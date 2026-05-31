import { DriverRideCard } from "@/src/components/feature/DriverRideCard";
import { ScreenWrapper } from "@/src/components/layout/ScreenWraper";
import { Text, View } from "react-native";

export default function Driver() {
  return (
    <ScreenWrapper>
      <View className="mb-10">
        <Text className="text-2xl font-bold">Gerenciar Caronas</Text>
      </View>

      <DriverRideCard
        date="01/06"
        time="21h30"
        origin="Campus IFTM"
        destination="Terminal Oeste"
        occupiedSpots={2}
        totalSpots={4}
        onCancelRide={() => console.log("Cancelando Carona")}
        onViewRequests={() => console.log("Analisando solicitações")}
      />
    </ScreenWrapper>
  );
}
