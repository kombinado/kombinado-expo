import { colors as themeColors } from '@/src/theme/colors';
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
    aceita: { label: "ACEITA", color: "text-success-secondary" },
    pendente: { label: "PENDENTE", color: "text-pending" },
    negada: { label: "NEGADA", color: "text-error-secondary" },
  };

  const currentStatus = statusConfig[status];
  const vehicleInfo = [carModel, carColor, carPlate].filter(Boolean);

  return (
    <View className="flex bg-card rounded-xl px-4 py-6 gap-6 shadow-sm mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1 mr-4">
          <Text
            className="text-2xl font-semibold text-text-light-primary mb-1"
            numberOfLines={1}
          >
            {driverName}
          </Text>

          {vehicleInfo.length > 0 ? (
            <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
              {vehicleInfo.map((info, index) => (
                <React.Fragment key={`${info}-${index}`}>
                  {index > 0 ? (
                    <View className="w-1 h-1 bg-text-light-secondary rounded-full" />
                  ) : null}
                  <Text
                    className={`text-sm text-text-light-primary ${
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

        {/* No Android, textos em negrito com letterSpacing podem ter a última letra cortada.
            A largura mínima e o texto esticado e centralizado deixam uma folga depois da palavra. */}
        <View className="bg-text-light-primary px-4 py-3 rounded-xl justify-center shadow-sm min-w-[120px]">
          <Text
            className={`self-stretch text-center text-lg font-black ${currentStatus.color}`}
          >
            {currentStatus.label}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-6 bg-input p-3 rounded-xl">
        <View className="flex-row items-center flex-1 justify-center">
          <Calendar size={20} color={themeColors.text['light-primary']} strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-text-light-primary font-bold">{date}</Text>
        </View>

        <View className="w-[2px] bg-text-light-secondary rounded-full" />

        <View className="flex-row items-center flex-1 justify-center">
          <Clock size={20} color={themeColors.text['light-primary']} strokeWidth={2.5} />
          <Text className="ml-2 text-lg text-text-light-primary font-bold">{time}</Text>
        </View>
      </View>

      <View className="flex-col gap-3 pl-2">
        <View className="flex-row gap-3 items-start">
          <View className="items-center mt-1">
            <MapPin size={22} color={themeColors.text['light-primary']} strokeWidth={2.5} />
          </View>
          <View className="flex-col flex-1">
            <Text className="text-text-links text-xs font-bold uppercase tracking-widest mb-0.5">
              Origem
            </Text>
            <Text className="text-text-light-primary text-xl font-bold leading-tight">
              {origin}
            </Text>
          </View>
        </View>

        <View className="pl-[2px]">
          <ArrowDownFromLine size={18} color={themeColors.text['light-secondary']} strokeWidth={2.5} />
        </View>

        <View className="flex-row gap-3 items-start">
          <View className="items-center mt-1">
            <LocateFixed size={22} color={themeColors.text['light-primary']} strokeWidth={2.5} />
          </View>
          <View className="flex-col flex-1">
            <Text className="text-text-links text-xs font-bold uppercase tracking-widest mb-0.5">
              Destino
            </Text>
            <Text className="text-text-light-primary text-xl font-bold leading-tight">
              {destination}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-2 flex-col gap-3">
        {status === "aceita" && canContactDriver ? (
          <Pressable
            onPress={onWhatsAppPress}
            className="w-full bg-button py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-button/70 active:scale-95 transition-all"
          >
            <MessageCircle size={22} color={themeColors.text.dark} strokeWidth={2.5} />
            <Text className="text-text-dark text-lg font-black tracking-wider">
              Falar no WhatsApp
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onCancelRequest}
          className={`w-full bg-button-cancel py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:bg-button-cancel/70 active:scale-95 transition-all ${
            isCancelling ? "opacity-70" : ""
          }`}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator color={themeColors.text['button-cancel']} />
          ) : (
            <Text className="text-text-button-cancel text-lg font-black tracking-wider">
              Cancelar Solicitação
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
