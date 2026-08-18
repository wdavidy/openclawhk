import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">關於</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          這是一個部署於 GitHub Pages 的 Next.js 靜態網站示範。
          整個專案使用靜態輸出（
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            output: &quot;export&quot;
          </code>
          ），不包含任何伺服器端功能（API Routes、Prisma、NextAuth、SSR），
          所有使用者資料皆以 LocalStorage 儲存在瀏覽器端。
        </p>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          目前包含{" "}
          <Link
            href="/todo"
            className="font-medium text-foreground underline underline-offset-4"
          >
            待辦清單
          </Link>{" "}
          與本地記事本兩個示範功能，資料皆以 Zod 驗證後儲存於 LocalStorage。
        </p>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          每次 push 到 <code className="rounded bg-muted px-1.5 py-0.5 text-sm">main</code>{" "}
          分支，GitHub Actions 都會自動建置並部署到 GitHub Pages。
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          ← 回到首頁
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
