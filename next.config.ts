import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["thong-squabble-sizzling.ngrok-free.dev"],
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
