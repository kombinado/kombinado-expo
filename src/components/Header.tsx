import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 1. Criamos a "tomada" do componente. Ele agora exige receber um primeiro nome.
export interface HeaderProps {
  firstName: string;
}

// 2. Extraímos o firstName de dentro das chaves (desestruturação)
export function Header({ firstName }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 16 }}
      className="bg-[#E84855] px-5 pb-4 flex-row gap-3 items-center"
    >
      <Image
        source={require("../../assets/images/kombi-auth-vector-image.svg")}
        style={{ width: 64, height: 32 }}
        contentFit="contain"
      />

      <View>
        {/* 3. Injetamos a variável usando as chaves no JSX */}
        <Text className="text-red-100 font-bold text-xs">Olá, {firstName}</Text>
        <Text className="text-white text-xl font-black">
          Bem-vindo de volta!
        </Text>
      </View>
    </View>
  );
}
