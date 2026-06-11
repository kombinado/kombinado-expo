import React from "react";
import { ScrollView, RefreshControlProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function ScreenWrapper({ children, refreshControl }: ScreenWrapperProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow p-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
