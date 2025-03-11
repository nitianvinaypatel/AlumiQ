import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/home/Header";
import StorySection from "@/components/home/StorySection";
import UniversityHighlightsSection from "@/components/home/UniversityHighlightsSection";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

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
            >
              <View className="bg-blue-50 p-1.5 rounded-full">
                <Ionicons name="image" size={18} color="#0077B5" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <View className="bg-green-50 p-1.5 rounded-full">
                <Ionicons name="videocam" size={18} color="#7FC15E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <View className="bg-yellow-50 p-1.5 rounded-full">
                <Ionicons name="document-text" size={18} color="#E7A33E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Document</Text>
            </TouchableOpacity>
          </View>
        </View>

        {[1, 2, 3].map((item) => (
          <View key={item} className="bg-white mt-2 p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: `https://randomuser.me/api/portraits/${
                      item % 2 === 0 ? "men" : "women"
                    }/${item * 10}.jpg`,
                  }}
                  className="w-12 h-12 rounded-full border border-gray-200"
                />
                <View className="ml-3">
                  <Text className="font-bold text-gray-800">
                    {item % 2 === 0 ? "David Kim" : "Emily Rodriguez"}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {item % 2 === 0
                      ? "Software Engineer at TechCorp"
                      : "Marketing Director at GlobalBrands"}
                  </Text>
                  <Text className="text-xs text-gray-400">2h ago</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 text-gray-800 leading-6">
              {item % 2 === 0
                ? "Just finished an amazing project using React Native and TypeScript. The performance improvements were incredible! #ReactNative #MobileDev"
                : "Excited to announce our latest marketing campaign that increased user engagement by 45%! Check out the case study on our website. #Marketing #DigitalStrategy"}
            </Text>

            {item === 2 && (
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
                }}
                className="w-full h-48 rounded-lg mt-3"
                resizeMode="cover"
              />
            )}

            <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-100">
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="heart-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600">
                  {item * 24 + 12} Likes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600">{item * 5} Comments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View className="h-4" />
      </Animated.ScrollView>
    </View>
  );
}
