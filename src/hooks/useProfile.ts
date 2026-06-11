import { api } from "@/services/api";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
// Importe o seu cliente de API aqui. Exemplo:
// import { api } from "@/src/services/api";

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
}

export function useProfile() {
  // 1. Pegamos os dados do Auth
  const { user, signOut, isLoading: isAuthLoading } = useAuth();

  // 2. Novos estados para gerenciar a chamada da API
  const [apiData, setApiData] = useState<Partial<AppProfile> | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. O Efeito: Dispara a busca assim que descobrirmos quem é o usuário logado
  useEffect(() => {
    // Se não tiver usuário logado (ou se ainda estiver carregando o Auth), não faz a chamada
    if (!user?.email) return;

    const fetchProfileData = async () => {
      setIsFetchingProfile(true);
      setError(null);

      try {
        // Substitua essa linha pela sua rota real da API.
        const response = await api.get(`/api/auth/me`);
        setApiData(response.data);

      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError("Não foi possível carregar os dados completos do perfil.");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfileData();
  }, [user]); // Re-executa se o usuário trocar de conta

  // 4. O useMemo agora atua como um "Mesclador Seguro" (Safety Net)
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
    };
  }, [user, apiData]);

  return {
    profile,
    signOut,
    // O App está "carregando" se o Auth estiver processando OU se a API estiver buscando
    isLoading: isAuthLoading || isFetchingProfile,
    error,
  };
}
