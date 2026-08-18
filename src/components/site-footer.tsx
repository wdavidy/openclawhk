export function SiteFooter() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OpenClaw HK</p>
        <a
          href="https://github.com/wdavidy/openclawhk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  );
}
