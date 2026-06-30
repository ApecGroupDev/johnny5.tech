"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Hero Hyperspace Starfield.
   The hero section has an opaque background (#000 fallback in
   its inline style), which blocks the global fixed canvas.
   This canvas sits inside the hero (absolute inset-0) and
   projects from the VIEWPORT center — not the canvas center —
   so its warp direction matches the global background exactly.
───────────────────────────────────────────────────────────── */
export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, w = 0, h = 0;

    // Same constants as the global background for consistency
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

    // Viewport center expressed in canvas-local coordinates.
    // The global canvas always projects from (vw/2, vh/2).
    // The hero canvas is offset by (left, top) from the viewport,
    // so the matching center in local coords is:
    //   localCx = vw/2 - canvas.getBoundingClientRect().left
    //   localCy = vh/2 - canvas.getBoundingClientRect().top
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
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h); // transparent — hero section bg shows through

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

        const t = 1 - star.z / MAX_Z;
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

        ctx.globalAlpha = Math.min(alpha * 1.6, 0.55);
        ctx.fillStyle = "#e8f0ff";
        ctx.beginPath();
        ctx.arc(curr.sx, curr.sy, t * 0.8 + 0.1, 0, Math.PI * 2);
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
