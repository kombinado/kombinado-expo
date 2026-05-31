import { DriverRideCard } from "@/src/components/feature/DriverRideCard";
import {
    RequestsModal,
    RideRequest,
} from "@/src/components/feature/RequestsModal";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Driver() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [requests, setRequests] = useState<RideRequest[]>([
    { id: "1", name: "Ana Beatriz Ferreira", status: "pendente" },
    { id: "2", name: "Carlos Eduardo", status: "aceita" },
  ]);

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "aceita" } : req)),
    );
  };

  const handleRejectRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  // NOVA FUNÇÃO: Remove o passageiro que já estava aceito
  const handleRemoveAcceptedRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    // No backend: api.delete(`/rides/remove-passenger/${id}`)
  };

  const occupiedSpotsCount = requests.filter(
    (req) => req.status === "aceita",
  ).length;

  return (
    <View className="flex-1 bg-[#FAF9F9]">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <DriverRideCard
          date="Amanhã"
          time="07h30"
          origin="Terminal Leste"
          destination="Campus IFTM"
          occupiedSpots={occupiedSpotsCount}
          totalSpots={4}
          onCancelRide={() => console.log("Carona cancelada")}
          onViewRequests={() => setIsModalVisible(true)}
        />
      </ScrollView>

      <RequestsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        requests={requests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        // Injetando a nova função aqui:
        onRemoveAccepted={handleRemoveAcceptedRequest}
      />
    </View>
  );
}
