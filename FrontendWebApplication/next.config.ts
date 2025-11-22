import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use default output (server) to avoid static export prerender issues for dynamic client features.
  // We rely on client components and runtime data fetching; forcing "export" leads to recursion errors.
};

export default nextConfig;
