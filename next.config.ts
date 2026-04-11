import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep source-of-truth env vars as NEON_* and map them for client-side SDK usage.
  env: {
    NEXT_PUBLIC_NEON_AUTH_URL: process.env.NEON_AUTH_URL,
    NEXT_PUBLIC_NEON_DATA_API_URL: process.env.NEON_DATA_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/academy',
        destination: '/learn',
        permanent: true,       // Returns 308
      },
      {
        source: '/index',
        destination: '/intelligence',
        permanent: true,
      },
      {
        source: '/briefs',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/assessment',
        destination: '/cognitive-audit',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
