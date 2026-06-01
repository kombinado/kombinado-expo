import { Clock, LocateFixed, MapPin, Users, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

// 1. Tipagem dos dados que o modal vai devolver para a tela pai
export interface RideFormData {
  origin: string;
  destination: string;
  time: string;
  spots: number;
}

export interface CreateRideModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: RideFormData) => void;
}

export function CreateRideModal({
  isVisible,
  onClose,
  onSubmit,
}: CreateRideModalProps) {
  // 2. Estados locais para controlar o que o motorista digita
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [spots, setSpots] = useState("");

  // 3. Função para limpar o formulário e enviar os dados
  const handleCreate = () => {
    // Validação básica
    if (!origin || !destination || !time || !spots) return;

    onSubmit({
      origin,
      destination,
      time,
      spots: parseInt(spots, 10),
    });

    // Limpa os campos para a próxima vez e fecha
    setOrigin("");
    setDestination("");
    setTime("");
    setSpots("");
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* KeyboardAvoidingView empurra o modal para cima quando o teclado abre */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable
            className="bg-white rounded-t-[32px] p-6 max-h-[90%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-[#040F0F]">
                Criar Carona
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-slate-100 p-2 rounded-full active:bg-slate-200"
              >
                <X size={24} color="#64748b" strokeWidth={2.5} />
              </Pressable>
            </View>

            {/* ScrollView permite rolar o formulário se a tela do celular for pequena */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4 pb-4">
                {/* Input: Origem */}
                <View>
                  <Text className="text-slate-500 font-bold mb-1 ml-1">
                    Origem
                  </Text>
                  <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#E84855] focus:bg-white transition-colors">
                    <MapPin size={20} color="#94a3b8" />
                    <TextInput
                      value={origin}
                      onChangeText={setOrigin}
                      placeholder="Ex: Campus IFTM"
                      className="flex-1 ml-3 text-lg font-semibold text-slate-800"
                      placeholderTextColor="#cbd5e1"
                    />
                  </View>
                </View>

                {/* Input: Destino */}
                <View>
                  <Text className="text-slate-500 font-bold mb-1 ml-1">
                    Destino
                  </Text>
                  <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#E84855] focus:bg-white transition-colors">
                    <LocateFixed size={20} color="#94a3b8" />
                    <TextInput
                      value={destination}
                      onChangeText={setDestination}
                      placeholder="Ex: Terminal Oeste"
                      className="flex-1 ml-3 text-lg font-semibold text-slate-800"
                      placeholderTextColor="#cbd5e1"
                    />
                  </View>
                </View>

                {/* Linha dividida: Horário e Assentos */}
                <View className="flex-row gap-4">
                  {/* Input: Horário */}
                  <View className="flex-1">
                    <Text className="text-slate-500 font-bold mb-1 ml-1">
                      Horário
                    </Text>
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#E84855] focus:bg-white transition-colors">
                      <Clock size={20} color="#94a3b8" />
                      <TextInput
                        value={time}
                        onChangeText={setTime}
                        placeholder="07:30"
                        keyboardType="numeric"
                        maxLength={5}
                        className="flex-1 ml-3 text-lg font-semibold text-slate-800"
                        placeholderTextColor="#cbd5e1"
                      />
                    </View>
                  </View>

                  {/* Input: Vagas */}
                  <View className="flex-1">
                    <Text className="text-slate-500 font-bold mb-1 ml-1">
                      Vagas
                    </Text>
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#E84855] focus:bg-white transition-colors">
                      <Users size={20} color="#94a3b8" />
                      <TextInput
                        value={spots}
                        onChangeText={setSpots}
                        placeholder="Ex: 4"
                        keyboardType="numeric"
                        maxLength={1}
                        className="flex-1 ml-3 text-lg font-semibold text-slate-800"
                        placeholderTextColor="#cbd5e1"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Botão de Finalizar */}
            <Pressable
              onPress={handleCreate}
              className={`w-full py-4 rounded-xl items-center shadow-lg transition-all mt-4 ${
                origin && destination && time && spots
                  ? "bg-[#E84855] active:bg-red-600 active:scale-95 shadow-red-900/20"
                  : "bg-slate-300" // Desativado visualmente se faltar dados
              }`}
              disabled={!origin || !destination || !time || !spots}
            >
              <Text className="text-white text-xl font-black uppercase tracking-wider">
                Criar Carona
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
