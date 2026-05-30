import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 15 blocks server-action POSTs from origins it doesn't recognize in
  // dev. Add the LAN address used for on-device testing so phone-originated
  // requests aren't rejected. Dev-only; ignored in production builds.
  allowedDevOrigins: ["192.168.68.118:3000", "localhost"],

  // Next 15.2+ streams <head> metadata into the <body> and hoists it client-
  // side, EXCEPT for user agents matching its built-in bot allowlist (which
  // omits plain `Googlebot` and most generic crawlers). That left the
  // <meta name="description"> out of the initial <head> for many UAs, so
  // Lighthouse reported "Document does not have a meta description".
  // Treating every UA as needing blocking metadata renders all metadata in
  // <head> in the initial HTML. Our metadata is static, so TTFB cost is ~0.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
