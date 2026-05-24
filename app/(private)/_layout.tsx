import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../../context/auth/AuthProvider";

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: true, // EXIBE o Stack nas pastas privadas
        headerStyle: {
          backgroundColor: "#000000", // Fundo preto combinando com seu Toggle Button
        },
        headerTintColor: "#ffffff", // Cor do título e botões de voltar
        headerTitleStyle: {
          fontWeight: "900", // Fonte bem grossa e energética
          fontSize: 20,
        },
        headerShadowVisible: false, // Remove aquela linha feia abaixo do header
      }}
    >
      {/* Tela Home com configurações específicas */}
      <Stack.Screen
        name="home"
        options={{
          title: "Kombinado 🚌",
          // Exemplo: Adicionar um botão de Logout lúdico no canto direito do Header
          headerRight: () => (
            <Pressable
              onPress={signOut}
              className="bg-red-500 px-3 py-1.5 rounded-full active:scale-95"
            >
              <Text className="text-white font-extrabold text-xs">Sair</Text>
            </Pressable>
          ),
        }}
      />

      {/* Tela de Perfil */}
      <Stack.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          animation: "slide_from_bottom", // Transição diferenciada para o perfil
        }}
      />
    </Stack>
  );
}
