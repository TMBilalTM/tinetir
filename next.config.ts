import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  }
};

export default nextConfig;
