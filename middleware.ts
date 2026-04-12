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
     * Match all request paths except:
     * - api, Next internals, favicon
     * - common static assets from /public (so logos, images load without auth middleware)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
