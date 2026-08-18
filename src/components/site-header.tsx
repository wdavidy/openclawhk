"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_BASE_PATH } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "首頁" },
  { href: "/todo", label: "待辦清單" },
  { href: "/about", label: "關於" },
];

export function SiteHeader() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/^\/openclawhk/, "").replace(/\/$/, "") || "/";

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src={`${SITE_BASE_PATH}/logo.svg`}
            alt="OpenClaw HK logo"
            width={28}
            height={28}
            priority
          />
          OpenClaw HK
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
