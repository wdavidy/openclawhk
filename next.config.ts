import type { NextConfig } from "next";

const repo = "openclawhk";

const nextConfig: NextConfig = {
  // GitHub Pages 靜態輸出
  output: "export",
  // 專案型 Pages 需要 basePath（https://<user>.github.io/<repo>）
  basePath: `/${repo}`,
  // 確保 CSS/JS 等靜態資源路徑正確
  assetPrefix: `/${repo}/`,
  trailingSlash: true,
  // 靜態輸出不支援 image optimization，改用 unoptimized
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
