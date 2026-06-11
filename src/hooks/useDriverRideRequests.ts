import { api } from "@/services/api";
import type {
  RespondRequestDto,
  RideRequestResponseDto,
} from "@/src/hooks/apiTypes";
import {
  ensureApiCommandSuccess,
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import { useCallback, useEffect, useState } from "react";

export function useDriverRideRequests(rideId: string | null) {
  const [requests, setRequests] = useState<RideRequestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!rideId) {
      setRequests([]);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<RideRequestResponseDto[]>(
        `/api/requests/ride/${rideId}`,
      );
      const data = ensureApiSuccess(
        response,
        "Não foi possível carregar as solicitações dessa carona.",
      );
      setRequests(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível carregar as solicitações dessa carona.",
      );
      setError(message);
      setRequests([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [rideId]);

  const respondToRequest = useCallback(
    async (requestId: string, accept: boolean) => {
      setRespondingRequestId(requestId);
      setActionError(null);

      try {
        const payload: RespondRequestDto = { accept };
        const response = await api.patch<string>(
          `/api/requests/${requestId}/respond`,
          payload,
        );
        ensureApiCommandSuccess(
          response,
          "Não foi possível responder a solicitação.",
        );

        await loadRequests();
        return true;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível responder a solicitação.",
        );
        setActionError(message);
        return false;
      } finally {
        setRespondingRequestId(null);
      }
    },
    [loadRequests],
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    isLoading,
    error,
    actionError,
    respondToRequest,
    respondingRequestId,
    refetch: loadRequests,
  };
}
