import type { NextConfig } from "next";

const nextConfig: any = {
  /* config options here */
  allowedDevOrigins: ['192.168.18.37', 'localhost'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
