import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Temporarily disable experimental features that might cause issues
  // experimental: {
  //   ppr: true,
  //   dynamicIO: true,
  // },
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
};

export default nextConfig;
