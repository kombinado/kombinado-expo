import { RequestedRideCard } from "@/src/components/feature/RequestedRideCard";
import { RideCard } from "@/src/components/feature/RideCard";
import { SearchBar } from "@/src/components/feature/SearchBar";
import { SuggestStopModal } from "@/src/components/feature/SuggestStopModal";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { ToggleButton } from "@/src/components/ui/ToggleButton";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
  const [isToRequest, setisToRequest] = useState(false);
  const [destiny, setDestiny] = useState("");

  // Estado para controlar a visibilidade do modal
  const [isSuggestModalVisible, setIsSuggestModalVisible] = useState(false);

  // Função que recebe a string digitada no modal
  const handleSuggestStop = (suggestion: string) => {
    console.log("O passageiro sugeriu a parada:", suggestion);
    // Aqui você enviará a sugestão para a sua API
    // api.post(`/rides/suggest-stop/${rideId}`, { stop: suggestion });
  };

  return (
    <ScreenWrapper>
      <View className="mb-10">
        <Text className="text-2xl font-bold">Caronas Disponíveis</Text>
      </View>

      <View className="mb-10">
        <ToggleButton
          value={isToRequest}
          onToggle={setisToRequest}
          labelLeft="Solicitar"
          labelRight="Solicitadas"
        />
      </View>

      {isToRequest && (
        <View>
          <View className="mb-10">
            <SearchBar
              value={destiny}
              placeholder="Pra onde vamos?"
              onChangeText={setDestiny}
            />
          </View>

          <RideCard
            driverName="Jose Macciotti"
            carModel="Kombi"
            carColor="Branco"
            carPlate="NFK8B93"
            date="27/05"
            time="22h"
            origin="Campus IFTM"
            destination="Terminal Oeste"
            availableSpots={3}
            onRequestRide={() => console.log("Carona solicitada")}
          />
        </View>
      )}

      {!isToRequest && (
        <RequestedRideCard
          driverName="Lucas Emmanuel"
          carModel="Toyota Corolla"
          carColor="Cinza"
          carPlate="GSK4715"
          date="01/06"
          time="21h"
          origin="Campus IFTM"
          destination="Terminal Oeste"
          status="pendente"
          onCancelRequest={() => console.log("Cancelando")}
          onSuggestStopPress={() => setIsSuggestModalVisible(true)}
          onWhatsAppPress={() => console.log("Indo para o WhatsApp")}
        />
      )}

      <SuggestStopModal
        isVisible={isSuggestModalVisible}
        onClose={() => setIsSuggestModalVisible(false)}
        onSubmit={handleSuggestStop}
      />
    </ScreenWrapper>
  );
}
