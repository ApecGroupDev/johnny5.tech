import Link from "next/link";
import { Container } from "./ui/container";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container>
        <div className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-[14px] font-medium">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-bg">
                J5
              </span>
              <span className="text-ink">
                johnny5<span className="text-muted">.tech</span>
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Automated workflows, AI-assisted tools, and quick utilities
              shipped for the web.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-2">
            <div>
              <div className="mb-3 font-mono text-[11px] text-muted">Site</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="link-underline text-ink/80 hover:text-ink"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="link-underline text-ink/80 hover:text-ink"
                    href="/#apps"
                  >
                    Apps
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="mb-3 font-mono text-[11px] text-muted">
                Inspirations
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    className="link-underline text-ink/80 hover:text-ink"
                    href="https://en.wikipedia.org/wiki/Short_Circuit_(1986_film)"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Nova Laboratories
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-line py-6 font-mono text-[11px] text-muted md:flex-row">
          <span>© {new Date().getFullYear()} Johnny5.tech</span>
          <div className="flex items-center gap-4">
            <Link
              className="link-underline text-ink/80 hover:text-ink"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="link-underline text-ink/80 hover:text-ink"
              href="/terms"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
