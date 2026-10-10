import { CreateRideModal } from "@/src/components/feature/CreateRideModal";
import { DriverRideCard } from "@/src/components/feature/DriverRideCard";
import { RequestsModal } from "@/src/components/feature/RequestsModal";
import {
  formatRideDate,
  formatRideTime,
  type RideFormData,
} from "@/src/hooks/apiTypes";
import { useCreateRide } from "@/src/hooks/useCreateRide";
import { useDriverRideRequests } from "@/src/hooks/useDriverRideRequests";
import { useDriverRides } from "@/src/hooks/useDriverRides";
import { useProfile } from "@/src/hooks/useProfile";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View, RefreshControl } from "react-native";

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
    cancelRide,
    cancelingRideId,
    refetch: refetchRides,
  } = useDriverRides();

  const {
    requests,
    isLoading: isRequestsLoading,
    error: requestsError,
    actionError,
    respondToRequest,
    respondingRequestId,
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
          onPress: async () => {
            const success = await cancelRide(rideId);
            if (!success) {
              Alert.alert("Erro", "Não foi possível cancelar a carona.");
            }
          },
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
        {isRidesLoading ? (
          <ActivityIndicator color="#E84855" size="large" />
        ) : ridesError ? (
          <View className="items-center mt-10">
            <Text className="text-rose-700 font-bold text-center mb-4">{ridesError}</Text>
            <Pressable onPress={() => refetchRides()} className="bg-[#E84855] px-6 py-3 rounded-full">
              <Text className="text-white font-bold">Tentar Novamente</Text>
            </Pressable>
          </View>
        ) : activeRides.length === 0 ? (
          <View className="items-center mt-20">
            <Text className="text-slate-500 font-semibold text-lg text-center">
              Você ainda não ofereceu nenhuma carona ativa.
            </Text>
          </View>
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
        errorMessage={requestsError || actionError}
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
