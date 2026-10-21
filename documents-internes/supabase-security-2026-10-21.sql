begin;

-- Server-only RPCs: serialize changes to balances, payments and the calendar.
create table if not exists public.dojomath_payments (
  session_id text primary key,
  event_id text not null unique,
  account_id text references public.dojomath_accounts(id) on delete set null,
  tokens integer not null check (tokens > 0),
  created_at timestamptz not null default now()
);
create table if not exists public.dojomath_rate_limits (
  key text primary key,
  count integer not null,
  resets_at timestamptz not null
);
alter table public.dojomath_payments enable row level security;
alter table public.dojomath_rate_limits enable row level security;
alter table public.dojomath_accounts enable row level security;
alter table public.dojomath_bookings enable row level security;
revoke all on public.dojomath_accounts, public.dojomath_bookings,
  public.dojomath_payments, public.dojomath_rate_limits from anon, authenticated;
grant all on public.dojomath_payments, public.dojomath_rate_limits to service_role;

create or replace function public.dojomath_set_session(
  p_account_id text, p_hash text, p_expires text, p_expected_hash text default null
) returns jsonb language plpgsql set search_path = '' as $$
declare current_data jsonb;
begin
  select data into current_data from public.dojomath_accounts
    where id = p_account_id for update;
  if not found then raise sqlstate 'PT404' using message = 'Compte introuvable.'; end if;
  if p_expected_hash is not null and current_data->>'sessionTokenHash' is distinct from p_expected_hash then
    return current_data;
  end if;
  current_data := (current_data - 'sessionTokenHash' - 'sessionExpiresAt') ||
    jsonb_strip_nulls(jsonb_build_object('sessionTokenHash', p_hash,
      'sessionExpiresAt', p_expires, 'updatedAt', now()));
  update public.dojomath_accounts set data = current_data,
    session_token_hash = p_hash, updated_at = now() where id = p_account_id;
  return current_data;
end;
$$;

create or replace function public.dojomath_credit_tokens(
  p_account_id text, p_tokens integer, p_session_id text default null, p_event_id text default null
) returns jsonb language plpgsql set search_path = '' as $$
declare current_data jsonb;
begin
  if p_tokens not between 1 and 100 then
    raise sqlstate 'PT400' using message = 'Credit invalide.';
  end if;
  if (p_session_id is null) <> (p_event_id is null) then
    raise sqlstate 'PT400' using message = 'Paiement incomplet.';
  end if;
  select data into current_data from public.dojomath_accounts where id = p_account_id for update;
  if not found then raise sqlstate 'PT404' using message = 'Compte introuvable.'; end if;
  if p_session_id is not null then
    if coalesce(current_data->'stripeEventIds', '[]'::jsonb) ? p_event_id then
      return jsonb_build_object('account', current_data, 'duplicate', true);
    end if;
    insert into public.dojomath_payments(session_id, event_id, account_id, tokens)
      values(p_session_id, p_event_id, p_account_id, p_tokens) on conflict do nothing;
    if not found then return jsonb_build_object('account', current_data, 'duplicate', true); end if;
  end if;
  current_data := current_data || jsonb_build_object(
    'tokens', (current_data->>'tokens')::integer + p_tokens, 'updatedAt', now());
  update public.dojomath_accounts set data = current_data, updated_at = now() where id = p_account_id;
  return jsonb_build_object('account', current_data, 'duplicate', false);
end;
$$;

-- A cancelled lesson must release its start time.
alter table public.dojomath_bookings drop constraint if exists dojomath_bookings_date_time_key;
create unique index if not exists dojomath_active_booking_start_idx
  on public.dojomath_bookings(date, time) where data->>'status' <> 'cancelled';

create or replace function public.dojomath_slot_available(
  p_date text, p_time text, p_hours integer, p_exclude text default null
) returns boolean language sql volatile set search_path = '' as $$
  select not exists (
    select 1 from public.dojomath_bookings b
    where b.date = p_date and b.id is distinct from p_exclude
      and b.data->>'status' <> 'cancelled'
      and (b.date::date + b.time::time) <
        (p_date::date + p_time::time) + make_interval(hours => p_hours, mins => 5)
      and (p_date::date + p_time::time) <
        (b.date::date + b.time::time) +
        make_interval(hours => (b.data->>'durationHours')::integer, mins => 5)
  );
$$;

create or replace function public.dojomath_reserve_booking(p_booking jsonb)
returns jsonb language plpgsql set search_path = '' as $$
declare current_data jsonb; cost integer; account_id text := p_booking->>'accountId';
begin
  perform pg_advisory_xact_lock(174428, 1);
  cost := case p_booking->>'planId' when 'stage' then 3 when 'liberte' then 1 when 'progression' then 1 else null end;
  if cost is null or (p_booking->>'durationHours')::integer is distinct from cost
      or p_booking->>'status' is distinct from 'pending' then
    raise sqlstate 'PT400' using message = 'Reservation invalide.';
  end if;
  if ((p_booking->>'date')::date + (p_booking->>'time')::time) at time zone 'Europe/Paris' <= now() then
    raise sqlstate 'PT400' using message = 'Ce cours a deja commence.';
  end if;
  select data into current_data from public.dojomath_accounts where id = account_id for update;
  if not found then raise sqlstate 'PT404' using message = 'Compte introuvable.'; end if;
  if (current_data->>'tokens')::integer < cost then
    raise sqlstate 'PT402' using message = 'Solde de jetons insuffisant.';
  end if;
  if not public.dojomath_slot_available(p_booking->>'date', p_booking->>'time', cost) then
    raise sqlstate 'PT409' using message = 'Ce creneau vient d''etre reserve.';
  end if;
  insert into public.dojomath_bookings(id, account_id, date, time, data)
    values(p_booking->>'id', account_id, p_booking->>'date', p_booking->>'time', p_booking);
  current_data := current_data || jsonb_build_object('tokens', (current_data->>'tokens')::integer - cost, 'updatedAt', now());
  update public.dojomath_accounts set data = current_data, updated_at = now() where id = account_id;
  return jsonb_build_object('account', current_data, 'booking', p_booking);
end;
$$;

create or replace function public.dojomath_change_booking(
  p_id text, p_patch jsonb, p_action text, p_account_id text default null
) returns jsonb language plpgsql set search_path = '' as $$
declare current_data jsonb; next_data jsonb;
begin
  perform pg_advisory_xact_lock(174428, 1);
  select data into current_data from public.dojomath_bookings where id = p_id for update;
  if not found then raise sqlstate 'PT404' using message = 'Reservation introuvable.'; end if;
  if p_action in ('reschedule', 'cancel') then
    if p_account_id is null or current_data->>'accountId' <> p_account_id then
      raise sqlstate 'PT403' using message = 'Reservation non autorisee.';
    end if;
    if current_data->>'status' not in ('pending', 'confirmed') then
      raise sqlstate 'PT409' using message = 'Ce cours ne peut plus etre modifie.';
    end if;
    if ((current_data->>'date')::date + (current_data->>'time')::time) at time zone 'Europe/Paris' <= now() then
      raise sqlstate 'PT409' using message = 'Ce cours a deja commence.';
    end if;
  end if;
  if p_action = 'reschedule' then
    next_data := (current_data - 'changeRequest' - 'reminderSentAt') ||
      jsonb_build_object('date', p_patch->>'date', 'time', p_patch->>'time');
  elsif p_action = 'cancel' then
    next_data := current_data || jsonb_build_object('status', 'cancel_requested', 'changeRequest', p_patch->'changeRequest');
  elsif p_action = 'admin' then
    if p_patch->>'status' not in ('pending', 'confirmed', 'reschedule_requested', 'cancel_requested', 'cancelled') then
      raise sqlstate 'PT400' using message = 'Statut invalide.';
    end if;
    next_data := current_data || jsonb_build_object('status', p_patch->>'status');
  elsif p_action = 'reminder' then
    next_data := current_data || jsonb_build_object('reminderSentAt', p_patch->>'reminderSentAt');
  else
    raise sqlstate 'PT400' using message = 'Action invalide.';
  end if;
  if p_action = 'reschedule' and
      ((next_data->>'date')::date + (next_data->>'time')::time) at time zone 'Europe/Paris' <= now() then
    raise sqlstate 'PT400' using message = 'Ce creneau est passe.';
  end if;
  if p_action in ('reschedule', 'admin') and next_data->>'status' <> 'cancelled' and
      not public.dojomath_slot_available(next_data->>'date', next_data->>'time',
        (next_data->>'durationHours')::integer, p_id) then
    raise sqlstate 'PT409' using message = 'Ce creneau vient d''etre reserve.';
  end if;
  update public.dojomath_bookings set data = next_data,
    date = next_data->>'date', time = next_data->>'time' where id = p_id;
  return next_data;
end;
$$;

create or replace function public.dojomath_check_rate_limit(p_key text, p_limit integer, p_window_ms integer)
returns boolean language plpgsql set search_path = '' as $$
declare current_count integer;
begin
  delete from public.dojomath_rate_limits where resets_at <= now();
  insert into public.dojomath_rate_limits(key, count, resets_at)
    values(p_key, 1, now() + p_window_ms * interval '1 millisecond')
    on conflict(key) do update set count = public.dojomath_rate_limits.count + 1
    returning count into current_count;
  return current_count <= p_limit;
end;
$$;

revoke all on function public.dojomath_set_session(text,text,text,text) from public, anon, authenticated;
revoke all on function public.dojomath_credit_tokens(text,integer,text,text) from public, anon, authenticated;
revoke all on function public.dojomath_slot_available(text,text,integer,text) from public, anon, authenticated;
revoke all on function public.dojomath_reserve_booking(jsonb) from public, anon, authenticated;
revoke all on function public.dojomath_change_booking(text,jsonb,text,text) from public, anon, authenticated;
revoke all on function public.dojomath_check_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.dojomath_set_session(text,text,text,text) to service_role;
grant execute on function public.dojomath_credit_tokens(text,integer,text,text) to service_role;
grant execute on function public.dojomath_slot_available(text,text,integer,text) to service_role;
grant execute on function public.dojomath_reserve_booking(jsonb) to service_role;
grant execute on function public.dojomath_change_booking(text,jsonb,text,text) to service_role;
grant execute on function public.dojomath_check_rate_limit(text,integer,integer) to service_role;
notify pgrst, 'reload schema';
commit;
