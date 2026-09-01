"use client";

import { ReportForm } from "@/components/report-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { AlertCircle, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function ReportPage() {
  return (
    <main>
      <SignedOut>
        <div className="container mx-auto px-4 py-20">
          <Card variant="glass" className="mx-auto max-w-md text-center">
            <CardHeader>
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                <AlertCircle className="h-5 w-5" />
              </span>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need an account to report a lost or found document — it&apos;s how we keep
                matches trustworthy.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="gradient" className="w-full">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/browse">
                  <Search />
                  Browse found documents
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
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
      </SignedIn>
    </main>
  );
}
