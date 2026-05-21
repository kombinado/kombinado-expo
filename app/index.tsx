import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-[#000804]">
      {/* Impede que o teclado cubra os inputs */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        {/* Cabeçalho Lúdico */}
        <View className="items-center mb-12">
          <Text className="text-4xl uppercase font-extrabold text-[#6BFE9C]">
            Kombinado
          </Text>
        </View>

        {/* Formulário Acessível */}
        <View className="bg-[#152219] rounded-[12px] py-[50px] px-[20px] gap-y-5">
          <View>
            <Text className="text-[24px] font-bold text-[#C9FDDE] ">
              Crie sua conta
            </Text>
            <Text className="text-[14px] text-[#84B69A] ">
              Junte-se à comunidade universitária de caronas.
            </Text>
          </View>

          <View>
            <Text className="text-slate-700 font-extrabold mb-2 ml-1 uppercase text-sm tracking-wider">
              E-mail Institucional
            </Text>
            <TextInput
              className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-lg text-slate-800"
              placeholder="aluno@iftm.edu.br"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              // value={}
              // onChangeText={}
              // Propriedades de Acessibilidade
              accessible={true}
              accessibilityLabel="Campo de e-mail institucional"
              accessibilityHint="Digite seu e-mail do IFTM para acessar o aplicativo"
            />
          </View>

          <View>
            <Text className="text-slate-700 font-extrabold mb-2 ml-1 uppercase text-sm tracking-wider">
              Senha
            </Text>
            <TextInput
              className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-lg text-slate-800"
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              // value={}
              // onChangeText={}
              // Propriedades de Acessibilidade
              accessible={true}
              accessibilityLabel="Campo de senha"
              accessibilityHint="Digite sua senha de acesso"
            />
          </View>

          {/* Botão Principal Gamificado */}
          <Pressable
            className="mt-4 w-full bg-sky-500 py-5 rounded-2xl items-center shadow-md active:bg-sky-700 active:scale-95"
            // onPress={() => console.log("Partiu IFTM!", email)}
            // Acessibilidade do Botão
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Botão Entrar"
            accessibilityHint="Toque para fazer login e buscar caronas"
          >
            <Text className="text-white text-xl font-extrabold uppercase tracking-widest">
              Dar Partida
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
