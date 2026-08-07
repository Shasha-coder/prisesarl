import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hard lock: do not serve stale static marketing pages
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, max-age=0",
        },
        { key: "X-Site-Status", value: "suspended" },
      ],
    },
  ],
};

export default nextConfig;
