/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "readymadeui.com",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "pub-174bad6a4f964482a3d0bb9a06f5f778.r2.dev",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "pagedone.io",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "cdn.setoriasecurity.co.uk",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "nextjs-cms.jw-digital.co.uk",
        pathname: "**", // This allows all paths under the hostname
      },
      {
        protocol: "https",
        hostname: "ignite-cms.jw-digital.co.uk",
        pathname: "**", // This allows all paths under the hostname
      },
    ],
  },
};

export default nextConfig;
