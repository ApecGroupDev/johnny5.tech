"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Hero Starfield — two layers matching the global background:
   1. Distant static stars — tiny gently-twinkling dots.
   2. Hyperspace warp streaks — projected from the viewport
      center so they align perfectly with the global canvas.
───────────────────────────────────────────────────────────── */
export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, w = 0, h = 0;

    // ── Distant static stars ──────────────────────────────────
    const DISTANT_COUNT = 200;

    type Distant = {
      x: number;
      y: number;
      r: number;
      base: number;
      phase: number;
      speed: number;
    };

    const distant: Distant[] = [];

    function spawnDistant(): Distant {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.6 + 0.15,
        base: Math.random() * 0.18 + 0.06,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.002,
      };
    }

    // ── Warp streaks ──────────────────────────────────────────
    const STAR_COUNT = 160;
    const MAX_Z = 800;
    const SPEED = 1.2;

    type Star = {
      x: number;
      y: number;
      z: number;
      pz: number;
    };

    const stars: Star[] = [];

    function viewportCenter() {
      const rect = canvas!.getBoundingClientRect();
      return {
        cx: window.innerWidth / 2 - rect.left,
        cy: window.innerHeight / 2 - rect.top,
      };
    }

    function spawnStar(spread: boolean): Star {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(w, h) * 1.2 + 40;
      const z = spread ? Math.random() * MAX_Z * 0.9 + 20 : MAX_Z;
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, z, pz: z };
    }

    function project(x: number, y: number, z: number, cx: number, cy: number) {
      const f = (MAX_Z / Math.max(z, 0.5)) * 0.5;
      return { sx: cx + x * f, sy: cy + y * f };
    }

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) stars.push(spawnStar(true));
      distant.length = 0;
      for (let i = 0; i < DISTANT_COUNT; i++) distant.push(spawnDistant());
    }

    let t = 0;

    function draw() {
      if (!ctx) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h); // transparent — hero bg shows through

      // ── Distant static stars ─────────────────────────────────
      for (const d of distant) {
        const alpha = d.base + Math.sin(t * d.speed * 60 + d.phase) * (d.base * 0.4);
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(alpha, 0.32));
        ctx.fillStyle = "#d8e8ff";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Warp streaks ─────────────────────────────────────────
      const { cx, cy } = viewportCenter();

      for (const star of stars) {
        const prev = project(star.x, star.y, star.pz, cx, cy);
        star.pz = star.z;
        star.z -= SPEED;

        if (star.z <= 1) {
          Object.assign(star, spawnStar(false));
          continue;
        }

        const curr = project(star.x, star.y, star.z, cx, cy);

        if (curr.sx < -20 || curr.sx > w + 20 || curr.sy < -20 || curr.sy > h + 20) {
          Object.assign(star, spawnStar(false));
          continue;
        }

        const t2 = 1 - star.z / MAX_Z;
        const alpha = Math.pow(t2, 2.2) * 0.38;
        const lw = t2 * 0.9 + 0.1;

        ctx.save();
        ctx.globalAlpha = Math.min(alpha, 0.42);
        ctx.strokeStyle = "#c8d8ff";
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prev.sx, prev.sy);
        ctx.lineTo(curr.sx, curr.sy);
        ctx.stroke();

        ctx.globalAlpha = Math.min(alpha * 1.6, 0.55);
        ctx.fillStyle = "#e8f0ff";
        ctx.beginPath();
        ctx.arc(curr.sx, curr.sy, t2 * 0.8 + 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

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
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
}
