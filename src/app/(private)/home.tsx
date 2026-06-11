import { RequestedRideCard } from "@/src/components/feature/RequestedRideCard";
import { RideCard } from "@/src/components/feature/RideCard";
import { SearchBar } from "@/src/components/feature/SearchBar";
import { SuggestStopModal } from "@/src/components/feature/SuggestStopModal";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { ToggleButton } from "@/src/components/ui/ToggleButton";
import {
  formatRideDate,
  formatRideTime,
  toRequestedRideCardStatus,
} from "@/src/hooks/apiTypes";
import { useAvailableRides } from "@/src/hooks/useAvailableRides";
import { usePassengerRideRequests } from "@/src/hooks/usePassengerRideRequests";
import { useState } from "react";
import { ActivityIndicator, Alert, Linking, Text, View, RefreshControl } from "react-native";

export default function Home() {
  const [isToRequest, setIsToRequest] = useState(true);
  const [destiny, setDestiny] = useState("");
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [isSuggestModalVisible, setIsSuggestModalVisible] = useState(false);

  const {
    filteredRides,
    isLoading: isLoadingRides,
    error: ridesError,
    requestRide,
    requestingRideId,
    requestError,
    refetch: refetchRides,
  } = useAvailableRides(destiny);

  const {
    requests,
    isLoading: isLoadingRequests,
    error: requestsError,
    actionError: requestActionError,
    cancelRequest,
    cancelingRequestId,
    refetch: refetchRequests,
  } = usePassengerRideRequests();

  const openRequestModal = (rideId: string) => {
    setSelectedRideId(rideId);
    setIsSuggestModalVisible(true);
  };

  const handleRequestRide = async (suggestion: string) => {
    if (!selectedRideId) return;

    const request = await requestRide(selectedRideId, suggestion);
    setSelectedRideId(null);

    if (request) {
      await refetchRequests();
      setIsToRequest(false);
    }
  };

  const handleWhatsAppPress = async (phoneNumber: string | null) => {
    if (!phoneNumber) {
      Alert.alert(
        "WhatsApp indisponível",
        "O telefone do motorista só é liberado quando a solicitação é aceita.",
      );
      return;
    }

    const digits = phoneNumber.replace(/\D/g, "");
    await Linking.openURL(`https://wa.me/+55${digits}`);
  };

  const handleRefresh = () => {
    refetchRides();
    refetchRequests();
  };

  // Filtra as caronas para ocultar aquelas nas quais o usuário já foi aceito
  const feedRides = filteredRides.filter((ride) => {
    return !requests.some(
      (req) => req.rideId === ride.id && req.status === "Aceita"
    );
  });

  return (
    <ScreenWrapper
      refreshControl={
        <RefreshControl
          refreshing={isLoadingRides || isLoadingRequests}
          onRefresh={handleRefresh}
          colors={["#E84855"]}
          tintColor="#E84855"
        />
      }
    >
      <View className="mb-10">
        <Text className="text-2xl font-bold">Caronas Disponíveis</Text>
      </View>

      <View className="mb-10">
        <ToggleButton
          value={isToRequest}
          onToggle={setIsToRequest}
          labelLeft="Solicitar"
          labelRight="Solicitadas"
        />
      </View>

      {requestError || requestActionError ? (
        <View className="bg-rose-100 border border-rose-300 p-4 rounded-xl mb-6">
          <Text className="text-rose-700 font-bold text-center">
            {requestError || requestActionError}
          </Text>
        </View>
      ) : null}

      {isToRequest ? (
        <View>
          <View className="mb-10">
            <SearchBar
              value={destiny}
              placeholder="Pra onde vamos?"
              onChangeText={setDestiny}
            />
          </View>

          {isLoadingRides ? (
            <ActivityIndicator color="#E84855" />
          ) : ridesError ? (
            <View className="gap-4">
              <Text className="text-rose-700 font-bold text-center">
                {ridesError}
              </Text>
              <Text
                className="text-[#E84855] font-black text-center"
                onPress={() => refetchRides()}
              >
                Tentar novamente
              </Text>
            </View>
          ) : feedRides.length === 0 ? (
            <Text className="text-slate-500 text-center font-semibold">
              Nenhuma carona disponível no momento.
            </Text>
          ) : (
            feedRides.map((ride) => (
              <RideCard
                key={ride.id}
                carModel={ride.vehicleModel}
                carColor={ride.vehicleColor}
                carPlate={ride.vehiclePlate}
                date={formatRideDate(ride.departureTime)}
                time={formatRideTime(ride.departureTime)}
                origin={ride.origin}
                destination={ride.destination}
                availableSpots={ride.availableSeats}
                isRequesting={requestingRideId === ride.id}
                onRequestRide={() => openRequestModal(ride.id)}
              />
            ))
          )}
        </View>
      ) : (
        <View>
          {isLoadingRequests ? (
            <ActivityIndicator color="#E84855" />
          ) : requestsError ? (
            <View className="gap-4">
              <Text className="text-rose-700 font-bold text-center">
                {requestsError}
              </Text>
              <Text
                className="text-[#E84855] font-black text-center"
                onPress={() => refetchRequests()}
              >
                Tentar novamente
              </Text>
            </View>
          ) : requests.length === 0 ? (
            <Text className="text-slate-500 text-center font-semibold">
              Você ainda não solicitou nenhuma carona.
            </Text>
          ) : (
            requests.map((request) => (
              <RequestedRideCard
                key={request.id}
                driverName={request.driverName || "Motorista"}
                carModel={request.vehicleModel}
                carColor={request.vehicleColor}
                carPlate={request.vehiclePlate}
                origin={request.origin || "Origem não disponível"}
                destination={request.destination || "Destino não disponível"}
                date={request.departureTime ? formatRideDate(request.departureTime) : "--/--"}
                time={request.departureTime ? formatRideTime(request.departureTime) : "--:--"}
                status={toRequestedRideCardStatus(request.status)}
                canContactDriver={Boolean(request.phoneNumber)}
                isCancelling={cancelingRequestId === request.id}
                onCancelRequest={() => cancelRequest(request.id)}
                onWhatsAppPress={() => handleWhatsAppPress(request.phoneNumber)}
              />
            ))
          )}
        </View>
      )}

      <SuggestStopModal
        isVisible={isSuggestModalVisible}
        onClose={() => {
          setSelectedRideId(null);
          setIsSuggestModalVisible(false);
        }}
        onSubmit={handleRequestRide}
      />
    </ScreenWrapper>
  );
}
