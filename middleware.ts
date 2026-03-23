import { neonAuth } from "@/lib/neon/auth-server";

export default neonAuth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/text-analyzer/:path*",
    "/speech-analyzer/:path*",
    "/rewrite-studio/:path*",
    "/ai-detection/:path*",
    "/risk-compliance/:path*",
    "/intent-analyzer/:path*",
    "/insights/:path*",
    "/settings/:path*",
  ],
};
