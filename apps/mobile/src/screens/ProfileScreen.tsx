import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../lib/convex-api";
import { Button } from "../components/ui/Button";
import { ItemCard, ItemSummary } from "../components/ItemCard";
import { LogOut, User as UserIcon, FileText } from "lucide-react-native";

interface ProfileScreenProps {
  onSignOut: () => Promise<void>;
}

export function ProfileScreen({ onSignOut }: ProfileScreenProps) {
  const { user, isLoaded } = useUser();
  const me = useQuery(api.users.me as any);
  const myItems = useQuery(api.items.getMyItems);

  // Ensure a Convex user row exists after the Clerk identity resolves.
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser as any);
  useEffect(() => {
    if (!user) return;
    createOrUpdateUser({
      name: user.fullName || user.primaryEmailAddress?.emailAddress || "Wanai user",
      avatarUrl: user.imageUrl || undefined,
    });
  }, [user, createOrUpdateUser]);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Profile</Text>
      </View>

      <FlatList
        data={myItems as unknown as ItemSummary[]}
        keyExtractor={(item) => item._id}
        contentContainerClassName="p-4 pb-8"
        ListHeaderComponent={
          <View>
            <View className="items-center py-6">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <UserIcon size={36} color="#1e40af" />
              </View>
              <Text className="mt-3 text-lg font-bold text-slate-900">
                {isLoaded && user ? user.fullName || "Wanai user" : "…"}
              </Text>
              <Text className="text-sm text-slate-500">
                {user?.primaryEmailAddress?.emailAddress || "Signed in"}
              </Text>
              {me?.role === "admin" ? (
                <Text className="mt-2 text-sm font-medium text-green-700">
                  Admin account
                </Text>
              ) : null}
            </View>

            <Text className="mt-2 mb-2 text-lg font-bold text-slate-900">
              My reports
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center gap-2 py-8">
            <FileText size={24} color="#94a3b8" />
            <Text className="text-center text-sm text-slate-500">
              No reports yet. Report a lost or found document to get started.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View className="mt-4 gap-3">
            <Button
              title="Sign out"
              variant="danger"
              onPress={() => onSignOut()}
              icon={<LogOut size={16} color="#fff" />}
            />
          </View>
        }
        renderItem={({ item }) => <View className="mb-3"><ItemCard item={item} showStatus /></View>}
      />
    </View>
  );
}
