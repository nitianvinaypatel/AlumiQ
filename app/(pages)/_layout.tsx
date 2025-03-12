import React from "react";
import { Stack } from "expo-router";

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0077B5",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
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
