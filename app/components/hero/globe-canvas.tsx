"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";

export function GlobeCanvas() {
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
      const r = Math.min(w, h) * 0.34;

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
          const x3 = r * cosTheta * Math.sin(phi);
          const y3 = r * sinTheta;
          const z3 = r * cosTheta * Math.cos(phi);
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
          const x3 = outerR * cosTheta * Math.sin(phi);
          const y3 = outerR * sinTheta;
          const z3 = outerR * cosTheta * Math.cos(phi);
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
        const rx = ringRadius1 * Math.cos(angle);
        const ry = 0;
        const rz = ringRadius1 * Math.sin(angle);
        const x1 = rx * Math.cos(tiltY1) + rz * Math.sin(tiltY1);
        const z1 = -rx * Math.sin(tiltY1) + rz * Math.cos(tiltY1);
        const y2 = ry * Math.cos(tiltX1) - z1 * Math.sin(tiltX1);
        const z2 = ry * Math.sin(tiltX1) + z1 * Math.cos(tiltX1);
        const px = cx + x1;
        const py = cy + y2;
        const alpha = 0.08 + (z2 > 0 ? (z2 / ringRadius1) * 0.32 : 0);
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        if (i === 0) { ctx.beginPath(); ctx.moveTo(px, py); }
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
        const rx = ringRadius2 * Math.cos(angle);
        const ry = 0;
        const rz = ringRadius2 * Math.sin(angle);
        const x1 = rx * Math.cos(tiltY2) + rz * Math.sin(tiltY2);
        const z1 = -rx * Math.sin(tiltY2) + rz * Math.cos(tiltY2);
        const y2 = ry * Math.cos(tiltX2) - z1 * Math.sin(tiltX2);
        const z2 = ry * Math.sin(tiltX2) + z1 * Math.cos(tiltX2);
        const px = cx + x1;
        const py = cy + y2;
        const alpha = 0.05 + (z2 > 0 ? (z2 / ringRadius2) * 0.25 : 0);
        ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
        if (i === 0) { ctx.beginPath(); ctx.moveTo(px, py); }
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
        { text: "CLAUDE_3.5_SONNET", lat: -0.2, lon: Math.PI * 1.8 },
      ];
      labels.forEach((lbl) => {
        const theta = lbl.lat;
        const phi = lbl.lon + now * 0.15; // revolve slowly
        const labelR = r * 1.06;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const x3 = labelR * cosTheta * Math.sin(phi);
        const y3 = labelR * sinTheta;
        const z3 = labelR * cosTheta * Math.cos(phi);

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
    ro.observe(canvas);
    resize();
    checkState();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVis);
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

