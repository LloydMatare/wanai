import "../../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "https://greedy-wolf-576.convex.cloud"
);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </ConvexProvider>
  );
}
