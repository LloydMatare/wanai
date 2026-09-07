import "../../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "https://greedy-wolf-576.convex.cloud"
);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="item/[id]" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ConvexProvider>
  );
}
