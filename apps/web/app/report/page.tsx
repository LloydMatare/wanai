"use client";

import { ReportForm } from "@/components/report-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { ShieldCheck } from "lucide-react";

export default function ReportPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b bg-gradient-subtle px-4 py-14">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-60" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <Badge variant="soft" className="gap-1.5 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your details stay private
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Report a <span className="text-gradient">document</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Share only a partial identifier. We&apos;ll handle matching and verification.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Tabs defaultValue="found" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="found">I found one</TabsTrigger>
            <TabsTrigger value="lost">I lost one</TabsTrigger>
          </TabsList>

          <TabsContent value="found">
            <Reveal>
              <ReportForm type="found" />
            </Reveal>
          </TabsContent>

          <TabsContent value="lost">
            <Reveal>
              <ReportForm type="lost" />
            </Reveal>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
