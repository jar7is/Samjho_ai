import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack rules are dev-only (local `next dev`).
  // Production builds use webpack; do NOT include turbopack.rules here
  // as Vercel's modifyConfig injection conflicts with custom loader specs.
};

export default nextConfig;
