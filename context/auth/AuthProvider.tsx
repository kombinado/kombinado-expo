import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Altere para "token_fake" se quiser testar as telas privadas direto, ou mantenha null para ir pro Login
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    console.log("Tentativa de login com:", email);
    setUserToken("token_fake"); // Simula o login com sucesso
  };

  const signOut = async () => {
    setUserToken(null); // Simula o logout
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
