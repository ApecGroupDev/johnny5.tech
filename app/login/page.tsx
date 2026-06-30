"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Section } from "../components/ui/section";
import { Reveal } from "../components/motion/reveal";
import { StarsBackground } from "../components/stars-background";

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
      const callbackUrl = params?.get("callbackUrl") || "/";
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
    <Section id="login" className="relative overflow-hidden pt-24 pb-32 flex items-center justify-center min-h-[calc(100vh-160px)]">
      {/* Layer 1: background twinkling stars */}
      <StarsBackground />

      {/* Layer 2: masked perspective grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)] opacity-20 pointer-events-none z-[1]" />

      {/* Layer 3: ambient light layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[130px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.02] blur-[110px] animate-[pulse_12s_ease-in-out_infinite]" />
      </div>

      <Reveal>
        <div className="mx-auto max-w-md w-full px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Security Pill */}
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] px-3 py-1 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
                Security Gateway
              </span>
            </div>

            <h1 className="mt-4 font-display text-[28px] font-extrabold tracking-tight text-white sm:text-3xl">
              Identity Verification
            </h1>
            <p className="mt-2 text-[13px] text-white/45 max-w-sm">
              Enter secure credentials to establish your authorized workspace session.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-xl border border-white/5 bg-zinc-950/80 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden"
          >
            {/* top accent border line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Registry Key (Email)
                </label>
                <input
                  type="email"
                  placeholder="key-identifier@theapecgroup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Passcode
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-red-400">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg px-4 py-2.5 text-[13px] font-semibold text-black transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:scale-100 cursor-pointer shadow-[0_0_24px_rgba(6,182,212,0.2)]"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #818cf8)",
              }}
            >
              {loading ? "Decrypting Key…" : "Verify Credentials"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              APEC GROUP SECURE TERMINAL · invite only
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
