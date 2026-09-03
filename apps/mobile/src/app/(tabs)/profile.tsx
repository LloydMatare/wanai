import React from "react";
import { useClerk } from "@clerk/clerk-expo";
import { ProfileScreen } from "../../screens/ProfileScreen";

export default function ProfileRoute() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

  return <ProfileScreen onSignOut={handleSignOut} />;
}
