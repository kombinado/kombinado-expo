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
    <View className="flex-row w-full h-12 bg-card border-2 border-card rounded-xl overflow-hidden">
      <Pressable
        onPress={() => onToggle(true)}
        className={`w-1/2 h-full items-center justify-center rounded-xl transition-colors ${
          value ? "bg-button" : "bg-transparent"
        }`}
      >
        <Text
          className={`bg-transparent font-semibold text-lg ${
            value ? "text-text-dark" : "text-text-light-primary"
          }`}
        >
          {labelLeft}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onToggle(false)}
        className={`w-1/2 h-full items-center justify-center rounded-xl transition-colors ${
          !value ? "bg-button" : "bg-transparent"
        }`}
      >
        <Text
          className={`bg-transparent font-semibold text-lg ${
            !value ? "text-text-dark" : "text-text-light-primary"
          }`}
        >
          {labelRight}
        </Text>
      </Pressable>
    </View>
  );
}
