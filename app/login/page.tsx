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
    <Section id="login" className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Layer 1: background twinkling stars */}
      <StarsBackground />

      {/* Layer 2: masked perspective grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)] opacity-20 pointer-events-none z-[1]" />

      {/* Layer 3: ambient light layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-indigo-500/[0.03] blur-[130px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.015] blur-[110px] animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-yellow-500/[0.005] blur-[100px] animate-[pulse_14s_ease-in-out_infinite]" />
      </div>

      <Reveal>
        <div className="mx-auto max-w-5xl px-4 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column: Login Form */}
            <div className="mx-auto w-full max-w-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-1.5 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Security Gateway
              </p>
              <h1 className="mt-3 font-display text-[32px] leading-[1.1] text-white font-extrabold sm:text-4xl">
                Identity Verification
              </h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
                Enter secure credentials to establish authorized workspace
                session.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-xl border border-white/5 bg-zinc-950/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden"
              >
                {/* top accent border line */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-cyan-400 to-transparent" />

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
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #818cf8)",
                  }}
                >
                  {loading ? "Decrypting Key…" : "Verify Credentials"}
                </button>
              </form>

              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                System Terminal Secured
              </p>
            </div>

            {/* Right Column: Holographic Terminal Status diagnostics */}
            <div className="hidden lg:flex flex-col gap-4 rounded-xl border border-white/5 bg-zinc-950/45 p-6 backdrop-blur-md font-mono text-[11px] text-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white/80 font-bold uppercase tracking-wider">
                    Terminal Diagnostics
                  </span>
                </div>
                <span className="text-white/20">V1.0.4-LOCKED</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/20">SYSTEM STATE:</span>
                  <span className="text-cyan-400 font-semibold">
                    SECURED_PORTAL_ACTIVE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/20">SECURE SHELL:</span>
                  <span className="text-emerald-400">
                    NEXT-AUTH_JWT_ENCRYPTED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/20">DATA LAYER:</span>
                  <span className="text-white/70">PRISMA_POSTGRES_LIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/20">GATEWAY ID:</span>
                  <span className="text-amber-400">JOHNNY5.TECH_PROX_S3</span>
                </div>
              </div>

              <div className="h-px bg-white/5 my-1" />

              <div className="space-y-1.5 text-[10px] text-white/30">
                <div className="text-white/50">
                  &gt; INITIALIZING ENCRYPTED AUTH SESSION...
                </div>
                <div>
                  &gt; DECRYPTING DATABASE CREDENTIALS:{" "}
                  <span className="text-emerald-400">[SUCCESS]</span>
                </div>
                <div>
                  &gt; PARSING INVITED ACCESS REGISTRY:{" "}
                  <span className="text-cyan-400">100% OK</span>
                </div>
                <div>
                  &gt; peggy@theapecgroup.com
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-white/50">[AUTHORIZED]</span>
                </div>
                <div>
                  &gt; alihusain.me shared layer
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-white/50">[LINK_VERIFIED]</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-cyan-400 animate-pulse">&gt;</span>
                  <span className="animate-pulse bg-white/30 h-3 w-1.5 inline-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
