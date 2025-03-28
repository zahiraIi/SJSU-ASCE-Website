/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // App Router only - no hybrid mode
  experimental: {
    appDir: true,
    serverActions: true,
    serverComponentsExternalPackages: ['googleapis', 'google-auth-library'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 