import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.15.141", "192.168.15.141:3000", "localhost:3000"],
};

export default nextConfig;

