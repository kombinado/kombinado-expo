import { ErrorBanner } from "@/src/components/ui/ErrorBanner";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { useProfile } from "@/src/hooks/useProfile";
import { colors as themeColors } from '@/src/theme/colors';
import { useRouter } from "expo-router";
import {
  Car,
  ChevronRight,
  GraduationCap,
  Hash,
  Lock,
  LogOut,
  Mail,
  Palette,
  Pencil,
  Phone,
  User,
  Users,
} from "lucide-react-native";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const { profile, isLoading, hasProfileData, error, refetch, signOut } =
    useProfile();
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          // Na primeira carga o LoadingState já indica o carregamento
          refreshing={isLoading && hasProfileData}
          onRefresh={() => { void refetch(); }}
          colors={[themeColors.text.links]}
          tintColor={themeColors.text.links}
          progressBackgroundColor={themeColors.card}
        />
      }
    >
      <View className="items-center mb-8">
        <View className="w-28 h-28 bg-card rounded-full items-center justify-center border-4 border-button shadow-md mb-4">
          <User size={48} color={themeColors.button.DEFAULT} strokeWidth={2} />
        </View>
        <Text className="text-3xl font-black text-text-light-primary">
          {profile.name}
        </Text>

        <View
          className={`mt-2 px-4 py-1.5 rounded-full ${profile.isDriver ? "bg-button" : "bg-button"}`}
        >
          <Text className={`font-bold text-xs uppercase tracking-widest ${profile.isDriver ? "text-text-dark" : "text-text-dark"}`}>
            {profile.isDriver ? "Motorista Kombinado" : "Passageiro"}
          </Text>
        </View>
      </View>

      {!hasProfileData ? (
        isLoading ? (
          <LoadingState message="Carregando seu perfil..." />
        ) : (
          <ErrorState
            message={error || "Não foi possível carregar os dados do seu perfil."}
            onRetry={refetch}
          />
        )
      ) : (
        <>
          {/* Falha ao atualizar: mantém os dados já carregados e avisa acima deles */}
          <ErrorBanner message={error} className="mb-6" />

          <Text className="text-text-light-primary font-bold text-sm uppercase tracking-wider mb-3 ml-1">
            Informações Pessoais
          </Text>
          <View className="bg-card rounded-2xl p-4 shadow-sm border border-text-light-secondary mb-6 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-background p-2.5 rounded-xl">
                <GraduationCap size={22} color={themeColors.text.links} />
              </View>
              <View className="flex-1 border-b border-text-light-secondary pb-3">
                <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                  Curso
                </Text>
                <Text className="text-text-light-primary text-base font-semibold">
                  {profile.course}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="bg-background p-2.5 rounded-xl">
                <Mail size={22} color={themeColors.text.links} />
              </View>
              <View className="flex-1 border-b border-text-light-secondary pb-3">
                <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                  E-mail institucional
                </Text>
                <Text className="text-text-light-primary text-base font-semibold">
                  {profile.email}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="bg-background p-2.5 rounded-xl">
                <Phone size={22} color={themeColors.text.links} />
              </View>
              <View className="flex-1">
                <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                  WhatsApp
                </Text>
                <Text className="text-text-light-primary text-base font-semibold">
                  {profile.whatsApp}
                </Text>
              </View>
            </View>
          </View>

          {profile.isDriver && (
            <>
              <Text className="text-text-light-primary font-bold text-sm uppercase tracking-wider mb-3 ml-1">
                Meu Veículo
              </Text>
              <View className="bg-card rounded-2xl p-4 shadow-sm border border-text-light-secondary mb-6 gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="bg-background p-2.5 rounded-xl">
                    <Car size={22} color={themeColors.text.links} />
                  </View>
                  <View className="flex-1 border-b border-text-light-secondary pb-3">
                    <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                      Modelo
                    </Text>
                    <Text className="text-text-light-primary text-base font-semibold">
                      {profile.vehicleModel}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="bg-background p-2.5 rounded-xl">
                      <Palette size={22} color={themeColors.text.links} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                        Cor
                      </Text>
                      <Text className="text-text-light-primary text-base font-semibold">
                        {profile.vehicleColor}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="bg-background p-2.5 rounded-xl">
                      <Hash size={22} color={themeColors.text.links} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                        Placa
                      </Text>
                      <Text className="text-text-light-primary text-base font-semibold uppercase">
                        {profile.vehiclePlate}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-3 border-t border-text-light-secondary pt-3">
                  <View className="bg-background p-2.5 rounded-xl">
                    <Users size={22} color={themeColors.text.links} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-links text-xs font-bold uppercase tracking-wider">
                      Vagas para passageiros
                    </Text>
                    <Text className="text-text-light-primary text-base font-semibold">
                      {profile.vehicleTotalSeats ?? "Não informado"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <Pressable
            onPress={() => router.push("/edit-profile")}
            className="mt-2 mb-8 flex-row items-center justify-center rounded-2xl p-4 bg-button active:bg-button/70 active:scale-95 transition-all"
          >
            <Pencil size={22} color={themeColors.text.dark} />
            <Text className="ml-2 font-bold text-text-dark text-lg">
              Editar perfil
            </Text>
          </Pressable>
        </>
      )}

      <Text className="text-text-light-primary font-bold text-sm uppercase tracking-wider mb-3 ml-1">
        Segurança
      </Text>

      <Pressable className="bg-card flex-row items-center justify-between p-4 rounded-2xl shadow-sm border border-text-light-secondary mb-4 active:bg-card/70 active:scale-95 transition-all">
        <View className="flex-row items-center gap-3">
          <View className="bg-background p-2.5 rounded-xl">
            <Lock size={22} color={themeColors.text.links} />
          </View>
          <View>
            <Text className="text-text-links font-bold text-base">
              Senha de Acesso
            </Text>
            <Text className="text-text-light-primary font-medium text-xs mt-0.5">
              ••••••••
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={themeColors.text.links} />
      </Pressable>

      <Pressable onPress={signOut} className="bg-button-cancel flex-row items-center justify-center p-4 rounded-2xl active:bg-button-cancel/70 active:scale-95 transition-all mt-4 mb-8">
        <LogOut size={22} color={themeColors.text["button-cancel"]} strokeWidth={2.5} />
        <Text className="text-text-button-cancel font-black text-lg ml-2">
          Sair do Aplicativo
        </Text>
      </Pressable>
    </ScrollView>
  );
}
