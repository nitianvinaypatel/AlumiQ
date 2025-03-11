import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
  Easing,
  Share,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDrawer } from "./DrawerContext";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  StatusBar.currentHeight || (Platform.OS === "ios" ? 44 : 0);
const DRAWER_WIDTH = Math.min(width * 0.85, 375);

// Define types for menu items
interface MenuItem {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | keyof typeof FontAwesome5.glyphMap;
  iconType?: "ionicon" | "fontawesome";
  route: string;
  badge?: number;
  premium?: boolean;
}

interface SecondaryMenuItem {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | keyof typeof FontAwesome5.glyphMap;
  iconType?: "ionicon" | "fontawesome";
  toggle?: boolean;
  route?: string;
  divider?: boolean;
  onPress?: () => void;
}

interface PremiumFeature {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap | keyof typeof FontAwesome5.glyphMap;
  iconType?: "ionicon" | "fontawesome";
}

interface ProfileStats {
  id: number;
  count: number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface SideDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

// Menu items for the drawer
const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "My Profile",
    icon: "user",
    iconType: "fontawesome",
    route: "/(tabs)/profile",
  },
  {
    id: 2,
    title: "My Network",
    icon: "people",
    route: "/(tabs)/network",
  },
  {
    id: 3,
    title: "Jobs",
    icon: "briefcase",
    route: "/(tabs)/jobs",
  },
  {
    id: 4,
    title: "Messages",
    icon: "chatbubble-ellipses",
    route: "/(tabs)/messages",
    badge: 5,
  },
  {
    id: 5,
    title: "Notifications",
    icon: "notifications",
    route: "/(tabs)/notifications",
    badge: 12,
  },
  {
    id: 6,
    title: "Events",
    icon: "calendar",
    route: "/(tabs)/events",
  },
  {
    id: 7,
    title: "Groups",
    icon: "people-circle",
    route: "/(tabs)/groups",
  },
  {
    id: 8,
    title: "Learning",
    icon: "school",
    route: "/(tabs)/learning",
    premium: true,
  },
];

// Secondary menu items
const secondaryMenuItems: SecondaryMenuItem[] = [
  {
    id: 1,
    title: "Find Alumni",
    icon: "search",
    route: "/(tabs)/find-alumni",
  },
  {
    id: 2,
    title: "Alumni Directory",
    icon: "book",
    route: "/(tabs)/alumni-directory",
  },
  {
    id: 3,
    title: "Create Post",
    icon: "create",
    route: "/(tabs)/create-post",
    divider: true,
  },
  {
    id: 4,
    title: "Settings & Privacy",
    icon: "settings",
    route: "/(tabs)/settings",
  },
  {
    id: 5,
    title: "Help Center",
    icon: "help-circle",
    route: "/(tabs)/help",
  },
  {
    id: 6,
    title: "Dark Mode",
    icon: "moon",
    toggle: true,
  },
];

// Premium features
const premiumFeatures: PremiumFeature[] = [
  {
    id: 1,
    title: "InMail Credits",
    description: "Send messages to anyone",
    icon: "envelope",
    iconType: "fontawesome",
  },
  {
    id: 2,
    title: "Who Viewed Your Profile",
    description: "See all viewers",
    icon: "eye",
    iconType: "fontawesome",
  },
  {
    id: 3,
    title: "Advanced Insights",
    description: "Stand out to recruiters",
    icon: "chart-line",
    iconType: "fontawesome",
  },
];

// Profile stats
const profileStats: ProfileStats[] = [
  {
    id: 1,
    count: 652,
    label: "Profile views",
    icon: "eye",
  },
  {
    id: 2,
    count: 127,
    label: "Connections",
    icon: "people",
  },
  {
    id: 3,
    count: 24,
    label: "Search appearances",
    icon: "search",
  },
];

const SideDrawer: React.FC<SideDrawerProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  // Animation refs
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuItemsOpacity = useRef(new Animated.Value(0)).current;
  const profileSectionY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  // State
  const [darkMode, setDarkMode] = useState(false);
  const [premiumExpanded, setPremiumExpanded] = useState(false);

  // Animation config
  useEffect(() => {
    if (isVisible) {
      // Reset scroll position
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }

      // Start animations
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered animation for menu items
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(profileSectionY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(menuItemsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(menuItemsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Store dark mode preference
    const saveDarkModePreference = async () => {
      try {
        await AsyncStorage.setItem("@darkMode", darkMode ? "true" : "false");
      } catch (e) {
        console.log("Error saving dark mode preference");
      }
    };

    saveDarkModePreference();
  }, [isVisible, darkMode]);

  // Load dark mode preference
  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const value = await AsyncStorage.getItem("@darkMode");
        if (value !== null) {
          setDarkMode(value === "true");
        }
      } catch (e) {
        console.log("Error loading dark mode preference");
      }
    };

    loadDarkModePreference();
  }, []);

  // Scroll view ref for scrolling to top
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNavigate = (route: string) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Close drawer and navigate
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const toggleDarkMode = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDarkMode(!darkMode);
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: "Check out my AlumiQ profile!",
        url: "https://alumiq.com/profile/sarahjohnson",
        title: "My AlumiQ Profile",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const togglePremiumSection = () => {
    setPremiumExpanded(!premiumExpanded);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Backdrop with blur */}
      <Animated.View
        className={`absolute inset-0 ${
          darkMode ? "bg-black/70" : "bg-black/50"
        }`}
        style={{ opacity: backdropOpacity }}
      >
        <TouchableOpacity
          className="w-full h-full"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer Content */}
      <Animated.View
        className={`absolute top-0 left-0 h-full shadow-xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        } ${
          Platform.OS === "ios" ? "rounded-tr-2xl rounded-br-2xl" : ""
        } overflow-hidden`}
        style={{
          width: DRAWER_WIDTH,
          transform: [{ translateX }, { scale }],
        }}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={darkMode ? 20 : 10}
            className="absolute top-0 left-0 right-0 z-10"
            style={{ height: STATUSBAR_HEIGHT + 10 }}
            tint={darkMode ? "dark" : "light"}
          />
        )}

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          className={darkMode ? "bg-gray-900" : "bg-white"}
        >
          {/* User Profile Section */}
          <Animated.View
            className={`px-5 ${darkMode ? "bg-black" : "bg-gray-50"}`}
            style={{
              paddingTop: Platform.OS === "ios" ? 50 : STATUSBAR_HEIGHT + 20,
              transform: [{ translateY: profileSectionY }],
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => handleNavigate("/(tabs)/profile")}
                activeOpacity={0.9}
                className="relative"
              >
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/1.jpg",
                  }}
                  className="w-16 h-16 rounded-full border-2 border-blue-600"
                />
                <View className="w-3 h-3 rounded-full bg-green-600 absolute bottom-0.5 right-0.5 border-2 border-white" />
              </TouchableOpacity>

              <TouchableOpacity
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  darkMode ? "bg-gray-800" : "bg-blue-50"
                }`}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#0077B5" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => handleNavigate("/(tabs)/profile")}
              activeOpacity={0.8}
              className="mb-1"
            >
              <Text
                className={`text-xl font-bold mb-0.5 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sarah Johnson
              </Text>
              <Text
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Senior Software Engineer at TechCorp
              </Text>
            </TouchableOpacity>

            {/* Profile Stats */}
            <View className="flex-row mt-4 mb-4">
              {profileStats.map((stat, index) => (
                <TouchableOpacity
                  key={stat.id}
                  className={`flex-1 items-center py-2.5 ${
                    index < profileStats.length - 1
                      ? darkMode
                        ? "border-r border-gray-700"
                        : "border-r border-gray-200"
                      : ""
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-lg font-bold mb-0.5 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.count}
                  </Text>
                  <View className="flex-row items-center justify-center">
                    <Text
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.label}
                    </Text>
                    <Ionicons
                      name={stat.icon}
                      size={14}
                      color={darkMode ? "#9ca3af" : "#666666"}
                      className="ml-1"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                className="bg-blue-600 py-2.5 px-5 rounded-full flex-1 mr-2"
                activeOpacity={0.8}
                onPress={() => handleNavigate("/(tabs)/profile")}
              >
                <Text className="text-white font-semibold text-center text-sm">
                  View Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  darkMode ? "bg-gray-800" : "bg-blue-50"
                }`}
                activeOpacity={0.8}
                onPress={handleShareProfile}
              >
                <Ionicons name="share-social" size={20} color="#0077B5" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Premium Section */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={togglePremiumSection}
            className={`mx-4 my-2.5 p-4 rounded-lg ${
              darkMode ? "bg-amber-900/40" : "bg-amber-200"
            }`}
          >
            <View className="flex-row items-center">
              <FontAwesome5
                name="crown"
                size={16}
                color={darkMode ? "#E7A33E" : "#92400E"}
              />
              <Text
                className={`font-semibold text-base ml-2 flex-1 ${
                  darkMode ? "text-amber-400" : "text-amber-800"
                }`}
              >
                Try Premium for free
              </Text>
              <Ionicons
                name={premiumExpanded ? "chevron-up" : "chevron-down"}
                size={22}
                color={darkMode ? "#E7A33E" : "#92400E"}
              />
            </View>

            {premiumExpanded && (
              <View className="mt-3">
                <Text
                  className={`text-sm mb-2.5 ${
                    darkMode ? "text-amber-400" : "text-amber-800"
                  }`}
                >
                  Unlock exclusive premium features:
                </Text>

                {premiumFeatures.map((feature) => (
                  <View key={feature.id} className="flex-row mb-3">
                    {feature.iconType === "fontawesome" ? (
                      <FontAwesome5
                        name={feature.icon as any}
                        size={16}
                        color={darkMode ? "#E7A33E" : "#92400E"}
                        className="mt-0.5 mr-2.5"
                      />
                    ) : (
                      <Ionicons
                        name={feature.icon as any}
                        size={18}
                        color={darkMode ? "#E7A33E" : "#92400E"}
                        className="mt-0.5 mr-2.5"
                      />
                    )}
                    <View className="flex-1">
                      <Text
                        className={`font-semibold text-sm mb-0.5 ${
                          darkMode ? "text-white" : "text-amber-900"
                        }`}
                      >
                        {feature.title}
                      </Text>
                      <Text
                        className={`text-xs ${
                          darkMode ? "text-amber-400" : "text-amber-700"
                        }`}
                      >
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  className={`py-2 px-4 rounded-full mt-1 ${
                    darkMode ? "bg-amber-400" : "bg-amber-700"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`font-semibold text-sm text-center ${
                      darkMode ? "text-black" : "text-white"
                    }`}
                  >
                    Try free for 1 month
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Primary Menu Items */}
          <Animated.View
            className="px-4 py-1"
            style={{ opacity: menuItemsOpacity }}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center py-3 px-1"
                activeOpacity={0.7}
                onPress={() => handleNavigate(item.route)}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    darkMode ? "bg-gray-800" : "bg-blue-50"
                  }`}
                >
                  {item.iconType === "fontawesome" ? (
                    <FontAwesome5
                      name={item.icon as any}
                      size={18}
                      color="#0077B5"
                    />
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color="#0077B5"
                    />
                  )}
                </View>
                <Text
                  className={`text-base flex-1 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </Text>
                {item.badge && (
                  <View className="bg-red-500 min-w-6 h-6 rounded-full items-center justify-center px-1">
                    <Text className="text-xs font-bold text-white">
                      {item.badge}
                    </Text>
                  </View>
                )}
                {item.premium && (
                  <FontAwesome5 name="crown" size={12} color="#E7A33E" />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>

          <View
            className={`h-px mx-4 my-2.5 ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
          />

          {/* Secondary Menu Items */}
          <View className="px-4 py-1">
            {secondaryMenuItems.map((item) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  className="flex-row items-center py-3 px-1"
                  activeOpacity={0.7}
                  onPress={
                    item.toggle
                      ? toggleDarkMode
                      : item.route
                      ? () => handleNavigate(item.route)
                      : item.onPress
                  }
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      darkMode ? "bg-gray-800" : "bg-blue-50"
                    }`}
                  >
                    {item.iconType === "fontawesome" ? (
                      <FontAwesome5
                        name={item.icon as any}
                        size={18}
                        color="#0077B5"
                      />
                    ) : (
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color="#0077B5"
                      />
                    )}
                  </View>
                  <Text
                    className={`text-base flex-1 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </Text>
                  {item.toggle && (
                    <View
                      className={`w-10 h-5 rounded-full p-0.5 ${
                        darkMode ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <Animated.View
                        className="w-4 h-4 rounded-full bg-white"
                        style={{
                          transform: [{ translateX: darkMode ? 18 : 0 }],
                        }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                {item.divider && (
                  <View
                    className={`h-px mx-1 my-2.5 ${
                      darkMode ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          <View
            className={`h-px mx-4 my-2.5 ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
          />

          {/* Sign Out Button */}
          <TouchableOpacity
            className="flex-row items-center py-4 px-5"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={22} color="#0077B5" />
            <Text className="text-base font-semibold text-blue-600 ml-2.5">
              Sign Out
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text
            className={`text-xs text-center my-5 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            AlumiQ v1.2.0
          </Text>
        </ScrollView>
      </Animated.View>

      {/* Status Bar Overlay to ensure drawer appears above status bar */}
      {Platform.OS === "android" && (
        <StatusBar
          backgroundColor="transparent"
          barStyle={darkMode ? "light-content" : "dark-content"}
          translucent
        />
      )}
    </View>
  );
};

// This component will be rendered at the root level of the app
const SideDrawerRoot: React.FC = () => {
  const { isDrawerVisible, closeDrawer } = useDrawer();
  return <SideDrawer isVisible={isDrawerVisible} onClose={closeDrawer} />;
};

export default SideDrawerRoot;
