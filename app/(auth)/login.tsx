import { ScreenWrapper } from "@/components/ScreenWraper";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [isDriver, setIsDriver] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <ScreenWrapper>
      <SafeAreaView className="flex-1 bg-[#E84855]">
        <KeyboardAvoidingView
          behavior="padding"
          className="justify-center px-8 gap-y-12"
        >
          <View className="items-center">
            <Image
              source={require("../../assets/images/kombi-auth-vector-image.svg")}
              style={{ width: 200, height: 100 }}
              contentFit="contain"
            />
          </View>

          {/* Formulário Acessível */}
          <View className="bg-[#FAF9F9] flex-col rounded-[12px] py-[40px] px-[20px] gap-y-8">
            <View className="gap-4">
              <Text className="text-3xl text-wrap font-bold text-[#040F0F] ">
                Bem-vindo à comunidade
              </Text>
              <Text className="text-lg text-wrap text-[#040F0F] ">
                Acesse sua conta institucional para a encontrar caronas e
                colegas.
              </Text>
            </View>

            <View className="flex-col gap-y-5">
              <TextInput
                className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                placeholder="Email"
                placeholderTextColor="#FAF9F9"
                keyboardType="email-address"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Campo de e-mail institucional"
                accessibilityHint="Digite seu e-mail do IFTM para acessar o aplicativo"
              />

              <TextInput
                className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                placeholder="Senha"
                placeholderTextColor="#FAF9F9"
                keyboardType="default"
                secureTextEntry={true}
                autoCapitalize="words"
                accessible={true}
                accessibilityLabel="Campo de Nome Completo"
                accessibilityHint="Digite seu Nome Completo para acessar o aplicativo"
              />
            </View>

            {/* Botão Principal Gamificado */}
            <Pressable
              className="mt-4 w-full bg-[#040F0F] py-5 rounded-2xl items-center shadow-md active:bg-[#040F0F]/70 active:scale-95"
              onPress={() => console.log("Partiu IFTM!")}
              // Acessibilidade do Botão
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Botão Entrar"
              accessibilityHint="Toque para fazer login e buscar caronas"
            >
              <Text className="text-white text-xl font-extrabold tracking-widest">
                Cadastrar
              </Text>
            </Pressable>
          </View>

          <View className="flex-row self-center">
            <Text className="mr-1  text-[#FAF9F9]">Já possui uma conta?</Text>
            <Text className="text-[#FAF9F9] font-bold">Entrar</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
