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
  const [error, setError] = useState<string | null>(null);
  // Carona cuja última busca já terminou (com sucesso ou erro)
  const [loadedRideId, setLoadedRideId] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(
    null,
  );
  // Erro ao responder, guardado com a carona em que aconteceu
  const [actionError, setActionError] = useState<{
    rideId: string | null;
    message: string;
  } | null>(null);

  // Busca as solicitações de uma carona e só altera o estado depois da resposta.
  // isCurrent descarta a resposta de uma carona que já foi fechada ou trocada.
  const fetchRequests = useCallback(
    async (id: string, isCurrent: () => boolean = () => true) => {
      try {
        const response = await api.get<RideRequestResponseDto[]>(
          `/api/requests/ride/${id}`,
        );
        const data = ensureApiSuccess(
          response,
          "Não foi possível carregar as solicitações dessa carona.",
        );
        if (isCurrent()) {
          setRequests(data);
          setError(null);
        }
        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar as solicitações dessa carona.",
        );
        if (isCurrent()) {
          setError(message);
          setRequests([]);
        }
        return null;
      } finally {
        if (isCurrent()) {
          setLoadedRideId(id);
        }
      }
    },
    [],
  );

  // Recarrega a carona aberta mostrando o carregamento (ex.: após aceitar ou recusar)
  const loadRequests = useCallback(async () => {
    if (!rideId) return null;

    setIsRefetching(true);
    try {
      return await fetchRequests(rideId);
    } finally {
      setIsRefetching(false);
    }
  }, [rideId, fetchRequests]);

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
        setActionError({ rideId, message });
        return false;
      } finally {
        setRespondingRequestId(null);
      }
    },
    [rideId, loadRequests],
  );

  useEffect(() => {
    if (!rideId) return;

    let isCurrent = true;
    // A regra não acompanha o await: fetchRequests só altera o estado depois da resposta da API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests(rideId, () => isCurrent);
    return () => {
      isCurrent = false;
    };
  }, [rideId, fetchRequests]);

  // Enquanto a carona aberta não termina de carregar, nada da carona anterior é exibido
  const isOpenRideLoaded = rideId !== null && loadedRideId === rideId;

  return {
    requests: isOpenRideLoaded ? requests : [],
    isLoading: isRefetching || (rideId !== null && !isOpenRideLoaded),
    error: isOpenRideLoaded ? error : null,
    actionError: actionError?.rideId === rideId ? actionError.message : null,
    respondToRequest,
    respondingRequestId,
    refetch: loadRequests,
  };
}
