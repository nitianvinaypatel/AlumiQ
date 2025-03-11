import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
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
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <Animated.View
      className="flex-1 bg-white items-center justify-between py-10"
      style={containerStyle}
    >
      <View className="flex-1 items-center justify-center pt-16">
        <Animated.View className="relative" style={logoStyle}>
          <View className="w-20 h-20 bg-blue-600 rounded-xl items-center justify-center shadow-lg">
            <Text className="text-4xl font-bold text-white">A</Text>
          </View>
        </Animated.View>

        <Text className="mt-6 text-4xl font-bold text-blue-600">AlumiQ</Text>

        <Text className="mt-3 text-gray-600 text-center px-8 max-w-xs">
          Connect with your university network
        </Text>

        {/* Loading Progress - Simplified */}
        <View className="mt-12 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-blue-600 rounded-full"
            style={progressBarStyle}
          />
        </View>
      </View>

      {/* Footer Section - Simplified */}
      <View className="w-full pb-10">
        <View className="items-center">
          <Text className="text-gray-500 mb-5">
            Where alumni connections thrive
          </Text>

          <View className="flex-row space-x-4">
            <Pressable className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Ionicons name="school" size={20} color="#2563EB" />
            </Pressable>

            <Pressable className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Ionicons name="briefcase" size={20} color="#2563EB" />
            </Pressable>

            <Pressable className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Ionicons name="people" size={20} color="#2563EB" />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
