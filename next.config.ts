import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app is nested in a multi-package repo; pin the workspace root so Next's
  // file tracing (and Vercel's build) uses client-next, not the parent folder.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  images: {
    // Serve AVIF first (smaller than WebP), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Optimized images are content-stable — cache them at the edge for a year.
    minimumCacheTTL: 31536000,
    // The Express API serves some category/group images from its own origin.
    remotePatterns: [
      { protocol: "https", hostname: "api.smartassfacts.com" },
    ],
  },
};

export default nextConfig;
