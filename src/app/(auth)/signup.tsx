import { useAuth } from "@/hooks/useAuth";
import { ScreenWrapper } from "@/src/components/ScreenWraper";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [isDriver, setIsDriver] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");

  // Campos exclusivos do motorista
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();

  const handleSignup = async () => {
    // Validações básicas obrigatórias
    if (!name || !email || !whatsApp || !course || !password) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Validações adicionais para motorista
    if (isDriver && (!vehicleModel || !vehicleColor || !vehiclePlate)) {
      setErrorMessage("Por favor, preencha todas as informações do veículo!");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const payload = {
      name,
      email,
      password,
      whatsApp,
      course,
      isDriver,
      ...(isDriver
        ? {
            vehicleModel,
            vehicleColor,
            vehiclePlate,
          }
        : {}),
    };

    try {
      await signUp(payload);
      // Redireciona para login com o parâmetro de sucesso no cadastro
      router.replace({
        pathname: "/login",
        params: { successSignup: "true" },
      });
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Erro ao realizar cadastro. Verifique os dados inseridos.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView className="flex-1 bg-[#E84855]">
        <KeyboardAvoidingView behavior="padding" className="flex-1 px-8 py-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: 24, paddingBottom: 40 }}
          >
            <View className="items-center mt-2">
              <Image
                source={require("@/assets/images/kombi-auth-vector-image.svg")}
                style={{ width: 200, height: 100 }}
                contentFit="contain"
              />
            </View>

            {/* Alternador de Perfil */}
            <View className="flex-row w-full h-12 bg-white rounded-xl overflow-hidden p-1">
              <Pressable
                onPress={() => !isSubmitting && setIsDriver(false)}
                className={`w-1/2 h-full items-center justify-center rounded-lg ${
                  !isDriver ? "bg-[#E84855]" : "bg-transparent"
                } `}
              >
                <Text
                  className={`font-bold text-base ${
                    !isDriver ? "text-white" : "text-[#E84855]"
                  }`}
                >
                  Passageiro
                </Text>
              </Pressable>
              <Pressable
                onPress={() => !isSubmitting && setIsDriver(true)}
                className={`w-1/2 h-full items-center justify-center rounded-lg ${
                  isDriver ? "bg-[#E84855]" : "bg-transparent"
                } `}
              >
                <Text
                  className={`font-bold text-base ${
                    isDriver ? "text-white" : "text-[#E84855]"
                  }`}
                >
                  Motorista
                </Text>
              </Pressable>
            </View>

            {/* Formulário */}
            <View className="bg-[#FAF9F9] flex-col rounded-[12px] py-[30px] px-[20px] gap-y-6 shadow-lg">
              <View className="gap-2">
                <Text className="text-2xl text-wrap font-bold text-[#040F0F] ">
                  Participe do Kombinado
                </Text>
                <Text className="text-base text-wrap text-[#040F0F] ">
                  Tenha acesso à maior comunidade universitária de caronas.
                </Text>
              </View>

              {/* Banner de Erro */}
              {errorMessage ? (
                <View className="bg-rose-100 border border-rose-400 p-4 rounded-xl">
                  <Text className="text-rose-800 font-bold text-center text-sm">
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              {/* Campos Gerais */}
              <View className="flex-col gap-y-4">
                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Nome Completo"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#FAF9F9"
                  keyboardType="default"
                  autoCapitalize="words"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de Nome Completo"
                />

                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Email institucional"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#FAF9F9"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de e-mail institucional"
                />

                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="WhatsApp (com DDD)"
                  value={whatsApp}
                  onChangeText={setWhatsApp}
                  placeholderTextColor="#FAF9F9"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de WhatsApp"
                />

                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Curso"
                  value={course}
                  onChangeText={setCourse}
                  placeholderTextColor="#FAF9F9"
                  keyboardType="default"
                  autoCapitalize="words"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de Curso"
                />

                <TextInput
                  className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#FAF9F9"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de Senha"
                />
              </View>

              {/* Se for motorista, exibe os campos do veículo */}
              {isDriver && (
                <View className="flex-col gap-y-4 border-t border-gray-200 pt-4">
                  <Text className="text-center font-bold text-[#E84855] text-base uppercase tracking-wider">
                    Informações do Veículo
                  </Text>

                  <TextInput
                    className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                    placeholder="Modelo do Veículo"
                    value={vehicleModel}
                    onChangeText={setVehicleModel}
                    placeholderTextColor="#FAF9F9"
                    keyboardType="default"
                    autoCapitalize="words"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Modelo do carro"
                  />

                  <TextInput
                    className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                    placeholder="Cor"
                    value={vehicleColor}
                    onChangeText={setVehicleColor}
                    placeholderTextColor="#FAF9F9"
                    keyboardType="default"
                    autoCapitalize="words"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Cor do carro"
                  />

                  <TextInput
                    className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                    placeholder="Placa"
                    value={vehiclePlate}
                    onChangeText={setVehiclePlate}
                    placeholderTextColor="#FAF9F9"
                    keyboardType="default"
                    autoCapitalize="characters"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Placa do carro"
                  />
                </View>
              )}

              {/* Botão de Envio */}
              <Pressable
                className={`mt-4 w-full bg-[#040F0F] py-5 rounded-2xl items-center shadow-md active:bg-[#040F0F]/70 active:scale-95 ${
                  isSubmitting ? "opacity-60" : ""
                }`}
                onPress={handleSignup}
                disabled={isSubmitting}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Botão Cadastrar"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FAF9F9" />
                ) : (
                  <Text className="text-white text-xl font-extrabold tracking-widest">
                    Cadastrar
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="flex-row self-center">
              <Text className="mr-1 text-[#FAF9F9]">Já possui uma conta?</Text>
              <Pressable
                onPress={() => router.push("/login")}
                disabled={isSubmitting}
              >
                <Text className="text-[#FAF9F9] font-bold">Entrar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
