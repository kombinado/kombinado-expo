import "@/global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/auth/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
