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

      <SearchBar
        value={destiny}
        placeholder="Pra onde vamos?"
        onChangeText={setDestiny}
      />
    </ScreenWrapper>
  );
}
