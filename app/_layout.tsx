import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { DrawerProvider, useDrawer } from "@/components/DrawerContext";
import SideDrawerRoot from "@/components/SideDrawerRoot";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

// Theme-aware layout component
const ThemedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useDrawer();

  // Define colors based on theme
  const colors = {
    background: isDarkMode ? "#121212" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#000000",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {children}
      <SideDrawerRoot />
    </View>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <DrawerProvider>
        <ThemedLayout>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemedLayout>
      </DrawerProvider>
    </Provider>
  );
}
