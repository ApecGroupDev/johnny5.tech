"use client";

import { useEffect, useRef } from "react";

export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let w = 0, h = 0;
    
    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      vx: number;
      vy: number;
      color: string;
    }
    
    let stars: Star[] = [];
    
    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      stars = [];
      const count = Math.floor((w * h) / 10000); // balanced star density
      const colors = ["#ffffff", "#cbd5e1", "#22d3ee", "#818cf8"];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.1 + 0.4, // size range (0.4px to 1.5px)
          alpha: Math.random(),
          speed: Math.random() * 0.008 + 0.002,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }
    
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      stars.forEach(star => {
        // Drift movement
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap screen bounds
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        // Twinkling alpha pulse
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx!.globalAlpha = Math.max(0.12, Math.min(1, star.alpha)) * 0.85; // visible but soft opacity
        ctx!.fillStyle = star.color;
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fill();
      });
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
      style={{ zIndex: 0, opacity: 0.8 }} // balanced layer opacity
    />
  );
}
