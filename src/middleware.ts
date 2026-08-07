import { NextRequest, NextResponse } from "next/server";
import { SITE_LOCKED, SUSPENSION_MESSAGE } from "@/lib/site-lock";

/**
 * Hard site lock (code-only). Blocks APIs and funnels every page to "/".
 * Unlock: set SITE_LOCKED = false in src/lib/site-lock.ts and restore pages from git.
 */
export function middleware(req: NextRequest) {
  if (!SITE_LOCKED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Allow Next internals + static files only
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/manifest.webmanifest" ||
    /\.(ico|png|jpg|jpeg|svg|webp|gif|woff2?|css|js|map|txt|xml|webmanifest)$/i.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "Service unavailable", message: SUSPENSION_MESSAGE },
      {
        status: 503,
        headers: {
          "Retry-After": "86400",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // Force home (suspension page) for any other path
  if (pathname !== "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 307);
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("X-Site-Status", "suspended");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
