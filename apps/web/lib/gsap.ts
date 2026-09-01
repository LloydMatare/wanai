"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Client components are still server-rendered by Next, and useLayoutEffect
 * warns in that pass. Fall back to useEffect on the server, where neither runs.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ScrollTrigger touches `document` at registration time, so this module must
// only ever be imported from client components. registerPlugin is idempotent,
// and the module itself is evaluated once, so this runs at most once per load.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** House easing/duration so every animation in the app feels related. */
export const EASE = "power3.out";
export const DURATION = 0.8;

/** True when the visitor has asked the OS to minimise animation. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
