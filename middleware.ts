import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ============================================================================
 * THE RAW HOUSE - Security & Route Guard Middleware
 * ============================================================================
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. HTTP Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // 2. Protect Admin Route Access
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader && !request.cookies.get("admin_session")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
