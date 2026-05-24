import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [isDriver, setIsDriver] = useState(false);
  return (
    <ScrollView className="flex-1" contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView className="flex p-50 bg-[#E84855]">
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

          <View className="flex-row w-full h-12 bg-white rounded-xl">
            <Pressable
              onPress={() => setIsDriver(!isDriver)}
              className={`w-1/2 h-full items-center justify-center border-2 border-white rounded-xl  ${isDriver ? "bg-white" : "bg-[#E84855]"} `}
            >
              <Text
                className={`bg-transparent font-semibold text-lg ${isDriver ? "text-[#E84855]" : "text-white"}`}
              >
                Passageiro
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsDriver(!isDriver)}
              className={`w-1/2 h-full items-center justify-center border-2 border-white rounded-xl ${isDriver ? "bg-[#E84855]" : "bg-white"} `}
            >
              <Text
                className={`bg-transparent font-semibold text-lg ${isDriver ? "text-white" : "text-[#E84855]"} `}
              >
                Motorista
              </Text>
            </Pressable>
          </View>

          {/* Formulário Acessível */}
          <View className="bg-[#FAF9F9] flex-col rounded-[12px] py-[40px] px-[20px] gap-y-8">
            <View className="gap-4">
              <Text className="text-3xl text-wrap font-bold text-[#040F0F] ">
                Participe agora do Kombinado
              </Text>
              <Text className="text-lg text-wrap text-[#040F0F] ">
                Tenha acesso à maior comunidade universitária de caronas.
              </Text>
            </View>
            <View className="flex-col gap-y-5">
              <TextInput
                className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                placeholder="Nome Completo"
                placeholderTextColor="#FAF9F9"
                keyboardType="name-phone-pad"
                autoCapitalize="words"
                accessible={true}
                accessibilityLabel="Campo de Nome Completo"
                accessibilityHint="Digite seu Nome Completo para acessar o aplicativo"
              />
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
                placeholder="WhatsApp"
                placeholderTextColor="#FAF9F9"
                keyboardType="phone-pad"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Campo de contato WhatsApp"
                accessibilityHint="Digite seu contato do WhatsApp para acessar o aplicativo"
              />

              <TextInput
                className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                placeholder="Curso"
                placeholderTextColor="#FAF9F9"
                keyboardType="default"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Campo de Curso do IFTM"
                accessibilityHint="Digite seu Curso no IFTM para acessar o aplicativo"
              />
            </View>

            {/* Se for motorista */}
            {isDriver && (
              <View className="flex-col justify-center items-center gap-y-5">
                <Text className="text-[#E84855]">informações do veículo</Text>
                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Modelo"
                  placeholderTextColor="#FAF9F9"
                  keyboardType="default"
                  autoCapitalize="words"
                  accessible={true}
                  accessibilityLabel="Campo de Modelo do Veículo"
                  accessibilityHint="Digite o Modelo do Veículo para acessar o aplicativo"
                />
                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Cor"
                  placeholderTextColor="#FAF9F9"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessible={true}
                  accessibilityLabel="Campo de Cor do Veículo"
                  accessibilityHint="Digite a Cor do Veículo para acessar o aplicativo"
                />

                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Placa"
                  placeholderTextColor="#FAF9F9"
                  keyboardType="name-phone-pad"
                  autoCapitalize="none"
                  accessible={true}
                  accessibilityLabel="Campo de "
                  accessibilityHint="Digite a Placa do Veículo para acessar o aplicativo"
                />
              </View>
            )}

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
            <Pressable onPress={() => router.push("/signup")}>
              <Text className="text-[#FAF9F9] font-bold">Entrar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
}
