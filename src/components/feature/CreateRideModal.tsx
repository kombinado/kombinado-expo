import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import type { RideFormData } from "@/src/hooks/apiTypes";
import { colors as themeColors } from '@/src/theme/colors';
import { Clock, LocateFixed, MapPin, Users, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export type { RideFormData };

export interface CreateRideModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: RideFormData) => boolean | void | Promise<boolean | void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  // Capacidade do veículo do motorista; a API aceita no máximo 8 vagas por carona
  maxSeats?: number;
}

const MIN_SEATS = 1;
const MAX_SEATS = 8;

export function CreateRideModal({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  maxSeats = MAX_SEATS,
}: CreateRideModalProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [spots, setSpots] = useState("");

  const resetForm = () => {
    setOrigin("");
    setDestination("");
    setTime("");
    setSpots("");
  };

  const handleTimeChange = (text: string) => {
    // Remove qualquer coisa que não seja número
    const numbers = text.replace(/\D/g, "");
    
    // Adiciona o ":" após os dois primeiros dígitos
    if (numbers.length <= 2) {
      setTime(numbers);
    } else {
      setTime(`${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`);
    }
  };

  const seatsLimit = Math.min(maxSeats, MAX_SEATS);
  const spotsNumber = parseInt(spots, 10);
  const isSpotsValid = spotsNumber >= MIN_SEATS && spotsNumber <= seatsLimit;

  const handleSpotsChange = (text: string) => {
    setSpots(text.replace(/\D/g, ""));
  };

  const handleCreate = async () => {
    if (!origin || !destination || !time || !isSpotsValid || isSubmitting) return;

    const shouldClose = await onSubmit({
      origin,
      destination,
      time,
      spots: spotsNumber,
    });

    if (shouldClose === false) return;

    resetForm();
    onClose();
  };

  // Enquanto a carona é enviada, o modal não pode ser fechado
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const canSubmit = Boolean(origin && destination && time) && isSpotsValid && !isSubmitting;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={handleClose}>
          <Pressable
            className="bg-card rounded-t-[32px] p-6 max-h-[90%]"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-light-primary">
                Criar Carona
              </Text>
              <Pressable
                onPress={handleClose}
                className="bg-button-cancel p-2 rounded-full active:bg-button-cancel/70"
              >
                <X size={24} color={themeColors.text["button-cancel"]} strokeWidth={2.5} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4 pb-4">
                <ErrorBanner message={errorMessage} />

                <View>
                  <Text className="text-text-links font-bold mb-1 ml-1">
                    Origem
                  </Text>
                  <View className="flex-row items-center bg-input border border-text-light-secondary rounded-2xl px-4 py-3 focus:border-text-links focus:bg-input transition-colors">
                    <MapPin size={20} color={themeColors.text.links} />
                    <TextInput
                      value={origin}
                      onChangeText={setOrigin}
                      placeholder="Ex: Campus IFTM"
                      className="flex-1 ml-3 text-lg font-semibold text-text-light-primary"
                      placeholderTextColor={themeColors.text["light-secondary"]}
                      editable={!isSubmitting}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-text-links font-bold mb-1 ml-1">
                    Destino
                  </Text>
                  <View className="flex-row items-center bg-input border border-text-light-secondary rounded-2xl px-4 py-3 focus:border-text-links focus:bg-input transition-colors">
                    <LocateFixed size={20} color={themeColors.text.links} />
                    <TextInput
                      value={destination}
                      onChangeText={setDestination}
                      placeholder="Ex: Terminal Oeste"
                      className="flex-1 ml-3 text-lg font-semibold text-text-light-primary"
                      placeholderTextColor={themeColors.text["light-secondary"]}
                      editable={!isSubmitting}
                    />
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-text-links font-bold mb-1 ml-1">
                      Horário
                    </Text>
                    <View className="flex-row items-center bg-input border border-text-light-secondary rounded-2xl px-4 py-3 focus:border-text-links focus:bg-input transition-colors">
                      <Clock size={20} color={themeColors.text.links} />
                      <TextInput
                        value={time}
                        onChangeText={handleTimeChange}
                        placeholder="07:30"
                        keyboardType="numeric"
                        maxLength={5}
                        className="flex-1 ml-3 text-lg font-semibold text-text-light-primary"
                        placeholderTextColor={themeColors.text["light-secondary"]}
                        editable={!isSubmitting}
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-text-links font-bold mb-1 ml-1">
                      Vagas
                    </Text>
                    <View className="flex-row items-center bg-input border border-text-light-secondary rounded-2xl px-4 py-3 focus:border-text-links focus:bg-input transition-colors">
                      <Users size={20} color={themeColors.text.links} />
                      <TextInput
                        value={spots}
                        onChangeText={handleSpotsChange}
                        placeholder="Ex: 4"
                        keyboardType="number-pad"
                        maxLength={1}
                        className="flex-1 ml-3 text-lg font-semibold text-text-light-primary"
                        placeholderTextColor={themeColors.text["light-secondary"]}
                        editable={!isSubmitting}
                      />
                    </View>
                    <Text
                      className={`text-xs font-semibold mt-1 ml-1 ${spots && !isSpotsValid ? "text-error-secondary" : "text-text-light-secondary"}`}
                    >
                      De {MIN_SEATS} a {seatsLimit} vagas
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <Pressable
              onPress={handleCreate}
              className={`w-full py-4 rounded-xl items-center shadow-lg transition-all mt-4 ${canSubmit
                ? "bg-button active:bg-button/70 active:scale-95 shadow-red-900/20"
                : "bg-text-light-secondary"
                }`}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator color={themeColors.text.dark} />
              ) : (
                <Text className="text-text-dark text-xl font-black uppercase tracking-wider">
                  Criar Carona
                </Text>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
