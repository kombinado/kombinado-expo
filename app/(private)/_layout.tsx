import { Tabs } from "expo-router";
import { House, User } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { signOut } = useAuth();

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarLabelVisibilityMode: "unlabeled",
        tabBarStyle: {
          backgroundColor: "#E84855",
          borderTopWidth: 0,

          height: 60 + insets.bottom,

          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          paddingTop: 10,
        },
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontWeight: "900",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Kombinado 🚌",
          tabBarLabel: "Caronas",
          tabBarIcon: ({ color, size }) => <House stroke="#fff" />,
          headerRight: () => (
            <Pressable
              onPress={signOut}
              className="bg-red-500 px-4 py-2 rounded-full active:scale-95 mr-4"
            >
              <Text className="text-white font-extrabold text-xs">SAIR</Text>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <User stroke="#fff" />,
        }}
      />
    </Tabs>
  );
}
