import {
    CreateRideModal,
    RideFormData,
} from "@/src/components/feature/CreateRideModal";
import { DriverRideCard } from "@/src/components/feature/DriverRideCard";
import {
    RequestsModal,
    RideRequest,
} from "@/src/components/feature/RequestsModal";
import { Plus } from "lucide-react-native"; // <-- 1. Importação do Ícone
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native"; // <-- Importe o Pressable

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

  const handleRemoveAcceptedRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const occupiedSpotsCount = requests.filter(
    (req) => req.status === "aceita",
  ).length;

  const [isRequestsModalVisible, setIsRequestsModalVisible] = useState(false);
  // 2. Novo estado para o modal de criação
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // ... (mantenha os estados e funções de requests que já fizemos)

  // 3. Função que recebe os dados do formulário
  const handleCreateRide = (data: RideFormData) => {
    console.log("Nova carona criada:", data);
    // Aqui no futuro você fará o POST para a API
    // api.post("/rides", data)
  };

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

      {/* 2. BOTÃO FLUTUANTE (FAB) */}
      {/* Absolute tira o botão do fluxo, right-6 e bottom-6 fixam ele no canto */}
      <Pressable
        onPress={() => setIsCreateModalVisible(true)}
        className="absolute right-6 bottom-6 w-16 h-16 bg-black rounded-full items-center justify-center shadow-lg shadow-black/40 active:scale-90 active:bg-black/70 transition-all z-10"
        accessibilityRole="button"
        accessibilityLabel="Criar nova carona"
      >
        <Plus size={32} color="#FFF" strokeWidth={2.5} />
      </Pressable>

      <RequestsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        requests={requests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onRemoveAccepted={handleRemoveAcceptedRequest}
      />

      <CreateRideModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateRide}
      />
    </View>
  );
}
