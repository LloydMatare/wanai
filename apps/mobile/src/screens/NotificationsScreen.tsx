import React from "react";
import { FlatList, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../lib/convex-api";
import { colors } from "../lib/theme";
import { Badge } from "../components/ui/Badge";
import { BellRing } from "lucide-react-native";

export function NotificationsScreen() {
  const notifications = useQuery(api.notifications.myUnread);

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-4 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">Notifications</Text>
        <Text className="mt-1 text-sm text-muted-foreground">Real-time alerts for your reports</Text>
      </View>

      {notifications === undefined ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <BellRing size={26} color={colors.primary} />
          </View>
          <Text className="text-center text-lg font-semibold text-foreground">
            No notifications
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            We'll alert you here when there's a possible match or an update on your
            reports.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications as any[]}
          keyExtractor={(n) => n._id}
          contentContainerClassName="px-4 pb-8 gap-2"
          renderItem={({ item }) => (
            <View className="rounded-2xl border border-border bg-card p-4">
              <View className="mb-1 flex-row items-center gap-2">
                <Badge label={notificationTypeLabel(item.type)} tone="primary" />
                <View className="ml-auto">
                  <View className="h-2 w-2 rounded-full bg-primary" />
                </View>
              </View>
              <Text className="text-sm text-foreground/70">{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function notificationTypeLabel(type: string): string {
  switch (type) {
    case "match_suggested":
      return "Possible match";
    default:
      return type.replace(/_/g, " ");
  }
}
