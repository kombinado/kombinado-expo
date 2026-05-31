import { Check, UserX, X } from "lucide-react-native"; // Adicionei o UserX aqui!
import React from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

export interface RideRequest {
  id: string;
  name: string;
  status: "pendente" | "aceita";
}

export interface RequestsModalProps {
  isVisible: boolean;
  onClose: () => void;
  requests: RideRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  // NOVA AÇÃO: Para quando o motorista se arrepender e quiser remover um aceito
  onRemoveAccepted: (id: string) => void;
}

export function RequestsModal({
  isVisible,
  onClose,
  requests,
  onAccept,
  onReject,
  onRemoveAccepted, // Extraímos a nova propriedade
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
          onPress={(e) => e.stopPropagation()}
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

          {requests.length === 0 ? (
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
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl mb-3 border border-slate-100 shadow-sm">
                  <Text
                    className="text-lg font-bold text-slate-800 flex-1 mr-4"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  {item.status === "pendente" ? (
                    <View className="flex-row gap-3">
                      <Pressable
                        onPress={() => onReject(item.id)}
                        className="bg-red-100 w-12 h-12 rounded-xl items-center justify-center active:bg-red-200 active:scale-95 transition-all"
                      >
                        <X size={24} color="#E84855" strokeWidth={3} />
                      </Pressable>

                      <Pressable
                        onPress={() => onAccept(item.id)}
                        className="bg-green-100 w-12 h-12 rounded-xl items-center justify-center active:bg-green-200 active:scale-95 transition-all"
                      >
                        <Check size={24} color="#16a34a" strokeWidth={3} />
                      </Pressable>
                    </View>
                  ) : (
                    // NOVO: Agrupamento do Label de Aceito + Botão de Remover
                    <View className="flex-row items-center gap-2">
                      <View className="bg-green-500 px-4 py-3 rounded-xl">
                        <Text className="text-white font-black uppercase tracking-wider text-xs">
                          Aceito
                        </Text>
                      </View>

                      {/* Botão para deletar a solicitação aceita */}
                      <Pressable
                        onPress={() => onRemoveAccepted(item.id)}
                        className="bg-slate-200 w-12 h-12 rounded-xl items-center justify-center active:bg-red-100 active:scale-95 transition-all"
                        accessibilityRole="button"
                        accessibilityLabel={`Remover ${item.name} da carona`}
                      >
                        <UserX size={22} color="#64748b" strokeWidth={2.5} />
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
