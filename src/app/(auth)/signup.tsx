import { AuthScreenWrapper } from "@/src/components/AuthScreenWraper";
import { useAuth } from "@/src/hooks/useAuth";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [isDriver, setIsDriver] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Campos exclusivos do motorista
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();

  const formatWhatsApp = (text: string) => {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (text: string) => {
    setWhatsApp(formatWhatsApp(text));
  };

  const handleSignup = async () => {
    // Validações básicas obrigatórias
    if (!name || !email || !whatsApp || !course || !password) {
      const msg = "Por favor, preencha todos os campos obrigatórios!";
      setErrorMessage(msg);
      Alert.alert("Atenção", msg);
      return;
    }

    // Validações adicionais para motorista
    if (isDriver && (!vehicleModel || !vehicleColor || !vehiclePlate)) {
      const msg = "Por favor, preencha todas as informações do veículo!";
      setErrorMessage(msg);
      Alert.alert("Atenção", msg);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const unmaskedWhatsApp = whatsApp.replace(/\D/g, "");

    const payload = {
      name,
      email,
      password,
      whatsApp: unmaskedWhatsApp,
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
      const msg = err.message || "Erro ao realizar cadastro. Verifique os dados inseridos.";
      setErrorMessage(msg);
      Alert.alert("Ops!", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full bg-[#F0F0F0] font-semibold text-[#040F0F] px-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#E84855] focus:bg-white text-lg";

  return (
    <AuthScreenWrapper>
      <SafeAreaView className="flex-1 bg-[#E84855]">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          className="flex-1 px-8 py-4"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: 24, paddingBottom: 40 }}
            bounces={false}
            overScrollMode="never"
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
                  className={inputClassName}
                  placeholder="Nome Completo"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#A1A1AA"
                  keyboardType="default"
                  autoCapitalize="words"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de Nome Completo"
                />

                <TextInput
                  className={inputClassName}
                  placeholder="Email institucional"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#A1A1AA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de e-mail institucional"
                />

                <TextInput
                  className={inputClassName}
                  placeholder="WhatsApp (com DDD)"
                  value={whatsApp}
                  onChangeText={handleWhatsAppChange}
                  placeholderTextColor="#A1A1AA"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de WhatsApp"
                />

                <TextInput
                  className={inputClassName}
                  placeholder="Curso"
                  value={course}
                  onChangeText={setCourse}
                  placeholderTextColor="#A1A1AA"
                  keyboardType="default"
                  autoCapitalize="words"
                  editable={!isSubmitting}
                  accessible={true}
                  accessibilityLabel="Campo de Curso"
                />

                <View className="relative w-full justify-center">
                  <TextInput
                    className={inputClassName + " pr-12"}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Campo de Senha"
                  />
                  <Pressable
                    className="absolute right-4 z-10"
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showPassword ? (
                      <EyeOff size={24} color="#A1A1AA" />
                    ) : (
                      <Eye size={24} color="#A1A1AA" />
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Se for motorista, exibe os campos do veículo */}
              {isDriver && (
                <View className="flex-col gap-y-4 border-t border-gray-200 pt-4">
                  <Text className="text-center font-bold text-[#E84855] text-base uppercase tracking-wider">
                    Informações do Veículo
                  </Text>

                  <TextInput
                    className={inputClassName}
                    placeholder="Modelo do Veículo"
                    value={vehicleModel}
                    onChangeText={setVehicleModel}
                    placeholderTextColor="#A1A1AA"
                    keyboardType="default"
                    autoCapitalize="words"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Modelo do carro"
                  />

                  <TextInput
                    className={inputClassName}
                    placeholder="Cor"
                    value={vehicleColor}
                    onChangeText={setVehicleColor}
                    placeholderTextColor="#A1A1AA"
                    keyboardType="default"
                    autoCapitalize="words"
                    editable={!isSubmitting}
                    accessible={true}
                    accessibilityLabel="Cor do carro"
                  />

                  <TextInput
                    className={inputClassName}
                    placeholder="Placa"
                    value={vehiclePlate}
                    onChangeText={setVehiclePlate}
                    placeholderTextColor="#A1A1AA"
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
    </AuthScreenWrapper>
  );
}
