"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, FileText, RefreshCw } from "lucide-react";

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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant={item.kind === "found" ? "success" : "secondary"}>
            {item.kind === "found" ? "Found" : "Lost"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {DOCUMENT_LABELS[item.documentType] || item.documentType}
          </span>
        </div>
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
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {item.description}
          </p>
        )}
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Documents</h1>
        <p className="text-muted-foreground">
          Search through reported lost and found documents across Zimbabwe
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city === "All" ? "All Cities" : city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterDocType} onValueChange={setFilterDocType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="national_id">National ID</SelectItem>
            <SelectItem value="drivers_license">Driver's License</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="vehicle_registration">Vehicle Registration</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="found">
        <TabsList className="mb-6">
          <TabsTrigger value="found">
            Found ({filteredFound.length})
          </TabsTrigger>
          <TabsTrigger value="lost">
            Lost ({filteredLost.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="found">
          {foundItems === undefined ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFound.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFound.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lost">
          {lostItems === undefined ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLost.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No lost documents</h3>
              <p className="text-muted-foreground">
                No one has reported a lost document matching your filters
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLost.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}