import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 15 blocks server-action POSTs from origins it doesn't recognize in
  // dev. Add the LAN address used for on-device testing so phone-originated
  // requests aren't rejected. Dev-only; ignored in production builds.
  allowedDevOrigins: ["192.168.68.118:3000", "localhost"],
  
};

export default nextConfig;
