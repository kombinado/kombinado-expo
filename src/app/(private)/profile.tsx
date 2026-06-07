import { useProfile } from "@/src/hooks/useProfile";
import {
  Car,
  ChevronRight,
  GraduationCap,
  Hash,
  Lock,
  LogOut,
  Mail,
  Palette,
  Phone,
  User,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Profile() {
  const { profile, isLoading, signOut } = useProfile();

  return (
    <ScrollView
      className="flex-1 bg-[#FAF9F9]"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-8">
        <View className="w-28 h-28 bg-[#E84855] rounded-full items-center justify-center border-4 border-white shadow-md mb-4">
          <User size={48} color="#FFF" strokeWidth={2} />
        </View>
        <Text className="text-3xl font-black text-[#040F0F]">
          {profile.name}
        </Text>

        <View
          className={`mt-2 px-4 py-1.5 rounded-full ${profile.isDriver ? "bg-[#040F0F]" : "bg-sky-500"}`}
        >
          <Text className="text-white font-bold text-xs uppercase tracking-widest">
            {profile.isDriver ? "Motorista Kombinado" : "Passageiro"}
          </Text>
        </View>
      </View>

      <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
        Informações Pessoais
      </Text>
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 gap-4">
        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <GraduationCap size={22} color="#E84855" />
          </View>
          <View className="flex-1 border-b border-slate-100 pb-3">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Curso
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {profile.course}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <Mail size={22} color="#E84855" />
          </View>
          <View className="flex-1 border-b border-slate-100 pb-3">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              E-mail institucional
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {profile.email}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <Phone size={22} color="#E84855" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              WhatsApp
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {profile.whatsApp}
            </Text>
          </View>
        </View>
      </View>

      {profile.isDriver && (
        <>
          <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
            Meu Veículo
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-red-50 p-2.5 rounded-xl">
                <Car size={22} color="#E84855" />
              </View>
              <View className="flex-1 border-b border-slate-100 pb-3">
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Modelo
                </Text>
                <Text className="text-[#040F0F] text-base font-semibold">
                  {profile.vehicleModel}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="bg-red-50 p-2.5 rounded-xl">
                  <Palette size={22} color="#E84855" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Cor
                  </Text>
                  <Text className="text-[#040F0F] text-base font-semibold">
                    {profile.vehicleColor}
                  </Text>
                </View>
              </View>

              <View className="flex-1 flex-row items-center gap-3">
                <View className="bg-red-50 p-2.5 rounded-xl">
                  <Hash size={22} color="#E84855" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Placa
                  </Text>
                  <Text className="text-[#040F0F] text-base font-semibold uppercase">
                    {profile.vehiclePlate}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
        Segurança
      </Text>

      <Pressable className="bg-white flex-row items-center justify-between p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 active:bg-slate-50 transition-colors">
        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <Lock size={22} color="#64748b" />
          </View>
          <View>
            <Text className="text-[#040F0F] font-bold text-base">
              Senha de Acesso
            </Text>
            <Text className="text-slate-400 font-medium text-xs mt-0.5">
              ••••••••
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color="#cbd5e1" />
      </Pressable>

      <Pressable onPress={signOut} className="bg-red-50 flex-row items-center justify-center p-4 rounded-2xl active:bg-red-100 active:scale-95 transition-all mt-4 mb-8">
        <LogOut size={22} color="#E84855" strokeWidth={2.5} />
        <Text className="text-[#E84855] font-black text-lg ml-2">
          Sair do Aplicativo
        </Text>
      </Pressable>
    </ScrollView>
  );
}
