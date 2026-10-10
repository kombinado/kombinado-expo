import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

// Carregamento de uma tela ou lista inteira
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="py-10 items-center justify-center gap-3">
      <ActivityIndicator color="#E84855" size="large" />
      {message ? (
        <Text className="text-slate-500 font-semibold text-center">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
