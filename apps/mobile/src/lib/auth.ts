import * as SecureStore from "expo-secure-store";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";

// The token cache Clerk uses to persist auth tokens across app restarts.
// Clerk's Expo SDK doesn't expose this type at the package root, so we model
// it here (it matches the shape the provider expects).
interface TokenCache {
  getToken: (key: string) => Promise<string | null | undefined>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

// Clerk needs a token cache so auth tokens survive app restarts. We store them
// in the device secure store.
export const tokenCache: TokenCache = {
  getToken: async (key: string) => {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  saveToken: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore secure-store write failures
    }
  },
  clearToken: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore secure-store delete failures
    }
  },
};

// A small bridge from Clerk's `useAuth` to the shape Convex's provider expects.
// Our installed Clerk (SDK 52 compatible) doesn't expose `sessionClaims` on
// `useAuth`; when it is absent Convex automatically uses the "convex" JWT
// template, which is exactly the flow we want.
export function useAuthForConvex() {
  const clerk = useClerkAuth();
  return {
    isLoaded: clerk.isLoaded,
    isSignedIn: clerk.isSignedIn,
    getToken: clerk.getToken,
    orgId: clerk.orgId,
    orgRole: clerk.orgRole,
    sessionId: clerk.sessionId,
    sessionClaims: (clerk as unknown as { sessionClaims?: Record<string, unknown> })
      .sessionClaims,
    userId: clerk.userId,
    signOut: clerk.signOut,
  };
}
