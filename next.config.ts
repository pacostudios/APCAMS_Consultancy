import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained build for the VPS: `node .next/standalone/server.js`
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
  // v2 is now the main site; keep old /v2 links working
  async redirects() {
    return [
      { source: '/v2', destination: '/', permanent: true },
      { source: '/v2/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
