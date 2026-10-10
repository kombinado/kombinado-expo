import { tokenStorage } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Tempo máximo de espera por uma resposta, para nenhuma tela ficar carregando para sempre
const REQUEST_TIMEOUT_MS = 30000;

const NETWORK_ERROR_MESSAGE =
  "Erro de rede: Não foi possível conectar ao servidor. Verifique se o servidor está rodando e se a URL no seu .env está acessível para o emulador Android (ex: use HTTP em vez de HTTPS para evitar problemas com certificado SSL autoassinado).";
const TIMEOUT_ERROR_MESSAGE =
  "O servidor demorou demais para responder. Verifique sua conexão e tente novamente.";
const SESSION_EXPIRED_MESSAGE = "Sessão expirada. Faça login novamente.";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// Callback para quando ocorrer um logout forçado (ex: refresh token expirado)
type UnauthorizedCallback = () => void;
let onUnauthorizedCallback: UnauthorizedCallback | null = null;

export const setOnUnauthorized = (callback: UnauthorizedCallback) => {
  onUnauthorizedCallback = callback;
};

// Evita loop infinito se a própria requisição de refresh retornar 401
let isRefreshing = false;

// Fila de requisições falhas que aguardam a conclusão do Refresh Token
type FailedRequest = {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  path: string;
  options: RequestInit;
};
let failedQueue: FailedRequest[] = [];

// Libera todas as requisições da fila: com erro, ou repetindo cada uma com o token novo
const processQueue = (error: Error | null) => {
  const queue = failedQueue;
  failedQueue = [];

  queue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // request() lê o token novo do storage e trata a resposta igual a qualquer chamada
      request(prom.path, prom.options, true).then(prom.resolve, prom.reject);
    }
  });
};

// Converte erros de rede e de timeout em mensagens amigáveis
function toFriendlyError(error: any): Error {
  if (error?.name === "AbortError") {
    return new Error(TIMEOUT_ERROR_MESSAGE);
  }
  if (error?.message?.includes("Network request failed")) {
    return new Error(NETWORK_ERROR_MESSAGE);
  }
  return error instanceof Error ? error : new Error(String(error));
}

async function fetchWithTimeout(url: string, options: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Retorna o novo access token, ou null se a API recusar a renovação (sessão expirada).
// Erros de rede são lançados: nesse caso o usuário não é deslogado e pode tentar de novo.
async function refreshTokens(): Promise<string | null> {
  const currentAccessToken = await tokenStorage.getAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!currentAccessToken || !refreshToken) return null;

  console.log("[API] Access Token expirado. Tentando rotacionar...");

  // Chamada manual de refresh para evitar loop recursivo infinito
  const refreshRes = await fetchWithTimeout(`${BASE_URL}/api/Auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: currentAccessToken,
      refreshToken: refreshToken,
    }),
  });

  if (!refreshRes.ok) return null;

  const refreshPayload: ApiResponse = await refreshRes.json();
  if (!refreshPayload.success || !refreshPayload.data) return null;

  const { accessToken: newAccess, refreshToken: newRefresh } =
    refreshPayload.data;

  // Salva os novos tokens rotacionados
  await tokenStorage.saveTokens(newAccess, newRefresh);
  console.log("[API] Tokens rotacionados com sucesso.");

  return newAccess;
}

async function request<T = any>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  // Injeta cabeçalhos padrão
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Recupera e injeta o access token se disponível
  const token = await tokenStorage.getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  options.headers = headers;

  try {
    const response = await fetchWithTimeout(url, options);

    // Caso de erro de credencial ou token expirado (401)
    // Se a rota for de Auth (login, signup, refresh), nós NÃO interceptamos, pois o 401 significa apenas credenciais inválidas.
    const isAuthRoute = path.includes("/api/Auth/");
    if (response.status === 401 && !isAuthRoute) {
      if (isRefreshing) {
        // Se já está acontecendo um refresh, enfileira a requisição atual
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, path, options });
        });
      }

      // Uma requisição repetida com token novo que volta a dar 401 não tenta outro refresh
      let newAccessToken: string | null = null;
      if (!isRetry) {
        isRefreshing = true;
        try {
          newAccessToken = await refreshTokens();
        } catch (refreshErr) {
          // Erros esperados vão para console.log: console.warn/error abrem alertas do LogBox no app
          console.log("[API] Aviso: falha de rede ao atualizar token:", refreshErr);
          const friendlyError = toFriendlyError(refreshErr);
          processQueue(friendlyError);
          throw friendlyError;
        } finally {
          isRefreshing = false;
        }
      }

      if (newAccessToken) {
        // Processa outras requisições que aguardavam na fila e repete a requisição original
        processQueue(null);
        return await request<T>(path, options, true);
      }

      console.log("[API] Sessão expirada de vez. Deslogando usuário...");
      const sessionError = new Error(SESSION_EXPIRED_MESSAGE);
      processQueue(sessionError);

      // Limpa dados salvos e notifica o AuthProvider para deslogar
      await tokenStorage.clearAll();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }

      throw sessionError;
    }

    // Lê a resposta como texto e tenta fazer o parse seguro para evitar quebra com erros 500 HTML
    const textResponse = await response.text();
    let data: any = {};
    try {
      if (textResponse) {
        data = JSON.parse(textResponse);
      }
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(
          textResponse || `Erro na requisição (Status ${response.status})`
        );
      }
      console.error(
        "[API] O servidor não retornou JSON válido:",
        textResponse.substring(0, 150),
      );
    }

    if (!response.ok) {
      let errorMessage = "Ocorreu um erro ao processar a requisição.";

      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && typeof data.errors === "object") {
        const errorMessages = Object.values(data.errors).flat();
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join("\n");
        }
      } else if (data.title) {
        errorMessage = data.title;
      }

      throw new Error(errorMessage);
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    console.log(`[API Warning] Aviso na chamada a ${path}:`, error.message);
    // Caso seja timeout, erro de certificado ou falta de conexão
    throw toFriendlyError(error);
  }
}

export const api = {
  get: <T = any>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
