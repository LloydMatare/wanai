"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, PlusCircle, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroCanvas } from "@/components/three/hero-canvas";
import { Magnetic } from "@/components/motion/magnetic";
import {
  DURATION,
  EASE,
  gsap,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

export function Hero() {
  const rootRef = React.useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Above the fold, so this plays on load rather than on scroll.
    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-hero-item], [data-hero-stat]"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE, duration: DURATION } })
        .fromTo(
          "[data-hero-item]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.09 }
        )
        .fromTo(
          "[data-hero-stat]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.6 },
          "-=0.35"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden px-4 pb-24 pt-20 sm:pt-28"
    >
      <HeroCanvas />
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" />

      <div className="container relative mx-auto max-w-4xl text-center">
        <div data-hero-item className="will-reveal flex justify-center">
          <Badge variant="soft" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Free for everyone in Zimbabwe
          </Badge>
        </div>

        <h1
          data-hero-item
          className="will-reveal mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Find your <span className="text-gradient">lost documents</span>
        </h1>

        <p
          data-hero-item
          className="will-reveal mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
        >
          Wanai reunites Zimbabweans with lost national IDs, driver&apos;s licences and
          passports. Report what you&apos;ve lost or found, and get notified the moment
          there&apos;s a match.
        </p>

        <div
          data-hero-item
          className="will-reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <SignedOut>
            <Magnetic>
              <Button asChild size="lg" variant="gradient">
                <Link href="/sign-in">
                  Get started
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
          </SignedOut>
          <SignedIn>
            <Magnetic>
              <Button asChild size="lg" variant="gradient">
                <Link href="/report">
                  <PlusCircle />
                  Report a document
                </Link>
              </Button>
            </Magnetic>
          </SignedIn>

          <Button asChild size="lg" variant="glass">
            <Link href="/browse">
              <Search />
              Browse found
            </Link>
          </Button>
        </div>

        <p data-hero-stat className="will-reveal mt-8 text-xs text-muted-foreground">
          No document numbers are ever shown publicly.
        </p>
      </div>
    </section>
  );
}
