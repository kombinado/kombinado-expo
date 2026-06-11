import { api } from "@/services/api";
import type { RideResponseDto } from "@/src/hooks/apiTypes";
import {
  ensureApiCommandSuccess,
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import { useCallback, useEffect, useState } from "react";

export function useDriverRides() {
  const [rides, setRides] = useState<RideResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingRideId, setCancelingRideId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadRides = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<RideResponseDto[]>(
        "/api/Rides/me/driving",
      );
      const data = ensureApiSuccess(
        response,
        "Não foi possível carregar suas caronas.",
      );
      setRides(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível carregar suas caronas.",
      );
      setError(message);
      setRides([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelRide = useCallback(async (rideId: string) => {
    setCancelingRideId(rideId);
    setActionError(null);

    try {
      const response = await api.patch<string>(`/api/Rides/${rideId}/cancel`);
      ensureApiCommandSuccess(response, "Não foi possível cancelar a carona.");

      setRides((current) =>
        current.map((ride) =>
          ride.id === rideId ? { ...ride, status: "Cancelada" } : ride,
        ),
      );
      return true;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível cancelar a carona.",
      );
      setActionError(message);
      return false;
    } finally {
      setCancelingRideId(null);
    }
  }, []);

  useEffect(() => {
    loadRides();
  }, [loadRides]);

  return {
    rides,
    activeRides: rides.filter((ride) => ride.status !== "Cancelada"),
    isLoading,
    error,
    actionError,
    cancelRide,
    cancelingRideId,
    refetch: loadRides,
  };
}
