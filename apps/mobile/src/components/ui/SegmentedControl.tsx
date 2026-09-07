import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.7}
            onPress={() => onChange(opt.value)}
            style={[
              styles.base,
              active ? styles.active : styles.inactive,
            ]}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
  active: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactive: {
    backgroundColor: "transparent",
  },
});
