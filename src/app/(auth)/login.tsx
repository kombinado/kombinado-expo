import { AuthScreenWrapper } from "@/src/components/AuthScreenWraper";
import { useAuth } from "@/src/hooks/useAuth";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { successSignup } = useLocalSearchParams<{ successSignup?: string }>();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Por favor, preencha e-mail e senha!");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      // A proteção de rotas reativa no app/_layout.tsx se encarrega de redirecionar para /home
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Erro ao tentar fazer login. Verifique suas credenciais.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenWrapper>
      <SafeAreaView className="flex-1 bg-[#E84855]">
        <KeyboardAvoidingView
          behavior="padding"
          className="justify-center px-8 gap-y-12"
        >
          <View className="items-center">
            <Image
              source={require("@/assets/images/kombi-auth-vector-image.svg")}
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
                Acesse sua conta institucional para encontrar caronas e colegas.
              </Text>
            </View>

            {/* Banner de Sucesso (Se vindo de Cadastro) */}
            {successSignup === "true" && (
              <View className="bg-emerald-100 border border-emerald-400 p-4 rounded-xl">
                <Text className="text-emerald-800 font-bold text-center text-sm">
                  Conta cadastrada com sucesso! Faça seu login abaixo.
                </Text>
              </View>
            )}

            {/* Banner de Erro */}
            {errorMessage ? (
              <View className="bg-rose-100 border border-rose-400 p-4 rounded-xl">
                <Text className="text-rose-800 font-bold text-center text-sm">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View className="flex-col gap-y-5">
              <TextInput
                className="w-full bg-[#E84855] font-semibold text-white focus:text-[#040F0F] px-3 py-4 rounded-2xl focus:bg-[#FAF9F9] focus:border-2 focus:border-[#E84855] text-lg"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#FAF9F9"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                accessible={true}
                accessibilityLabel="Campo de e-mail institucional"
                accessibilityHint="Digite seu e-mail do IFTM para acessar o aplicativo"
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
                accessibilityLabel="Campo de senha"
                accessibilityHint="Digite sua senha para acessar o aplicativo"
              />
            </View>

            {/* Botão Principal */}
            <Pressable
              className={`mt-4 w-full bg-[#040F0F] py-5 rounded-2xl items-center shadow-md active:bg-[#040F0F]/70 active:scale-95 ${
                isSubmitting ? "opacity-60" : ""
              }`}
              onPress={handleLogin}
              disabled={isSubmitting}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Botão Entrar"
              accessibilityHint="Toque para fazer login e buscar caronas"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FAF9F9" />
              ) : (
                <Text className="text-white text-xl font-extrabold tracking-widest">
                  Entrar
                </Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row self-center">
            <Text className="mr-1 text-[#FAF9F9]">
              Ainda não possui uma conta?
            </Text>
            <Pressable
              onPress={() => router.push("/signup")}
              disabled={isSubmitting}
            >
              <Text className="text-[#FAF9F9] font-bold">Criar Conta</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthScreenWrapper>
  );
}
