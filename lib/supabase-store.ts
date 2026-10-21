export function normalizeSupabaseUrl(value: string | undefined) {
  return value
    ?.replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseStorage = Boolean(supabaseUrl && serviceRoleKey);

export class StorageError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function assertStorageAvailable() {
  if (process.env.NODE_ENV === "production" && !hasSupabaseStorage) {
    throw new StorageError("Le stockage est momentanement indisponible.", 503);
  }
}

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
    signal: init.signal ?? AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const failure = await response.json().catch(() => ({})) as {
      message?: string;
      code?: string;
    };
    throw new StorageError(
      failure.message ?? "Le stockage est momentanement indisponible.",
      response.status,
      failure.code,
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}

export function callRpc<T>(name: string, params: Record<string, unknown>) {
  return request<T>(`rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function insertRow(table: string, row: Record<string, unknown>) {
  return request<null>(table, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
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

export async function deleteRows(
  table: string,
  params: Record<string, QueryValue>,
) {
  await request<null>(
    table,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal",
      },
    },
    params,
  );
}
