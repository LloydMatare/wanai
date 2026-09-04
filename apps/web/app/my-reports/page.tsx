"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/reveal";
import { Calendar, FileText, MapPin, PlusCircle } from "lucide-react";
import Link from "next/link";

const DOCUMENT_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's licence",
  passport: "Passport",
  vehicle_registration: "Vehicle registration",
  other: "Other document",
};

function ItemCard({ item }: { item: any }) {
  const eventDate = new Date(item.eventDate).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card variant="interactive" className="h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.kind === "found" ? "success" : "secondary"}>
            {item.kind === "found" ? "Found" : "Lost"}
          </Badge>
          <Badge variant={item.status === "open" ? "soft" : "outline"} className="capitalize">
            {item.status}
          </Badge>
          <Badge variant="outline" className="ml-auto font-normal">
            {DOCUMENT_LABELS[item.documentType] || item.documentType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {item.partialIdentifier && (
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="tabular-nums">…{item.partialIdentifier}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {item.city}
            {item.location && ` · ${item.location}`}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{eventDate}</span>
        </div>
        {item.description && (
          <p className="pt-1 text-sm text-muted-foreground">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MyReportsPage() {
  const myItems = useQuery(api.items.getMyItems);

  return (
    <main>
      <section className="relative overflow-hidden border-b bg-gradient-subtle px-4 py-14">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-60" />
        <div className="container relative mx-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My <span className="text-gradient">reports</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Everything you&apos;ve reported as lost or found.
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link href="/report">
              <PlusCircle />
              New report
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {myItems === undefined ? (
          <ReportsSkeleton />
        ) : myItems.length === 0 ? (
          <Card variant="glass" className="py-16 text-center">
            <CardContent className="flex flex-col items-center">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold">No reports yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t reported any lost or found documents. It only takes a minute.
              </p>
              <Button asChild variant="gradient" className="mt-6">
                <Link href="/report">
                  <PlusCircle />
                  Report a document
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Reveal
            stagger={0.06}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {myItems.map((item: any) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </Reveal>
        )}
      </div>
    </main>
  );
}
