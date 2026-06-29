"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  y?: number;
  as?: "div" | "section" | "header" | "article" | "li" | "span";
};

export function Reveal({
  delay = 0,
  y = 12,
  as = "div",
  children,
  className,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
      {...(rest as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </MotionTag>
  );
}
