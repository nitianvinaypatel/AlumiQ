import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/home/Header";
import { useRouter } from "expo-router";
import StorySection from "@/components/home/StorySection";
import UniversityHighlightsSection from "@/components/home/UniversityHighlightsSection";
import PostSection from "@/components/home/PostSection";
import { dummyPosts } from "@/helpers/postData";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Get the theme from context
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Apply the theme values
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={themeColors.background}
      />

      <Header scrollY={scrollY} />

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
      >
        <StorySection />

        <UniversityHighlightsSection />

        <View
          className={`p-4 rounded-xl shadow-sm ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <TouchableOpacity
              className={`ml-3 flex-1 px-4 py-2.5 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <Text className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                Share with your alumni network...
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`flex-row justify-between mt-4 pt-3 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View
                className={
                  isDarkMode
                    ? "bg-blue-900/30 p-1.5 rounded-full"
                    : "bg-blue-50 p-1.5 rounded-full"
                }
              >
                <Ionicons name="image" size={18} color={themeColors.primary} />
              </View>
              <Text
                className={`ml-2 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View
                className={
                  isDarkMode
                    ? "bg-green-900/30 p-1.5 rounded-full"
                    : "bg-green-50 p-1.5 rounded-full"
                }
              >
                <Ionicons
                  name="videocam"
                  size={18}
                  color={isDarkMode ? "#8FD87A" : "#7FC15E"}
                />
              </View>
              <Text
                className={`ml-2 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View
                className={
                  isDarkMode
                    ? "bg-yellow-900/30 p-1.5 rounded-full"
                    : "bg-yellow-50 p-1.5 rounded-full"
                }
              >
                <Ionicons
                  name="document-text"
                  size={18}
                  color={isDarkMode ? "#F7B94E" : "#E7A33E"}
                />
              </View>
              <Text
                className={`ml-2 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Document
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <PostSection posts={dummyPosts} />

        <View className="h-4" />
      </Animated.ScrollView>
    </View>
  );
}
