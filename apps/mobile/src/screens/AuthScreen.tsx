import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { SegmentedControl } from "../components/ui/SegmentedControl";

export function AuthScreen() {
  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="p-5 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      <View className="mt-10 items-center">
        <Text className="text-3xl font-bold text-primary">Wanai</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Find lost documents in Zimbabwe
        </Text>
      </View>
      <View className="mt-8">
        <AuthForm />
      </View>
    </ScrollView>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!pendingVerification) {
        if (mode === "signin") {
          const result = await signIn!.create({
            identifier: email,
            password,
          });
          if (result.status === "complete") {
            await setActive!({ session: result.createdSessionId });
          } else if (result.status === "needs_second_factor") {
            setError("Two-factor authentication is enabled. Please check your authenticator app.");
          } else {
            setError("Sign in could not be completed.");
          }
        } else {
          const result = await signUp!.create({
            emailAddress: email,
            password,
            firstName: name,
          });
          if (result.status === "complete") {
            await setActive!({ session: result.createdSessionId });
          } else if (result.status === "missing_requirements") {
            setPendingVerification(true);
          } else {
            setError("Account creation is pending. Check your email for verification.");
          }
        }
      } else {
        // Complete email verification with the code sent to the user.
        const result = await signUp!.attemptEmailAddressVerification({ code });
        if (result.status === "complete") {
          await setActive!({ session: result.createdSessionId });
        } else {
          setError("Verification did not complete. Check the code and try again.");
        }
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="mt-4 gap-4">
        <Text className="text-lg font-bold text-slate-900">Verify your email</Text>
        <Text className="text-sm text-slate-500">
          We sent a code to {email}. Enter it below to finish creating your account.
        </Text>
        <FormField
          label="Verification code"
          placeholder="Enter the 6-digit code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {error ? <ErrorBanner message={error} /> : null}
        <Button title="Verify" onPress={submit} loading={loading} />
      </View>
    );
  }

  return (
    <View className="mt-4 gap-4">
      <SegmentedControl
        value={mode}
        onChange={(v) => {
          setMode(v as "signin" | "signup");
          setError(null);
        }}
        options={[
          { value: "signin", label: "Sign in" },
          { value: "signup", label: "Sign up" },
        ]}
      />

      {mode === "signup" ? (
        <FormField label="Your name" placeholder="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
      ) : null}

      <FormField
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <FormField
        label="Password"
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <Button
        title={mode === "signin" ? "Sign in" : "Create account"}
        onPress={submit}
        loading={loading}
      />
    </View>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <View className="rounded-xl border border-red-200 bg-red-50 p-3">
      <Text className="text-sm text-red-600">{message}</Text>
    </View>
  );
}
