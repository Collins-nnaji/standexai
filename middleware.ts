import { neonAuth } from "@/lib/neon/auth-server";

export default neonAuth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/studio/:path*",
    "/settings/:path*",
    "/prompt-lab/:path*",
    "/brand-pulse/:path*",
    "/data-diagnostics/:path*",
    "/readiness-ledger/:path*",
  ],
};
