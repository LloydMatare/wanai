"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/motion/reveal";
import { Calendar, FileText, MapPin, PackageSearch, SlidersHorizontal } from "lucide-react";

const DOCUMENT_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's licence",
  passport: "Passport",
  vehicle_registration: "Vehicle registration",
  other: "Other document",
};

const CITIES = ["All", "Harare", "Bulawayo", "Chinhoyi", "Mutare", "Gweru", "Masvingo", "Kwekwe", "Kadoma", "Marondera", "Bindura", "Other"];

function ItemCard({ item }: { item: any }) {
  const eventDate = new Date(item.eventDate).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card variant="interactive" className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={item.kind === "found" ? "success" : "secondary"}>
            {item.kind === "found" ? "Found" : "Lost"}
          </Badge>
          <Badge variant="outline" className="font-normal">
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
          <p className="line-clamp-2 pt-1 text-sm text-muted-foreground">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

/** Placeholder grid shown while the Convex query is in flight. */
function ItemGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card variant="glass" className="py-16 text-center">
      <CardContent className="flex flex-col items-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PackageSearch className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function BrowsePage() {
  const [filterCity, setFilterCity] = useState("All");
  const [filterDocType, setFilterDocType] = useState("all");

  const foundItems = useQuery(api.items.getOpenItems, { kind: "found" });
  const lostItems = useQuery(api.items.getOpenItems, { kind: "lost" });

  const filterItems = (items: any[]) => {
    if (!items) return [];
    return items.filter((item) => {
      if (filterCity !== "All" && item.city !== filterCity) return false;
      if (filterDocType !== "all" && item.documentType !== filterDocType) return false;
      return true;
    });
  };

  const filteredFound = filterItems(foundItems || []);
  const filteredLost = filterItems(lostItems || []);

  const hasFilters = filterCity !== "All" || filterDocType !== "all";

  const resetFilters = () => {
    setFilterCity("All");
    setFilterDocType("all");
  };

  /** Loading / empty / grid states share the same shape for both tabs. */
  const renderResults = (
    items: any[] | undefined,
    filtered: any[],
    emptyTitle: string,
    emptyDescription: string
  ) => {
    if (items === undefined) return <ItemGridSkeleton />;
    if (filtered.length === 0) {
      return (
        <EmptyState
          title={emptyTitle}
          description={
            hasFilters
              ? "Nothing matches these filters yet. Try widening your search."
              : emptyDescription
          }
        />
      );
    }
    return (
      <Reveal
        key={filtered.length}
        stagger={0.06}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </Reveal>
    );
  };

  return (
    <main>
      {/* Page header */}
      <section className="relative overflow-hidden border-b bg-gradient-subtle px-4 py-14">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-60" />
        <div className="container relative mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse <span className="text-gradient">documents</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Search reported lost and found documents from across Zimbabwe.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="found">
          {/* Sticky control bar keeps tabs and filters reachable while scrolling. */}
          <div className="sticky top-14 z-30 -mx-4 mb-8 border-b bg-background/80 px-4 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <TabsList>
                <TabsTrigger value="found">Found ({filteredFound.length})</TabsTrigger>
                <TabsTrigger value="lost">Lost ({filteredLost.length})</TabsTrigger>
              </TabsList>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </div>

                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Filter by city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city === "All" ? "All cities" : city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterDocType} onValueChange={setFilterDocType}>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="Document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="drivers_license">Driver&apos;s licence</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="vehicle_registration">Vehicle registration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <TabsContent value="found">
            {renderResults(
              foundItems,
              filteredFound,
              "No found documents yet",
              "Nobody has reported a found document yet. Check back soon."
            )}
          </TabsContent>

          <TabsContent value="lost">
            {renderResults(
              lostItems,
              filteredLost,
              "No lost documents yet",
              "Nobody has reported a lost document yet."
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
