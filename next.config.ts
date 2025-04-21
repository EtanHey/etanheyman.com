import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: true,
    dynamicIO: true,
  },
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
};

export default nextConfig;
