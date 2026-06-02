import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/src/components/Header";
import { Tabs } from "expo-router";
import { Car, House, User } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { signOut } = useAuth();

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header firstName="Lucas" />,

        tabBarStyle: {
          backgroundColor: "#E84855",
          borderTopWidth: 0,

          height: 60 + insets.bottom,

          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          paddingTop: 10,
        },
        tabBarActiveTintColor: "#E84855",
        tabBarInactiveTintColor: "#e5e5e5",
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
          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`p-2 rounded-full transition-all ${
                focused
                  ? "bg-white" // Efeito quando está clicado
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
                  ? "bg-white" // Efeito quando está clicado
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
                  ? "bg-white" // Efeito quando está clicado
                  : "" // Sem efeito quando está inativo
              }`}
            >
              <User stroke={color} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
