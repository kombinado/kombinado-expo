
import { useProfile } from "@/src/hooks/useProfile";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";


export default function EditProfile() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <>
      <Stack.Screen options={{ title: "Editar perfil" }} />

      <KeyboardAvoidingView
        className="flex-1 bg-[#FAF9F9]"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.replace("./profile")}
            className="mt-4 mb-6 flex-row items-center self-start py-2"
          >
            <ArrowLeft size={22} color="#E84855" />
            <Text className="ml-2 font-semibold text-[#E84855]">
              Voltar ao perfil
            </Text>
          </Pressable>

          <Text className="mb-2 text-2xl font-bold text-[#040F0F]">
            Editar perfil
          </Text>

          <Text className="mb-6 text-base text-gray-600">
            Atualize suas informações pessoais e, se você for motorista,
            os dados do seu veículo.
          </Text>

          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Text className="mb-1 text-lg font-bold text-[#040F0F]">
              Informações pessoais
            </Text>

            <Text className="text-sm text-gray-500">
              Nome, WhatsApp e curso.
            </Text>
          </View>

          {profile.isDriver && (
            <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <Text className="mb-1 text-lg font-bold text-[#040F0F]">
                Dados do veículo
                </Text>

                <Text className="text-sm text-gray-500">
                Modelo, cor, placa e vagas para passageiros.
                </Text>
            </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
