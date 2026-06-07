import type { RideRequestResponseDto } from "@/src/hooks/apiTypes";
import { Check, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
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
  errorMessage,
  respondingRequestId,
}: RequestsModalProps) {
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

          {errorMessage ? (
            <View className="bg-rose-100 border border-rose-300 p-3 rounded-xl mb-4">
              <Text className="text-rose-700 text-sm font-bold text-center">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {isLoading ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator color="#E84855" />
            </View>
          ) : requests.length === 0 ? (
            <View className="py-10 items-center justify-center">
              <Text className="text-slate-400 text-lg font-medium text-center">
                Nenhuma solicitação no momento.
              </Text>
            </View>
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
                      ) : (
                        <View className="bg-green-500 px-4 py-3 rounded-xl">
                          <Text className="text-white font-black uppercase tracking-wider text-xs">
                            Aceito
                          </Text>
                        </View>
                      )}
                    </View>

                    {item.meetingPointSuggestion ? (
                      <Text className="text-slate-500 font-medium">
                        Parada sugerida: {item.meetingPointSuggestion}
                      </Text>
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
