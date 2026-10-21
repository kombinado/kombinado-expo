import { api } from "@/services/api";
import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { ensureApiSuccess, getErrorMessage } from "@/src/hooks/apiHookUtils";
import type { UserProfileResponseDto } from "@/src/hooks/apiTypes";
import { useAuth } from "@/src/hooks/useAuth";
import { type AppProfile, useProfile } from "@/src/hooks/useProfile";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
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
  const { profile, isLoading, error, refetch } = useProfile();

  // Hidden tabs stay mounted: refetch on later visits so the form drops unsaved edits
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  // Inside tabs, the Android back button would go to Home
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          router.navigate("/profile");
          return true;
        },
      );
      return () => subscription.remove();
    }, [router]),
  );

  return (
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
          onPress={() => router.navigate("/profile")}
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
          Atualize suas informações pessoais e, se você for motorista, os dados
          do seu veículo.
        </Text>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <EditProfileForm profile={profile} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// useProfile fills missing fields with display text, which must not become input values
function toInitialValues(profile: AppProfile) {
  return {
    name: profile.name === "Usuário Kombinado" ? "" : profile.name,
    whatsApp:
      profile.whatsApp === "WhatsApp não cadastrado" ? "" : profile.whatsApp,
    course: profile.course === "Curso não informado" ? "" : profile.course,
    vehicleModel: profile.vehicleModel ?? "",
    vehicleColor: profile.vehicleColor ?? "",
    vehiclePlate: profile.vehiclePlate ?? "",
    vehicleTotalSeats:
      profile.vehicleTotalSeats != null
        ? String(profile.vehicleTotalSeats)
        : "",
  };
}

function EditProfileForm({ profile }: { profile: AppProfile }) {
  const router = useRouter();
  const { updateUser } = useAuth();

  const initialValues = toInitialValues(profile);
  const [name, setName] = useState(initialValues.name);
  const [whatsApp, setWhatsApp] = useState(initialValues.whatsApp);
  const [course, setCourse] = useState(initialValues.course);

  const [vehicleModel, setVehicleModel] = useState(initialValues.vehicleModel);
  const [vehicleColor, setVehicleColor] = useState(initialValues.vehicleColor);
  const [vehiclePlate, setVehiclePlate] = useState(initialValues.vehiclePlate);
  const [vehicleTotalSeats, setVehicleTotalSeats] = useState(
    initialValues.vehicleTotalSeats,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    const cleanWhatsApp = whatsApp.replace(/\D/g, "");
    const cleanPlate = vehiclePlate.trim().toUpperCase().replace(/-/g, "");
    setErrorMessage(null);

    if (!name.trim() || !course.trim()) {
      setErrorMessage("Preencha seu nome e curso.");
      return;
    }

    if (!/^\d{10,11}$/.test(cleanWhatsApp)) {
      setErrorMessage(
        "Informe um WhatsApp com DDD, contendo 10 ou 11 números.",
      );
      return;
    }

    const perfilData: Record<string, unknown> = {
      name: name.trim(),
      whatsApp: cleanWhatsApp,
      course: course.trim(),
    };

    if (profile.isDriver) {
      const seats = Number(vehicleTotalSeats);

      if (
        !vehicleModel.trim() ||
        !vehicleColor.trim() ||
        !cleanPlate ||
        (!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(cleanPlate) &&
          !/^[A-Z]{3}\d{4}$/.test(cleanPlate))
      ) {
        setErrorMessage(
          "Confira o modelo, a cor e a placa do veículo (formato ABC1234 ou ABC1D23).",
        );
        return;
      }

      if (
        vehicleTotalSeats.trim() === "" ||
        !Number.isInteger(seats) ||
        seats < 1 ||
        seats > 8
      ) {
        setErrorMessage(
          "A quantidade de lugares deve ser um número inteiro entre 1 e 8.",
        );
        return;
      }

      Object.assign(perfilData, {
        vehicleModel: vehicleModel.trim(),
        vehicleColor: vehicleColor.trim(),
        vehiclePlate: cleanPlate,
        vehicleTotalSeats: seats,
      });
    }

    try {
      setIsSaving(true);

      const response = await api.put<UserProfileResponseDto>(
        "/api/users/profile",
        perfilData,
      );
      const updatedProfile = ensureApiSuccess(
        response,
        "Não foi possível atualizar seu perfil. Tente novamente.",
      );

      // Changing the auth user makes every useProfile refetch (profile, driver, header)
      await updateUser({
        name: updatedProfile.name,
        isDriver: updatedProfile.isDriver,
      });

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.navigate("/profile");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Não foi possível atualizar seu perfil. Tente novamente.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <Text className="mb-4 text-lg font-bold text-[#040F0F]">
          Informações pessoais
        </Text>

        <Text className="mb-2 font-semibold text-[#040F0F]">Nome completo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome completo"
          maxLength={100}
          autoCapitalize="words"
          className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
          placeholderTextColor="#888888"
        />

        <Text className="mb-2 font-semibold text-[#040F0F]">WhatsApp</Text>
        <TextInput
          value={whatsApp}
          onChangeText={setWhatsApp}
          placeholder="DDD + número"
          keyboardType="phone-pad"
          className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
          placeholderTextColor="#888888"
        />

        <Text className="mb-2 font-semibold text-[#040F0F]">Curso</Text>
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

          <Text className="mb-2 font-semibold text-[#040F0F]">Modelo</Text>
          <TextInput
            value={vehicleModel}
            onChangeText={setVehicleModel}
            placeholder="Ex.: Honda Civic"
            maxLength={50}
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
          />

          <Text className="mb-2 font-semibold text-[#040F0F]">Cor</Text>
          <TextInput
            value={vehicleColor}
            onChangeText={setVehicleColor}
            placeholder="Ex.: Prata"
            maxLength={30}
            className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#040F0F]"
            placeholderTextColor="#888888"
          />

          <Text className="mb-2 font-semibold text-[#040F0F]">Placa</Text>
          <TextInput
            value={vehiclePlate}
            onChangeText={(value) => setVehiclePlate(value.toUpperCase())}
            placeholder="Ex.: ABC1D23"
            // Allows a hyphen (ABC-1234), removed before sending
            maxLength={8}
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

      <ErrorBanner message={errorMessage} className="mb-3" />

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        className={`mt-2 items-center justify-center rounded-xl p-4 ${
          isSaving ? "bg-gray-400" : "bg-[#E84855]"
        }`}
      >
        <Text className="font-bold text-white">
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Text>
      </Pressable>
    </>
  );
}
