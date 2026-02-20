import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    // Avoid workspace root inference when multiple lockfiles exist.
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/GATES/stacks-hub-welcome.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
