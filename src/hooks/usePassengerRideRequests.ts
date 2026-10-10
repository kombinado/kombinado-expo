import { api } from "@/services/api";
import {
  ensureApiCommandSuccess,
  ensureApiSuccess,
  getErrorMessage,
} from "@/src/hooks/apiHookUtils";
import type { RideRequestResponseDto } from "@/src/hooks/apiTypes";
import { useCallback, useEffect, useState } from "react";

export function usePassengerRideRequests() {
  const [requests, setRequests] = useState<RideRequestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingRequestId, setCancelingRequestId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  // Busca os dados e só altera o estado depois da resposta, por isso pode rodar direto no useEffect
  const fetchRequests = useCallback(async () => {
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

  // Recarrega mostrando o carregamento (pull-to-refresh, "Tentar novamente" e após ações)
  const loadRequests = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setActionError(null);
    return fetchRequests();
  }, [fetchRequests]);

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

        // A API não lista solicitações canceladas, então ela sai da lista (e a carona volta ao feed)
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

  // No carregamento inicial o estado já começa como "carregando"
  useEffect(() => {
    // A regra não acompanha o await: fetchRequests só altera o estado depois da resposta da API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

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
