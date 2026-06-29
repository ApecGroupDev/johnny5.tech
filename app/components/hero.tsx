"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Globe canvas — fills its container, bigger radius
───────────────────────────────────────────────────────────── */
function GlobeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number,
      w = 0,
      h = 0;
    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const now = Date.now() / 1000;
      const cx = w * 0.5,
        cy = h * 0.5;
      const r = Math.min(w, h) * 0.4; // scaled down slightly to prevent clipping glow

      // Ambient outer glow
      const amb = ctx.createRadialGradient(cx, cy, r * 0.12, cx, cy, r * 1.22);
      amb.addColorStop(0, "rgba(99,102,241,.20)");
      amb.addColorStop(0.4, "rgba(6,182,212,.09)");
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.22, 0, Math.PI * 2);
      ctx.fill();

      // Globe body
      const body = ctx.createRadialGradient(
        cx - r * 0.24,
        cy - r * 0.28,
        r * 0.06,
        cx,
        cy,
        r,
      );
      body.addColorStop(0, "rgba(148,163,255,.26)");
      body.addColorStop(0.45, "rgba(6,182,212,.12)");
      body.addColorStop(1, "rgba(0,0,0,.40)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Dot world map
      ctx.save();
      ctx.globalAlpha = 0.21;
      const step = Math.max(r / 13, 13);
      for (let lat = -r * 0.92; lat <= r * 0.92; lat += step) {
        const rowR = Math.sqrt(r * r - lat * lat);
        for (let lng = -rowR; lng <= rowR; lng += step) {
          if (Math.sqrt(lng * lng + lat * lat) < r * 0.94) {
            ctx.beginPath();
            ctx.arc(cx + lng, cy + lat, 0.92, 0, Math.PI * 2);
            ctx.fillStyle = "#a5b4fc";
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Rotating 3D dot grid sphere overlay
      ctx.save();
      const points = 16;
      const rotateY = now * 0.22;
      const rotateX = 0.15;
      for (let lat = 0; lat < points; lat++) {
        const theta = (lat / points) * Math.PI - Math.PI / 2;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const longPoints = 24;
        for (let lon = 0; lon < longPoints; lon++) {
          const phi = (lon / longPoints) * 2 * Math.PI + rotateY;
          let x3 = r * cosTheta * Math.sin(phi);
          let y3 = r * sinTheta;
          let z3 = r * cosTheta * Math.cos(phi);
          const yRot = y3 * Math.cos(rotateX) - z3 * Math.sin(rotateX);
          const zRot = y3 * Math.sin(rotateX) + z3 * Math.cos(rotateX);
          y3 = yRot;
          z3 = zRot;
          if (z3 > 0) {
            const px = cx + x3;
            const py = cy + y3;
            const zRatio = z3 / r;
            const dotOpacity = 0.08 + zRatio * 0.35;
            const dotSize = 0.8 + zRatio * 1.1;
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fillStyle =
              lon % 2 === 0
                ? `rgba(6,182,212,${dotOpacity})`
                : `rgba(129,140,248,${dotOpacity})`;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Lat/lng lines
      ctx.save();
      ctx.globalAlpha = 0.055;
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 0.75;
      for (let i = 1; i < 5; i++) {
        const lat = r * (i / 5 - 0.5) * 1.55;
        const rr = Math.sqrt(Math.max(0, r * r - lat * lat));
        ctx.beginPath();
        ctx.arc(cx, cy + lat, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const angle = i * (Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(
          cx + Math.cos(angle) * r * 0.55,
          cy + Math.sin(angle) * r * 0.55,
          cx,
          cy + r,
        );
        ctx.stroke();
      }
      ctx.restore();

      // Pulsing rim (cyan)
      const rp = 0.52 + 0.22 * Math.sin(now * 1.25);
      ctx.save();
      ctx.globalAlpha = rp;
      const rim = ctx.createRadialGradient(cx, cy, r * 0.87, cx, cy, r * 1.06);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(0.5, "rgba(6,182,212,.72)");
      rim.addColorStop(1, "transparent");
      ctx.strokeStyle = rim;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      // Purple outer ring
      ctx.globalAlpha = rp * 0.55;
      const rim2 = ctx.createRadialGradient(cx, cy, r * 1.02, cx, cy, r * 1.18);
      rim2.addColorStop(0, "rgba(129,140,248,.45)");
      rim2.addColorStop(1, "transparent");
      ctx.strokeStyle = rim2;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // "AI" text
      const aiSz = Math.max(r * 0.42, 28);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${aiSz}px system-ui,sans-serif`;
      const aiG = ctx.createLinearGradient(
        cx,
        cy - aiSz * 0.5,
        cx,
        cy + aiSz * 0.2,
      );
      aiG.addColorStop(0, "#a5b4fc");
      aiG.addColorStop(1, "#06b6d4");
      ctx.fillStyle = aiG;
      ctx.globalAlpha = 0.92;
      ctx.shadowColor = "#818cf8";
      ctx.shadowBlur = 18;
      ctx.fillText("AI", cx, cy - r * 0.06);
      ctx.font = `500 ${Math.max(r * 0.1, 9)}px monospace`;
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = "#c4c8ff";
      ctx.shadowBlur = 0;
      ctx.fillText("POWERING INTELLIGENCE", cx, cy + r * 0.2);
      ctx.fillText("SHAPING THE FUTURE", cx, cy + r * 0.31);
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="w-full h-full"
      style={{
        display: "block",
        background: "transparent",
        border: "none",
        outline: "none",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Connector canvas — absolutely positioned over the bottom grid.
   Measures actual DOM positions of cards + globe, draws bezier
   lines with traveling dots from each card → globe center.
───────────────────────────────────────────────────────────── */
function ConnectorCanvas({
  containerRef,
  cardRefs,
  globeRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.RefObject<HTMLDivElement | null>[];
  globeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const ACCENT = ["#06b6d4", "#22c55e", "#eab308"];

    function bez(p0: number, p1: number, p2: number, p3: number, t: number) {
      return (
        (1 - t) ** 3 * p0 +
        3 * (1 - t) ** 2 * t * p1 +
        3 * (1 - t) * t ** 2 * p2 +
        t ** 3 * p3
      );
    }
    function ra(hex: string, a: number) {
      const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function resize() {
      const cont = containerRef.current;
      if (!cont) return;
      const rect = cont.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
    }

    function draw() {
      if (!ctx) return;
      const w = canvas!.width,
        h = canvas!.height;
      ctx.clearRect(0, 0, w, h);
      const now = Date.now() / 1000;
      const cont = containerRef.current;
      const globe = globeRef.current;
      if (!cont || !globe) return void (raf = requestAnimationFrame(draw));

      const contRect = cont.getBoundingClientRect();
      const globeRect = globe.getBoundingClientRect();
      // Globe center relative to container
      const gx = globeRect.left - contRect.left + globeRect.width / 2;
      const gy = globeRect.top - contRect.top + globeRect.height / 2;

      cardRefs.forEach((cRef, i) => {
        const card = cRef.current;
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        // Source: right edge, vertical center of card
        const srcX = cardRect.right - contRect.left;
        const srcY = cardRect.top - contRect.top + cardRect.height / 2;
        const c = ACCENT[i];

        const dx = gx - srcX;
        const cp1x = srcX + dx * 0.38;
        const cp1y = srcY;
        const cp2x = srcX + dx * 0.7;
        const cp2y = gy;

        // Gradient line
        ctx.save();
        const lg = ctx.createLinearGradient(srcX, srcY, gx, gy);
        const lp = 0.28 + 0.14 * Math.sin(now * 1.9 + i * 1.5);
        lg.addColorStop(0, ra(c, lp));
        lg.addColorStop(0.55, ra(c, lp * 2.8));
        lg.addColorStop(1, ra(c, 0.04));
        ctx.strokeStyle = lg;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.88;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, gx, gy);
        ctx.stroke();
        // Thin secondary glow
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY + 2);
        ctx.bezierCurveTo(cp1x, cp1y + 2, cp2x, cp2y, gx, gy);
        ctx.stroke();
        ctx.restore();

        // Traveling dot
        const prog = (now * 0.5 + i * 0.34) % 1;
        const bx = bez(srcX, cp1x, cp2x, gx, prog);
        const by = bez(srcY, cp1y, cp2y, gy, prog);
        ctx.save();
        ctx.shadowColor = c;
        ctx.shadowBlur = 14;
        ctx.fillStyle = c;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(bx, by, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        pointerEvents: "none",
        zIndex: 2,
        background: "transparent",
        border: "none",
        outline: "none",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Ecosystem node card — forwardRef so Hero can measure position
───────────────────────────────────────────────────────────── */
const EcosystemNode = forwardRef<
  HTMLDivElement,
  {
    name: string;
    tag: string;
    accentColor?: string;
    logoSrc: string;
  }
>(function EcosystemNode({ name, tag, accentColor = "#06b6d4", logoSrc }, ref) {
  return (
    <div
      ref={ref}
      className="relative flex items-center gap-3 rounded-lg border px-3 py-3 backdrop-blur-sm"
      style={{
        borderColor: `${accentColor}40`,
        background:
          "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.72) 100%)",
        boxShadow: `0 0 24px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
      />

      {/* Logo */}
      <div
        className="ml-1.5 flex h-11 w-[68px] shrink-0 items-center justify-center rounded-md overflow-hidden bg-white p-1"
        style={{
          border: `1px solid ${accentColor}40`,
        }}
      >
        <Image
          src={logoSrc}
          alt={name}
          width={60}
          height={36}
          className="object-contain"
          style={{ maxHeight: 36, maxWidth: 60 }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-semibold tracking-tight text-white/90">
          {name}
        </div>
        <div
          className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em]"
          style={{ color: `${accentColor}90` }}
        >
          {tag}
        </div>
      </div>

      {/* Live dot */}
      <div className="shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: accentColor }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: accentColor }}
          />
        </span>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   Stat badge
───────────────────────────────────────────────────────────── */
function StatBadge({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/3 px-4 py-2.5 backdrop-blur-sm">
      <span className="font-mono text-[10px] text-white/28">{icon}</span>
      <span className="font-display text-lg font-bold text-white">{value}</span>
      <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-white/38">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────────── */
export function Hero() {
  // Refs for connector lines
  const bottomRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "92vh",
        background:
          "radial-gradient(ellipse 80% 55% at 68% 50%, rgba(99,102,241,0.13) 0%, rgba(6,182,212,0.06) 42%, transparent 72%), radial-gradient(ellipse 45% 45% at 12% 55%, rgba(234,179,8,0.05) 0%, transparent 65%), #000",
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ── TOP: Brand + text ───────────────────────────── */}
        <div className="flex flex-col gap-5 pt-16 pb-10">
          {/* Status pill */}
          <div className="flex items-center gap-2 self-start rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              System Online · All Services Operational
            </span>
          </div>

          {/* JOHNNY5.TECH — one word */}
          <div>
            <h1
              className="font-display leading-none tracking-[-0.045em]"
              style={{ fontSize: "clamp(54px, 7.5vw, 92px)" }}
            >
              <span className="text-white">JOHNNY</span>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #06b6d4 0%, #818cf8 50%, #eab308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                5.TECH
              </span>
            </h1>
            <p
              className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(6,182,212,0.68)" }}
            >
              AI · Big Data · Automation
            </p>
          </div>

          {/* Description + CTAs + Stats */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5">
              <p className="max-w-lg text-[15.5px] leading-relaxed text-white/48">
                Intelligent systems powering real business decisions — from live
                construction risk scoring to AI-assisted field operations and
                enterprise data platforms.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/#apps"
                  className="group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-black transition-all duration-300 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #818cf8)",
                    boxShadow: "0 0 28px rgba(6,182,212,0.35)",
                  }}
                >
                  Launch Portal
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5-5 5M6 12h12"
                    />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-5 py-2.5 text-[13px] font-medium text-white/65 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatBadge value="5" label="Active Apps" icon="◈" />
              <StatBadge value="AI" label="Powered" icon="◎" />
              <StatBadge value="Live" label="Real-time Data" icon="◉" />
              <StatBadge value="Secure" label="Auth Required" icon="◆" />
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(6,182,212,0.3), rgba(129,140,248,0.15), transparent)",
            }}
          />
        </div>

        {/* ── BOTTOM: Cards LEFT | Globe RIGHT ──────────── */}
        {/* relative container so ConnectorCanvas can be absolute over both columns */}
        <div
          ref={bottomRef}
          className="relative grid grid-cols-1 gap-8 pb-16 lg:grid-cols-2 lg:items-center"
        >
          {/* Connector lines drawn over both columns */}
          <ConnectorCanvas
            containerRef={bottomRef}
            cardRefs={[card0Ref, card1Ref, card2Ref]}
            globeRef={globeRef}
          />

          {/* Left — Ecosystem cards */}
          <div className="relative flex flex-col gap-3" style={{ zIndex: 3 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Ecosystem Registry
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-white/20">
                  Partner Status:{" "}
                  <span className="text-cyan-400">Verified</span> · Health:{" "}
                  <span className="text-emerald-400">Optimal</span>
                </div>
              </div>
              <div className="font-mono text-[9px] text-white/18">
                {new Date().toISOString().split("T")[0]}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <EcosystemNode
                ref={card0Ref}
                name="Metal Products Company"
                tag="Engineering · Live"
                logoSrc="/logos/mpc-logo.png"
                accentColor="#06b6d4"
              />
              <EcosystemNode
                ref={card1Ref}
                name="Geo Petroleum"
                tag="Petroleum · Live"
                logoSrc="/logos/geo-logo.png"
                accentColor="#22c55e"
              />
              <EcosystemNode
                ref={card2Ref}
                name="Atlanta Petroleum Equipment Company"
                tag="Services · Live"
                logoSrc="/logos/apec-logo.webp"
                accentColor="#eab308"
              />
            </div>

            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/15">
              Ecosystem Registry
            </div>
          </div>

          {/* Right — AI Globe (ref'd so connector knows its center) */}
          <div
            ref={globeRef}
            className="hidden lg:block w-full max-w-[460px] aspect-square mx-auto bg-transparent border-0 outline-none"
            style={{ zIndex: 3 }}
          >
            <GlobeCanvas />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
