import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header() {
  // Pegamos a altura exata da barra de status (varia de iPhone para Android)
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 16 }}
      // 1. Removi o h-16 (Deixa o conteúdo ditar a altura)
      // 2. Adicionei pb-4 (Padding Bottom)
      // 3. Adicionei items-center (Para alinhar a imagem com o texto verticalmente)
      className="bg-[#E84855] px-5 pb-4 flex-row gap-3 items-center"
    >
      <Image
        source={require("../../assets/images/kombi-auth-vector-image.svg")}
        style={{ width: 64, height: 32 }}
        contentFit="contain"
      />

      <View>
        <Text className="text-red-100 font-bold text-xs">Olá, Felipe</Text>
        <Text className="text-white text-xl font-black">
          Bem-vindo de volta!
        </Text>
      </View>
    </View>
  );
}
