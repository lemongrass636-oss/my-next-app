import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 制限を 10MB に引き上げます（数値はお好みで調整してください）
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
