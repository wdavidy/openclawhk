import Link from "next/link";
import { LocalNotes } from "@/components/local-notes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Zod",
  "LocalStorage",
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            歡迎來到{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              OpenClaw HK
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            部署在 GitHub Pages 的靜態網站 —
            使用 Next.js 靜態輸出，資料儲存於瀏覽器 LocalStorage。
          </p>
          <Link
            href="/todo"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            開啟待辦清單 →
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            技術棧
          </h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border px-3 py-1 text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-xl">
          <LocalNotes />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
