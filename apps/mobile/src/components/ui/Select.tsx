import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../../lib/theme";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function Select({
  label,
  value,
  options,
  onValueChange,
  placeholder = "Select...",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-xl border border-input bg-card px-4 py-3"
      >
        <Text
          className={`text-base ${selected ? "text-foreground" : "text-muted-foreground"}`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.mutedForeground} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setOpen(false)}
        >
          <Pressable className="rounded-t-3xl bg-card p-4 pb-8">
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-border" />
            </View>
            <Text className="mb-3 text-lg font-bold text-foreground">{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    className={`rounded-xl px-4 py-3 ${active ? "bg-primary/10" : ""}`}
                  >
                    <Text
                      className={`text-base ${active ? "font-bold text-primary" : "text-foreground"}`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
