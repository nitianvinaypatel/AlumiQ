import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
const SettingsSection = ({ title, children }) => (
  <View className="mb-2 bg-white">
    <Text className="text-base font-semibold px-4 py-3 border-b border-gray-100">
      {title}
    </Text>
    <View>{children}</View>
  </View>
);

const SettingItem = ({ icon, title, description, rightElement }) => (
  <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
    <View className="flex-row items-center flex-1">
      <View className="w-10 items-center">{icon}</View>
      <View className="ml-2 flex-1">
        <Text className="text-base">{title}</Text>
        {description && (
          <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
        )}
      </View>
    </View>
    <View className="ml-4">{rightElement}</View>
  </TouchableOpacity>
);

const ToggleSetting = ({ icon, title, description, value, onToggle }) => (
  <SettingItem
    icon={icon}
    title={title}
    description={description}
    rightElement={
      <Switch
        trackColor={{ false: "#E0E0E0", true: "#0A66C2" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E0E0E0"
        onValueChange={onToggle}
        value={value}
      />
    }
  />
);

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataUsageEnabled, setDataUsageEnabled] = useState(true);

  const user = {
    name: "Sarah Johnson",
    email: "sarah@alumiq.in",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    premium: true,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mt-8">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity className="p-1" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Settings</Text>
          <TouchableOpacity className="p-1">
            <Ionicons name="help-circle-outline" size={24} color="#0A66C2" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="flex-row items-center p-4 bg-white mb-2">
          <Image
            source={{ uri: user.profileImage }}
            className="w-16 h-16 rounded-full"
          />
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold">{user.name}</Text>
            <Text className="text-sm text-gray-500 mt-0.5">{user.email}</Text>
            {user.premium && (
              <View className="bg-yellow-600 px-2 py-0.5 rounded-full self-start mt-1">
                <Text className="text-white text-xs font-semibold">
                  Premium
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity className="px-3 py-1.5 rounded-full border border-blue-600">
            <Text className="text-blue-600 font-medium">Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingItem
            icon={<MaterialIcons name="security" size={22} color="#0A66C2" />}
            title="Account security"
            description="Password, login history, devices"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
          <ToggleSetting
            icon={
              <MaterialIcons name="verified-user" size={22} color="#0A66C2" />
            }
            title="Two-factor authentication"
            description="Add an extra layer of security"
            value={twoFactorEnabled}
            onToggle={() => setTwoFactorEnabled((prev) => !prev)}
          />
          <SettingItem
            icon={<MaterialIcons name="person" size={22} color="#0A66C2" />}
            title="Personal information"
            description="Name, phone number, address"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <ToggleSetting
            icon={<Ionicons name="notifications" size={22} color="#0A66C2" />}
            title="Push notifications"
            description="Messages, connections, job alerts"
            value={notificationsEnabled}
            onToggle={() => setNotificationsEnabled((prev) => !prev)}
          />
          <ToggleSetting
            icon={<MaterialIcons name="email" size={22} color="#0A66C2" />}
            title="Email notifications"
            description="Weekly updates and important alerts"
            value={emailEnabled}
            onToggle={() => setEmailEnabled((prev) => !prev)}
          />
          <SettingItem
            icon={<Ionicons name="options" size={22} color="#0A66C2" />}
            title="Notification preferences"
            description="Customize what you get notified about"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
        </SettingsSection>

        {/* Display Section */}
        <SettingsSection title="Display">
          <ToggleSetting
            icon={<Ionicons name="moon" size={22} color="#0A66C2" />}
            title="Dark mode"
            description="Change app appearance"
            value={darkModeEnabled}
            onToggle={() => setDarkModeEnabled((prev) => !prev)}
          />
          <SettingItem
            icon={
              <MaterialIcons name="format-size" size={22} color="#0A66C2" />
            }
            title="Text size"
            description="Adjust the app's text size"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy">
          <ToggleSetting
            icon={<MaterialIcons name="data-usage" size={22} color="#0A66C2" />}
            title="Data saver mode"
            description="Reduce mobile data usage"
            value={dataUsageEnabled}
            onToggle={() => setDataUsageEnabled((prev) => !prev)}
          />
          <SettingItem
            icon={<MaterialIcons name="download" size={22} color="#0A66C2" />}
            title="Download your data"
            description="Get a copy of your data and activity"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
          <SettingItem
            icon={
              <MaterialIcons name="privacy-tip" size={22} color="#0A66C2" />
            }
            title="Privacy settings"
            description="Control who can see your profile"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
        </SettingsSection>

        {/* Help & About */}
        <SettingsSection title="Help & About">
          <SettingItem
            icon={<MaterialIcons name="help" size={22} color="#0A66C2" />}
            title="Help center"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
          <SettingItem
            icon={<MaterialIcons name="info" size={22} color="#0A66C2" />}
            title="About"
            description="Version 2.4.1"
            rightElement={
              <Ionicons name="chevron-forward" size={22} color="#757575" />
            }
          />
        </SettingsSection>

        {/* Sign out button */}
        <TouchableOpacity className="mx-4 my-2 py-3 bg-white rounded items-center">
          <Text className="text-red-600 text-base font-medium">Sign Out</Text>
        </TouchableOpacity>

        <View className="p-4 items-center">
          <Text className="text-xs text-gray-500 mb-1">
            © 2025 Your Company
          </Text>
          <Text className="text-xs text-gray-500">Terms · Privacy Policy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
