import React from "react";
import { Text, View } from "react-native";

interface ErrorBannerProps {
  message?: string | null;
  className?: string;
}

// Erro de uma ação (criar, cancelar, solicitar) exibido acima do conteúdo, sem substituí-lo
export function ErrorBanner({ message, className = "" }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <View
      className={`bg-rose-100 border border-rose-300 p-3 rounded-xl ${className}`}
    >
      <Text className="text-rose-700 text-sm font-bold text-center">
        {message}
      </Text>
    </View>
  );
}
