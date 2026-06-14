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
    ],
  },
};

export default nextConfig;
