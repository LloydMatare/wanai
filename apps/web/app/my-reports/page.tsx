"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Loader2 } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant={item.kind === "found" ? "success" : "secondary"}>
            {item.kind === "found" ? "Found" : "Lost"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {DOCUMENT_LABELS[item.documentType] || item.documentType}
          </span>
        </div>
        <Badge variant={item.status === "open" ? "default" : "outline"} className="w-fit">
          {item.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {item.partialIdentifier && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>…{item.partialIdentifier}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{item.city}{item.location && ` - ${item.location}`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{eventDate}</span>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {item.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyReportsPage() {
  const { user } = useUser();
  const myItems = useQuery(api.items.getMyItems);

  return (
    <main className="container mx-auto px-4 py-8">
      <SignedOut>
        <Card className="max-w-md mx-auto mt-12">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-muted-foreground">
              You need to sign in to view your reports.
            </p>
            <Link href="/sign-in" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </SignedOut>

      <SignedIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reports</h1>
          <p className="text-muted-foreground">
            View all documents you've reported as lost or found
          </p>
        </div>

        {myItems === undefined ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : myItems.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't reported any lost or found documents
            </p>
            <Link href="/report">
              <Button>Report a Document</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </SignedIn>
    </main>
  );
}