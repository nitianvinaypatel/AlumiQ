import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0077B5", // AlumiQ blue color
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 5 },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0077B5",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          headerShown: false,
          title: "Alumni",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-post"
        options={{
          headerShown: false,
          title: "Post",
          tabBarIcon: ({ color, size }) => (
            <View className="bg-[#0077B5] rounded-full p-1 -mt-2">
              <Ionicons name="add" size={size} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          headerShown: false,
          title: "Opportunities",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
