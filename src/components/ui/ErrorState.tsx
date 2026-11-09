import { colors as themeColors } from '@/src/theme/colors';
import { CircleAlert } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// Erro que impede de mostrar uma tela ou lista inteira
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="py-10 items-center justify-center gap-4">
      <CircleAlert size={40} color={themeColors.error.secondary} strokeWidth={2} />
      <Text className="text-error-primary font-bold text-center">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="bg-button-cancel px-6 py-3 items-center rounded-full active:bg-button-cancel/70 active:scale-95 transition-all"
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text className="text-text-button-cancel font-bold">Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
