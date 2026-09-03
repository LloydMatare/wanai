import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../lib/convex-api";
import { colors } from "../lib/theme";
import { ItemCard, ItemSummary } from "../components/ItemCard";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Select } from "../components/ui/Select";
import { Filter, PackageSearch } from "lucide-react-native";
import { CITIES, DOCUMENT_TYPES } from "../lib/constants";

export function BrowseScreen() {
  const [kind, setKind] = useState<"lost" | "found">("found");
  const [city, setCity] = useState<string>("All");
  const [docType, setDocType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const foundItems = useQuery(api.items.getOpenItems, { kind: "found" });
  const lostItems = useQuery(api.items.getOpenItems, { kind: "lost" });

  const items = kind === "found" ? foundItems : lostItems;

  const filtered = (items ?? [])
    .filter((item: any) =>
      city === "All" ? true : item.city === city
    )
    .filter((item: any) =>
      docType === "all" ? true : item.documentType === docType
    );

  const hasFilters = city !== "All" || docType !== "all";

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-4 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">Browse</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Reported lost and found documents from across Zimbabwe
        </Text>
      </View>

      <View className="gap-3 px-4 py-3">
        <SegmentedControl
          value={kind}
          onChange={(v) => setKind(v as "lost" | "found")}
          options={[
            { value: "found", label: "Found" },
            { value: "lost", label: "Lost" },
          ]}
        />

        <Pressable
          onPress={() => setShowFilters((s) => !s)}
          className="flex-row items-center justify-between rounded-xl border border-input bg-card px-4 py-3"
        >
          <View className="flex-row items-center gap-2">
            <Filter size={16} color={colors.mutedForeground} />
            <Text className="text-sm font-medium text-foreground/70">Filters</Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            {hasFilters ? "Active" : "None"}
          </Text>
        </Pressable>

        {showFilters ? (
          <View className="gap-3">
            <Select
              label="City"
              value={city}
              onValueChange={setCity}
              options={[{ value: "All", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))]}
            />
            <Select
              label="Document type"
              value={docType}
              onValueChange={setDocType}
              options={[
                { value: "all", label: "All types" },
                ...DOCUMENT_TYPES.map((d) => ({ value: d.value, label: d.label })),
              ]}
            />
          </View>
        ) : null}
      </View>

      {items === undefined ? (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-muted-foreground">Loading documents...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <PackageSearch size={26} color={colors.primary} />
          </View>
          <Text className="text-center text-lg font-semibold text-foreground">
            No {kind} documents found
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            {hasFilters
              ? "Nothing matches these filters yet. Try widening your search."
              : "Nobody has reported a " + kind + " document yet. Check back soon."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered as ItemSummary[]}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-4 pb-8 gap-3"
          renderItem={({ item }) => <ItemCard item={item} />}
        />
      )}
    </View>
  );
}
