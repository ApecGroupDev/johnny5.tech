"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { cn } from "@/lib/cn";
import { openCommandPalette } from "./command-palette";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Apps", href: "/apps" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(navigator.platform));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled
          ? "bg-bg/80 backdrop-blur supports-backdrop-filter:bg-bg/70 border-b border-line"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[14px] font-medium tracking-tight"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-bg">
              J5
            </span>
            <span className="text-ink">
              johnny5<span className="text-muted">.tech</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-muted">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCommandPalette}
              className="hidden md:inline-flex items-center gap-2 rounded-md cursor-pointer border border-line bg-surface pl-2.5 pr-1.5 py-1.5 text-[12px] text-muted hover:border-ink/30 hover:text-ink transition-colors"
              aria-label="Open command palette"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
              <kbd className="ml-2 rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
                {isMac ? "⌘" : "Ctrl"}K
              </kbd>
            </button>

            {pathname !== "/login" && (
              <div className="hidden md:block">
                <Button href="/login" variant="primary" size="sm">
                  Sign in
                </Button>
              </div>
            )}

            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-line pb-4 pt-2">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 text-sm text-ink/80 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
              {pathname !== "/login" && (
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center justify-center rounded-md bg-ink text-bg px-4 py-2.5 text-sm"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
