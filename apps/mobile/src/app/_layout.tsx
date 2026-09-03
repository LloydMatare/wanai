import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { tokenCache, useAuthForConvex } from "../lib/auth";
import { colors } from "../lib/theme";

// The Convex deployment this app talks to on behalf of all clients.
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "https://greedy-wolf-576.convex.cloud"
);

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_your_clerk_key";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuthForConvex as any}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </SafeAreaProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootNavigator() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
