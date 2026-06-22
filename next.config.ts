import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: '/f/**',
      },
       {
        protocol: "https",
        hostname: "image.clerk.com",
        port: "",
        pathname: "/f/**", 
      },
    ],
  },
};

export default nextConfig;
