import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

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
      <Text className="text-sm font-semibold text-slate-800">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3"
      >
        <Text
          className={`text-base ${selected ? "text-slate-900" : "text-slate-400"}`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color="#64748b" />
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
          <Pressable className="rounded-t-3xl bg-white p-4 pb-8">
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-slate-300" />
            </View>
            <Text className="mb-3 text-lg font-bold text-slate-900">{label}</Text>
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
                      className={`text-base ${active ? "font-bold text-primary" : "text-slate-800"}`}
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