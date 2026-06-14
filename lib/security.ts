import { timingSafeEqual } from "node:crypto";

type JsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function jsonError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

export async function readJsonBody<T>(
  request: Request,
  maxBytes: number,
  errorMessage = "La demande est illisible.",
): Promise<JsonResult<T>> {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > maxBytes) {
    return {
      ok: false,
      response: jsonError("La demande est trop volumineuse.", 413),
    };
  }

  try {
    const body = await request.text();

    if (new Blob([body]).size > maxBytes) {
      return {
        ok: false,
        response: jsonError("La demande est trop volumineuse.", 413),
      };
    }

    return { ok: true, data: JSON.parse(body) as T };
  } catch {
    return { ok: false, response: jsonError(errorMessage, 400) };
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const requestOrigin = new URL(request.url).origin;
  const allowedOrigins = new Set(
    [
      requestOrigin,
      host ? `${proto}://${host}` : null,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null,
    ].filter(Boolean) as string[],
  );

  if (!allowedOrigins.has(origin)) {
    return jsonError("Origine de requete non autorisee.", 403);
  }

  return null;
}

export function rateLimit(
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
  const now = Date.now();
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
