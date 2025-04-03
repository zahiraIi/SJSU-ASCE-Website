/** @type {import('next').NextConfig} */

// Allow CORS and external domain images
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable server actions as they are needed for googleCalendar.ts
    serverActions: true,
  },
  // Fix for node-fetch and debug module issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this from being included
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        encoding: false,
      };
    }
    return config;
  },
  // Image configuration
  images: {
    unoptimized: true, // Disable Next.js image optimization completely
    domains: [
      'f004.backblazeb2.com',    // Backblaze B2 direct file domain
      's3.us-west-004.backblazeb2.com', // S3-compatible endpoint
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Cache optimization
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // This allows us to access the public folder path in our code
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  // Environment variables that will be available on the client
  env: {
    NEXT_PUBLIC_USE_B2_STORAGE: 'true',
    NEXT_PUBLIC_B2_BUCKET_NAME: 'ascewebsiteimages',
    NEXT_PUBLIC_B2_KEY_ID: '004c009ed52a3c20000000001',
    NEXT_PUBLIC_B2_APPLICATION_KEY: 'K004A2A29GN3OHzoDG77Z7iZGtJLw4k',
  },
}

module.exports = nextConfig; 