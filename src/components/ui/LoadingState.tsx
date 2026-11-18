import { colors as themeColors } from '@/src/theme/colors';
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

// Carregamento de uma tela ou lista inteira
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="py-10 items-center justify-center gap-3">
      <ActivityIndicator color={themeColors.text.links} size="large" />
      {message ? (
        <Text className="text-text-light-primary font-semibold text-center">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
