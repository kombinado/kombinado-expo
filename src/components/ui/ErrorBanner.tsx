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
      className={`bg-error-primary border border-error-secondary p-3 rounded-xl ${className}`}
    >
      <Text className="text-error-secondary text-sm font-bold text-center">
        {message}
      </Text>
    </View>
  );
}
