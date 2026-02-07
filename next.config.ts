import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
  async redirects() {
    return [
      {
        source: "/projects/golems/docs",
        destination: "https://etanhey.github.io/golems/",
        permanent: false,
      },
      {
        source: "/projects/golems/docs/:path*",
        destination: "https://etanhey.github.io/golems/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
