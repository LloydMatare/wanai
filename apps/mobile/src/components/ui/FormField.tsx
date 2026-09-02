import React from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

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
      <Text className="text-sm font-semibold text-slate-800">{label}</Text>
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`rounded-xl border bg-white px-4 py-3 text-base text-slate-900 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
        {...inputProps}
      />
      {error ? (
        <Text className="text-xs text-red-600">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-slate-500">{hint}</Text>
      ) : null}
    </View>
  );
}