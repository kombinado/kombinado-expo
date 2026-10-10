import { RequestedRideCard } from "@/src/components/feature/RequestedRideCard";
import { RideCard } from "@/src/components/feature/RideCard";
import { SearchBar } from "@/src/components/feature/SearchBar";
import { SuggestStopModal } from "@/src/components/feature/SuggestStopModal";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { ToggleButton } from "@/src/components/ui/ToggleButton";
import {
  formatRideDate,
  formatRideTime,
  toRequestedRideCardStatus,
} from "@/src/hooks/apiTypes";
import { useAvailableRides } from "@/src/hooks/useAvailableRides";
import { usePassengerRideRequests } from "@/src/hooks/usePassengerRideRequests";
import { CarFront, SearchX, Ticket } from "lucide-react-native";
import { useState } from "react";
import { Alert, Linking, Text, View, RefreshControl } from "react-native";

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

  // Oculta as caronas que o usuário já solicitou (pendente, aceita ou recusada), pois a API
  // recusa uma nova solicitação nesses casos. Só uma solicitação cancelada libera a carona de novo.
  const feedRides = filteredRides.filter((ride) => {
    return !requests.some(
      (req) => req.rideId === ride.id && req.status !== "Cancelada"
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

      <ErrorBanner message={requestError || requestActionError} className="mb-6" />

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
            <LoadingState />
          ) : ridesError ? (
            <ErrorState message={ridesError} onRetry={refetchRides} />
          ) : feedRides.length === 0 ? (
            destiny.trim() ? (
              <EmptyState
                icon={SearchX}
                message={`Nenhuma carona encontrada para "${destiny.trim()}".`}
                description="Tente buscar por outra origem ou destino."
              />
            ) : (
              <EmptyState
                icon={CarFront}
                message="Nenhuma carona disponível no momento."
                description="Puxe a tela para baixo para atualizar."
              />
            )
          ) : (
            feedRides.map((ride) => (
              <RideCard
                key={ride.id}
                driverName={ride.driverName}
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
            <LoadingState />
          ) : requestsError ? (
            <ErrorState message={requestsError} onRetry={refetchRequests} />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={Ticket}
              message="Você ainda não solicitou nenhuma carona."
              description="As caronas que você solicitar aparecem aqui."
            />
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
