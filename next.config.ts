import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
  async rewrites() {
    return [
      {
        source: "/projects/golems/docs",
        destination: "https://etanhey.github.io/golems/",
      },
      {
        source: "/projects/golems/docs/:path*",
        destination: "https://etanhey.github.io/golems/:path*",
      },
      {
        source: "/golems/:path*",
        destination: "https://etanhey.github.io/golems/:path*",
      },
    ];
  },
};

export default nextConfig;
