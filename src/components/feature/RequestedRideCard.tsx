import {
  ArrowDownFromLine,
  Calendar,
  Clock,
  LocateFixed,
  MapPin,
  MessageCircle,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export interface RequestedRideCardProps {
  driverName: string;
  carModel?: string;
  carColor?: string;
  carPlate?: string;
  date?: string;
  time?: string;
  origin?: string;
  destination?: string;
  status: "aceita" | "pendente" | "negada";
  onCancelRequest: () => void;
  onWhatsAppPress: () => void;
  canContactDriver?: boolean;
  isCancelling?: boolean;
}

export function RequestedRideCard({
  driverName,
  carModel,
  carColor,
  carPlate,
  date = "--/--",
  time = "--:--",
  origin = "Origem não disponível",
  destination = "Destino não disponível",
  status,
  onCancelRequest,
  onWhatsAppPress,
  canContactDriver = false,
  isCancelling = false,
}: RequestedRideCardProps) {
  const statusConfig = {
    aceita: { label: "Aceita", color: "text-green-600" },
    pendente: { label: "Pendente", color: "text-amber-500" },
    negada: { label: "Negada", color: "text-slate-400" },
  };

  const currentStatus = statusConfig[status];
  const vehicleInfo = [carModel, carColor, carPlate].filter(Boolean);

  return (
    <View className="flex bg-[#E84855] rounded-xl px-4 py-6 gap-6 shadow-sm mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1 mr-4">
          <Text
            className="text-2xl font-semibold text-white mb-1"
            numberOfLines={1}
          >
            {driverName}
          </Text>

          {vehicleInfo.length > 0 ? (
            <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
              {vehicleInfo.map((info, index) => (
                <React.Fragment key={`${info}-${index}`}>
                  {index > 0 ? (
                    <View className="w-1 h-1 bg-red-200/50 rounded-full" />
                  ) : null}
                  <Text
                    className={`text-sm text-red-100 ${
                      info === carPlate
                        ? "font-bold uppercase tracking-wider"
                        : "font-medium"
                    }`}
                  >
                    {info}
                  </Text>
                </React.Fragment>
              ))}
            </View>
          ) : null}
        </View>

        <View className="bg-white px-4 py-3 rounded-xl items-center justify-center shadow-sm">
          <Text
            className={`text-lg font-black uppercase tracking-wider ${currentStatus.color}`}
          >
            {currentStatus.label}
          </Text>
        </View>
      </View>

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

      <View className="mt-2 flex-col gap-3">
        {status === "aceita" && canContactDriver ? (
          <Pressable
            onPress={onWhatsAppPress}
            className="w-full bg-[#25D366] py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-[#20b858] active:scale-95 transition-all"
          >
            <MessageCircle size={22} color="#FFF" strokeWidth={2.5} />
            <Text className="text-white text-lg font-black tracking-wider">
              Falar no WhatsApp
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onCancelRequest}
          className={`w-full bg-[#040F0F] py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-[#040F0F]/80 active:scale-95 transition-all ${
            isCancelling ? "opacity-70" : ""
          }`}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-lg font-black tracking-wider">
              Cancelar Solicitação
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
