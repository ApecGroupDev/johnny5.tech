"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Layer 1: Stars background canvas — twinkling & drifting
 ───────────────────────────────────────────────────────────── */
function StarsBackground() {
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
    }
    
    let stars: Star[] = [];
    
    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      stars = [];
      const count = Math.floor((w * h) / 14000); // density of stars
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 0.8 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
        });
      }
    }
    
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#ffffff";
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx!.globalAlpha = Math.max(0, Math.min(1, star.alpha)) * 0.6;
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
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Globe canvas — 3D orbital rings, Concentric dust shells, text projection
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
      const r = Math.min(w, h) * 0.38;

      // Ambient outer bloom (Cyan/Indigo/Gold gradient)
      const amb = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.4);
      amb.addColorStop(0, "rgba(99,102,241,.24)");
      amb.addColorStop(0.35, "rgba(6,182,212,.12)");
      amb.addColorStop(0.7, "rgba(234,179,8,.02)");
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Globe body base shadow
      const body = ctx.createRadialGradient(
        cx - r * 0.2,
        cy - r * 0.24,
        r * 0.05,
        cx,
        cy,
        r,
      );
      body.addColorStop(0, "rgba(165,180,252,.30)");
      body.addColorStop(0.5, "rgba(6,182,212,.14)");
      body.addColorStop(1, "rgba(5,5,10,.85)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Dot world map (faint base layer)
      ctx.save();
      ctx.globalAlpha = 0.18;
      const step = Math.max(r / 13, 12);
      for (let lat = -r * 0.92; lat <= r * 0.92; lat += step) {
        const rowR = Math.sqrt(r * r - lat * lat);
        for (let lng = -rowR; lng <= rowR; lng += step) {
          if (Math.sqrt(lng * lng + lat * lat) < r * 0.94) {
            ctx.beginPath();
            ctx.arc(cx + lng, cy + lat, 0.85, 0, Math.PI * 2);
            ctx.fillStyle = "#a5b4fc";
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Concentric Shell 1: Main Rotating 3D Dot Grid Sphere
      ctx.save();
      const points = 18;
      const rotateY1 = now * 0.18;
      const rotateX1 = 0.15;
      for (let lat = 0; lat < points; lat++) {
        const theta = (lat / points) * Math.PI - Math.PI / 2;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const longPoints = 26;
        for (let lon = 0; lon < longPoints; lon++) {
          const phi = (lon / longPoints) * 2 * Math.PI + rotateY1;
          let x3 = r * cosTheta * Math.sin(phi);
          let y3 = r * sinTheta;
          let z3 = r * cosTheta * Math.cos(phi);
          const yRot = y3 * Math.cos(rotateX1) - z3 * Math.sin(rotateX1);
          const zRot = y3 * Math.sin(rotateX1) + z3 * Math.cos(rotateX1);
          if (zRot > 0) {
            const px = cx + x3;
            const py = cy + yRot;
            const zRatio = zRot / r;
            const dotOpacity = 0.1 + zRatio * 0.5;
            const dotSize = 0.85 + zRatio * 1.25;
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

      // Concentric Shell 2: Outer Faint Dust Particle Shell (Rotating Reverse)
      ctx.save();
      const outerPoints = 10;
      const outerR = r * 1.12;
      const rotateY2 = -now * 0.08;
      const rotateX2 = -0.2;
      for (let lat = 0; lat < outerPoints; lat++) {
        const theta = (lat / outerPoints) * Math.PI - Math.PI / 2;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const longPoints = 16;
        for (let lon = 0; lon < longPoints; lon++) {
          const phi = (lon / longPoints) * 2 * Math.PI + rotateY2;
          let x3 = outerR * cosTheta * Math.sin(phi);
          let y3 = outerR * sinTheta;
          let z3 = outerR * cosTheta * Math.cos(phi);
          const yRot = y3 * Math.cos(rotateX2) - z3 * Math.sin(rotateX2);
          const zRot = y3 * Math.sin(rotateX2) + z3 * Math.cos(rotateX2);
          if (zRot > 0) {
            const px = cx + x3;
            const py = cy + yRot;
            const zRatio = zRot / outerR;
            ctx.beginPath();
            ctx.arc(px, py, 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(234,179,8,${zRatio * 0.28})`;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Lat/lng lines (subtle wireframe details)
      ctx.save();
      ctx.globalAlpha = 0.045;
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 0.65;
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

      // 3D Orbital Ring 1 (Cyan tilted)
      ctx.save();
      ctx.lineWidth = 1.1;
      const ringPoints1 = 90;
      const ringRadius1 = r * 1.25;
      const tiltX1 = 0.75;
      const tiltY1 = now * 0.16;
      for (let i = 0; i <= ringPoints1; i++) {
        const angle = (i / ringPoints1) * 2 * Math.PI;
        let rx = ringRadius1 * Math.cos(angle);
        let ry = 0;
        let rz = ringRadius1 * Math.sin(angle);
        let x1 = rx * Math.cos(tiltY1) + rz * Math.sin(tiltY1);
        let z1 = -rx * Math.sin(tiltY1) + rz * Math.cos(tiltY1);
        let y2 = ry * Math.cos(tiltX1) - z1 * Math.sin(tiltX1);
        let z2 = ry * Math.sin(tiltX1) + z1 * Math.cos(tiltX1);
        const px = cx + x1;
        const py = cy + y2;
        const alpha = 0.08 + (z2 > 0 ? (z2 / ringRadius1) * 0.32 : 0);
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        if (i === 0) ctx.beginPath(), ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // 3D Orbital Ring 2 (Indigo tilted opposite)
      ctx.save();
      ctx.lineWidth = 0.9;
      const ringPoints2 = 90;
      const ringRadius2 = r * 1.38;
      const tiltX2 = -0.65;
      const tiltY2 = -now * 0.12;
      for (let i = 0; i <= ringPoints2; i++) {
        const angle = (i / ringPoints2) * 2 * Math.PI;
        let rx = ringRadius2 * Math.cos(angle);
        let ry = 0;
        let rz = ringRadius2 * Math.sin(angle);
        let x1 = rx * Math.cos(tiltY2) + rz * Math.sin(tiltY2);
        let z1 = -rx * Math.sin(tiltY2) + rz * Math.cos(tiltY2);
        let y2 = ry * Math.cos(tiltX2) - z1 * Math.sin(tiltX2);
        let z2 = ry * Math.sin(tiltX2) + z1 * Math.cos(tiltX2);
        const px = cx + x1;
        const py = cy + y2;
        const alpha = 0.05 + (z2 > 0 ? (z2 / ringRadius2) * 0.25 : 0);
        ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
        if (i === 0) ctx.beginPath(), ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Pulsing outer edge glow
      const rp = 0.52 + 0.22 * Math.sin(now * 1.25);
      ctx.save();
      ctx.globalAlpha = rp;
      const rim = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.08);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(0.5, "rgba(6,182,212,.64)");
      rim.addColorStop(1, "transparent");
      ctx.strokeStyle = rim;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = rp * 0.45;
      const rim2 = ctx.createRadialGradient(cx, cy, r * 1.02, cx, cy, r * 1.22);
      rim2.addColorStop(0, "rgba(129,140,248,.38)");
      rim2.addColorStop(1, "transparent");
      ctx.strokeStyle = rim2;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Rotating Holographic Data Labels projected in 3D space
      const labels = [
        { text: "APEC_NODE_01", lat: 0.3, lon: 0 },
        { text: "GEO_DB_SYNC", lat: -0.4, lon: Math.PI * 0.65 },
        { text: "SYS_UPTIME_99.9", lat: 0.5, lon: Math.PI * 1.3 },
        { text: "CLAUDE_3.5_SONNET", lat: -0.2, lon: Math.PI * 1.8 }
      ];
      labels.forEach((lbl) => {
        const theta = lbl.lat;
        const phi = lbl.lon + now * 0.15; // revolve slowly
        const labelR = r * 1.06;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        let x3 = labelR * cosTheta * Math.sin(phi);
        let y3 = labelR * sinTheta;
        let z3 = labelR * cosTheta * Math.cos(phi);
        
        const yRot = y3 * Math.cos(0.15) - z3 * Math.sin(0.15);
        const zRot = y3 * Math.sin(0.15) + z3 * Math.cos(0.15);
        
        if (zRot > 0) {
          const px = cx + x3;
          const py = cy + yRot;
          const opacity = (zRot / labelR) * 0.62;
          ctx.save();
          ctx.font = "8px monospace";
          ctx.fillStyle = `rgba(165,180,252,${opacity})`;
          ctx.fillText(lbl.text, px + 8, py + 3);
          
          // Draw connecting dot marker
          ctx.fillStyle = `rgba(6,182,212,${opacity})`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // "AI" centerpiece text
      const aiSz = Math.max(r * 0.38, 22);
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
      ctx.shadowBlur = 15;
      ctx.fillText("AI", cx, cy - r * 0.05);
      ctx.font = `500 ${Math.max(r * 0.09, 7.5)}px monospace`;
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = "#c4c8ff";
      ctx.shadowBlur = 0;
      ctx.fillText("POWERING INTELLIGENCE", cx, cy + r * 0.2);
      ctx.fillText("SHAPING THE FUTURE", cx, cy + r * 0.32);
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
   Connector canvas — bezier lines with flowing multi-packets & tails
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
      const gx = globeRect.left - contRect.left + globeRect.width / 2;
      const gy = globeRect.top - contRect.top + globeRect.height / 2;

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
            by
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
   Ecosystem node card
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
      className="relative flex items-center gap-3.5 rounded-lg border px-3.5 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-white/30 hover:shadow-[0_0_32px_rgba(6,182,212,0.25)] hover:bg-black/90"
      style={{
        borderColor: `${accentColor}40`,
        background:
          "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.72) 100%)",
        boxShadow: `0 0 24px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
      />

      <div
        className="ml-1.5 flex h-11 w-[68px] shrink-0 items-center justify-center rounded-md overflow-hidden bg-white p-1"
        style={{ border: `1px solid ${accentColor}40` }}
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
        <div className="truncate text-[13.5px] font-semibold tracking-tight text-white/90">
          {name}
        </div>
        <div
          className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em]"
          style={{ color: `${accentColor}90` }}
        >
          {tag}
        </div>
      </div>

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
   Stat badge — slim
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
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/3 px-3 py-1.5 backdrop-blur-sm">
      <span className="font-mono text-[10px] text-white/28">{icon}</span>
      <span className="font-display text-[13px] font-bold text-white">
        {value}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/38">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Layer 6: Holographic glassmorphic data panels floating component
 ───────────────────────────────────────────────────────────── */
function FloatingPanel({
  title,
  value,
  status,
  statusColor = "#06b6d4",
  className = "",
  style = {},
}: {
  title: string;
  value: string;
  status: string;
  statusColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute pointer-events-auto rounded-lg border border-white/[0.08] bg-black/45 px-3 py-2 backdrop-blur-md transition-all duration-300 hover:border-white/20 select-none shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
      style={{
        boxShadow: `0 0 16px ${statusColor}08, inset 0 1px 0 rgba(255,255,255,0.05)`,
        ...style,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="h-1 w-1 rounded-full animate-pulse"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 4px ${statusColor}`,
          }}
        />
        <span className="font-mono text-[8px] uppercase tracking-wider text-white/40">
          {title}
        </span>
      </div>
      <div className="mt-1 font-mono text-[10.5px] font-semibold text-white/90">
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[7.5px] text-white/30">{status}</div>
    </div>
  );
}

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
        height: "100svh",
        minHeight: 640,
        background:
          "radial-gradient(ellipse 80% 55% at 68% 50%, rgba(99,102,241,0.13) 0%, rgba(6,182,212,0.06) 42%, transparent 72%), radial-gradient(ellipse 45% 45% at 12% 55%, rgba(234,179,8,0.05) 0%, transparent 65%), #000",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />

      {/* Layer 1: background twinkling stars */}
      <StarsBackground />

      {/* Layer 2: masked perspective grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_60%_50%_at_68%_50%,#000_40%,transparent_100%)] opacity-70 pointer-events-none z-[1]" />

      {/* Layer 3: ambient light layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[20%] right-[-20%] w-[800px] h-[800px] rounded-full bg-cyan-500/10 blur-[130px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/12 blur-[150px] animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-yellow-500/03 blur-[120px] animate-[pulse_14s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6">
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
              <span className="text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]">JOHNNY</span>
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
            <div className="flex flex-col gap-3">
              <p className="max-w-lg text-[14px] leading-relaxed text-white/48">
                Intelligent systems powering real business decisions — from live
                construction risk scoring to AI-assisted field operations and
                enterprise data platforms.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/#apps"
                  className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.98]"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 py-2 text-[13px] font-medium text-white/65 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
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
          className="relative grid min-h-0 flex-1 grid-cols-1 items-center gap-6 py-[clamp(10px,3vh,28px)] lg:grid-cols-2"
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
                logoSrc="/logos/apec-logo.webp"
                accentColor="#eab308"
              />
            </div>
          </div>

          {/* Right — AI Globe container & Floating Panels (Layer 5 & 6) */}
          <div
            ref={globeRef}
            className="relative hidden items-center justify-center lg:flex h-full w-full border-0 bg-transparent outline-none z-[2]"
          >
            {/* The actual massive canvas that overflows behind card grids and screen bounds */}
            <div className="absolute w-[520px] h-[520px] xl:w-[650px] xl:h-[650px] aspect-square rounded-full pointer-events-none select-none">
              <GlobeCanvas />
            </div>

            {/* Layer 6: Floating Holographic Glassmorphic Data Panels */}
            <FloatingPanel
              title="Risk Profile"
              value="NOMINAL (0.02%)"
              status="CALCULATING..."
              statusColor="#06b6d4"
              className="top-[10%] left-[-2%] animate-[hero-float-1_7s_ease-in-out_infinite]"
            />
            <FloatingPanel
              title="Data Sources"
              value="24/24 CONNECTED"
              status="ALL STREAMS OPERATIONAL"
              statusColor="#22c55e"
              className="top-[25%] right-[0%] animate-[hero-float-2_9s_ease-in-out_infinite]"
            />
            <FloatingPanel
              title="Core Engine"
              value="CLAUDE 3.5 SONNET"
              status="AI READY"
              statusColor="#818cf8"
              className="top-[48%] left-[-10%] animate-[hero-float-3_8s_ease-in-out_infinite]"
            />
            <FloatingPanel
              title="Throughput"
              value="1,420 OPS/SEC"
              status="SYNCED"
              statusColor="#06b6d4"
              className="top-[60%] right-[-2%] animate-[hero-float-4_10s_ease-in-out_infinite]"
            />
            <FloatingPanel
              title="Uptime Health"
              value="99.98% OPTIMAL"
              status="OPERATIONAL"
              statusColor="#22c55e"
              className="bottom-[15%] left-[0%] animate-[hero-float-2_6s_ease-in-out_infinite]"
            />
            <FloatingPanel
              title="Latency Speed"
              value="84ms avg"
              status="FASTEST ROUTE Active"
              statusColor="#eab308"
              className="bottom-[25%] right-[-2%] animate-[hero-float-1_11s_ease-in-out_infinite]"
            />
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
