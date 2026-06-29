"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterProps = {
  lines: string[];
  speed?: number;       // ms per character
  linePause?: number;   // ms between lines
  startDelay?: number;
  className?: string;
};

export function Typewriter({
  lines,
  speed = 22,
  linePause = 220,
  startDelay = 300,
  className,
}: TypewriterProps) {
  const reduce = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [reduce, startDelay]);

  useEffect(() => {
    if (!started || reduce) return;
    if (lineIndex >= lines.length) return;
    const current = lines[lineIndex];
    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, linePause);
    return () => clearTimeout(t);
  }, [started, charIndex, lineIndex, lines, speed, linePause, reduce]);

  return (
    <pre className={className}>
      {reduce
        ? lines.join("\n")
        : lines.slice(0, lineIndex).join("\n") +
          (lineIndex < lines.length
            ? (lineIndex > 0 ? "\n" : "") + lines[lineIndex].slice(0, charIndex)
            : "")}
      {!reduce && lineIndex < lines.length && (
        <span className="inline-block w-[7px] h-[1em] translate-y-[2px] bg-current animate-pulse" />
      )}
    </pre>
  );
}
