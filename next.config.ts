import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // All canonical tags use trailing slashes; this makes Next.js serve /path/ directly
  // instead of 308-redirecting to /path, keeping redirects and canonicals consistent.
  trailingSlash: true,
  // This app is nested in a multi-package repo; pin the workspace root so Next's
  // file tracing (and Vercel's build) uses client-next, not the parent folder.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      // Old VPS sitemaps Google still has cached — point to the single Next.js sitemap
      { source: '/sitemap-:name.xml', destination: '/sitemap.xml', permanent: true },
      // Old /random/[category]/ routes don't exist in Next.js
      { source: '/random/:category/', destination: '/random/', permanent: true },
      { source: '/random/:category', destination: '/random/', permanent: true },
    ]
  },
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
