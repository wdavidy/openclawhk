import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            OpenClaw HK
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              首頁
            </Link>
            <Link href="/about" className="font-medium text-foreground">
              關於
            </Link>
          </div>
        </nav>
      </header>

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

      <footer className="border-t py-6">
        <div className="mx-auto flex max-w-4xl justify-center px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} OpenClaw HK</p>
        </div>
      </footer>
    </div>
  );
}
