import React from "react";
import { Pressable, Text, View } from "react-native";

interface ToggleButtonProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
  labelLeft?: string;
  labelRight?: string;
}

export function ToggleButton({
  value,
  onToggle,
  labelLeft = "Passageiro",
  labelRight = "Motorista",
}: ToggleButtonProps) {
  return (
    <View className="flex-row w-full h-12 bg-white border-2 border-[#E84855] rounded-xl overflow-hidden">
      <Pressable
        onPress={() => onToggle(true)}
        className={`w-1/2 h-full items-center justify-center border-2 border-white rounded-xl transition-colors ${
          value ? "bg-[#E84855]" : "bg-white"
        }`}
      >
        <Text
          className={`bg-transparent font-semibold text-lg ${
            value ? "text-white" : "text-[#E84855]"
          }`}
        >
          {labelLeft}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onToggle(false)}
        className={`w-1/2 h-full items-center justify-center border-2 border-white rounded-xl transition-colors ${
          !value ? "bg-[#E84855]" : "bg-white"
        }`}
      >
        <Text
          className={`bg-transparent font-semibold text-lg ${
            !value ? "text-white" : "text-[#E84855]"
          }`}
        >
          {labelRight}
        </Text>
      </Pressable>
    </View>
  );
}
