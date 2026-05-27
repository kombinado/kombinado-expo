import {
    ArrowDownFromLine,
    Calendar,
    Clock,
    LocateFixed,
    MapPin,
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface RideCardProps {
  driverName: string;
  carModel: string;
  carColor: string;
  carPlate: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  availableSpots: number;
  onRequestRide: () => void;
}

export function RideCard({
  driverName,
  carModel,
  carColor,
  carPlate,
  date,
  time,
  origin,
  destination,
  availableSpots,
  onRequestRide,
}: RideCardProps) {
  return (
    <View className="flex bg-[#E84855] rounded-xl px-4 py-6 gap-6 shadow-sm mb-4">
      {/* --- SEÇÃO 1: MOTORISTA E VAGAS --- */}
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1 mr-4">
          <Text
            className="text-2xl font-semibold text-white mb-1"
            numberOfLines={1} // Evita que nomes muito longos quebrem o layout
          >
            {driverName}
          </Text>

          {/* Informações do carro separadas em tags respeitando o estilo */}
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

        {/* Display de Vagas (Com lógica para plural/singular) */}
        <View className="bg-white px-4 py-3 rounded-xl items-center justify-center shadow-sm">
          <Text className="text-[#040F0F] text-lg font-black">
            {availableSpots} {availableSpots === 1 ? "vaga" : "vagas"}
          </Text>
        </View>
      </View>

      {/* --- SEÇÃO 2: DATA E HORA --- */}
      <View className="flex-row gap-6 bg-white/10 p-3 rounded-xl">
        <View className="flex-row items-center flex-1 justify-center">
          <Calendar size={20} color="#FFF" strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-white font-bold">{date}</Text>
        </View>

        {/* Divisória vertical sutil */}
        <View className="w-[2px] bg-white/20 rounded-full" />

        <View className="flex-row items-center flex-1 justify-center">
          <Clock size={20} color="#FFF" strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-white font-bold">{time}</Text>
        </View>
      </View>

      {/* --- SEÇÃO 3: TRAJETO --- */}
      <View className="flex-col gap-3 pl-2">
        {/* Origem */}
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

        {/* Ícone de Seta (Alinhado visualmente com os pinos) */}
        <View className="pl-[2px]">
          <ArrowDownFromLine size={18} color="#FFB5B5" strokeWidth={2.5} />
        </View>

        {/* Destino */}
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

      {/* --- SEÇÃO 4: BOTÃO DE AÇÃO --- */}
      <View className="mt-2">
        <Pressable
          onPress={onRequestRide}
          className="w-full bg-[#040F0F] py-4 rounded-xl items-center shadow-lg active:bg-[#040F0F]/80 active:scale-95 transition-all"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Solicitar carona com ${driverName} para ${destination}`}
          accessibilityHint="Toque para enviar uma solicitação de carona para este motorista"
        >
          <Text className="text-white text-xl font-black uppercase tracking-wider">
            Solicitar Carona
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
