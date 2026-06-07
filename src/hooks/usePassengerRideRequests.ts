import { api } from "@/services/api";
import type { RideRequestResponseDto } from "@/src/hooks/apiTypes";
import {
  ensureApiCommandSuccess,
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import { useCallback, useEffect, useState } from "react";

export function usePassengerRideRequests() {
  const [requests, setRequests] = useState<RideRequestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingRequestId, setCancelingRequestId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await api.get<RideRequestResponseDto[]>("/api/requests/me");
      const data = ensureApiSuccess(
        response,
        "Não foi possível carregar suas solicitações.",
      );
      setRequests(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível carregar suas solicitações.",
      );
      setError(message);
      setRequests([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelRequest = useCallback(
    async (requestId: string) => {
      setCancelingRequestId(requestId);
      setActionError(null);

      try {
        const response = await api.patch<string>(
          `/api/requests/${requestId}/cancel`,
        );
        ensureApiCommandSuccess(
          response,
          "Não foi possível cancelar a solicitação.",
        );

        setRequests((current) =>
          current.filter((request) => request.id !== requestId),
        );
        return true;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível cancelar a solicitação.",
        );
        setActionError(message);
        return false;
      } finally {
        setCancelingRequestId(null);
      }
    },
    [],
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    isLoading,
    error,
    actionError,
    cancelRequest,
    cancelingRequestId,
    refetch: loadRequests,
  };
}
