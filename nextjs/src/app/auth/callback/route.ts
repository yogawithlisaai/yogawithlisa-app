import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Only allow same-site relative paths, so ?redirect= can't be used for an open redirect. */
function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/mindshift";
  }
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));
  const providerError = searchParams.get("error_description") || searchParams.get("error");

  const signInWithError = () => {
    const url = new URL("/sign-in", origin);
    url.searchParams.set("error", "We couldn't sign you in. Please try again.");
    return NextResponse.redirect(url);
  };

  if (providerError || !code) {
    return signInWithError();
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return signInWithError();
  }

  return NextResponse.redirect(new URL(redirectTo, origin));
}
