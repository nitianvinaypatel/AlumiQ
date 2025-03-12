import React from "react";
import { Text, View, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDrawer } from "@/components/DrawerContext";
import { useRouter } from "expo-router";

// Define props interface
interface HeaderProps {
  scrollY: Animated.Value;
}

const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const { toggleDrawer } = useDrawer();
  const router = useRouter();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const headerShadow = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity: headerOpacity,
        elevation: headerShadow,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
      className="bg-white px-5 pt-10 pb-4 flex-row items-center justify-between border-b border-gray-100"
    >
      {/* Left Section: Profile & Search */}
      <View className="flex-row items-center flex-1 space-x-3">
        {/* Profile Picture */}
        <TouchableOpacity activeOpacity={0.8} onPress={toggleDrawer}>
          <View className="relative">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-11 h-11 rounded-full border-2 border-blue-500"
            />
            {/* Online Indicator */}
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></View>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 bg-gray-100 rounded-full px-4 ml-6 py-2 flex-row items-center"
          onPress={() => router.push("/(pages)/search")}
        >
          <Ionicons name="search" size={20} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-2">
            Search alumni, jobs....
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Section: Messages */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="relative min-w-[40px] ml-4"
        onPress={() => router.push("/(pages)/messages")}
      >
        <Ionicons name="chatbox-ellipses-outline" size={26} color="#0077B5" />
        {/* Notification Badge */}
        <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center">
          <Text className="text-white text-xs font-bold">2</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Header;
