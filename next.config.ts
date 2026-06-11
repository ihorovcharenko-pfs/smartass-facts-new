import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app is nested in a multi-package repo; pin the workspace root so Next's
  // file tracing (and Vercel's build) uses client-next, not the parent folder.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  images: {
    // The Express API serves some category/group images from its own origin.
    // Allowed here so we can adopt next/image later without further config.
    remotePatterns: [
      { protocol: "https", hostname: "api.smartassfacts.com" },
    ],
  },
};

export default nextConfig;
