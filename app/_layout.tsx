import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth/AuthProvider";
import "../global.css";

// Criamos um componente interno para poder usar o hook 'useAuth' com segurança
function RootNavigation() {
  const { userToken } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Se NÃO está logado, a única rota existente na árvore é o grupo (auth) */}
      {!userToken ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        // Se está logado, o app esquece o login e monta apenas o grupo privado (app)
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
