/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
