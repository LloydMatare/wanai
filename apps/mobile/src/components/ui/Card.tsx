import React from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <View
      className={`rounded-2xl border border-border bg-card p-4 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}
