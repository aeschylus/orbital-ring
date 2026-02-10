import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/orbital-ring" : "",
  assetPrefix: isProd ? "/orbital-ring/" : "",
  transpilePackages: ["three"],
  images: { unoptimized: true },
};

export default nextConfig;
