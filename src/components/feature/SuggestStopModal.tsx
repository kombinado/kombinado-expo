import { MapPinPlus, X } from "lucide-react-native";
import React, { useState } from "react";
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

  const handleSubmit = () => {
    // Evita envio de texto vazio ou só com espaços
    if (!suggestion.trim()) return;

    onSubmit(suggestion);
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
            className="bg-white rounded-t-[32px] p-6 max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-black text-[#040F0F]">
                Sugerir Parada
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-slate-100 p-2 rounded-full active:bg-slate-200"
                accessibilityRole="button"
                accessibilityLabel="Fechar modal de sugestão"
              >
                <X size={24} color="#64748b" strokeWidth={2.5} />
              </Pressable>
            </View>

            {/* Texto de Apoio (UX) */}
            <Text className="text-slate-500 text-sm mb-6 leading-relaxed">
              Descreva o local onde você gostaria de embarcar ou desembarcar. O
              motorista será notificado e poderá aceitar sua sugestão.
            </Text>

            {/* Input da Sugestão */}
            <View className="mb-6">
              <Text className="text-slate-500 font-bold mb-1 ml-1 uppercase tracking-wider text-xs">
                Local da Parada
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#E84855] focus:bg-white transition-colors">
                <MapPinPlus size={20} color="#E84855" />
                <TextInput
                  value={suggestion}
                  onChangeText={setSuggestion}
                  placeholder="Ex: Ponto de ônibus do Bahamas..."
                  className="flex-1 ml-3 text-lg font-semibold text-slate-800"
                  placeholderTextColor="#cbd5e1"
                  autoFocus={true} // Já abre o teclado direto para o usuário
                />
              </View>
            </View>

            {/* Botão Enviar */}
            <Pressable
              onPress={handleSubmit}
              disabled={!suggestion.trim()}
              className={`w-full py-4 rounded-xl items-center shadow-lg transition-all ${
                suggestion.trim()
                  ? "bg-[#E84855] active:bg-red-600 active:scale-95 shadow-red-900/20"
                  : "bg-slate-300"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Enviar sugestão de parada"
            >
              <Text className="text-white text-xl font-black uppercase tracking-wider">
                Enviar Sugestão
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
