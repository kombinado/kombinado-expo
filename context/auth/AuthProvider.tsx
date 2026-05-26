import React, { createContext, useEffect, useState } from "react";
import { api, setOnUnauthorized } from "../../services/api";
import { tokenStorage } from "../../services/storage";

export interface UserProfile {
  name: string;
  isDriver: boolean;
}

interface AuthContextType {
  userToken: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await tokenStorage.getAccessToken();
        const storedUser = await tokenStorage.getUserData();
        if (token && storedUser) {
          setUserToken(token);
          setUser(storedUser);
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
    setIsLoading(true);
    try {
      const response = await api.post("/api/Auth/login", { email, password });

      if (response.success && response.data) {
        const { accessToken, refreshToken, name, isDriver } = response.data;

        // Salva tokens de forma segura no SecureStore
        await tokenStorage.saveTokens(accessToken, refreshToken);

        // Salva dados de perfil no SecureStore
        const profileData = { name, isDriver };
        await tokenStorage.saveUserData(profileData);

        // Atualiza estados locais de forma atômica
        setUser(profileData);
        setUserToken(accessToken);
      } else {
        throw new Error(response.message || "Erro desconhecido ao fazer login.");
      }
    } catch (error: any) {
      console.log("[AuthProvider] Aviso no signIn:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (payload: any) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await tokenStorage.clearAll();
      setUser(null);
      setUserToken(null);
    } catch (error) {
      console.error("[AuthProvider] Erro no signOut:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, user, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
