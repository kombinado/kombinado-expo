import { CircleAlert } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// Erro que impede de mostrar uma tela ou lista inteira
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="py-10 items-center justify-center gap-4">
      <CircleAlert size={40} color="#be123c" strokeWidth={2} />
      <Text className="text-rose-700 font-bold text-center">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="bg-[#E84855] px-6 py-3 rounded-full active:bg-red-600 active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text className="text-white font-bold">Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
