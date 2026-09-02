import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  outline: "border border-primary bg-transparent",
  ghost: "bg-transparent",
  danger: "bg-destructive",
};

const textClasses: Record<Variant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  outline: "text-primary",
  ghost: "text-primary",
  danger: "text-destructive-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 rounded-lg",
  md: "px-5 py-3 rounded-xl",
  lg: "px-6 py-4 rounded-xl",
};

const sizeText: Record<Size, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-base font-bold",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      className={`flex-row items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#1e40af" : "#fff"} />
      ) : (
        <View className="flex-row items-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`${textClasses[variant]} ${sizeText[size]}`}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
