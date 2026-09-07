"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLeft, Calendar, FileText, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const DOCUMENT_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's licence",
  passport: "Passport",
  vehicle_registration: "Vehicle registration",
  other: "Other document",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  matched: "Matched",
  closed: "Closed",
};

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const item = useQuery(api.items.getItemById, { itemId: id as any });

  if (!item) {
    return (
      <main className="container mx-auto px-4 py-10">
        <Skeleton className="mb-4 h-8 w-32" />
        <Card>
          <CardContent className="space-y-4 py-8">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
      </main>
    );
  }

  const eventDate = new Date(item.eventDate).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Reveal>
        <Link
          href="/browse"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Link>

        <Card>
          <CardContent className="space-y-6 py-6">
            <div className="flex items-center gap-3">
              <Badge variant={item.kind === "found" ? "success" : "secondary"}>
                {item.kind === "found" ? "Found" : "Lost"}
              </Badge>
              <Badge variant="outline">
                {STATUS_LABELS[item.status] || item.status}
              </Badge>
              <span className="ml-auto text-sm text-muted-foreground">
                {DOCUMENT_LABELS[item.documentType] || item.documentType}
              </span>
            </div>

            {item.photoUrl && (
              <img
                src={item.photoUrl}
                alt="Document photo"
                className="h-64 w-full rounded-xl object-cover"
              />
            )}

            {item.partialIdentifier && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Document ID (partial)</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums">
                    …{item.partialIdentifier}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="mt-0.5 text-lg font-semibold">
                  {item.city}
                  {item.location ? `, ${item.location}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {item.kind === "lost" ? "Date lost" : "Date found"}
                </p>
                <p className="mt-0.5 text-lg font-semibold">{eventDate}</p>
              </div>
            </div>

            {item.description && (
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1 text-sm leading-relaxed">{item.description}</p>
              </div>
            )}

            {item.phone && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-green-600" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Reporter&apos;s phone</p>
                    <p className="mt-0.5 text-lg font-semibold">{item.phone}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  asChild
                >
                  <a href={`tel:${item.phone}`}>Call reporter</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </main>
  );
}
