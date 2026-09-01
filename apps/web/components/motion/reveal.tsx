"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DURATION,
  EASE,
  gsap,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction the content travels from. */
  direction?: Direction;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /**
   * When set, direct children animate in sequence with this gap (seconds)
   * instead of the wrapper animating as a single block.
   */
  stagger?: number;
  /** Viewport position that fires the tween, in ScrollTrigger syntax. */
  start?: string;
  /** Render as a different element, e.g. "section" or "ul". */
  as?: React.ElementType;
}

/**
 * Fades content in as it scrolls into view. Uses gsap.context() so every tween
 * and ScrollTrigger created here is reverted on unmount, which also makes it
 * safe under React strict-mode double-mounting.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  stagger,
  start = "top 85%",
  as: Tag = "div",
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show everything immediately and skip GSAP entirely.
    if (prefersReducedMotion()) {
      gsap.set(stagger ? Array.from(el.children) : el, { opacity: 1, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.fromTo(
        targets,
        { opacity: 0, ...OFFSETS[direction] },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: DURATION,
          ease: EASE,
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [direction, delay, stagger, start]);

  return (
    <Tag
      ref={ref}
      // Starts hidden in the server HTML so hydration doesn't cause a flash.
      className={cn(stagger ? "will-reveal-children" : "will-reveal", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
