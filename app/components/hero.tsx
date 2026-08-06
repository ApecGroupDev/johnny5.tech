"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";

import { StarsBackground } from "./stars-background";

/* ─────────────────────────────────────────────────────────────
   Globe canvas — 3D orbital rings, Concentric dust shells, text projection
 ───────────────────────────────────────────────────────────── */
import { GlobeCanvas } from "./hero/globe-canvas";
import { ConnectorCanvas } from "./hero/connector-canvas";
import { EcosystemNode, StatBadge } from "./hero/ecosystem-node";

/* ─────────────────────────────────────────────────────────────
   Hero
 ───────────────────────────────────────────────────────────── */
export function Hero() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax MouseMove Listener using CSS Custom Properties
  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cont.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const nx = x / (rect.width / 2);
      const ny = y / (rect.height / 2);
      cont.style.setProperty("--mx", `${nx}`);
      cont.style.setProperty("--my", `${ny}`);
    };
    cont.addEventListener("mousemove", handleMouseMove);
    return () => cont.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col overflow-hidden"
      style={{
        height: "calc(100svh - 64px)",
        minHeight: 580,
        background:
          "radial-gradient(ellipse 80% 55% at 68% 50%, rgba(99,102,241,0.13) 0%, rgba(6,182,212,0.06) 42%, transparent 72%), radial-gradient(ellipse 45% 45% at 12% 55%, rgba(234,179,8,0.05) 0%, transparent 65%), #000",
      }}
    >
      <style>{`
        @keyframes hero-float-1 {
          0%, 100% { transform: translate(calc(var(--mx, 0) * -16px), calc(var(--my, 0) * -16px + 0px)); }
          50% { transform: translate(calc(var(--mx, 0) * -16px), calc(var(--my, 0) * -16px - 8px)); }
        }
        @keyframes hero-float-2 {
          0%, 100% { transform: translate(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 18px + 0px)); }
          50% { transform: translate(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 18px - 10px)); }
        }
        @keyframes hero-float-3 {
          0%, 100% { transform: translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px + 0px)); }
          50% { transform: translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px - 7px)); }
        }
        @keyframes hero-float-4 {
          0%, 100% { transform: translate(calc(var(--mx, 0) * 22px), calc(var(--my, 0) * 22px + 0px)); }
          50% { transform: translate(calc(var(--mx, 0) * 22px), calc(var(--my, 0) * 22px - 6px)); }
        }
      `}</style>

      {/* Layer 1: background twinkling stars */}
      <StarsBackground />

      {/* Layer 2: masked perspective grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[45px_45px] mask-[radial-gradient(ellipse_60%_50%_at_68%_50%,#000_40%,transparent_100%)] opacity-40 pointer-events-none z-1" />

      {/* Layer 3: ambient light layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Deep background glows */}
        <div className="absolute top-[15%] right-[-25%] w-[900px] h-[900px] rounded-full bg-cyan-500/08 blur-[130px] animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute top-[25%] right-[5%] w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-[150px] animate-[pulse_11s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-yellow-500/02 blur-[120px] animate-[pulse_13s_ease-in-out_infinite]" />

        {/* Top left corner accent illumination for header & content layout */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/05 blur-[110px]" />

        {/* Interactive Mouse-Following Light Bloom */}
        <div
          className="absolute top-[20%] left-[40%] w-[700px] h-[700px] rounded-full bg-linear-to-tr from-cyan-500/04 to-indigo-500/04 blur-[140px] transition-transform duration-500 ease-out"
          style={{
            transform:
              "translate(calc(var(--mx, 0) * 45px), calc(var(--my, 0) * 45px))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24">
        {/* ── TOP: Brand + text ───────────────────────────── */}
        <div className="flex flex-col gap-3 pt-[clamp(20px,4.5vh,56px)]">
          {/* Status pill */}
          <div className="flex items-center gap-2 self-start rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              System Online · All Services Operational
            </span>
          </div>

          {/* JOHNNY5.TECH */}
          <div>
            <h1
              className="font-display leading-none tracking-[-0.045em] select-none"
              style={{ fontSize: "clamp(40px, 6.2vw, 80px)" }}
            >
              <span className="text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                JOHNNY
              </span>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #06b6d4 0%, #818cf8 50%, #eab308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                className="drop-shadow-[0_0_30px_rgba(99,102,241,0.25)]"
              >
                5.TECH
              </span>
            </h1>
            <p
              className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(6,182,212,0.68)" }}
            >
              AI · Big Data · Automation
            </p>
          </div>

          {/* Description + CTAs + Stats */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <StatBadge value="5" label="Active Apps" icon="◈" />
              <StatBadge value="AI" label="Powered" icon="◎" />
              <StatBadge value="Live" label="Real-time" icon="◉" />
              <StatBadge value="Secure" label="Auth" icon="◆" />
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

        {/* ── BOTTOM: Cards LEFT | Massive Globe RIGHT — fills remaining space ── */}
        <div
          ref={bottomRef}
          className="relative grid min-h-0 flex-initial grid-cols-1 items-start pt-6 gap-6 py-[clamp(10px,3vh,28px)] lg:grid-cols-2"
        >
          {/* Layer 4: Network Connectors */}
          <ConnectorCanvas
            containerRef={bottomRef}
            cardRefs={[card0Ref, card1Ref, card2Ref]}
            globeRef={globeRef}
          />

          {/* Left — Ecosystem cards */}
          <div className="relative flex flex-col gap-2" style={{ zIndex: 10 }}>
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

            <div className="flex flex-col gap-2">
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
                logoSrc="/logos/apec-logo.png"
                accentColor="#eab308"
              />
            </div>
          </div>

          {/* Right — AI Globe container & Floating Panels (Layer 5 & 6) */}
          <div
            ref={globeRef}
            className="relative hidden items-start justify-center lg:flex h-full w-full border-0 bg-transparent outline-none z-2 pt-4"
          >
            {/* The actual massive canvas that overflows behind card grids and screen bounds */}
            <div className="absolute top-[-100px] xl:top-[-160px] w-[520px] h-[520px] xl:w-[650px] xl:h-[650px] aspect-square pointer-events-none select-none">
              <GlobeCanvas />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
