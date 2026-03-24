import { neonAuth } from "@/lib/neon/auth-server";

export default neonAuth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/console/:path*",
    "/writing-lab/:path*",
    "/text-analyzer/:path*",
    "/agent/:path*",
    "/speech-analyzer/:path*",
    "/rewrite-studio/:path*",
    "/settings/:path*",
    "/ai-detection/:path*",
    "/risk-compliance/:path*",
    "/intent-analyzer/:path*",
    "/insights/:path*",
  ],
};
