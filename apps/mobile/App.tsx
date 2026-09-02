import React from "react";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { tokenCache, useAuthForConvex } from "./src/lib/auth";
import { MainTabs } from "./src/navigation/MainTabs";
import { AuthScreen } from "./src/screens/AuthScreen";

// The Convex deployment this app talks to on behalf of all clients.
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || "https://greedy-wolf-576.convex.cloud"
);

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_your_clerk_key";

export default function App() {
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
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <MainTabs /> : <AuthScreen />}
    </NavigationContainer>
  );
}
