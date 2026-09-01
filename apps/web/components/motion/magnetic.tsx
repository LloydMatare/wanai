"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export interface MagneticProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How far the element may drift toward the cursor, in pixels. */
  strength?: number;
}

/**
 * Nudges its child toward the pointer on hover. Skipped entirely on touch
 * devices (no hover state to speak of) and under reduced-motion.
 */
export function Magnetic({ children, className, strength = 12, ...props }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)} {...props}>
      {children}
    </div>
  );
}
