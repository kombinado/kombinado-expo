import {
    ArrowDownFromLine,
    Calendar,
    Clock,
    LocateFixed,
    MapPin,
    Users, // Importamos o ícone de usuários para o botão de solicitações
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

// 1. Tipagem ajustada para a visão do motorista
export interface DriverRideCardProps {
  date: string;
  time: string;
  origin: string;
  destination: string;
  occupiedSpots: number; // Vagas já ocupadas (x)
  totalSpots: number; // Total de vagas disponibilizadas (y)
  onCancelRide: () => void; // Antigo onRequestRide, agora cancela a carona
  onViewRequests: () => void; // Função que vai abrir o seu modal
}

export function DriverRideCard({
  date,
  time,
  origin,
  destination,
  occupiedSpots,
  totalSpots,
  onCancelRide,
  onViewRequests,
}: DriverRideCardProps) {
  return (
    <View className="flex bg-[#E84855] rounded-xl px-4 py-6 gap-6 shadow-sm mb-4">
      {/* --- SEÇÃO 1: CABEÇALHO E CONTROLE DE VAGAS --- */}
      <View className="flex-row items-center justify-between">
        {/* Como tiramos o nome do motorista, colocamos um título de contexto */}
        <View className="flex-col flex-1 mr-4">
          <Text className="text-2xl font-semibold text-white mb-1">
            Minha Carona
          </Text>
          <Text className="text-sm text-red-100 font-medium">
            Gerencie suas vagas e passageiros
          </Text>
        </View>

        {/* Agrupamento do Botão de Solicitações + Display de Vagas */}
        <View className="flex-row items-center gap-2">
          {/* Novo Botão para abrir o Modal de Solicitações */}
          <Pressable
            onPress={onViewRequests}
            className="bg-white/20 p-3 rounded-xl items-center justify-center active:bg-white/30 transition-colors"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Ver solicitações de passageiros"
          >
            <Users size={24} color="#FFF" />

            {/* Opcional: Uma "bolinha" de notificação se houver solicitações pendentes */}
            <View className="absolute -top-1 -right-1 bg-yellow-400 w-3.5 h-3.5 rounded-full border-2 border-[#E84855]" />
          </Pressable>

          {/* Display de Vagas em formato de Fração (x/y) */}
          <View className="bg-white px-4 py-3 rounded-xl items-center justify-center shadow-sm">
            <Text className="text-[#040F0F] text-lg font-black">
              {occupiedSpots}/{totalSpots} vagas
            </Text>
          </View>
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

      {/* --- SEÇÃO 4: BOTÃO DE CANCELAR --- */}
      <View className="mt-2">
        <Pressable
          onPress={onCancelRide}
          className="w-full bg-[#040F0F] py-4 rounded-xl items-center shadow-lg active:bg-[#040F0F]/80 active:scale-95 transition-all"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Cancelar esta carona"
        >
          <Text className="text-white text-xl font-black uppercase tracking-wider">
            Cancelar Carona
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
