import React from "react";
import { Text, View } from "react-native";

type Tone = "primary" | "success" | "danger" | "neutral" | "outline";

const toneClasses: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-green-100", text: "text-green-700" },
  danger: { bg: "bg-red-100", text: "text-red-600" },
  neutral: { bg: "bg-slate-100", text: "text-slate-700" },
  outline: { bg: "bg-transparent border border-slate-300", text: "text-slate-600" },
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
