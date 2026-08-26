import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // (redeploy trigger 2)
  // pdf-parse (and the pdfjs-dist it wraps) do their own dynamic
  // import()/require() of a worker file at runtime — Turbopack's SSR
  // bundling can't resolve that relative to its own bundled chunks, so it
  // needs to be loaded via real Node `require` instead of being bundled.
  serverExternalPackages: ["pdfjs-dist", "pdf-parse"],
};

export default nextConfig;
