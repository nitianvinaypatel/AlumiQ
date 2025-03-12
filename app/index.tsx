import React, { useEffect } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Theme colors
  const colors = {
    background: isDark ? "#121212" : "white",
    primary: "#2563EB", // blue-600
    primaryLight: isDark ? "#1E3A8A" : "#DBEAFE", // dark: blue-900, light: blue-50
    text: isDark ? "white" : "#1F2937", // dark: white, light: gray-800
    textSecondary: isDark ? "#9CA3AF" : "#6B7280", // dark: gray-400, light: gray-500
    progressBg: isDark ? "#374151" : "#E5E7EB", // dark: gray-700, light: gray-200
  };

  // Animation values - simplified
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const progressWidth = useSharedValue(0);

  // Simplified animation setup
  useEffect(() => {
    // Start with a quick fade in
    opacity.value = withTiming(1, { duration: 400 });

    // Logo animation
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Progress bar animation - single smooth animation
    progressWidth.value = withSequence(
      withTiming(0.3, { duration: 300 }),
      withTiming(0.6, { duration: 400 }),
      withTiming(
        1,
        {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (finished) => {
          if (finished) {
            // Navigate after animation completes
            runOnJS(navigateToLogin)();
          }
        }
      )
    );

    // Clean up function
    return () => {};
  }, []);

  const navigateToLogin = () => {
    router.replace("/(auth)/login");
  };

  // Animated styles - simplified
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: colors.background,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <Animated.View
      className="flex-1 items-center justify-between py-10"
      style={containerStyle}
    >
      <View className="flex-1 items-center justify-center pt-16">
        <Animated.View className="relative" style={logoStyle}>
          <View
            style={{ backgroundColor: colors.primary }}
            className="w-20 h-20 rounded-xl items-center justify-center shadow-lg"
          >
            <Text className="text-4xl font-bold text-white">A</Text>
          </View>
        </Animated.View>

        <Text
          style={{ color: colors.primary }}
          className="mt-6 text-4xl font-bold"
        >
          AlumiQ
        </Text>

        <Text
          style={{ color: colors.textSecondary }}
          className="mt-3 text-center px-8 max-w-xs"
        >
          Connect with your university network
        </Text>

        {/* Loading Progress - Simplified */}
        <View
          style={{ backgroundColor: colors.progressBg }}
          className="mt-12 w-64 h-1 rounded-full overflow-hidden"
        >
          <Animated.View
            style={[progressBarStyle, { backgroundColor: colors.primary }]}
            className="h-full rounded-full"
          />
        </View>
      </View>

      {/* Footer Section - Simplified */}
      <View className="w-full pb-10">
        <View className="items-center">
          <Text style={{ color: colors.textSecondary }} className="mb-5">
            Where alumni connections thrive
          </Text>

          <View className="flex-row space-x-4 gap-x-4">
            <Pressable
              style={{ backgroundColor: colors.primaryLight }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="school" size={20} color={colors.primary} />
            </Pressable>

            <Pressable
              style={{ backgroundColor: colors.primaryLight }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="briefcase" size={20} color={colors.primary} />
            </Pressable>

            <Pressable
              style={{ backgroundColor: colors.primaryLight }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="people" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
