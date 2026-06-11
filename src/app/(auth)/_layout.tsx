import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esconde a barra superior no Login/Signup
        animation: "fade", // Transição suave entre Login e Signup
      }}
    />
  );
}
