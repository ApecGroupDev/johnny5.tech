"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Apps";
  href: string;
};

const ITEMS: Item[] = [
  { id: "home", label: "Home", group: "Navigate", href: "/" },
  { id: "apps", label: "Apps", group: "Navigate", href: "/#apps" },
  { id: "login", label: "Sign in", group: "Navigate", href: "/login" },

  { id: "canopy", label: "Canopy Configurator", group: "Apps", href: "/apps/canopy-configurator" },
  { id: "rain-risk", label: "Rain Risk Board", group: "Apps", href: "/apps/rain-risk" },
  { id: "pulse-360", label: "PULSE 360", group: "Apps", href: "/apps/project-updates" },
  { id: "ruby-queen", label: "Ruby Queen", group: "Apps", href: "/apps/ruby-queen" },
  { id: "site360", label: "SITE 360", group: "Apps", href: "/apps/site360" },
];

const OPEN_EVENT = "alihusain:open-command-palette";

export function openCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }
}

export default function CommandPalette() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const dynamicItems = ITEMS.map((item) => {
      if (item.id === "login") {
        return session ? { ...item, id: "logout", label: "Sign out", href: "#" } : item;
      }
      return item;
    });
    const query = q.trim().toLowerCase();
    if (!query) return dynamicItems;
    return dynamicItems.filter((i) => i.label.toLowerCase().includes(query));
  }, [q, session]);

  const groups = useMemo(() => {
    const g: Record<string, Item[]> = {};
    for (const item of results) {
      (g[item.group] ||= []).push(item);
    }
    return g;
  }, [results]);

  const flat = results;

  const select = (item: Item) => {
    setOpen(false);
    if (item.id === "logout") {
      signOut({ callbackUrl: "/" });
      return;
    }
    router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      select(flat[active]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(11,11,12,0.3)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search apps, pages…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-subtle focus:outline-none"
              />
              <kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {flat.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted">
                  No results.
                </div>
              ) : (
                Object.entries(groups).map(([group, items]) => (
                  <div key={group} className="px-2 pb-2">
                    <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                      {group}
                    </div>
                    <ul>
                      {items.map((item) => {
                        const idx = flat.indexOf(item);
                        const isActive = idx === active;
                        return (
                          <li key={item.id}>
                            <button
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => select(item)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                isActive
                                  ? "bg-ink/5 text-ink"
                                  : "text-ink/80 hover:bg-ink/5"
                              }`}
                            >
                              <span>{item.label}</span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
