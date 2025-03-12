import React, { useRef, useEffect, useState, useMemo } from "react";
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
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDrawer } from "./DrawerContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  useTheme,
  ThemeColors,
  lightTheme,
  darkTheme,
  defaultTheme,
} from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  StatusBar.currentHeight || (Platform.OS === "ios" ? 44 : 0);
const DRAWER_WIDTH = Math.min(width * 0.85, 375);

// Define types for various components
interface MenuItem {
  id: number;
  title: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof FontAwesome5.glyphMap
    | keyof typeof MaterialIcons.glyphMap;
  iconType?: "ionicon" | "fontawesome" | "material";
  route: string;
  badge?: number;
}

type SecondaryMenuItemBase = {
  id: number;
  title: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof FontAwesome5.glyphMap
    | keyof typeof MaterialIcons.glyphMap;
  iconType?: "ionicon" | "fontawesome" | "material";
  divider?: boolean;
};

type RouteMenuItem = SecondaryMenuItemBase & {
  route: string;
  toggle?: undefined;
  onPress?: undefined;
};

type ToggleMenuItem = SecondaryMenuItemBase & {
  toggle: true;
  route?: undefined;
  onPress?: undefined;
};

type ActionMenuItem = SecondaryMenuItemBase & {
  onPress: () => void;
  toggle?: undefined;
  route?: undefined;
};

type SecondaryMenuItem = RouteMenuItem | ToggleMenuItem | ActionMenuItem;

interface ProfileStats {
  id: number;
  count: number;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export interface SideDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

// Primary menu items
const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "My Profile",
    icon: "person-outline",
    iconType: "material",
    route: "/(pages)/profile",
  },
  {
    id: 2,
    title: "My Network",
    icon: "people-outline",
    iconType: "material",
    route: "/(tabs)/network",
  },
  {
    id: 3,
    title: "Jobs",
    icon: "work-outline",
    iconType: "material",
    route: "/(tabs)/jobs",
  },
  {
    id: 4,
    title: "Messaging",
    icon: "chat",
    iconType: "material",
    route: "/(pages)/messages",
    badge: 5,
  },
  {
    id: 5,
    title: "Notifications",
    icon: "notifications",
    iconType: "material",
    route: "/(tabs)/notifications",
    badge: 12,
  },
];

// Secondary menu items
const secondaryMenuItems: SecondaryMenuItem[] = [
  {
    id: 2,
    title: "Find Alumni",
    icon: "search",
    iconType: "material",
    route: "/(pages)/search",
  },
  {
    id: 3,
    title: "My Items",
    icon: "bookmark-outline",
    iconType: "material",
    route: "/(tabs)/saved-items",
    divider: true,
  },
  {
    id: 4,
    title: "Create Post",
    icon: "post-add",
    iconType: "material",
    route: "/(tabs)/create-post",
  },
  {
    id: 5,
    title: "Settings & Privacy",
    icon: "settings",
    iconType: "material",
    route: "/(pages)/settings",
  },
  {
    id: 6,
    title: "Help Center",
    icon: "help-outline",
    iconType: "material",
    route: "/(tabs)/help",
  },
  {
    id: 7,
    title: "Dark Mode",
    icon: "dark-mode",
    iconType: "material",
    toggle: true,
  },
];

// Profile stats
const profileStats: ProfileStats[] = [
  {
    id: 1,
    count: 652,
    label: "Profile views",
    icon: "visibility",
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
    label: "Appearances",
    icon: "search",
  },
];

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isVisible,
  onClose,
}) => {
  const router = useRouter();
  const { theme: themeType, toggleTheme } = useTheme();
  const theme = themeType === "dark" ? darkTheme : lightTheme;
  const isDarkMode = themeType === "dark";

  // Animation values
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuItemsOpacity = useRef(new Animated.Value(0)).current;
  const profileSectionY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const togglePosition = useRef(
    new Animated.Value(isDarkMode ? 22 : 0)
  ).current;

  // State
  const [darkMode, setDarkMode] = useState(themeType === "dark");

  // Scroll view ref
  const scrollViewRef = useRef<ScrollView>(null);

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
          easing: Easing.bezier(0.25, 1, 0.5, 1),
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
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered animation for menu items
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(profileSectionY, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(menuItemsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
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

  // Update darkMode state when theme changes
  useEffect(() => {
    setDarkMode(themeType === "dark");
  }, [themeType]);

  // Update toggle position when dark mode changes
  useEffect(() => {
    Animated.timing(togglePosition, {
      toValue: isDarkMode ? 22 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

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

    // Toggle theme in context first
    toggleTheme();

    // Local state will be updated via the useEffect that watches themeType
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: "Check out my professional profile on AlumiQ!",
        url: "https://alumiq.com/profile/sarahjohnson",
        title: "My AlumiQ Profile",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderIcon = (item: MenuItem | SecondaryMenuItem, size: number) => {
    const iconColor = theme.primary;

    if (item.iconType === "fontawesome") {
      return (
        <FontAwesome5
          name={item.icon as any}
          size={size - 4}
          color={iconColor}
        />
      );
    } else if (item.iconType === "material") {
      return (
        <MaterialIcons name={item.icon as any} size={size} color={iconColor} />
      );
    } else {
      return <Ionicons name={item.icon as any} size={size} color={iconColor} />;
    }
  };

  const handleMenuItemPress = (item: SecondaryMenuItem) => {
    if ("toggle" in item && item.toggle) {
      toggleDarkMode();
    } else if ("route" in item && item.route) {
      handleNavigate(item.route);
    } else if ("onPress" in item && item.onPress) {
      item.onPress();
    }
  };

  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFill} className="z-50">
      {/* Backdrop with blur */}
      <Animated.View
        className="absolute inset-0"
        style={{
          opacity: backdropOpacity,
          backgroundColor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
        }}
      >
        <TouchableOpacity
          className="w-full h-full"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer Content */}
      <Animated.View
        className="absolute top-0 left-0 h-full shadow-2xl overflow-hidden"
        style={{
          width: DRAWER_WIDTH,
          backgroundColor: theme.background,
          borderTopRightRadius: Platform.OS === "ios" ? 16 : 0,
          borderBottomRightRadius: Platform.OS === "ios" ? 16 : 0,
          transform: [{ translateX }, { scale }],
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 24,
        }}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 25 : 15}
            className="absolute top-0 left-0 right-0 z-10"
            style={{ height: STATUSBAR_HEIGHT + 10 }}
            tint={isDarkMode ? "dark" : "light"}
          />
        )}

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ backgroundColor: theme.background }}
        >
          {/* User Profile Section */}
          <Animated.View
            style={{
              paddingTop: Platform.OS === "ios" ? 50 : STATUSBAR_HEIGHT + 20,
              transform: [{ translateY: profileSectionY }],
            }}
          >
            <LinearGradient
              colors={
                Array.isArray(theme.profileGradient)
                  ? theme.profileGradient
                  : defaultTheme.profileGradient
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute top-0 left-0 right-0 h-80"
            />

            <View className="px-5">
              <View className="flex-row justify-between items-center mb-3 pt-2">
                <TouchableOpacity
                  onPress={() => handleNavigate("/(pages)/profile")}
                  activeOpacity={0.9}
                  className="relative"
                >
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/women/1.jpg",
                    }}
                    className="w-20 h-20 rounded-full"
                    style={{
                      borderWidth: 3,
                      borderColor: theme.background,
                    }}
                  />
                  <View
                    className="w-4 h-4 rounded-full bg-green-500 absolute bottom-0 right-0 border-2"
                    style={{ borderColor: theme.background }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => handleNavigate("/(pages)/profile")}
                activeOpacity={0.8}
                className="mb-1"
              >
                <Text
                  style={{
                    color: theme.profileTextColor,
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 2,
                  }}
                >
                  Sarah Johnson
                </Text>
                <Text
                  style={{
                    color: theme.profileTextColor,
                    opacity: 0.9,
                    fontSize: 14,
                  }}
                >
                  Senior Software Engineer at TechCorp
                </Text>
              </TouchableOpacity>

              {/* Profile Actions */}
              <View className="flex-row mt-4 mb-2 pt-2">
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.cardBackground,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    flex: 1,
                    marginRight: 8,
                  }}
                  activeOpacity={0.8}
                  onPress={() => handleNavigate("/(pages)/profile")}
                >
                  <Text
                    style={{
                      color: theme.primary,
                      fontWeight: "600",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    View Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                  activeOpacity={0.8}
                  onPress={handleShareProfile}
                >
                  <Ionicons name="share-social" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Stats */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                marginHorizontal: 10,
                borderRadius: 12,
                overflow: "hidden",
                paddingHorizontal: 2,
                backgroundColor: theme.cardBackground,
              }}
            >
              {profileStats?.map((stat, index) => (
                <TouchableOpacity
                  key={stat.id}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 14,
                    borderRightWidth: index < profileStats.length - 1 ? 1 : 0,
                    borderRightColor: theme.divider,
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 4,
                      color: theme.text,
                    }}
                  >
                    {stat.count}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={stat.icon}
                      size={14}
                      color={theme.textSecondary}
                      style={{ marginRight: 3 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.textSecondary,
                      }}
                    >
                      {stat.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )) || null}
            </View>
          </Animated.View>

          {/* Primary Menu Items */}
          <Animated.View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginTop: 8,
              opacity: menuItemsOpacity,
            }}
          >
            {menuItems?.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  marginBottom: 2,
                  backgroundColor: "transparent",
                }}
                activeOpacity={0.7}
                onPress={() => handleNavigate(item.route)}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    backgroundColor: theme.iconBackground,
                  }}
                >
                  {renderIcon(item, 24)}
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.text,
                    fontWeight: "500",
                  }}
                >
                  {item.title}
                </Text>
                {item.badge && (
                  <View
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: theme.badgeBackground,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 6,
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: theme.badgeText,
                      }}
                    >
                      {item.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )) || null}
          </Animated.View>

          <View
            style={{
              height: 1,
              marginHorizontal: 16,
              marginVertical: 10,
              backgroundColor: theme.divider,
            }}
          />

          {/* Secondary Menu Items */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {secondaryMenuItems?.map((item) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                  }}
                  activeOpacity={0.7}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      backgroundColor: theme.iconBackground,
                    }}
                  >
                    {renderIcon(item, 24)}
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: theme.text,
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </Text>
                  {"toggle" in item && item.toggle && (
                    <View
                      style={{
                        width: 48,
                        height: 24,
                        borderRadius: 12,
                        padding: 2,
                        backgroundColor: isDarkMode
                          ? theme.primary
                          : theme.toggleBackground,
                      }}
                    >
                      <Animated.View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: theme.toggleIndicator,
                          transform: [{ translateX: togglePosition }],
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                          elevation: 2,
                        }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                {item.divider && (
                  <View
                    style={{
                      height: 1,
                      marginHorizontal: 4,
                      marginVertical: 10,
                      backgroundColor: theme.divider,
                    }}
                  />
                )}
              </React.Fragment>
            )) || null}
          </View>

          <View
            style={{
              height: 1,
              marginHorizontal: 16,
              marginVertical: 10,
              backgroundColor: theme.divider,
            }}
          />

          {/* Sign Out Button */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginHorizontal: 16,
              marginBottom: 8,
              borderRadius: 8,
              backgroundColor: theme.iconBackground,
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={22} color={theme.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 12,
                color: theme.primary,
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              marginVertical: 20,
              color: theme.textSecondary,
            }}
          >
            AlumiQ v1.2.0
          </Text>
        </ScrollView>
      </Animated.View>

      {/* Status Bar Overlay */}
      {Platform.OS === "android" && (
        <StatusBar
          backgroundColor="transparent"
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          translucent
        />
      )}
    </View>
  );
};

// Root component for drawer
const SideDrawerRoot: React.FC = () => {
  const { isDrawerVisible, closeDrawer } = useDrawer();
  return <SideDrawer isVisible={isDrawerVisible} onClose={closeDrawer} />;
};

export default SideDrawerRoot;
