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
        hostname: "8al7qs0inw.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
