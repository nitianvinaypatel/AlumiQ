import React from "react";
import { Stack } from "expo-router";
import { useTheme, lightTheme, darkTheme } from "@/contexts/ThemeContext";

export default function PagesLayout() {
  // Get current theme
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="messages"
        options={{
          title: "Messages",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="create-post"
        options={{
          title: "Create Post",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="all-university-highlights"
        options={{
          title: "All University Highlights",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post-details"
        options={{
          title: "Post Details",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
