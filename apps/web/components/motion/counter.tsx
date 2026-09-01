"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/gsap";

export interface CounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Final value to count up to. */
  value: number;
  /** Tween length in seconds. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to render; defaults to integers. */
  decimals?: number;
}

/**
 * Counts from zero to `value` the first time it scrolls into view.
 * Renders the final value as text on the server so it is never blank or
 * misleading before hydration, and for reduced-motion users.
 */
export function Counter({
  value,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  ...props
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  const format = React.useCallback(
    (n: number) => `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`,
    [prefix, suffix, decimals]
  );

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
        // Guard against float drift leaving e.g. "1,239" on screen.
        onComplete: () => {
          el.textContent = format(value);
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, duration, format]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {format(value)}
    </span>
  );
}
