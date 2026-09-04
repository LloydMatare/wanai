import React from "react";
import { FlatList, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../lib/convex-api";
import { colors } from "../lib/theme";
import { ItemCard, ItemSummary } from "../components/ItemCard";
import { User as UserIcon, FileText } from "lucide-react-native";

export function ProfileScreen() {
  const myItems = useQuery(api.items.getMyItems);

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-4 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">Profile</Text>
      </View>

      <FlatList
        data={myItems as unknown as ItemSummary[]}
        keyExtractor={(item) => item._id}
        contentContainerClassName="p-4 pb-8"
        ListHeaderComponent={
          <View>
            <View className="items-center py-6">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <UserIcon size={36} color={colors.primary} />
              </View>
              <Text className="mt-3 text-lg font-bold text-foreground">
                Wanai user
              </Text>
            </View>

            <Text className="mt-2 mb-2 text-lg font-bold text-foreground">
              My reports
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center gap-2 py-8">
            <FileText size={24} color={colors.mutedForeground} />
            <Text className="text-center text-sm text-muted-foreground">
              No reports yet. Report a lost or found document to get started.
            </Text>
          </View>
        }
        renderItem={({ item }) => <View className="mb-3"><ItemCard item={item} showStatus /></View>}
      />
    </View>
  );
}
