import { RideCard } from "@/src/components/feature/RideCard";
import { SearchBar } from "@/src/components/feature/SearchBar";
import { SuggestStopModal } from "@/src/components/feature/SuggestStopModal";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { formatRideDate, formatRideTime } from "@/src/hooks/apiTypes";
import { useAvailableRides } from "@/src/hooks/useAvailableRides";
import { useState } from "react";
import { ActivityIndicator, Text, View, RefreshControl } from "react-native";

export default function Home() {
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

  const openRequestModal = (rideId: string) => {
    setSelectedRideId(rideId);
    setIsSuggestModalVisible(true);
  };

  const handleRequestRide = async (suggestion: string) => {
    if (!selectedRideId) return;

    const request = await requestRide(selectedRideId, suggestion);
    setSelectedRideId(null);

    if (request) {
      // The ride was requested successfully
    }
  };

  return (
    <ScreenWrapper
      refreshControl={
        <RefreshControl
          refreshing={isLoadingRides}
          onRefresh={refetchRides}
          colors={["#E84855"]}
          tintColor="#E84855"
        />
      }
    >
      <View className="mb-10">
        <Text className="text-2xl font-bold">Caronas Disponíveis</Text>
      </View>

      {requestError ? (
        <View className="bg-rose-100 border border-rose-300 p-4 rounded-xl mb-6">
          <Text className="text-rose-700 font-bold text-center">
            {requestError}
          </Text>
        </View>
      ) : null}

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
        ) : filteredRides.length === 0 ? (
          <Text className="text-slate-500 text-center font-semibold">
            Nenhuma carona disponível no momento.
          </Text>
        ) : (
          filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
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
