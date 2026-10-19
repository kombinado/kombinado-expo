
import { useProfile } from "@/src/hooks/useProfile";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
  
export default function EditProfile() {
    const router = useRouter();
    const { profile, isLoading } = useProfile();

    const [name, setName] = useState("");
    const [whatsApp, setWhatsApp] = useState("");
    const [course, setCourse] = useState("");


    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleColor, setVehicleColor] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [vehicleTotalSeats, setVehicleTotalSeats] = useState("");

// Estes estados guardam os dados que serão digitados no formulário.


  useEffect(() => {
    if (isLoading) return;

    setName(
      profile.name === "Usuário Kombinado" ? "" : profile.name
    );

    setWhatsApp(
      profile.whatsApp === "WhatsApp não cadastrado"
        ? ""
        : profile.whatsApp
    );

    setCourse(
      profile.course === "Curso não informado" ? "" : profile.course
    );


    setVehicleModel(profile.vehicleModel ?? "");
    setVehicleColor(profile.vehicleColor ?? "");
    setVehiclePlate(profile.vehiclePlate ?? "");
    setVehicleTotalSeats(
    profile.vehicleTotalSeats != null
        ? String(profile.vehicleTotalSeats)
        : ""
    );

  }, [profile, isLoading]);

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
        <Text className="mb-4 text-lg font-bold text-[#040F0F]">
            Informações pessoais
        </Text>

        <Text className="mb-2 font-semibold text-[#040F0F]">
            Nome completo
        </Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome completo"
            maxLength={100}
            autoCapitalize="words"
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
        />

        <Text className="mb-2 font-semibold text-[#040F0F]">
            WhatsApp
        </Text>
        <TextInput
            value={whatsApp}
            onChangeText={setWhatsApp}
            placeholder="DDD + número"
            keyboardType="phone-pad"
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
        />

        <Text className="mb-2 font-semibold text-[#040F0F]">
            Curso
        </Text>
        <TextInput
            value={course}
            onChangeText={setCourse}
            placeholder="Digite seu curso"
            maxLength={100}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
        />
        </View>

        {profile.isDriver && (
        <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Text className="mb-4 text-lg font-bold text-[#040F0F]">
            Dados do veículo
            </Text>

            <Text className="mb-2 font-semibold text-[#040F0F]">
            Modelo
            </Text>
            <TextInput
            value={vehicleModel}
            onChangeText={setVehicleModel}
            placeholder="Ex.: Honda Civic"
            maxLength={50}
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
            />

            <Text className="mb-2 font-semibold text-[#040F0F]">
            Cor
            </Text>
            <TextInput
            value={vehicleColor}
            onChangeText={setVehicleColor}
            placeholder="Ex.: Prata"
            maxLength={30}
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
            />

            <Text className="mb-2 font-semibold text-[#040F0F]">
            Placa
            </Text>
            <TextInput
            value={vehiclePlate}
            onChangeText={(value) =>
                setVehiclePlate(value.toUpperCase())
            }
            placeholder="Ex.: ABC1D23"
            maxLength={7}
            autoCapitalize="characters"
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
            />

            <Text className="mb-2 font-semibold text-[#040F0F]">
            Quantidade de lugares
            </Text>
            <TextInput
            value={vehicleTotalSeats}
            onChangeText={setVehicleTotalSeats}
            placeholder="De 1 a 8"
            keyboardType="number-pad"
            maxLength={1}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
            />
        </View>
        )}

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
