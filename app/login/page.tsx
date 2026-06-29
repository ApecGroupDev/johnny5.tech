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
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-1.5 justify-center mb-1">
            <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
            Security Gateway
          </p>
          <h1 className="mt-4 font-display text-[32px] text-center leading-[1.05] text-white font-extrabold sm:text-4xl">
            Identity Verification
          </h1>
          <p className="mt-3 text-[13.5px] text-center leading-relaxed text-white/50">
            Enter credentials to open REST security environment.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-xl border border-white/5 bg-zinc-950/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Registry Key (Email)
              </span>
              <input
                type="email"
                placeholder="key-identifier@theapecgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500 transition-colors"
              />
            </label>

            <label className="mt-5 block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Passcode
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500 transition-colors"
              />
            </label>

            {error && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-red-500">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg px-4 py-2.5 text-[13px] font-semibold text-black transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              style={{ background: "linear-gradient(135deg, #06b6d4, #818cf8)" }}
            >
              {loading ? "Decrypting Key…" : "Verify Credentials"}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
            System Terminal Secured
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
