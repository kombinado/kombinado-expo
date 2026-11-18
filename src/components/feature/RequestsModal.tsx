import { EmptyState } from "@/src/components/ui/EmptyState";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import type { RideRequestResponseDto } from "@/src/hooks/apiTypes";
import { colors as themeColors } from '@/src/theme/colors';
import { Check, Inbox, MessageCircle, X } from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

export type RideRequest = RideRequestResponseDto;

export interface RequestsModalProps {
  isVisible: boolean;
  onClose: () => void;
  requests: RideRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
  // Erro ao carregar a lista (substitui a lista, com botão de tentar novamente)
  loadErrorMessage?: string | null;
  onRetry?: () => void;
  // Erro ao aceitar ou recusar (aparece acima da lista)
  errorMessage?: string | null;
  respondingRequestId?: string | null;
}

export function RequestsModal({
  isVisible,
  onClose,
  requests,
  onAccept,
  onReject,
  isLoading = false,
  loadErrorMessage,
  onRetry,
  errorMessage,
  respondingRequestId,
}: RequestsModalProps) {

  const handleWhatsAppPress = async (phoneNumber: string | null) => {
    if (!phoneNumber) {
      Alert.alert(
        "WhatsApp indisponível",
        "O telefone do passageiro não foi fornecido.",
      );
      return;
    }

    const digits = phoneNumber.replace(/\D/g, "");
    await Linking.openURL(`https://wa.me/+55${digits}`);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="bg-card rounded-t-[32px] p-6 max-h-[80%]"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-text-light-primary">
              Solicitações
            </Text>
            <Pressable
              onPress={onClose}
              className="bg-button-cancel p-2 rounded-full active:bg-button-cancel/70"
            >
              <X size={24} color={themeColors.text["button-cancel"]} strokeWidth={2.5} />
            </Pressable>
          </View>

          <ErrorBanner message={errorMessage} className="mb-4" />

          {isLoading ? (
            <LoadingState />
          ) : loadErrorMessage ? (
            <ErrorState message={loadErrorMessage} onRetry={onRetry} />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              message="Nenhuma solicitação no momento."
              description="Quando um passageiro pedir uma vaga, ele aparece aqui."
            />
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isResponding = respondingRequestId === item.id;
                const passengerName = item.passengerName || "Passageiro";

                return (
                  <View className="bg-input p-4 rounded-2xl mb-3 border border-text-links shadow-sm gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className="text-lg font-bold text-text-light-primary flex-1 mr-4"
                        numberOfLines={1}
                      >
                        {passengerName}
                      </Text>

                      {item.status === "Pendente" ? (
                        <View className="flex-row gap-3">
                          <Pressable
                            onPress={() => onReject(item.id)}
                            disabled={isResponding}
                            className="bg-error-primary w-12 h-12 rounded-xl items-center justify-center active:bg-error-primary/70 active:scale-95 transition-all"
                          >
                            {isResponding ? (
                              <ActivityIndicator color={themeColors.error.secondary} />
                            ) : (
                              <X size={24} color={themeColors.error.secondary} strokeWidth={3} />
                            )}
                          </Pressable>

                          <Pressable
                            onPress={() => onAccept(item.id)}
                            disabled={isResponding}
                            className="bg-success-primary w-12 h-12 rounded-xl items-center justify-center active:bg-success-primary/70 active:scale-95 transition-all"
                          >
                            {isResponding ? (
                              <ActivityIndicator color={themeColors.success.secondary} />
                            ) : (
                              <Check
                                size={24}
                                color={themeColors.success.secondary}
                                strokeWidth={3}
                              />
                            )}
                          </Pressable>
                        </View>
                      ) : item.status === "Aceita" ? (
                        // Largura mínima e texto centralizado: evita o corte da última letra no Android
                        <View className="bg-success-secondary px-4 py-3 rounded-xl min-w-[96px]">
                          <Text className="text-center text-success-primary font-black text-xs">
                            ACEITA
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-error-secondary px-4 py-3 rounded-xl min-w-[96px]">
                          <Text className="text-center text-error-primary font-black text-xs">
                            RECUSADA
                          </Text>
                        </View>
                      )}
                    </View>

                    {item.meetingPointSuggestion ? (
                      <Text className="text-text-light-secondary font-medium">
                        Parada sugerida: {item.meetingPointSuggestion}
                      </Text>
                    ) : null}

                    {item.status === "Aceita" && item.phoneNumber ? (
                      <Pressable
                        onPress={() => handleWhatsAppPress(item.phoneNumber)}
                        className="w-full bg-button py-3 mt-2 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-button/70 active:scale-95 transition-all"
                      >
                        <MessageCircle size={20} color={themeColors.text.dark} strokeWidth={2.5} />
                        <Text className="text-text-dark text-base font-black tracking-wider">
                          Falar no WhatsApp
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
