"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CarFront,
  CreditCard,
  FileCheck2,
  Globe2,
  Handshake,
  IdCard,
  MapPin,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Magnetic } from "@/components/motion/magnetic";

const STATS = [
  { value: 1240, suffix: "+", label: "Documents reunited" },
  { value: 500, suffix: "+", label: "Active listings" },
  { value: 10, suffix: "", label: "Cities covered" },
];

const STEPS = [
  {
    icon: FileCheck2,
    title: "Report",
    description:
      "Log a lost or found document with the location, date and any partial identifiers you can safely share.",
  },
  {
    icon: BellRing,
    title: "Get matched",
    description:
      "We continuously compare reports on document type, city and identifiers, and alert you the moment something lines up.",
  },
  {
    icon: Handshake,
    title: "Reunite",
    description:
      "Confirm ownership with private verification questions, then arrange a safe handover through the platform.",
  },
];

const DOCUMENT_TYPES = [
  { icon: IdCard, label: "National ID" },
  { icon: CreditCard, label: "Driver's licence" },
  { icon: Globe2, label: "Passport" },
  { icon: CarFront, label: "Vehicle registration" },
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Stats */}
      <section className="border-y bg-muted/30 px-4 py-14">
        <Reveal
          stagger={0.12}
          className="container mx-auto grid grid-cols-1 gap-10 text-center sm:grid-cols-3"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* How it works */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="soft-accent" className="rounded-full">
              How it works
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to a reunion
            </h2>
            <p className="mt-4 text-muted-foreground">
              No offices, no queues. Everything happens from your phone.
            </p>
          </Reveal>

          <Reveal stagger={0.14} className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Card key={step.title} variant="interactive" className="gradient-border h-full">
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="text-4xl font-bold text-muted-foreground/15">
                      0{index + 1}
                    </span>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Document types + trust bento */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What we help find
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every kind of identity document Zimbabweans carry.
            </p>
          </Reveal>

          <Reveal stagger={0.08} className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {DOCUMENT_TYPES.map((type) => (
              <Card key={type.label} variant="interactive" className="group text-center">
                <CardContent className="flex flex-col items-center gap-3 p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
                    <type.icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium">{type.label}</p>
                </CardContent>
              </Card>
            ))}
          </Reveal>

          <Reveal stagger={0.1} className="mt-6 grid gap-4 md:grid-cols-3">
            <Card variant="glass" className="md:col-span-2">
              <CardHeader>
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <CardTitle>Privacy by default</CardTitle>
                <CardDescription className="leading-relaxed">
                  Listings only ever show a partial identifier. Full document numbers stay
                  private and ownership is confirmed with verification questions before any
                  contact details are exchanged.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <CardTitle>Countrywide</CardTitle>
                <CardDescription className="leading-relaxed">
                  From Harare to Bulawayo, Mutare to Gweru — matching works across every city
                  we cover.
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <Reveal className="container mx-auto max-w-4xl">
          <div className="relative isolate overflow-hidden rounded-2xl border bg-gradient-brand px-6 py-16 text-center text-white">
            <div className="aurora-blob left-[-10%] top-[-40%] h-72 w-72 animate-aurora bg-white/25" />
            <div
              className="aurora-blob bottom-[-40%] right-[-5%] h-64 w-64 animate-aurora bg-white/20"
              style={{ animationDelay: "-8s" }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to help?</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Whether you&apos;ve found a document or lost one, a couple of minutes can save
                someone weeks of queues and replacement fees.
              </p>
              <div className="mt-10 flex justify-center">
                <Magnetic>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/report">
                      <PlusCircle />
                      Report now
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
