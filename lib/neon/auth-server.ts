import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL ?? process.env.NEON_AUTH_URL;
const cookieSecret =
  process.env.NEON_AUTH_COOKIE_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "standexai-dev-cookie-secret-change-me-32-plus";

if (!baseUrl) {
  throw new Error("NEON_AUTH_URL (or NEON_AUTH_BASE_URL) is required for Neon Auth.");
}

export const neonAuth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
    sessionDataTtl: 300,
  },
});
