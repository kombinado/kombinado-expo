import { tokenStorage } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
  config: {
    path: string;
    options: RequestInit;
  };
};
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Injeta o novo token no cabeçalho das requisições enfileiradas
      if (prom.config.options.headers) {
        (prom.config.options.headers as any)["Authorization"] =
          `Bearer ${token}`;
      }
      // Re-executa a requisição original
      fetch(`${BASE_URL}${prom.config.path}`, prom.config.options)
        .then((res) => res.json())
        .then((data) => prom.resolve(data))
        .catch((err) => prom.reject(err));
    }
  });

  failedQueue = [];
};

async function request<T = any>(
  path: string,
  options: RequestInit = {},
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
    const response = await fetch(url, options);

    // Caso de erro de credencial ou token expirado (401)
    // Se a rota for de Auth (login, signup, refresh), nós NÃO interceptamos, pois o 401 significa apenas credenciais inválidas.
    const isAuthRoute = path.includes("/api/Auth/");
    if (response.status === 401 && !isAuthRoute) {
      if (isRefreshing) {
        // Se já está acontecendo um refresh, enfileira a requisição atual
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: { path, options } });
        });
      }

      isRefreshing = true;

      const currentAccessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (currentAccessToken && refreshToken) {
        try {
          console.log("[API] Access Token expirado. Tentando rotacionar...");

          // Chamada manual de refresh para evitar loop recursivo infinito
          const refreshRes = await fetch(`${BASE_URL}/api/Auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: currentAccessToken,
              refreshToken: refreshToken,
            }),
          });

          if (refreshRes.ok) {
            const refreshPayload: ApiResponse = await refreshRes.json();
            if (refreshPayload.success && refreshPayload.data) {
              const { accessToken: newAccess, refreshToken: newRefresh } =
                refreshPayload.data;

              // Salva os novos tokens rotacionados
              await tokenStorage.saveTokens(newAccess, newRefresh);

              console.log("[API] Tokens rotacionados com sucesso.");

              // Injeta o novo token e re-executa a requisição atual
              headers.set("Authorization", `Bearer ${newAccess}`);
              options.headers = headers;

              // Processa outras requisições que aguardavam na fila
              processQueue(null, newAccess);

              isRefreshing = false;

              // Repete a requisição original
              const retryResponse = await fetch(url, options);
              return await retryResponse.json();
            }
          }
        } catch (refreshErr) {
          console.error("[API] Falha crítica ao atualizar token:", refreshErr);
          processQueue(refreshErr, null);
        }
      }

      isRefreshing = false;
      console.warn("[API] Sessão expirada de vez. Deslogando usuário...");
      // Limpa dados salvos e notifica o AuthProvider para deslogar
      await tokenStorage.clearAll();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }

      throw new Error("Sessão expirada. Faça login novamente.");
    }

    // Lê a resposta como texto e tenta fazer o parse seguro para evitar quebra com erros 500 HTML
    const textResponse = await response.text();
    let data: any;
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error(
        "[API] O servidor não retornou JSON válido:",
        textResponse.substring(0, 150),
      );
      throw new Error(
        "Servidor indisponível ou ocorreu um erro interno. Tente novamente mais tarde.",
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
    // Caso seja erro de certificado ou falta de conexão
    if (error.message && error.message.includes("Network request failed")) {
      throw new Error(
        "Erro de rede: Não foi possível conectar ao servidor. Verifique se o servidor está rodando e se a URL no seu .env está acessível para o emulador Android (ex: use HTTP em vez de HTTPS para evitar problemas com certificado SSL autoassinado).",
      );
    }
    throw error;
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
