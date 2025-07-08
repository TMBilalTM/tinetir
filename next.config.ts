import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"]
  },
  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  }
};

export default nextConfig;
