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
    "/exam-prep/:path*",
    "/skills/:path*",
    "/console/:path*",
    "/writing-lab/:path*",
    "/text-analyzer/:path*",
    "/speech-analyzer/:path*",
    "/rewrite-studio/:path*",
    "/settings/:path*",
    "/ai-detection/:path*",
    "/risk-compliance/:path*",
    "/intent-analyzer/:path*",
    "/insights/:path*",
  ],
};
