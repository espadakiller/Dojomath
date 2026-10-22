import {
  normalizeSupabaseUrl,
  selectRows,
} from "@/lib/supabase-store";
import { hasValidAdminToken } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hasProjectRootUrl(value: string | undefined) {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value ?? "");
}

function toSafeError(error: unknown) {
  if (error instanceof Error) {
    return error.message
      .replace(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", "[redacted]")
      .replace(process.env.RESEND_API_KEY ?? "", "[redacted]");
  }

  return "Erreur inconnue.";
}

export async function GET(request: Request) {
  const wantsDetails = new URL(request.url).searchParams.get("details") === "1";

  if (wantsDetails && !hasValidAdminToken(request)) {
    return Response.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);
  let supabase = {
    configured: hasSupabaseConfig,
    urlLooksValid: hasProjectRootUrl(supabaseUrl),
    reachable: false,
    error: null as string | null,
  };

  if (hasSupabaseConfig) {
    try {
      await Promise.all([
        selectRows("dojomath_accounts", { select: "id", limit: 1 }),
        selectRows("dojomath_bookings", { select: "id", limit: 1 }),
      ]);
      supabase = {
        ...supabase,
        reachable: true,
      };
    } catch (error) {
      supabase = {
        ...supabase,
        error: toSafeError(error),
      };
    }
  }

  const configuredEmailFrom =
    process.env.CONTACT_FROM_EMAIL ?? process.env.EMAIL_FROM;
  const configuredContactTo =
    process.env.CONTACT_TO_EMAIL ??
    process.env.TEACHER_EMAIL ??
    "dojomath.contact@gmail.com";
  const ok = supabase.configured && supabase.urlLooksValid && supabase.reachable;
  const responseOptions = {
    status: ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  };

  if (!wantsDetails) {
    return Response.json({ ok }, responseOptions);
  }

  return Response.json({
    ok,
    supabase,
    email: {
      configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      fromConfigured: Boolean(process.env.EMAIL_FROM),
      contactConfigured: Boolean(
        process.env.RESEND_API_KEY &&
          configuredEmailFrom &&
          configuredContactTo,
      ),
    },
  }, responseOptions);
}
