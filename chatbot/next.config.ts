import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore: 'appDir' is not part of ExperimentalConfig but is needed to enable the App Router.
    appDir: true,
  },
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;