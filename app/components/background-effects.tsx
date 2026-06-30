"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Background canvas — particles + data streams (fixed viewport)
───────────────────────────────────────────────────────────── */
export function BackgroundEffects() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number,
      w = 0,
      h = 0;
    const C = ["#06b6d4", "#818cf8", "#eab308", "#3b82f6"];

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      c: string;
    };
    type S = {
      x: number;
      y: number;
      len: number;
      spd: number;
      op: number;
      lw: number;
      c: string;
      prog: number;
    };

    const ps: P[] = [];
    const ss: S[] = [];

    const rp = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18, // slightly slower for global bg so it's not distracting
      vy: -Math.random() * 0.3 - 0.05,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.35 + 0.1, // lower opacity so it blends nicely behind text
      c: C[Math.floor(Math.random() * 4)],
    });

    const rs = (): S => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.5,
      len: Math.random() * 150 + 60,
      spd: Math.random() * 0.9 + 0.3,
      op: Math.random() * 0.07 + 0.015, // subtle stream opacity
      lw: Math.random() * 1.1 + 0.3,
      c: C[Math.floor(Math.random() * 4)],
      prog: 0,
    });

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    // Initialize after dimensions are set in resize
    resize();
    for (let i = 0; i < 90; i++) ps.push(rp());
    for (let i = 0; i < 14; i++) ss.push(rs());

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Draw vertical streams
      for (const s of ss) {
        s.prog += s.spd;
        if (s.prog > s.len + 80) {
          Object.assign(s, rs());
          continue;
        }
        const t = Math.min(s.prog / s.len, 1);
        const a = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.save();
        ctx.globalAlpha = s.op * a;
        ctx.strokeStyle = s.c;
        ctx.lineWidth = s.lw;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y + s.prog - s.len * Math.min(t, 1));
        ctx.lineTo(s.x, s.y + s.prog);
        ctx.stroke();
        ctx.restore();
      }

      // Draw particles
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8 || p.x < -8 || p.x > w + 8) {
          Object.assign(p, rp());
          p.y = h + 5;
        }
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Solid Black Base Layer */}
      <div
        className="fixed inset-0 pointer-events-none bg-black"
        style={{ zIndex: -3 }}
        aria-hidden
      />
      {/* Global Fixed Circuit Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          zIndex: -2,
        }}
        aria-hidden
      />
      {/* Floating Particles Canvas */}
      <canvas
        ref={ref}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: -1,
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      />
    </>
  );
}
