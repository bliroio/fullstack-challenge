/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to handle client-side routing
  trailingSlash: false,
  // Enable experimental features
  experimental: {
    appDir: true,
  },
  // Handle client-side routing
  async rewrites() {
    return [
      {
        source: '/create-meeting',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
