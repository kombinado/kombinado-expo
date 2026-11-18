import { Header } from "@/src/components/Header";
import { useAuth } from "@/src/hooks/useAuth";
import { colors } from '@/src/theme/colors';
import { Tabs } from "expo-router";
import { Car, House, User } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { user } = useAuth();

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header firstName={user?.name?.split(" ")[0] || "Motorista"} />,

        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,

          height: 60 + insets.bottom,

          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.text.dark,
        tabBarInactiveTintColor: colors.text["light-secondary"],
        tabBarLabelStyle: {
          fontWeight: "900",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="driver"
        options={{
          title: "Kombinado 🚌",
          tabBarLabel: "",
          href: user?.isDriver ? '/driver' : null,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`p-2 rounded-full transition-all ${
                focused
                  ? "bg-text-links" // Efeito quando está clicado
                  : "" // Sem efeito quando está inativo
              }`}
            >
              <Car stroke={color} size={size} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Kombinado 🚌",
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`p-2 rounded-full transition-all ${
                focused
                  ? "bg-text-links" // Efeito quando está clicado
                  : "" // Sem efeito quando está inativo
              }`}
            >
              <House stroke={color} size={size} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`p-2 rounded-full transition-all ${
                focused
                  ? "bg-text-links" // Efeito quando está clicado
                  : "" // Sem efeito quando está inativo
              }`}
            >
              <User stroke={color} size={size} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="edit-profile"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
