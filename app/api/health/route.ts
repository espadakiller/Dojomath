import { selectRows } from "@/lib/supabase-store";

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

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
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
      await selectRows("dojomath_accounts", { limit: 1 });
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

  return Response.json({
    ok: supabase.configured && supabase.urlLooksValid && supabase.reachable,
    supabase,
    email: {
      configured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      fromConfigured: Boolean(process.env.EMAIL_FROM),
    },
  });
}
