import { RideCard } from "@/src/components/feature/RideCard";
import { SearchBar } from "@/src/components/feature/SearchBar";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { ToggleButton } from "@/src/components/ui/ToggleButton";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
  const [isToRequest, setisToRequest] = useState(false);
  const [destiny, setDestiny] = useState("");

  return (
    <ScreenWrapper>
      <View className="mb-10">
        <Text className="text-2xl font-bold">Caronas Disponíveis</Text>
      </View>

      <View className="mb-10">
        <ToggleButton value={isToRequest} onToggle={setisToRequest} />
      </View>

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
    </ScreenWrapper>
  );
}
