import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Para qual campus vamos?",
  ...rest
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || value.length > 0;

  const bgColor = isActive ? "bg-[#FAF9F9]" : "bg-[#E84855]";
  const borderColor = isActive ? "border-[#E84855]" : "border-transparent";
  const iconColor = isActive ? "#E84855" : "#FFF";
  const textColor = isActive ? "text-[#040F0F]" : "text-white";
  const placeholderColor = isActive ? "#94a3b8" : "#FAF9F9";

  return (
    <View
      className={`flex-row items-center w-full px-4 py-2 rounded-2xl border-2 transition-colors ${bgColor} ${borderColor}`}
    >
      <Search size={22} color={iconColor} strokeWidth={2.5} />

      <TextInput
        className={`flex-1 font-semibold ml-3 text-lg ${textColor}`}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="default"
        returnKeyType="search"
        autoCapitalize="words"
        accessible={true}
        accessibilityRole="search"
        accessibilityLabel="Campo de pesquisa"
        accessibilityHint="Digite o destino ou ponto de partida da carona"
        {...rest}
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          className="p-1 rounded-full active:opacity-50 ml-1"
          accessibilityRole="button"
          accessibilityLabel="Limpar texto da pesquisa"
        >
          <X size={20} color={iconColor} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}
