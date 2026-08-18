# OpenClaw HK

部署於 GitHub Pages 的 Next.js 靜態網站，包含 **Todo List**（待辦清單）功能。

## 功能

- **待辦清單**（https://wdavidy.github.io/openclawhk/todo/）：新增、編輯、刪除、完成標記、篩選（全部/進行中/已完成）、清除已完成
- 本地記事本（首頁示範）
- 所有資料以 Zod 驗證後儲存於瀏覽器 LocalStorage

## 技術棧

- Next.js（`output: "export"` 靜態輸出）
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod（表單/資料驗證）
- LocalStorage（瀏覽器端資料儲存）

> GitHub Pages 為純靜態託管，因此本專案**不包含**伺服器端功能：
> API Routes、Prisma、NextAuth、SSR 皆已排除。

## 線上網址

https://wdavidy.github.io/openclawhk/

## 本地開發

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

## 建置

```bash
npm run lint      # ESLint
npm run typecheck # TypeScript 型別檢查
npm run build     # Production build（輸出至 out/）
```

靜態輸出位於 `out/`，`next.config.ts` 已設定：

- `output: "export"`
- `basePath: "/openclawhk"`（GitHub Pages 專案路徑）
- `assetPrefix: "/openclawhk/"`
- `trailingSlash: true`
- `images.unoptimized: true`（靜態輸出不支援圖片最佳化）

## 部署

push 到 `main` 分支後，GitHub Actions（`.github/workflows/deploy.yml`）
會自動建置並部署到 GitHub Pages（使用內建 `GITHUB_TOKEN`，無需手動設定密鑰）。
