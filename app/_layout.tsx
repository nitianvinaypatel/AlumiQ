import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { DrawerProvider } from "@/components/DrawerContext";
import SideDrawerRoot from "@/components/SideDrawerRoot";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  ThemeProvider,
  useTheme,
  lightTheme,
  darkTheme,
} from "@/contexts/ThemeContext";
import "../global.css";

// Theme-aware layout component
const ThemedLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {children}
      <SideDrawerRoot />
    </View>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <ThemeProvider>
        <DrawerProvider>
          <ThemedLayout>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </ThemedLayout>
        </DrawerProvider>
      </ThemeProvider>
    </Provider>
  );
}
