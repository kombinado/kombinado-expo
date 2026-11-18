import { colors as themeColors } from '@/src/theme/colors';
import { MapPinPlus, X } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export interface SuggestStopModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (suggestion: string) => void;
}

export function SuggestStopModal({
  isVisible,
  onClose,
  onSubmit,
}: SuggestStopModalProps) {
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = (withSuggestion: boolean) => {
    if (withSuggestion && !suggestion.trim()) return;

    onSubmit(withSuggestion ? suggestion : "");
    setSuggestion(""); // Limpa o campo
    onClose(); // Fecha o modal
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable
            className="bg-card rounded-t-[32px] p-6 max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-black text-text-light-primary">
                Sugerir Parada
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-button-cancel p-2 rounded-full active:bg-button-cancel/70"
                accessibilityRole="button"
                accessibilityLabel="Fechar modal de sugestão"
              >
                <X size={24} color={themeColors.text['button-cancel']} strokeWidth={2.5} />
              </Pressable>
            </View>

            {/* Texto de Apoio (UX) */}
            <Text className="text-text-light-secondary text-sm mb-6 leading-relaxed">
              Descreva o local onde você gostaria de embarcar ou desembarcar. O
              motorista será notificado e poderá aceitar sua sugestão. Isso é opcional.
            </Text>

            {/* Input da Sugestão */}
            <View className="mb-6">
              <Text className="text-text-links font-bold mb-1 ml-1 uppercase tracking-wider text-xs">
                Local da Parada
              </Text>
              <View className="flex-row items-center bg-input border border-text-light-secondary rounded-2xl px-4 py-3 focus:border-text-links focus:bg-input transition-colors">
                <MapPinPlus size={20} color={themeColors.text.links} />
                <TextInput
                  value={suggestion}
                  onChangeText={setSuggestion}
                  placeholder="Ex: Ponto de ônibus do Bahamas..."
                  className="flex-1 ml-3 text-lg font-semibold text-text-light-primary"
                  placeholderTextColor={themeColors.text["light-secondary"]}
                  autoFocus={true} // Já abre o teclado direto para o usuário
                />
              </View>
            </View>

            {/* Botões */}
            <View className="flex-col gap-3">
              <Pressable
                onPress={() => handleSubmit(true)}
                disabled={!suggestion.trim()}
                className={`w-full py-4 rounded-xl items-center shadow-sm transition-all ${
                  suggestion.trim()
                    ? "bg-button active:bg-button/70 active:scale-95 shadow-button/50"
                    : "bg-text-light-secondary"
                }`}
                accessibilityRole="button"
                accessibilityLabel="Enviar sugestão de parada"
              >
                <Text className="text-text-dark text-xl font-black uppercase tracking-wider">
                  Enviar Sugestão
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSubmit(false)}
                className="w-full py-4 rounded-xl items-center border-2 border-text-light-primary active:bg-text-light-secondary active:scale-95 transition-all"
                accessibilityRole="button"
                accessibilityLabel="Solicitar sem sugestão"
              >
                <Text className="text-text-light-primary text-lg font-bold uppercase tracking-wider">
                  Solicitar sem sugestão
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
