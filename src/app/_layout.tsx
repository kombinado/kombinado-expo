import "@/global.css";
import { AuthProvider } from "@/src/context/auth/AuthProvider";
import { useAuth } from "@/src/hooks/useAuth";
import { colors } from '@/src/theme/colors';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function NavigationGuard() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userToken && !inAuthGroup) {
      // Redireciona usuários deslogados tentando acessar área privada para o login
      router.replace("/login");
    } else if (userToken && inAuthGroup) {
      // Redireciona usuários logados tentando acessar área de auth para a home
      router.replace("/home");
    }
  }, [userToken, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.text['links']} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(private)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard />
    </AuthProvider>
  );
}
