import { CreateRideModal } from "@/src/components/feature/CreateRideModal";
import { DriverRideCard } from "@/src/components/feature/DriverRideCard";
import { RequestsModal } from "@/src/components/feature/RequestsModal";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
  formatRideDate,
  formatRideTime,
  type RideFormData,
} from "@/src/hooks/apiTypes";
import { useCreateRide } from "@/src/hooks/useCreateRide";
import { useDriverRideRequests } from "@/src/hooks/useDriverRideRequests";
import { useDriverRides } from "@/src/hooks/useDriverRides";
import { useProfile } from "@/src/hooks/useProfile";
import { CarFront, Plus } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, View, RefreshControl } from "react-native";

export default function Driver() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const {
    createRide,
    isLoading: isCreatingRide,
    error: createError,
    clearError: clearCreateError,
  } = useCreateRide();
  const { profile } = useProfile();
  const {
    activeRides,
    isLoading: isRidesLoading,
    error: ridesError,
    actionError: cancelError,
    cancelRide,
    cancelingRideId,
    refetch: refetchRides,
  } = useDriverRides();

  const {
    requests,
    isLoading: isRequestsLoading,
    error: requestsError,
    actionError: respondError,
    respondToRequest,
    respondingRequestId,
    refetch: refetchRequests,
  } = useDriverRideRequests(selectedRideId);

  const openCreateModal = () => {
    clearCreateError();
    setIsCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    clearCreateError();
    setIsCreateModalVisible(false);
  };

  // Retorna false em caso de erro para o modal continuar aberto, com os dados e a mensagem da API
  const handleCreateRide = async (data: RideFormData) => {
    const success = await createRide(data);
    if (!success) return false;

    refetchRides();
    return true;
  };

  const handleCancelRide = (rideId: string) => {
    Alert.alert(
      "Cancelar Carona",
      "Tem certeza que deseja cancelar esta carona? Todas as solicitações serão canceladas.",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          // Em caso de erro, a mensagem da API aparece no banner acima da lista
          onPress: () => cancelRide(rideId),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#FAF9F9]">
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRidesLoading}
            onRefresh={refetchRides}
            colors={["#E84855"]}
            tintColor="#E84855"
          />
        }
      >
        <ErrorBanner message={cancelError} className="mb-4" />

        {isRidesLoading ? (
          <LoadingState />
        ) : ridesError ? (
          <ErrorState message={ridesError} onRetry={refetchRides} />
        ) : activeRides.length === 0 ? (
          <EmptyState
            icon={CarFront}
            message="Você ainda não ofereceu nenhuma carona ativa."
            description="Toque no botão + para oferecer uma carona."
          />
        ) : (
          activeRides.map((ride) => (
            <DriverRideCard
              key={ride.id}
              date={formatRideDate(ride.departureTime)}
              time={formatRideTime(ride.departureTime)}
              origin={ride.origin}
              destination={ride.destination}
              occupiedSpots={ride.totalSeats - ride.availableSeats}
              totalSpots={ride.totalSeats}
              onCancelRide={() => handleCancelRide(ride.id)}
              onViewRequests={() => setSelectedRideId(ride.id)}
              isCancelling={cancelingRideId === ride.id}
              hasPendingRequests={ride.pendingRequestsCount ? ride.pendingRequestsCount > 0 : false} 
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={openCreateModal}
        className="absolute right-6 bottom-6 w-16 h-16 bg-black rounded-full items-center justify-center shadow-lg shadow-black/40 active:scale-90 active:bg-black/70 transition-all z-10"
        accessibilityRole="button"
        accessibilityLabel="Criar nova carona"
      >
        <Plus size={32} color="#FFF" strokeWidth={2.5} />
      </Pressable>

      <RequestsModal
        isVisible={selectedRideId !== null}
        onClose={() => setSelectedRideId(null)}
        requests={requests}
        onAccept={async (id) => {
          await respondToRequest(id, true);
          refetchRides();
        }}
        onReject={(id) => respondToRequest(id, false)}
        isLoading={isRequestsLoading}
        loadErrorMessage={requestsError}
        onRetry={refetchRequests}
        errorMessage={respondError}
        respondingRequestId={respondingRequestId}
      />

      <CreateRideModal
        isVisible={isCreateModalVisible}
        onClose={closeCreateModal}
        onSubmit={handleCreateRide}
        isSubmitting={isCreatingRide}
        errorMessage={createError}
        // Sem capacidade cadastrada (motoristas antigos), o modal usa o limite da API (8)
        maxSeats={profile.vehicleTotalSeats ?? undefined}
      />
    </View>
  );
}
