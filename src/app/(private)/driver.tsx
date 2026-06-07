import { Plus } from "lucide-react-native"; // <-- 1. Importação do Ícone
import { Pressable, ScrollView, View } from "react-native"; // <-- Importe o Pressable

export default function Driver() {
  return (
    <View className="flex-1 bg-[#FAF9F9]">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* <DriverRideCard
          date="Amanhã"
          time="07h30"
          origin="Terminal Leste"
          destination="Campus IFTM"
          occupiedSpots={occupiedSpotsCount}
          totalSpots={4}
          onCancelRide={() => console.log("Carona cancelada")}
          onViewRequests={() => setIsModalVisible(true)}
        /> */}
      </ScrollView>

      {/* 2. BOTÃO FLUTUANTE (FAB) */}
      {/* Absolute tira o botão do fluxo, right-6 e bottom-6 fixam ele no canto */}
      <Pressable
        // onPress={() => setIsCreateModalVisible(true)}
        className="absolute right-6 bottom-6 w-16 h-16 bg-black rounded-full items-center justify-center shadow-lg shadow-black/40 active:scale-90 active:bg-black/70 transition-all z-10"
        accessibilityRole="button"
        accessibilityLabel="Criar nova carona"
      >
        <Plus size={32} color="#FFF" strokeWidth={2.5} />
      </Pressable>

      {/* <RequestsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        requests={requests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onRemoveAccepted={handleRemoveAcceptedRequest}
      /> */}

      {/* <CreateRideModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateRide}
      /> */}
    </View>
  );
}
