import React from "react";
import { Pressable, Text, View } from "react-native";

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
}

export function SegmentedControl({
  value,
  options,
  onChange,
}: SegmentedControlProps) {
  return (
    <View className="flex-row rounded-xl bg-muted p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 rounded-lg py-2.5 ${active ? "bg-card shadow-sm" : ""}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
