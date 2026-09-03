import React from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../../lib/theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function FormField({
  label,
  hint,
  error,
  containerClassName = "",
  ...inputProps
}: FormFieldProps) {
  return (
    <View className={`gap-1.5 ${containerClassName}`}>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        className={`rounded-xl border bg-card px-4 py-3 text-base text-foreground ${
          error ? "border-destructive" : "border-input"
        }`}
        {...inputProps}
      />
      {error ? (
        <Text className="text-xs text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
}
