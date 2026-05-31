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
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Mock dos dados baseados na sua estrutura JSON
const PASSENGER_MOCK = {
  name: "John Doe",
  email: "john@example.com",
  password: "Secure@123",
  whatsApp: "+55 11 99999-9999",
  course: "Computer Science",
  isDriver: false,
};

const DRIVER_MOCK = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "Secure@123",
  whatsApp: "+55 11 98888-8888",
  course: "Engineering",
  isDriver: true,
  vehicleModel: "Honda Civic",
  vehicleColor: "Preto",
  vehiclePlate: "ABC-1234",
};

export default function Profile() {
  // Estado apenas para você testar a mudança visual durante o desenvolvimento
  const [user, setUser] = useState<any>(PASSENGER_MOCK);

  return (
    <ScrollView
      className="flex-1 bg-[#FAF9F9]"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ⚠️ BOTÃO DE TESTE (Remova quando integrar com a API) */}
      <Pressable
        onPress={() => setUser(user.isDriver ? PASSENGER_MOCK : DRIVER_MOCK)}
        className="bg-slate-200 py-2 px-4 rounded-xl self-center mb-6 active:scale-95"
      >
        <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider">
          Trocar para {user.isDriver ? "Passageiro" : "Motorista"}
        </Text>
      </Pressable>

      {/* --- SEÇÃO 1: CABEÇALHO DO PERFIL (AVATAR) --- */}
      <View className="items-center mb-8">
        <View className="w-28 h-28 bg-[#E84855] rounded-full items-center justify-center border-4 border-white shadow-md mb-4">
          <User size={48} color="#FFF" strokeWidth={2} />
        </View>
        <Text className="text-3xl font-black text-[#040F0F]">{user.name}</Text>

        {/* Badge Dinâmico de Papel */}
        <View
          className={`mt-2 px-4 py-1.5 rounded-full ${user.isDriver ? "bg-[#040F0F]" : "bg-sky-500"}`}
        >
          <Text className="text-white font-bold text-xs uppercase tracking-widest">
            {user.isDriver ? "Motorista Kombinado" : "Passageiro"}
          </Text>
        </View>
      </View>

      {/* --- SEÇÃO 2: INFORMAÇÕES PESSOAIS --- */}
      <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
        Informações Pessoais
      </Text>
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 gap-4">
        {/* Curso */}
        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <GraduationCap size={22} color="#E84855" />
          </View>
          <View className="flex-1 border-b border-slate-100 pb-3">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Curso
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {user.course}
            </Text>
          </View>
        </View>

        {/* E-mail */}
        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <Mail size={22} color="#E84855" />
          </View>
          <View className="flex-1 border-b border-slate-100 pb-3">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              E-mail institucional
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {user.email}
            </Text>
          </View>
        </View>

        {/* WhatsApp */}
        <View className="flex-row items-center gap-3">
          <View className="bg-slate-50 p-2.5 rounded-xl">
            <Phone size={22} color="#E84855" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              WhatsApp
            </Text>
            <Text className="text-[#040F0F] text-base font-semibold">
              {user.whatsApp}
            </Text>
          </View>
        </View>
      </View>

      {/* --- SEÇÃO 3: VEÍCULO (RENDERIZAÇÃO CONDICIONAL) --- */}
      {user.isDriver && (
        <>
          <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
            Meu Veículo
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 gap-4">
            {/* Modelo */}
            <View className="flex-row items-center gap-3">
              <View className="bg-red-50 p-2.5 rounded-xl">
                <Car size={22} color="#E84855" />
              </View>
              <View className="flex-1 border-b border-slate-100 pb-3">
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Modelo
                </Text>
                <Text className="text-[#040F0F] text-base font-semibold">
                  {user.vehicleModel}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              {/* Cor */}
              <View className="flex-1 flex-row items-center gap-3">
                <View className="bg-red-50 p-2.5 rounded-xl">
                  <Palette size={22} color="#E84855" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Cor
                  </Text>
                  <Text className="text-[#040F0F] text-base font-semibold">
                    {user.vehicleColor}
                  </Text>
                </View>
              </View>

              {/* Placa */}
              <View className="flex-1 flex-row items-center gap-3">
                <View className="bg-red-50 p-2.5 rounded-xl">
                  <Hash size={22} color="#E84855" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Placa
                  </Text>
                  <Text className="text-[#040F0F] text-base font-semibold uppercase">
                    {user.vehiclePlate}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {/* --- SEÇÃO 4: SEGURANÇA E AÇÕES --- */}
      <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-3 ml-1">
        Segurança
      </Text>

      {/* Botão Alterar Senha */}
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

      {/* Botão Sair */}
      <Pressable className="bg-red-50 flex-row items-center justify-center p-4 rounded-2xl active:bg-red-100 active:scale-95 transition-all mt-4 mb-8">
        <LogOut size={22} color="#E84855" strokeWidth={2.5} />
        <Text className="text-[#E84855] font-black text-lg ml-2">
          Sair do Aplicativo
        </Text>
      </Pressable>
    </ScrollView>
  );
}
