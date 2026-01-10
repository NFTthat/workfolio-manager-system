import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // change to false if you'd like to fail builds on TS errors
    ignoreBuildErrors: false,
  },
  // If you want to avoid Turbopack on local dev when it's unstable:
  experimental: {},
  eslint: {
    // adjust for dev; set to false to avoid build-time failures
    ignoreDuringBuilds: false
  },
};

export default nextConfig;
