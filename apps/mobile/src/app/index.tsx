import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const { isSignedIn } = useAuth();
  return <Redirect href={isSignedIn ? "/(tabs)" : "/sign-in"} />;
}
