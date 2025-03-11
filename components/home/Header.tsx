import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDrawer } from "@/components/DrawerContext";

// Define the props interface
interface HeaderProps {
  scrollY: Animated.Value;
}

// Update props to remove onProfilePress
const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { toggleDrawer } = useDrawer(); // Use the drawer context

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 3],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{ opacity: headerOpacity, elevation: headerElevation }}
      className="bg-white px-4 pt-10 py-2 flex-row items-center justify-between border-b border-gray-200 shadow-sm"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <TouchableOpacity
          className="relative"
          activeOpacity={0.8}
          onPress={toggleDrawer} // Use toggleDrawer from context
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/1.jpg" }}
            className="w-11 h-11 rounded-full border-2 border-blue-500"
          />
          <View className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border border-white"></View>
        </TouchableOpacity>
        <View
          className={`flex-1 flex-row items-center bg-gray-100 rounded-full ${
            searchFocused ? "border border-blue-400" : ""
          }`}
        >
          <Ionicons
            name="search"
            size={18}
            color="#6b7280"
            style={{ marginLeft: 12 }}
          />
          <TextInput
            placeholder="Search alumni..."
            className="px-2 py-2 text-sm flex-1"
            placeholderTextColor="#6b7280"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity activeOpacity={0.7} className="mr-3 relative">
          <Ionicons name="notifications-outline" size={24} color="#0077B5" />
          <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#0077B5"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Header;
