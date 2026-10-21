import { api } from "@/services/api";
import {
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import type { UserProfileResponseDto } from "@/src/hooks/apiTypes";
import { useAuth } from "@/src/hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface AppProfile {
  name: string;
  firstName: string;
  email: string;
  course: string;
  whatsApp: string;
  isDriver: boolean;
  vehicleModel: string | null;
  vehicleColor: string | null;
  vehiclePlate: string | null;
  // Vagas para passageiros (1 a 8). Nulo para passageiros e motoristas cadastrados antes do campo existir
  vehicleTotalSeats: number | null;
}

const PROFILE_ERROR_MESSAGE = "Não foi possível carregar os dados do seu perfil.";

export function useProfile() {
  // 1. Pegamos os dados do Auth
  const { user, signOut, isLoading: isAuthLoading } = useAuth();

  // 2. Estados da chamada à API
  const [apiData, setApiData] = useState<UserProfileResponseDto | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca o perfil e só altera o estado depois da resposta, por isso pode rodar direto no useEffect
  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get<UserProfileResponseDto>("/api/auth/me");
      const data = ensureApiSuccess(response, PROFILE_ERROR_MESSAGE);
      setApiData(data);
      setError(null);
      return data;
    } catch (err) {
      console.log("Aviso ao buscar perfil:", err);
      setError(getErrorMessage(err, PROFILE_ERROR_MESSAGE));
      return null;
    } finally {
      setIsFetchingProfile(false);
    }
  }, []);

  // Recarrega mostrando o carregamento (pull-to-refresh e "Tentar novamente")
  const refetch = useCallback(() => {
    setIsFetchingProfile(true);
    setError(null);
    return fetchProfile();
  }, [fetchProfile]);

  // 3. Busca o perfil assim que descobrirmos quem é o usuário logado
  useEffect(() => {
    if (!user?.email) return;

    // A regra não acompanha o await: fetchProfile só altera o estado depois da resposta da API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [user, fetchProfile]); // Re-executa se o usuário trocar de conta

  // 4. O useMemo atua como um "Mesclador Seguro" (Safety Net)
  // Ele junta os dados básicos do Auth com os dados ricos da API e calcula o firstName
  const profile = useMemo<AppProfile>(() => {
    const name = apiData?.name || user?.name || "Usuário Kombinado";
    const firstName = name.trim().split(/\s+/)[0] || "Usuário";

    const rawWhatsApp = apiData?.whatsApp || "WhatsApp não cadastrado";
    let formattedWhatsApp = rawWhatsApp;

    if (rawWhatsApp !== "WhatsApp não cadastrado") {
      const digits = rawWhatsApp.replace(/\D/g, "");
      if (digits.length > 7) {
        formattedWhatsApp = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      } else if (digits.length > 2) {
        formattedWhatsApp = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      }
    }

    return {
      name,
      firstName,
      email: apiData?.email || user?.email || "Email não encontrado",
      course: apiData?.course || "Curso não informado",
      whatsApp: formattedWhatsApp,
      isDriver: apiData?.isDriver ?? user?.isDriver ?? false,
      vehicleModel: apiData?.vehicleModel || null,
      vehicleColor: apiData?.vehicleColor || null,
      vehiclePlate: apiData?.vehiclePlate || null,
      vehicleTotalSeats: apiData?.vehicleTotalSeats ?? null,
    };
  }, [user, apiData]);

  return {
    profile,
    signOut,
    // O App está "carregando" se o Auth estiver processando OU se a API estiver buscando
    isLoading: isAuthLoading || isFetchingProfile,
    // Indica se os dados completos da API já chegaram ao menos uma vez
    hasProfileData: apiData !== null,
    error,
    refetch,
  };
}
