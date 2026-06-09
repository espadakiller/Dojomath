const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseStorage = Boolean(supabaseUrl && serviceRoleKey);

type QueryValue = string | number | boolean;

function buildUrl(table: string, params?: Record<string, QueryValue>) {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function request<T>(
  table: string,
  init: RequestInit,
  params?: Record<string, QueryValue>,
) {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase storage is not configured.");
  }

  const response = await fetch(buildUrl(table, params), {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase ${table} request failed: ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}

export async function selectRows<T>(
  table: string,
  params: Record<string, QueryValue>,
) {
  return request<T[]>(
    table,
    {
      method: "GET",
    },
    { select: "*", ...params },
  );
}

export async function upsertRow<T extends Record<string, unknown>>(
  table: string,
  row: T,
  conflictColumn = "id",
) {
  await request<null>(
    table,
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    },
    { on_conflict: conflictColumn },
  );
}
