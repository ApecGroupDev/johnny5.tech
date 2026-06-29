"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Animated canvas: particle / data-stream background ─── */
function DataCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let w = 0, h = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      color: string;
    }

    interface Stream {
      x: number; y: number;
      length: number; speed: number;
      opacity: number; width: number;
      color: string; progress: number;
    }

    const COLORS = ["#06b6d4", "#818cf8", "#eab308", "#3b82f6"];
    const particles: Particle[] = [];
    const streams: Stream[] = [];

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }

    function spawnParticle(): Particle {
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.6 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function spawnStream(): Stream {
      return {
        x: Math.random() * w, y: Math.random() * h * 0.5,
        length: Math.random() * 200 + 100, speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.15 + 0.05, width: Math.random() * 1.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)], progress: 0,
      };
    }

    for (let i = 0; i < 80; i++) particles.push(spawnParticle());
    for (let i = 0; i < 12; i++) streams.push(spawnStream());

    function drawGlowingOrb() {
      if (!ctx) return;
      const cx = w * 0.72;
      const cy = h * 0.48;
      const r = Math.min(w, h) * 0.26;

      // Outer ambient glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.8);
      glow.addColorStop(0, "rgba(99, 102, 241, 0.14)");
      glow.addColorStop(0.5, "rgba(6, 182, 212, 0.07)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2); ctx.fill();

      // Globe body
      const orbGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r);
      orbGrad.addColorStop(0, "rgba(139, 148, 255, 0.22)");
      orbGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.10)");
      orbGrad.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = orbGrad;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

      // Dotted world grid
      ctx.save(); ctx.globalAlpha = 0.18;
      for (let lat = -r * 0.9; lat <= r * 0.9; lat += 18) {
        const rowR = Math.sqrt(r * r - lat * lat);
        for (let lng = -rowR; lng <= rowR; lng += 18) {
          if (Math.sqrt(lng * lng + lat * lat) < r) {
            ctx.beginPath(); ctx.arc(cx + lng, cy + lat, 1, 0, Math.PI * 2);
            ctx.fillStyle = "#818cf8"; ctx.fill();
          }
        }
      }
      ctx.restore();

      // Edge glow ring
      ctx.save(); ctx.globalAlpha = 0.45;
      const ringGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.05);
      ringGrad.addColorStop(0, "transparent");
      ringGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.65)");
      ringGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = ringGrad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number) {
      return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      drawGlowingOrb();

      // Streams
      for (const s of streams) {
        s.progress += s.speed;
        if (s.progress > s.length + 100) { Object.assign(s, spawnStream()); continue; }
        const t = Math.min(s.progress / s.length, 1);
        const alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.save(); ctx.globalAlpha = s.opacity * alpha; ctx.strokeStyle = s.color; ctx.lineWidth = s.width;
        const head = s.y + s.progress;
        const tail = head - s.length * Math.min(t, 1);
        ctx.beginPath(); ctx.moveTo(s.x, Math.max(tail, s.y)); ctx.lineTo(s.x, Math.min(head, s.y + s.length)); ctx.stroke(); ctx.restore();
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) { Object.assign(p, spawnParticle()); p.y = h + 5; }
        ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }

      void cubicBezier; // used in future iterations
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas); resize(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

/* ─── Ecosystem node card ─── */
function EcosystemNode({
  name, tag, accentColor = "#06b6d4", logoSrc, delay = 0,
}: {
  name: string; tag: string; accentColor?: string; logoSrc: string; delay?: number;
}) {
  return (
    <div
      className="group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 backdrop-blur-sm transition-all duration-500"
      style={{
        borderColor: `${accentColor}40`,
        background: "linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.70) 100%)",
        boxShadow: `0 0 20px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Left glow bar */}
      <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />

      {/* Logo container */}
      <div
        className="ml-1.5 flex h-10 w-16 shrink-0 items-center justify-center rounded-md overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${accentColor}30` }}
      >
        <Image src={logoSrc} alt={name} width={56} height={32} className="object-contain" style={{ maxHeight: 32, maxWidth: 56 }} />
      </div>

      <div className="min-w-0">
        <div className="truncate text-[12px] font-semibold tracking-tight text-white/90">{name}</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: `${accentColor}99` }}>{tag}</div>
      </div>

      {/* Live pulse dot */}
      <div className="ml-auto shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: accentColor }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
        </span>
      </div>
    </div>
  );
}

/* ─── Stat badge ─── */
function StatBadge({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-white/5 bg-white/3 px-4 py-2.5 backdrop-blur-sm">
      <span className="font-mono text-[10px] text-white/30">{icon}</span>
      <span className="font-display text-lg font-bold text-white">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">{label}</span>
    </div>
  );
}

/* ─── Hero ─── */
export function Hero() {
  return (
    <section
      className="relative min-h-[88vh] overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%), radial-gradient(ellipse 50% 50% at 15% 50%, rgba(234,179,8,0.05) 0%, transparent 60%), #000",
      }}
    >
      {/* Circuit board grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Animated canvas */}
      <DataCanvas />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-6">
            {/* Status badge */}
            <div className="flex items-center gap-2 self-start rounded-full border border-cyan-500/30 bg-cyan-500/8 px-3 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                System Online · All Services Operational
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-display leading-none tracking-[-0.04em]" style={{ fontSize: "clamp(52px, 7vw, 88px)" }}>
                <span className="block text-white">JOHNNY</span>
                <span
                  className="block"
                  style={{ background: "linear-gradient(90deg, #06b6d4 0%, #818cf8 50%, #eab308 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  5.TECH
                </span>
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "rgba(6,182,212,0.7)" }}>
                AI · Big Data · Automation
              </p>
            </div>

            {/* Description */}
            <p className="max-w-md text-[16px] leading-relaxed text-white/50">
              Intelligent systems powering real business decisions — from live
              construction risk scoring to AI-assisted field operations and
              enterprise data platforms.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#apps"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-5 py-2.5 text-[13px] font-semibold text-black transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #06b6d4, #818cf8)", boxShadow: "0 0 30px rgba(6,182,212,0.35)" }}
              >
                <span className="relative z-10">Launch Portal</span>
                <svg className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-2 flex flex-wrap gap-2">
              <StatBadge value="5"      label="Active Apps"    icon="◈" />
              <StatBadge value="AI"     label="Powered"        icon="◎" />
              <StatBadge value="Live"   label="Real-time Data" icon="◉" />
              <StatBadge value="Secure" label="Auth Required"  icon="◆" />
            </div>
          </div>

          {/* ── Right column: Ecosystem panel ── */}
          <div className="hidden lg:flex lg:flex-col lg:gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Ecosystem Registry
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-white/20">
                  Partner Status: <span className="text-cyan-400">Verified</span> · Ecosystem Health: <span className="text-emerald-400">Optimal</span>
                </div>
              </div>
              <div className="font-mono text-[9px] text-white/20">
                {new Date().toISOString().split("T")[0]}
              </div>
            </div>

            {/* Company nodes */}
            <div className="flex flex-col gap-2.5">
              <EcosystemNode name="Metal Products Company"     tag="Engineering · Live" logoSrc="/logos/mpc-logo.png"   accentColor="#06b6d4" delay={0}   />
              <EcosystemNode name="Geo Petroleum"              tag="Petroleum · Live"   logoSrc="/logos/geo-logo.png"   accentColor="#22c55e" delay={100} />
              <EcosystemNode name="APEC — Petroleum Equipment" tag="Services · Live"    logoSrc="/logos/apec-logo.webp" accentColor="#eab308" delay={200} />
            </div>

            {/* AI badge */}
            <div
              className="mt-2 flex items-center justify-between rounded-xl border p-4"
              style={{
                borderColor: "rgba(129,140,248,0.25)",
                background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 100%)",
                boxShadow: "0 0 40px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <div
                  className="font-display text-4xl font-bold leading-none"
                  style={{ background: "linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  AI
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Powering Intelligence</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Shaping the Future</div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                {["Analytics", "Forecasting", "Automation", "AI Assist", "Security"].map((cap) => (
                  <div key={cap} className="flex items-center justify-end gap-1.5">
                    <span className="font-mono text-[9px] text-white/30">{cap}</span>
                    <span className="h-1 w-1 rounded-full bg-cyan-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom label */}
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              Ecosystem Registry
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
