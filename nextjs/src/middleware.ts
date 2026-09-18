import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { wellnessTrackerEnabled } from "./lib/feature-flags";

// /mindshift is intentionally not here — signed-out visitors see it behind a client-side
// scroll gate (<SignInGate>) instead of a server redirect, so it can preview then blur.
// /wellness is only protected while its feature flag is on — while it's off the page 404s
// for everyone regardless of auth, so it shouldn't redirect to sign-in first.
const PROTECTED_PATHS = wellnessTrackerEnabled ? ["/wellness", "/reminders"] : ["/reminders"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session cookie if expired — required by @supabase/ssr.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|recipes/|og-image.png).*)"],
};
