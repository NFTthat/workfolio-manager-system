import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚨 THIS IS THE MISSING MAGIC LINE
  output: "standalone",
  
  // Keep your previous emergency settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;