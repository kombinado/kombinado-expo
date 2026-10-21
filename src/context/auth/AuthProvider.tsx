import { api, setOnUnauthorized } from "@/services/api";
import { tokenStorage } from "@/services/storage";
import React, { createContext, useEffect, useState } from "react";

export interface UserProfile {
  name: string;
  email?: string;
  isDriver: boolean;
}

interface AuthContextType {
  userToken: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (changes: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  // Só indica a restauração da sessão ao abrir o app. Enquanto é true, o NavigationGuard
  // troca toda a navegação por um spinner, desmontando as telas (e o que foi digitado nelas).
  // Por isso login, cadastro e logout usam o próprio estado de envio de cada tela.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await tokenStorage.getAccessToken();
        const storedUser = await tokenStorage.getUserData();
        if (token && storedUser) {
          setUserToken(token);
          // Usa os dados do storage temporariamente para evitar tela de carregamento longa
          setUser(storedUser);

          try {
            // Tenta buscar os dados mais atualizados no backend
            // Injetamos o token manualmente pois a instância 'api' pode não ter pego a tempo
            const response = await api.get("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.success && response.data) {
              const updatedProfile = {
                name: response.data.name,
                email: response.data.email,
                isDriver: response.data.isDriver,
              };
              setUser(updatedProfile);
              await tokenStorage.saveUserData(updatedProfile);
            }
          } catch (fetchError) {
            console.log(
              "Aviso: Não foi possível sincronizar o perfil no boot:",
              fetchError,
            );
            // Falha silenciosa, continua com o storedUser
          }
        }
      } catch (e) {
        console.error("Falha ao recuperar dados do SecureStore ao iniciar:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();

    // Configura o callback para forçar o logout se a renovação de tokens falhar de vez
    setOnUnauthorized(() => {
      setUserToken(null);
      setUser(null);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/Auth/login", { email, password });

      if (response.success && response.data) {
        const { accessToken, refreshToken, name, isDriver } = response.data;

        // Salva tokens de forma segura no SecureStore
        await tokenStorage.saveTokens(accessToken, refreshToken);

        // Salva dados de perfil no SecureStore
        const profileData = { name, email, isDriver };
        await tokenStorage.saveUserData(profileData);

        // Atualiza estados locais de forma atômica
        setUser(profileData);
        setUserToken(accessToken);
      } else {
        throw new Error(
          response.message || "Erro desconhecido ao fazer login.",
        );
      }
    } catch (error: any) {
      console.log("[AuthProvider] Aviso no signIn:", error.message);
      throw error;
    }
  };

  const signUp = async (payload: any) => {
    try {
      const response = await api.post("/api/Auth/signup", payload);

      if (!response.success) {
        throw new Error(response.message || "Erro desconhecido ao cadastrar.");
      }

      // O fluxo ajustado solicita que o usuário seja redirecionado para a tela de login
      // e não seja logado automaticamente. Portanto, não atualizamos o estado local de sessão.
    } catch (error: any) {
      console.log("[AuthProvider] Aviso no signUp:", error.message);
      throw error;
    }
  };

  const updateUser = async (changes: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...changes };
    setUser(updatedUser);
    await tokenStorage.saveUserData(updatedUser);
  };

  const signOut = async () => {
    try {
      await tokenStorage.clearAll();
    } catch (error) {
      console.error("[AuthProvider] Erro no signOut:", error);
    } finally {
      // Sem a sessão, o NavigationGuard leva o usuário para o login
      setUser(null);
      setUserToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
