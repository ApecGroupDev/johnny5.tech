"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Section } from "../components/ui/section";
import { Reveal } from "../components/motion/reveal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const callbackUrl = params?.get("callbackUrl") || "/apps";
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid credentials");
        setLoading(false);
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <Section id="login" className="pt-16 pb-24 md:pt-24 md:pb-32">
      <Reveal>
        <div className="mx-auto max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Authentication
          </p>
          <h1 className="mt-4 font-display text-[32px] leading-[1.05] text-ink sm:text-4xl">
            Sign in
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Access restricted experiments and private tools.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-lg border border-line bg-surface/40 p-6"
          >
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[14px] text-ink placeholder:text-subtle outline-none focus:border-accent transition-colors"
              />
            </label>

            <label className="mt-4 block">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                Password
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[14px] text-ink placeholder:text-subtle outline-none focus:border-accent transition-colors"
              />
            </label>

            {error && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-[14px] font-semibold text-bg transition-colors hover:bg-accent-ink cursor-pointer disabled:opacity-60"
            >
              {loading ? "Authenticating…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[11px] text-subtle">
            Authorized access only
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
