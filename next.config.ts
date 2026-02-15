import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep source-of-truth env vars as NEON_* and map them for client-side SDK usage.
  env: {
    NEXT_PUBLIC_NEON_AUTH_URL: process.env.NEON_AUTH_URL,
    NEXT_PUBLIC_NEON_DATA_API_URL: process.env.NEON_DATA_API_URL,
  },
};

export default nextConfig;
