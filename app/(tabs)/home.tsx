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
export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const CreatePostButton = () => (
    <TouchableOpacity
      className="absolute bottom-6 right-6 bg-[#0077B5] shadow-lg rounded-full w-12 h-12 items-center justify-center"
      style={{ elevation: 4 }}
      onPress={() => router.push("/(pages)/create-post" as any)}
    >
      <Ionicons name="add" size={22} color="white" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" backgroundColor="white" />

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
            colors={["#0077B5"]}
            tintColor="#0077B5"
          />
        }
      >
        <StorySection />

        <UniversityHighlightsSection />

        <View className="bg-white p-4 mx-3 rounded-xl shadow-sm">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <TouchableOpacity
              className="ml-3 flex-1 bg-gray-100 px-4 py-2.5 rounded-full"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <Text className="text-gray-500">
                Share with your alumni network...
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-100">
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View className="bg-blue-50 p-1.5 rounded-full">
                <Ionicons name="image" size={18} color="#0077B5" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View className="bg-green-50 p-1.5 rounded-full">
                <Ionicons name="videocam" size={18} color="#7FC15E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(pages)/create-post" as any)}
            >
              <View className="bg-yellow-50 p-1.5 rounded-full">
                <Ionicons name="document-text" size={18} color="#E7A33E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Document</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PostSection posts={dummyPosts} />

        <View className="h-4" />
      </Animated.ScrollView>
      <CreatePostButton />
    </View>
  );
}
