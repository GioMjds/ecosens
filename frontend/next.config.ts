import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
  allowedDevOrigins: ['*']
};

export default nextConfig;
