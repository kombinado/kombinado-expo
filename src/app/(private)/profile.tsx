import { useAuth } from "@/hooks/useAuth";
import { ScreenWrapper } from "@/src/components/ScreenWraper";
import { LogOut, UserCircle } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <ScreenWrapper>
      <SafeAreaView className="flex-1 bg-[#FAF9F9]">
        {/* Cabeçalho do Perfil */}
        <View className="px-6 pt-12 pb-8 items-center border-b border-gray-200 bg-white shadow-sm">
          <View className="bg-[#E84855]/10 p-5 rounded-full mb-4">
            <UserCircle size={80} color="#E84855" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-extrabold text-[#040F0F] text-center">
            {user?.name || "Usuário Kombinado"}
          </Text>
          <View className="mt-3 px-5 py-1.5 bg-[#040F0F] rounded-full">
            <Text className="text-white text-xs font-bold tracking-widest uppercase">
              {user?.isDriver ? "Motorista" : "Passageiro"}
            </Text>
          </View>
        </View>

        {/* Corpo e Botão de Sair */}
        <View className="flex-1 px-6 py-8 justify-end">
          <Pressable
            onPress={() => signOut()}
            className="w-full flex-row items-center justify-center bg-rose-50 border border-rose-300 py-4 rounded-2xl shadow-sm active:bg-rose-100 active:scale-95 transition-all"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Botão Sair"
            accessibilityHint="Toque para desconectar da sua conta"
          >
            <LogOut size={22} color="#be123c" style={{ marginRight: 8 }} />
            <Text className="text-rose-700 text-lg font-bold tracking-wider">
              Sair da Conta
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
