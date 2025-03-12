import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useTheme, lightTheme, darkTheme } from "@/contexts/ThemeContext";

// Custom animated tab bar icon component
interface AnimatedIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}

const AnimatedIcon = ({ name, color, size, focused }: AnimatedIconProps) => {
  // Use the filled icon variant when focused
  const iconName = focused
    ? (name.replace("-outline", "") as keyof typeof Ionicons.glyphMap)
    : name;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(focused ? 1.1 : 1, {
            duration: 150,
          }),
        },
      ],
      opacity: withTiming(focused ? 1 : 0.7, { duration: 150 }),
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

export default function TabsLayout() {
  // Get current theme
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Determine if we're on iOS for the blur effect
  const isIOS = Platform.OS === "ios";

  // LinkedIn-inspired colors
  const LINKEDIN_BLUE = theme.primary;

  // Tab bar style with conditional blur effect
  const tabBarStyle = useMemo(
    () => ({
      paddingBottom: 8,
      paddingTop: 8,
      height: 60,
      borderTopWidth: 0.5,
      borderTopColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)",
      elevation: 8,
      shadowColor: isDarkMode ? "#000" : "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: isDarkMode ? 0.2 : 0.1,
      shadowRadius: 3,
      backgroundColor: isDarkMode
        ? theme.cardBackground
        : isIOS
        ? "rgba(255, 255, 255, 0.85)"
        : "white",
    }),
    [isIOS, isDarkMode, theme]
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: LINKEDIN_BLUE, // LinkedIn blue color
        tabBarInactiveTintColor: isDarkMode ? "#aaa" : "#666",
        tabBarStyle: tabBarStyle,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          paddingBottom: 2,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint={isDarkMode ? "dark" : "light"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedIcon
              name="home-outline"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          headerShown: false,
          title: "My Network",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedIcon
              name="people-outline"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="get-referral"
        options={{
          headerShown: false,
          title: "Referrals",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedIcon
              name="git-network-outline"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          title: "Notifications",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedIcon
              name="notifications-outline"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          headerShown: false,
          title: "Jobs",
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedIcon
              name="briefcase-outline"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
