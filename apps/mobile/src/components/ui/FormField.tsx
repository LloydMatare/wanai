import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "../../lib/theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  secureTextEntry?: boolean;
}

export function FormField({
  label,
  hint,
  error,
  secureTextEntry,
  containerClassName = "",
  ...inputProps
}: FormFieldProps) {
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  return (
    <View className={`gap-1.5 ${containerClassName}`}>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <View className="relative">
        <TextInput
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPassword && hidden}
          className={`rounded-xl border bg-card py-3 text-base text-foreground ${
            error ? "border-destructive" : "border-input"
          } ${isPassword ? "pr-11 pl-4" : "px-4"}`}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((prev) => !prev)}
            className="absolute right-3 top-0 bottom-0 items-center justify-center"
          >
            {hidden ? (
              <EyeOff size={20} color={colors.mutedForeground} />
            ) : (
              <Eye size={20} color={colors.mutedForeground} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="text-xs text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
}
