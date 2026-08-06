"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";

export function ConnectorCanvas({
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
      const globeCanvas = globe.querySelector("canvas");
      const targetRect = globeCanvas
        ? globeCanvas.getBoundingClientRect()
        : globeRect;
      const gx = targetRect.left - contRect.left + targetRect.width / 2;
      const gy = targetRect.top - contRect.top + targetRect.height / 2;

      cardRefs.forEach((cRef, i) => {
        const card = cRef.current;
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const srcX = cardRect.right - contRect.left;
        const srcY = cardRect.top - contRect.top + cardRect.height / 2;
        const c = ACCENT[i];

        const dx = gx - srcX;
        const cp1x = srcX + dx * 0.38;
        const cp1y = srcY;
        const cp2x = srcX + dx * 0.7;
        const cp2y = gy;

        // 1. Draw glowing background path line
        ctx.save();
        const lg = ctx.createLinearGradient(srcX, srcY, gx, gy);
        const lp = 0.16 + 0.08 * Math.sin(now * 2.2 + i * 1.2);
        lg.addColorStop(0, ra(c, lp));
        lg.addColorStop(0.55, ra(c, lp * 2.2));
        lg.addColorStop(1, ra(c, 0.03));
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, gx, gy);
        ctx.stroke();
        ctx.restore();

        // 2. Draw active glowing pulse wave segment
        ctx.save();
        const pulseProgress = (now * 0.35 + i * 0.2) % 1;
        const pSize = 0.12; // wave segment length
        const tStart = Math.max(0, pulseProgress - pSize);
        const tEnd = pulseProgress;

        ctx.lineWidth = 2.2;
        ctx.strokeStyle = ra(c, 0.45);
        ctx.beginPath();
        for (let t = tStart; t <= tEnd; t += 0.01) {
          const bx = bez(srcX, cp1x, cp2x, gx, t);
          const by = bez(srcY, cp1y, cp2y, gy, t);
          if (t === tStart) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
        }
        ctx.stroke();
        ctx.restore();

        // 3. Draw multiple flowing packets in series with trailing gradient tails
        const speed = 0.38;
        const baseProg = (now * speed + i * 0.3) % 1;

        for (let pack = 0; pack < 2; pack++) {
          const prog = (baseProg + pack * 0.5) % 1;
          const bx = bez(srcX, cp1x, cp2x, gx, prog);
          const by = bez(srcY, cp1y, cp2y, gy, prog);

          // Draw trail segment
          ctx.save();
          const trailLength = 0.06;
          const trStart = Math.max(0, prog - trailLength);
          const trEnd = prog;

          const trailG = ctx.createLinearGradient(
            bez(srcX, cp1x, cp2x, gx, trStart),
            bez(srcY, cp1y, cp2y, gy, trStart),
            bx,
            by,
          );
          trailG.addColorStop(0, "transparent");
          trailG.addColorStop(1, ra(c, 0.5));
          ctx.strokeStyle = trailG;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let t = trStart; t <= trEnd; t += 0.015) {
            const tx = bez(srcX, cp1x, cp2x, gx, t);
            const ty = bez(srcY, cp1y, cp2y, gy, t);
            if (t === trStart) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          }
          ctx.stroke();
          ctx.restore();

          // Packet core glow
          ctx.save();
          ctx.shadowColor = c;
          ctx.shadowBlur = 10;
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#fff";
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (document.visibilityState === "visible" && isIntersecting) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    }

    let isIntersecting = true;
    function checkState() {
      if (document.visibilityState === "visible" && isIntersecting) {
        if (!raf) draw();
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      checkState();
    });
    io.observe(canvas);

    const handleVis = () => checkState();
    document.addEventListener("visibilitychange", handleVis);

    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    resize();
    checkState();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVis);
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
