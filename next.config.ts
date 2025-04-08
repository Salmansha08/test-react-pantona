import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "localhost"
    }],
  },
};

export default nextConfig;
