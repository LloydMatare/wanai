import React from "react";
import { Text, View } from "react-native";

type Tone = "primary" | "success" | "danger" | "neutral" | "outline";

const toneClasses: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-success/10", text: "text-success" },
  danger: { bg: "bg-destructive/10", text: "text-destructive" },
  neutral: { bg: "bg-muted", text: "text-foreground/70" },
  outline: { bg: "bg-transparent border border-border", text: "text-foreground/60" },
};

interface BadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function Badge({ label, tone = "neutral", className = "" }: BadgeProps) {
  const { bg, text } = toneClasses[tone];
  return (
    <View className={`rounded-full px-2.5 py-1 ${bg} ${className}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}
