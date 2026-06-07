import { useMemo } from "react";
import { useAuth } from "@/src/hooks/useAuth";

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

const unavailable = "Não disponível pela API atual";

export function useProfile() {
  const { user, signOut, isLoading } = useAuth();

  const profile = useMemo<AppProfile>(() => {
    const name = user?.name || "Usuário Kombinado";
    const firstName = name.trim().split(/\s+/)[0] || "Usuário";

    return {
      name,
      firstName,
      email: user?.email || unavailable,
      course: unavailable,
      whatsApp: unavailable,
      isDriver: user?.isDriver ?? false,
      vehicleModel: null,
      vehicleColor: null,
      vehiclePlate: null,
    };
  }, [user]);

  return {
    profile,
    signOut,
    isLoading,
  };
}
