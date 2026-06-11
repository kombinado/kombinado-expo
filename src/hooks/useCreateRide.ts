import { api } from "@/services/api";
import {
  buildCreateRidePayload,
  type RideFormData,
  type RideResponseDto,
} from "@/src/hooks/apiTypes";
import {
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import { useState } from "react";

interface UseCreateRideOptions {
  onSuccess?: (ride: RideResponseDto) => void | Promise<void>;
}

export function useCreateRide(options: UseCreateRideOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRide = async (data: RideFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = buildCreateRidePayload(data);
      const response = await api.post<RideResponseDto>("/api/Rides", payload);
      const ride = ensureApiSuccess(
        response,
        "Não foi possível criar a carona.",
      );

      await options.onSuccess?.(ride);
      return true;
    } catch (err) {
      console.error("Erro ao criar carona:", err);
      setError(
        getErrorMessage(
          err,
          "Não foi possível criar a carona. Tente novamente.",
        ),
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRide,
    isLoading,
    error,
  };
}
