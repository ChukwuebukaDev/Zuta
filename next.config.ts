import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // Optional: specify port and pathname if needed (wildcard recommended for dynamic paths)
        // port: '',
        // pathname: '/photo/**',
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Often used for dynamic, source-based URLs
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // Often used for dynamic, source-based URLs
      },
    ],
    // Optional: Add modern image formats for better performance
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
