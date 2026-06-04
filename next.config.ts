import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allowing any hostname since we don't know the exact Supabase URL yet. Can be restricted later.
      },
    ],
  },
};

export default nextConfig;
