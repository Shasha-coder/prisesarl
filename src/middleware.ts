import { NextRequest, NextResponse } from "next/server";

/**
 * Site lock — outstanding account balance.
 * Set SITE_LOCKED=false (or remove middleware) to restore the site after payment.
 */
const SITE_LOCKED = true;

export function middleware(req: NextRequest) {
  if (!SITE_LOCKED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Allow only static assets / metadata Next needs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/manifest.webmanifest" ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff2?|css|js|map|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  // Kill all APIs while locked
  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      {
        error: "Service unavailable",
        message:
          "The website has been temporarily suspended because the account has an outstanding balance.",
      },
      { status: 503, headers: { "Retry-After": "86400" } }
    );
  }

  // Everything else → home (suspension page)
  if (pathname !== "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
