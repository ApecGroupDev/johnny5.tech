"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Background canvas — subtle Star Wars starfield.
   Stars drift outward from screen center using 3D perspective.
   Kept deliberately faint so it doesn't compete with content.
───────────────────────────────────────────────────────────── */
export function BackgroundEffects() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, w = 0, h = 0;

    const STAR_COUNT = 160;   // fewer stars = less noise
    const MAX_Z = 800;
    const SPEED = 1.2;        // slow, calm drift

    type Star = {
      x: number;
      y: number;
      z: number;
      pz: number;
    };

    const stars: Star[] = [];

    function spawnStar(spread: boolean): Star {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(w, h) * 0.9 + 40;
      const z = spread ? Math.random() * MAX_Z * 0.9 + 20 : MAX_Z;
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, z, pz: z };
    }

    function project(x: number, y: number, z: number) {
      const f = (MAX_Z / Math.max(z, 0.5)) * 0.5;
      return { sx: w / 2 + x * f, sy: h / 2 + y * f };
    }

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) stars.push(spawnStar(true));
    }

    function draw() {
      if (!ctx) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        const prev = project(star.x, star.y, star.pz);
        star.pz = star.z;
        star.z -= SPEED;

        if (star.z <= 1) {
          Object.assign(star, spawnStar(false));
          continue;
        }

        const curr = project(star.x, star.y, star.z);

        if (curr.sx < -20 || curr.sx > w + 20 || curr.sy < -20 || curr.sy > h + 20) {
          Object.assign(star, spawnStar(false));
          continue;
        }

        // Proximity 0→1 as star approaches viewer
        const t = 1 - star.z / MAX_Z;

        // Very subtle — barely visible far away, gentle at close range
        const alpha = Math.pow(t, 2.2) * 0.38;
        const lw = t * 0.9 + 0.1;

        ctx.save();
        ctx.globalAlpha = Math.min(alpha, 0.42);
        ctx.strokeStyle = "#c8d8ff";
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prev.sx, prev.sy);
        ctx.lineTo(curr.sx, curr.sy);
        ctx.stroke();

        // Soft dot at leading tip
        ctx.globalAlpha = Math.min(alpha * 1.6, 0.55);
        ctx.fillStyle = "#e8f0ff";
        ctx.beginPath();
        ctx.arc(curr.sx, curr.sy, t * 0.8 + 0.1, 0, Math.PI * 2);
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
      {/* Subtle circuit grid — barely visible */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* Hyperspace Starfield */}
      <canvas
        ref={ref}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
