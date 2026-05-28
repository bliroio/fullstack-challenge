/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a minimal self-contained server bundle in .next/standalone
  // so the production Docker image stays small.
  output: "standalone",
};

module.exports = nextConfig;
