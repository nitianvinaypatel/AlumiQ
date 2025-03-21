import React from "react";
import { Text, View, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDrawer } from "@/components/DrawerContext";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

// Define props interface
interface HeaderProps {
  scrollY: Animated.Value;
}

const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const { toggleDrawer } = useDrawer();
  const router = useRouter();
  const { theme } = useTheme();

  // Determine theme colors based on current theme
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const headerShadow = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 8],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -2],
    extrapolate: "clamp",
  });

  // Helper function for haptic feedback
  const triggerHaptic = (style = "light") => {
    try {
      if (style === "medium") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (style === "heavy") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  return (
    <Animated.View
      style={{
        opacity: headerOpacity,
        transform: [{ translateY: headerTranslateY }],
        elevation: headerShadow,
        shadowColor: isDarkMode ? "#000" : "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDarkMode ? 0.3 : 0.15,
        shadowRadius: 5,
        backgroundColor: themeColors.background,
        zIndex: 100,
      }}
      className={`px-5 pt-12 pb-4 flex-row items-center justify-between border-b ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      {/* Left Section: Profile & Search */}
      <View className="flex-row items-center flex-1 space-x-4">
        {/* Profile Picture with subtle shadow */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic("medium");
            toggleDrawer();
          }}
          style={{
            shadowColor: isDarkMode ? "#1f2937" : "#4b5563",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View className="relative">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            {/* Online Indicator - more subtle */}
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></View>
          </View>
        </TouchableOpacity>

        {/* Search Bar - refined */}
        <TouchableOpacity
          activeOpacity={0.6}
          className={`flex-1 rounded-lg px-4 py-2.5  flex-row items-center mx-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-gray-50 border border-gray-100"
          }`}
          style={{
            shadowColor: isDarkMode ? "#000" : "#718096",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDarkMode ? 0.2 : 0.1,
            shadowRadius: 2,
          }}
          onPress={() => {
            triggerHaptic();
            router.push("/(pages)/search");
          }}
        >
          <Ionicons
            name="search"
            size={18}
            color={isDarkMode ? "#9CA3AF" : "#6b7280"}
          />
          <Text
            className={`text-sm ml-2 font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Search alumni, jobs, events...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Section: Actions */}
      <View className="flex-row items-center gap-2">
        {/* Create Post Button - updated to match messages button style */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="relative min-w-[36px] mr-2"
          style={{
            shadowColor: isDarkMode ? "#1f2937" : "#4b5563",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => {
            triggerHaptic("medium");
            router.push("/(pages)/create-post" as any);
          }}
        >
          <View
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={themeColors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="relative min-w-[36px]"
          style={{
            shadowColor: isDarkMode ? "#1f2937" : "#4b5563",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => {
            triggerHaptic("medium");
            router.push("/(pages)/messages");
          }}
        >
          <View
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={22}
              color={themeColors.primary}
            />
          </View>
          {/* Message Badge - Improved */}
          <View
            className="absolute -top-1 -right-1 bg-red-500 rounded-full flex items-center justify-center"
            style={{
              minWidth: 16,
              height: 16,
              paddingHorizontal: 1,
              borderWidth: 1.5,
              borderColor: isDarkMode ? themeColors.background : "#fff",
            }}
          >
            <Text className="text-white text-[9px] font-bold">5</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Header;
