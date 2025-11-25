import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // allow images served from this Vercel deployment hostname using a remote pattern
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abdifrost.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
