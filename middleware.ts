import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";

const authMiddleware = neonAuth.middleware({
  loginUrl: "/auth/sign-in",
});

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/exam-prep" || path.startsWith("/exam-prep/")) {
    const url = req.nextUrl.clone();
    url.pathname = path.replace(/^\/exam-prep/, "/skills");
    return NextResponse.redirect(url);
  }
  return authMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
