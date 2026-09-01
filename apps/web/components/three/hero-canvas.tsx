"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Three.js is ~600kB and touches `window` on import, so it is loaded only in
// the browser and only once the rest of the hero has painted.
const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

/**
 * Decorative hero backdrop. The gradient/aurora layer below renders on its own
 * and is what reduced-motion and no-WebGL visitors see, with the 3D canvas
 * layered on top when it is available.
 */
export function HeroCanvas({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="aurora-blob left-[-10%] top-[-15%] h-[36rem] w-[36rem] animate-aurora bg-primary/30" />
      <div
        className="aurora-blob right-[-12%] top-[10%] h-[30rem] w-[30rem] animate-aurora bg-accent/25"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="aurora-blob bottom-[-20%] left-[30%] h-[28rem] w-[28rem] animate-aurora bg-fuchsia-500/20"
        style={{ animationDelay: "-12s" }}
      />
      <HeroScene className="absolute inset-0" />
      {/* Fades the scene into the page background at the section boundary. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
