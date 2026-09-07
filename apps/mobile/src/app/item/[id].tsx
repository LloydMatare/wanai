import React from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../../lib/convex-api";
import { colors } from "../../lib/theme";
import { Badge } from "../../components/ui/Badge";
import { formatDate, formatDocType, STATUS_LABELS } from "../../lib/constants";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  Phone,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useQuery(api.items.getItemById, id ? { itemId: id as any } : "skip");

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 border-b border-border bg-card px-4 pb-3 pt-4">
        <View
          accessible
          accessibilityRole="button"
          onTouchEnd={() => router.back()}
        >
          <ArrowLeft size={22} color={colors.foreground} />
        </View>
        <Text className="text-lg font-bold text-foreground">Details</Text>
      </View>

      <ScrollView
        contentContainerClassName="p-4 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <View className="flex-row items-center gap-2">
            <Badge
              label={item.kind === "found" ? "Found" : "Lost"}
              tone={item.kind === "found" ? "success" : "primary"}
            />
            <Badge
              label={STATUS_LABELS[item.status] || item.status}
              tone="neutral"
            />
            <View className="ml-auto">
              <Badge label={formatDocType(item.documentType)} tone="outline" />
            </View>
          </View>

          {item.photoUrl ? (
            <Image
              source={{ uri: item.photoUrl }}
              className="h-56 w-full rounded-2xl bg-muted"
              resizeMode="cover"
            />
          ) : null}

          {item.partialIdentifier ? (
            <View className="rounded-xl border border-border bg-card p-4">
              <View className="flex-row items-center gap-3">
                <FileText size={18} color={colors.primary} />
                <View>
                  <Text className="text-xs text-muted-foreground">
                    Document ID (partial)
                  </Text>
                  <Text className="mt-0.5 text-base font-semibold text-foreground tabular-nums">
                    …{item.partialIdentifier}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          <View className="rounded-xl border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <MapPin size={18} color={colors.mutedForeground} />
              <View>
                <Text className="text-xs text-muted-foreground">Location</Text>
                <Text className="mt-0.5 text-base font-semibold text-foreground">
                  {item.city}
                  {item.location ? `, ${item.location}` : ""}
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <Calendar size={18} color={colors.mutedForeground} />
              <View>
                <Text className="text-xs text-muted-foreground">
                  {item.kind === "lost" ? "Date lost" : "Date found"}
                </Text>
                <Text className="mt-0.5 text-base font-semibold text-foreground">
                  {formatDate(item.eventDate)}
                </Text>
              </View>
            </View>
          </View>

          {item.description ? (
            <View className="rounded-xl border border-border bg-card p-4">
              <Text className="text-xs text-muted-foreground">Description</Text>
              <Text className="mt-1.5 text-sm leading-5 text-foreground">
                {item.description}
              </Text>
            </View>
          ) : null}

          {item.phone ? (
            <View className="rounded-xl border border-border bg-card p-4">
              <View className="flex-row items-center gap-3">
                <Phone size={18} color={colors.success} />
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">
                    Reporter&apos;s phone
                  </Text>
                  <Text className="mt-0.5 text-base font-semibold text-foreground">
                    {item.phone}
                  </Text>
                </View>
              </View>
              <View
                accessible
                accessibilityRole="button"
                onTouchEnd={() => Linking.openURL(`tel:${item.phone}`)}
                className="mt-3 items-center rounded-xl bg-success/10 py-3"
              >
                <Text className="text-sm font-semibold text-success">
                  Call reporter
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
