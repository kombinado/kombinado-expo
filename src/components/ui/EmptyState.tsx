import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  description?: string;
}

// Lista carregada com sucesso, mas sem itens
export function EmptyState({ icon: Icon, message, description }: EmptyStateProps) {
  return (
    <View className="py-10 items-center justify-center gap-2">
      {Icon ? <Icon size={40} color="#94a3b8" strokeWidth={2} /> : null}
      <Text className="text-slate-500 font-semibold text-lg text-center">
        {message}
      </Text>
      {description ? (
        <Text className="text-slate-400 text-sm text-center">{description}</Text>
      ) : null}
    </View>
  );
}
