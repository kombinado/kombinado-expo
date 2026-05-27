import "@/global.css";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/src/context/auth/AuthProvider";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
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
  }, [userToken, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#E84855] justify-center items-center">
        <ActivityIndicator size="large" color="#FAF9F9" />
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
