/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Next.js routing to use React Router
  trailingSlash: false,
  // This allows React Router to handle client-side routing
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
