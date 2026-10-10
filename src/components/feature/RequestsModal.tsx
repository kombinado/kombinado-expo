import { EmptyState } from "@/src/components/ui/EmptyState";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import type { RideRequestResponseDto } from "@/src/hooks/apiTypes";
import { Check, Inbox, X, MessageCircle } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  Linking,
  Alert,
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
          className="bg-white rounded-t-[32px] p-6 max-h-[80%]"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-[#040F0F]">
              Solicitações
            </Text>
            <Pressable
              onPress={onClose}
              className="bg-slate-100 p-2 rounded-full active:bg-slate-200"
            >
              <X size={24} color="#64748b" strokeWidth={2.5} />
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
                  <View className="bg-slate-50 p-4 rounded-2xl mb-3 border border-slate-100 shadow-sm gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className="text-lg font-bold text-slate-800 flex-1 mr-4"
                        numberOfLines={1}
                      >
                        {passengerName}
                      </Text>

                      {item.status === "Pendente" ? (
                        <View className="flex-row gap-3">
                          <Pressable
                            onPress={() => onReject(item.id)}
                            disabled={isResponding}
                            className="bg-red-100 w-12 h-12 rounded-xl items-center justify-center active:bg-red-200 active:scale-95 transition-all"
                          >
                            {isResponding ? (
                              <ActivityIndicator color="#E84855" />
                            ) : (
                              <X size={24} color="#E84855" strokeWidth={3} />
                            )}
                          </Pressable>

                          <Pressable
                            onPress={() => onAccept(item.id)}
                            disabled={isResponding}
                            className="bg-green-100 w-12 h-12 rounded-xl items-center justify-center active:bg-green-200 active:scale-95 transition-all"
                          >
                            {isResponding ? (
                              <ActivityIndicator color="#16a34a" />
                            ) : (
                              <Check
                                size={24}
                                color="#16a34a"
                                strokeWidth={3}
                              />
                            )}
                          </Pressable>
                        </View>
                      ) : item.status === "Aceita" ? (
                        <View className="bg-green-500 px-4 py-3 rounded-xl">
                          {/* Rótulo já em maiúsculas: no Android, a classe uppercase corta a última letra */}
                          <Text className="text-white font-black tracking-wider text-xs">
                            ACEITA
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-red-500 px-4 py-3 rounded-xl">
                          <Text className="text-white font-black tracking-wider text-xs">
                            RECUSADA
                          </Text>
                        </View>
                      )}
                    </View>

                    {item.meetingPointSuggestion ? (
                      <Text className="text-slate-500 font-medium">
                        Parada sugerida: {item.meetingPointSuggestion}
                      </Text>
                    ) : null}

                    {item.status === "Aceita" && item.phoneNumber ? (
                      <Pressable
                        onPress={() => handleWhatsAppPress(item.phoneNumber)}
                        className="w-full bg-[#25D366] py-3 mt-2 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-[#20b858] active:scale-95 transition-all"
                      >
                        <MessageCircle size={20} color="#FFF" strokeWidth={2.5} />
                        <Text className="text-white text-base font-black tracking-wider">
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
