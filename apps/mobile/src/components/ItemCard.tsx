import React from "react";
import { Image, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { MapPin, Calendar, FileText, ShieldAlert } from "lucide-react-native";
import { api } from "../../lib/convex-api";
import { Badge } from "./ui/Badge";
import {
  formatDate,
  formatDocType,
  STATUS_LABELS,
} from "../lib/constants";

export interface ItemSummary {
  _id: string;
  kind: "lost" | "found";
  documentType: string;
  city: string;
  location: string;
  partialIdentifier: string;
  description: string;
  eventDate: number;
  photoStorageId?: string | null;
  status: string;
  reporterId: string;
}

interface ItemCardProps {
  item: ItemSummary;
  showStatus?: boolean;
}

export function ItemCard({ item, showStatus = false }: ItemCardProps) {
  const photoUrl = useQuery(
    api.items.getPhotoUrl,
    item.photoStorageId ? { storageId: item.photoStorageId as any } : "skip"
  );

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-center gap-2">
        <Badge
          label={item.kind === "found" ? "Found" : "Lost"}
          tone={item.kind === "found" ? "success" : "primary"}
        />
        {showStatus ? (
          <Badge
            label={STATUS_LABELS[item.status] || item.status}
            tone="neutral"
          />
        ) : null}
        <View className="ml-auto">
          <Badge label={formatDocType(item.documentType)} tone="outline" />
        </View>
      </View>

      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          className="mb-3 h-36 w-full rounded-xl bg-slate-100"
          resizeMode="cover"
        />
      ) : null}

      {item.partialIdentifier ? (
        <View className="mb-1.5 flex-row items-center gap-2">
          <FileText size={16} color="#1e40af" />
          <Text className="text-sm font-semibold text-slate-900 tabular-nums">
            …{item.partialIdentifier}
          </Text>
        </View>
      ) : null}

      <View className="mb-1.5 flex-row items-center gap-2">
        <MapPin size={16} color="#64748b" />
        <Text className="flex-1 text-sm text-slate-600">
          {item.city}
          {item.location ? ` · ${item.location}` : ""}
        </Text>
      </View>

      <View className="mb-1.5 flex-row items-center gap-2">
        <Calendar size={16} color="#64748b" />
        <Text className="text-sm text-slate-600">{formatDate(item.eventDate)}</Text>
      </View>

      {item.description ? (
        <Text numberOfLines={2} className="mt-1 text-sm text-slate-500">
          {item.description}
        </Text>
      ) : null}
    </View>
  );
}