/** @type {import('next').NextConfig} */

const nextConfig = { 
  output: 'export',
  basePath: "/turbo-scout",
  assetPrefix: "/turbo-scout",
  images: {
    unoptimized: true
  },
};

export default nextConfig;
