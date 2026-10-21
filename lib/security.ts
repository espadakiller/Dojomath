import { createHash, timingSafeEqual } from "node:crypto";
import { callRpc, hasSupabaseStorage, StorageError } from "@/lib/supabase-store";

type JsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

export function jsonError(message: string, status: number) {
  return Response.json({ ok: false, message }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function apiHandler(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof StorageError) {
        if (error.code === "23505") return jsonError("Cette demande existe deja ou le creneau est reserve.", 409);
        if (error.code?.startsWith("PT") && [400, 401, 402, 403, 404, 409].includes(error.status)) {
          return jsonError(error.message, error.status);
        }
      }
      console.error("DojoMath API unavailable", error instanceof Error ? error.name : "UnknownError");
      return jsonError("Le service est momentanement indisponible. Reessayez dans quelques instants.", 503);
    }
  };
}

export async function readRequestText(request: Request, maxBytes: number): Promise<
  { ok: true; text: string } | { ok: false; response: Response }
> {
  if (Number(request.headers.get("content-length")) > maxBytes) {
    return { ok: false, response: jsonError("La demande est trop volumineuse.", 413) };
  }
  const reader = request.body?.getReader();
  if (!reader) return { ok: true, text: "" };
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return { ok: false, response: jsonError("La demande est trop volumineuse.", 413) };
      }
      chunks.push(value);
    }
    return { ok: true, text: Buffer.concat(chunks).toString("utf8") };
  } finally {
    reader.releaseLock();
  }
}

export async function readJsonBody<T>(
  request: Request,
  maxBytes: number,
  errorMessage = "La demande est illisible.",
): Promise<JsonResult<T>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return {
      ok: false,
      response: jsonError("Le format JSON est requis.", 415),
    };
  }

  try {
    const body = await readRequestText(request, maxBytes);
    if (!body.ok) return body;
    const data: unknown = JSON.parse(body.text);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, response: jsonError(errorMessage, 400) };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, response: jsonError(errorMessage, 400) };
  }
}

export function assertSameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return jsonError("Origine de requete non autorisee.", 403);
  }
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const requestUrl = new URL(request.url);
  const requestOrigin = requestUrl.origin;
  const allowedOrigins = new Set(
    [
      requestOrigin,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null,
    ].filter(Boolean) as string[],
  );

  if (process.env.NODE_ENV !== "production") {
    try {
      const originUrl = new URL(origin);

      if (
        localHostnames.has(originUrl.hostname) &&
        localHostnames.has(requestUrl.hostname)
      ) {
        return null;
      }
    } catch {
      return jsonError("Origine de requete non autorisee.", 403);
    }
  }

  if (!allowedOrigins.has(origin)) {
    return jsonError("Origine de requete non autorisee.", 403);
  }

  return null;
}

export async function rateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowMs: number,
) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const ip =
    forwardedFor?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";
  const key = `${bucket}:${ip}`;
  if (hasSupabaseStorage) {
    try {
      const allowed = await callRpc<boolean>("dojomath_check_rate_limit", {
        p_key: createHash("sha256").update(key).digest("hex"),
        p_limit: limit,
        p_window_ms: windowMs,
      });
      return allowed ? null : jsonError("Trop de tentatives. Reessayez dans quelques minutes.", 429);
    } catch {
      return jsonError("Le service est momentanement indisponible.", 503);
    }
  }
  if (process.env.NODE_ENV === "production") {
    return jsonError("Le service est momentanement indisponible.", 503);
  }
  const now = Date.now();
  if (rateLimitStore.size >= 2_000) {
    for (const [entryKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(entryKey);
    }
    if (rateLimitStore.size >= 2_000 && !rateLimitStore.has(key)) {
      return jsonError("Trop de tentatives. Reessayez dans quelques minutes.", 429);
    }
  }
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;

  if (current.count > limit) {
    return jsonError("Trop de tentatives. Reessayez dans quelques minutes.", 429);
  }

  if (rateLimitStore.size > 2_000) {
    for (const [entryKey, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(entryKey);
      }
    }
  }

  return null;
}

export function asBoundedText(
  value: unknown,
  options: { max: number; min?: number } = { max: 500 },
) {
  const text = typeof value === "string" ? value.trim() : "";
  const min = options.min ?? 0;

  if (text.length < min || text.length > options.max) {
    return "";
  }

  return text;
}

export function normalizeEmail(value: unknown) {
  return asBoundedText(value, { max: 254 }).toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hasValidAdminToken(request: Request) {
  const expected = process.env.DOJOMATH_ADMIN_TOKEN;
  const provided = request.headers.get("x-dojomath-admin-token");

  if (!expected || !provided) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}
