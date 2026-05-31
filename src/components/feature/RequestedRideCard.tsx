import {
    ArrowDownFromLine,
    Calendar,
    Clock,
    LocateFixed,
    MapPin,
    MessageCircle,
    PlusCircle,
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

// 1. Tipagem atualizada para os novos requisitos
export interface RequestedRideCardProps {
  driverName: string;
  carModel: string;
  carColor: string;
  carPlate: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  // O status aceita apenas estas 3 strings exatas
  status: "aceita" | "pendente" | "negada";
  onCancelRequest: () => void;
  onWhatsAppPress: () => void;
  onSuggestStopPress: () => void;
}

export function RequestedRideCard({
  driverName,
  carModel,
  carColor,
  carPlate,
  date,
  time,
  origin,
  destination,
  status,
  onCancelRequest,
  onWhatsAppPress,
  onSuggestStopPress,
}: RequestedRideCardProps) {
  // 2. Dicionário visual para o badge de status
  const statusConfig = {
    aceita: { label: "Aceita", color: "text-green-600" },
    pendente: { label: "Pendente", color: "text-amber-500" },
    negada: { label: "Negada", color: "text-slate-400" },
  };

  const currentStatus = statusConfig[status];

  return (
    <View className="flex bg-[#E84855] rounded-xl px-4 py-6 gap-6 shadow-sm mb-4">
      {/* --- SEÇÃO 1: MOTORISTA E STATUS --- */}
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1 mr-4">
          <Text
            className="text-2xl font-semibold text-white mb-1"
            numberOfLines={1}
          >
            {driverName}
          </Text>

          <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
            <Text className="text-sm text-red-100 font-medium">{carModel}</Text>
            <View className="w-1 h-1 bg-red-200/50 rounded-full" />
            <Text className="text-sm text-red-100 font-medium">{carColor}</Text>
            <View className="w-1 h-1 bg-red-200/50 rounded-full" />
            <Text className="text-sm text-red-100 font-bold uppercase tracking-wider">
              {carPlate}
            </Text>
          </View>
        </View>

        {/* Display de Status Dinâmico */}
        <View className="bg-white px-4 py-3 rounded-xl items-center justify-center shadow-sm">
          <Text
            className={`text-lg font-black uppercase tracking-wider ${currentStatus.color}`}
          >
            {currentStatus.label}
          </Text>
        </View>
      </View>

      {/* --- SEÇÃO 2: DATA E HORA --- */}
      <View className="flex-row gap-6 bg-white/10 p-3 rounded-xl">
        <View className="flex-row items-center flex-1 justify-center">
          <Calendar size={20} color="#FFF" strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-white font-bold">{date}</Text>
        </View>

        <View className="w-[2px] bg-white/20 rounded-full" />

        <View className="flex-row items-center flex-1 justify-center">
          <Clock size={20} color="#FFF" strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-white font-bold">{time}</Text>
        </View>
      </View>

      {/* --- SEÇÃO 3: TRAJETO --- */}
      <View className="flex-col gap-3 pl-2">
        <View className="flex-row gap-3 items-start">
          <View className="items-center mt-1">
            <MapPin size={22} color="#FFF" strokeWidth={2.5} />
          </View>
          <View className="flex-col flex-1">
            <Text className="text-red-100 text-xs font-bold uppercase tracking-widest mb-0.5">
              Origem
            </Text>
            <Text className="text-white text-xl font-bold leading-tight">
              {origin}
            </Text>
          </View>
        </View>

        <View className="pl-[2px]">
          <ArrowDownFromLine size={18} color="#FFB5B5" strokeWidth={2.5} />
        </View>

        <View className="flex-row gap-3 items-start">
          <View className="items-center mt-1">
            <LocateFixed size={22} color="#FFF" strokeWidth={2.5} />
          </View>
          <View className="flex-col flex-1">
            <Text className="text-red-100 text-xs font-bold uppercase tracking-widest mb-0.5">
              Destino
            </Text>
            <Text className="text-white text-xl font-bold leading-tight">
              {destination}
            </Text>
          </View>
        </View>
      </View>

      {/* --- SEÇÃO 4: AÇÕES DA CARONA --- */}
      <View className="mt-2 flex-col gap-3">
        {/* Botão WhatsApp (Exibido apenas se não estiver negada, opcional de regra de negócio) */}
        {status !== "negada" && (
          <Pressable
            onPress={onWhatsAppPress}
            className="w-full bg-[#25D366] py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-[#20b858] active:scale-95 transition-all"
          >
            <MessageCircle size={22} color="#FFF" strokeWidth={2.5} />
            <Text className="text-white text-lg font-black tracking-wider">
              Falar no WhatsApp
            </Text>
          </Pressable>
        )}

        {/* Botão Sugerir Parada (Branco com texto vermelho para contraste) */}
        {status !== "negada" && (
          <Pressable
            onPress={onSuggestStopPress}
            className="w-full bg-white py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-slate-100 active:scale-95 transition-all"
          >
            <PlusCircle size={22} color="#E84855" strokeWidth={2.5} />
            <Text className="text-[#E84855] text-lg font-black tracking-wider">
              Sugerir Parada
            </Text>
          </Pressable>
        )}

        {/* Botão Cancelar (Escuro, destrutivo) */}
        <Pressable
          onPress={onCancelRequest}
          className="w-full bg-[#040F0F] py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-[#040F0F]/80 active:scale-95 transition-all"
        >
          <Text className="text-white text-lg font-black tracking-wider">
            Cancelar Solicitação
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
