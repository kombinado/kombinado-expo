import { api } from "@/services/api";
import type {
  CreateRideRequestDto,
  RideRequestResponseDto,
  RideResponseDto,
} from "@/src/hooks/apiTypes";
import {
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useAvailableRides(searchTerm = "") {
  const [rides, setRides] = useState<RideResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingRideId, setRequestingRideId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const loadRides = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRequestError(null);

    try {
      const response = await api.get<RideResponseDto[]>("/api/Rides");
      const data = ensureApiSuccess(
        response,
        "Não foi possível carregar as caronas disponíveis.",
      );
      setRides(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível carregar as caronas disponíveis.",
      );
      setError(message);
      setRides([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestRide = useCallback(
    async (rideId: string, meetingPointSuggestion?: string) => {
      setRequestingRideId(rideId);
      setRequestError(null);

      try {
        const payload: CreateRideRequestDto = {
          meetingPointSuggestion: meetingPointSuggestion?.trim() || null,
        };
        const response = await api.post<RideRequestResponseDto>(
          `/api/requests/ride/${rideId}`,
          payload,
        );
        const request = ensureApiSuccess(
          response,
          "Não foi possível solicitar a carona.",
        );

        await loadRides();
        return request;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível solicitar a carona.",
        );
        setRequestError(message);
        return null;
      } finally {
        setRequestingRideId(null);
      }
    },
    [loadRides],
  );

  useEffect(() => {
    loadRides();
  }, [loadRides]);

  const filteredRides = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rides;

    return rides.filter((ride) =>
      `${ride.origin} ${ride.destination}`.toLowerCase().includes(term),
    );
  }, [rides, searchTerm]);

  return {
    rides,
    filteredRides,
    isLoading,
    error,
    requestRide,
    requestingRideId,
    requestError,
    refetch: loadRides,
  };
}
