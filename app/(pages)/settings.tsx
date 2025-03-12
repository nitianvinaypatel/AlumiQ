import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme, lightTheme, darkTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  badge?: string | number;
}

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  profileImage: string;
  premium: boolean;
  role?: string;
  organization?: string;
  memberSince?: string;
  lastLogin?: string;
  accountType?: "basic" | "premium" | "enterprise";
  verificationStatus?: "verified" | "pending" | "unverified";
}

// Components
const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  icon,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  return (
    <View className={`mb-2 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        {icon && <View className="mr-2">{icon}</View>}
        <Text
          className={`text-base font-semibold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </Text>
      </View>
      <View>{children}</View>
    </View>
  );
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  rightElement,
  onPress,
  badge,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between px-4 py-3 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center flex-1">
        <View
          className={`w-10 h-10 rounded-full ${
            isDarkMode ? "bg-gray-700" : themeColors.iconBackground
          } items-center justify-center`}
        >
          {icon}
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {title}
            </Text>
            {badge && (
              <View className="ml-2 px-2 py-0.5 rounded-full bg-red-500">
                <Text className="text-white text-xs font-bold">{badge}</Text>
              </View>
            )}
          </View>
          {description && (
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } mt-0.5`}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      <View className="ml-4">{rightElement}</View>
    </TouchableOpacity>
  );
};

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  icon,
  title,
  description,
  value,
  onToggle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  return (
    <SettingItem
      icon={icon}
      title={title}
      description={description}
      onPress={disabled ? undefined : onToggle}
      rightElement={
        <Switch
          trackColor={{
            false: isDarkMode ? "#3E4042" : "#E0E0E0",
            true: themeColors.primary,
          }}
          thumbColor={value ? "#FFFFFF" : isDarkMode ? "#B0B3B8" : "#FFFFFF"}
          ios_backgroundColor={isDarkMode ? "#3E4042" : "#E0E0E0"}
          onValueChange={disabled ? undefined : onToggle}
          value={value}
          disabled={disabled}
        />
      }
    />
  );
};

const Settings: React.FC = () => {
  // Theme
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  // State
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [dataUsageEnabled, setDataUsageEnabled] = useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Mock user data
  const user: UserProfile = {
    name: "Sarah Johnson",
    email: "sarah@alumiq.in",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    premium: true,
    role: "Senior Software Engineer",
    organization: "TechVision Inc.",
    memberSince: "May 2021",
    lastLogin: "Today at 9:45 AM",
    accountType: "premium",
    verificationStatus: "verified",
  };

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem("userSettings");
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setNotificationsEnabled(settings.notifications ?? false);
          setEmailEnabled(settings.email ?? true);
          setTwoFactorEnabled(settings.twoFactor ?? false);
          setDataUsageEnabled(settings.dataUsage ?? true);
          setBiometricEnabled(settings.biometric ?? false);
          setLocationEnabled(settings.location ?? true);
          setAnalyticsEnabled(settings.analytics ?? true);
          setAutoPlayEnabled(settings.autoPlay ?? true);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage
  const saveSettings = async (key: string, value: boolean) => {
    try {
      const storedSettings = await AsyncStorage.getItem("userSettings");
      const settings = storedSettings ? JSON.parse(storedSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem("userSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Toggle handlers with storage
  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    saveSettings("notifications", newValue);
  };

  const handleToggleEmail = () => {
    const newValue = !emailEnabled;
    setEmailEnabled(newValue);
    saveSettings("email", newValue);
  };

  const handleToggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    saveSettings("twoFactor", newValue);

    if (newValue) {
      // In a real app, this would navigate to 2FA setup
      Alert.alert(
        "Two-Factor Authentication",
        "You'll be guided through the setup process for two-factor authentication.",
        [{ text: "OK" }]
      );
    }
  };

  const handleToggleDataUsage = () => {
    const newValue = !dataUsageEnabled;
    setDataUsageEnabled(newValue);
    saveSettings("dataUsage", newValue);
  };

  const handleToggleBiometric = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    saveSettings("biometric", newValue);

    if (newValue) {
      // In a real app, this would trigger biometric setup
      Alert.alert(
        "Biometric Authentication",
        "You'll be prompted to set up fingerprint or face recognition.",
        [{ text: "OK" }]
      );
    }
  };

  const handleToggleLocation = () => {
    const newValue = !locationEnabled;
    setLocationEnabled(newValue);
    saveSettings("location", newValue);
  };

  const handleToggleAnalytics = () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    saveSettings("analytics", newValue);
  };

  const handleToggleAutoPlay = () => {
    const newValue = !autoPlayEnabled;
    setAutoPlayEnabled(newValue);
    saveSettings("autoPlay", newValue);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          // In a real app, this would clear auth tokens and navigate to login
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert(
              "Account Deletion",
              "Your account deletion request has been submitted."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} ${
        Platform.OS === "ios" ? "mt-0" : "mt-8"
      }`}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView className="flex-1">
          {/* Header */}
          <View
            className={`flex-row items-center justify-between px-4 py-3 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <TouchableOpacity className="p-1" onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Settings
            </Text>
            <TouchableOpacity className="p-1">
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={themeColors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View
            className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} mb-2`}
          >
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={{ uri: user.profileImage }}
                  className="w-16 h-16 rounded-full"
                />
                {user.verificationStatus === "verified" && (
                  <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View className="flex-1 ml-4">
                <Text
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.name}
                </Text>
                <Text
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mt-0.5`}
                >
                  {user.email}
                </Text>
                <View className="flex-row mt-1">
                  {user.premium && (
                    <View className="bg-gradient-to-r from-yellow-600 to-amber-500 px-2 py-0.5 rounded-full mr-2">
                      <Text className="text-white text-xs font-semibold">
                        Premium
                      </Text>
                    </View>
                  )}
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Member since {user.memberSince}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className={`px-3 py-1.5 rounded-full border ${
                  isDarkMode ? "border-blue-500" : "border-blue-600"
                }`}
                onPress={() => router.push("/(pages)/profile")}
              >
                <Text
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } font-medium`}
                >
                  View
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`mt-4 p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <View className="flex-row items-center">
                <FontAwesome5
                  name="crown"
                  size={16}
                  color={isDarkMode ? "#FFD700" : "#B45309"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.accountType === "premium"
                    ? "Premium Account"
                    : "Basic Account"}
                </Text>
              </View>
              <Text
                className={`mt-1 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {user.accountType === "premium"
                  ? "You have access to all premium features."
                  : "Upgrade to premium for additional features."}
              </Text>
              {user.accountType !== "premium" && (
                <TouchableOpacity
                  className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 py-2 rounded-lg items-center"
                  onPress={() =>
                    Alert.alert(
                      "Upgrade",
                      "This would navigate to the premium upgrade screen."
                    )
                  }
                >
                  <Text className="text-white font-medium">Upgrade Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Account Section */}
          <SettingsSection
            title="Account"
            icon={
              <MaterialIcons
                name="account-circle"
                size={20}
                color={themeColors.primary}
              />
            }
          >
            <SettingItem
              icon={
                <MaterialIcons
                  name="security"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Account security"
              description="Password, login history, devices"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Security",
                  "This would navigate to account security settings."
                )
              }
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="verified-user"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Two-factor authentication"
              description="Add an extra layer of security"
              value={twoFactorEnabled}
              onToggle={handleToggleTwoFactor}
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="fingerprint"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Biometric login"
              description="Use fingerprint or face recognition"
              value={biometricEnabled}
              onToggle={handleToggleBiometric}
              disabled={Platform.OS === "web"}
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="person"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Personal information"
              description="Name, phone number, address"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Personal Info",
                  "This would navigate to personal information settings."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="payment"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Payment methods"
              description="Manage your payment options"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Payment Methods",
                  "This would navigate to payment methods settings."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="history"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Login activity"
              description={`Last login: ${user.lastLogin}`}
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Login Activity",
                  "This would show your recent login history."
                )
              }
            />
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection
            title="Notifications"
            icon={
              <Ionicons
                name="notifications"
                size={20}
                color={themeColors.primary}
              />
            }
          >
            <ToggleSetting
              icon={
                <Ionicons
                  name="notifications"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Push notifications"
              description="Messages, connections, job alerts"
              value={notificationsEnabled}
              onToggle={handleToggleNotifications}
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="email"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Email notifications"
              description="Weekly updates and important alerts"
              value={emailEnabled}
              onToggle={handleToggleEmail}
            />
            <SettingItem
              icon={
                <Ionicons
                  name="options"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Notification preferences"
              description="Customize what you get notified about"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Notification Preferences",
                  "This would navigate to notification preferences."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="do-not-disturb"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Do Not Disturb"
              description="Schedule quiet hours"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Do Not Disturb",
                  "This would navigate to DND settings."
                )
              }
            />
          </SettingsSection>

          {/* Display Section */}
          <SettingsSection
            title="Display"
            icon={
              <Ionicons
                name="color-palette"
                size={20}
                color={themeColors.primary}
              />
            }
          >
            <ToggleSetting
              icon={
                <Ionicons name="moon" size={22} color={themeColors.primary} />
              }
              title="Dark mode"
              description="Change app appearance"
              value={isDarkMode}
              onToggle={handleThemeToggle}
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="format-size"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Text size"
              description="Adjust the app's text size"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Text Size",
                  "This would navigate to text size settings."
                )
              }
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="play-circle-outline"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Auto-play videos"
              description="Play videos automatically while scrolling"
              value={autoPlayEnabled}
              onToggle={handleToggleAutoPlay}
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="language"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Language"
              description="English (US)"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Language",
                  "This would navigate to language settings."
                )
              }
            />
          </SettingsSection>

          {/* Data & Privacy */}
          <SettingsSection
            title="Data & Privacy"
            icon={
              <MaterialIcons
                name="shield"
                size={20}
                color={themeColors.primary}
              />
            }
          >
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="data-usage"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Data saver mode"
              description="Reduce mobile data usage"
              value={dataUsageEnabled}
              onToggle={handleToggleDataUsage}
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="location-on"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Location services"
              description="Allow app to access your location"
              value={locationEnabled}
              onToggle={handleToggleLocation}
            />
            <ToggleSetting
              icon={
                <MaterialIcons
                  name="analytics"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Analytics"
              description="Help improve the app by sharing usage data"
              value={analyticsEnabled}
              onToggle={handleToggleAnalytics}
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="download"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Download your data"
              description="Get a copy of your data and activity"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Download Data",
                  "This would initiate a data download request."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="privacy-tip"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Privacy settings"
              description="Control who can see your profile"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Privacy Settings",
                  "This would navigate to privacy settings."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="delete-forever"
                  size={22}
                  color={themeColors.error}
                />
              }
              title="Delete account"
              description="Permanently remove your account and data"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={handleDeleteAccount}
            />
          </SettingsSection>

          {/* Help & About */}
          <SettingsSection
            title="Help & About"
            icon={
              <MaterialIcons
                name="info"
                size={20}
                color={themeColors.primary}
              />
            }
          >
            <SettingItem
              icon={
                <MaterialIcons
                  name="help"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Help center"
              description="Get support and answers to common questions"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Help Center",
                  "This would navigate to the help center."
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="feedback"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Send feedback"
              description="Help us improve the app"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert("Feedback", "This would open a feedback form.")
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="info"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="About"
              description="Version 2.4.1"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "About",
                  "AlumiQ - Version 2.4.1\nBuild 2023.10.15\n© 2025 Your Company"
                )
              }
            />
            <SettingItem
              icon={
                <MaterialIcons
                  name="description"
                  size={22}
                  color={themeColors.primary}
                />
              }
              title="Terms & Policies"
              description="Legal information and agreements"
              rightElement={
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={isDarkMode ? "#B0B3B8" : "#757575"}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Terms & Policies",
                  "This would navigate to terms and policies."
                )
              }
            />
          </SettingsSection>

          {/* Sign out button */}
          <TouchableOpacity
            className={`mx-4 my-4 py-3 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } items-center`}
            onPress={handleSignOut}
          >
            <Text className="text-red-600 text-base font-medium">Sign Out</Text>
          </TouchableOpacity>

          <View
            className={`p-4 items-center ${
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              } mb-1`}
            >
              © 2025 Your Company
            </Text>
            <Text
              className={`text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Terms · Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Settings;
