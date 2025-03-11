import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { storyData } from "../../helpers/homeData";

const StorySection = () => {
  const [stories, setStories] = useState(storyData);

  const handleViewStory = (id: number) => {
    setStories(
      stories.map((story) =>
        story.id === id ? { ...story, viewed: true, hasUpdate: false } : story
      )
    );
  };

  return (
    <View className="bg-white pt-2 pb-2 shadow-sm mb-2">
      <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className="font-bold text-lg text-gray-800">Stories</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-blue-600 font-medium mr-1">See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#0077B5" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            className="mr-3 mt-1 items-center"
            activeOpacity={0.8}
            onPress={() => handleViewStory(story.id)}
          >
            <View className="relative">
              {story.isYourStory ? (
                <View className="absolute -inset-1 rounded-full justify-center items-center">
                  <LinearGradient
                    colors={["#0077B5", "#0077B5"]}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0.15,
                    }}
                  />
                </View>
              ) : story.hasUpdate ? (
                <View className="absolute -inset-1 rounded-full justify-center items-center">
                  <LinearGradient
                    colors={["#0077B5", "#4f46e5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </View>
              ) : (
                <View className="absolute -inset-1 rounded-full justify-center items-center">
                  <View
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: story.viewed ? "#e5e7eb" : "#d1d5db",
                    }}
                  />
                </View>
              )}
              <View
                className="bg-white rounded-full p-1"
                style={{ width: 64, height: 64 }}
              >
                <Image
                  source={{ uri: story.image }}
                  className="w-full h-full rounded-full"
                />
                {story.isYourStory && (
                  <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-white w-6 h-6 items-center justify-center">
                    <Ionicons name="add" size={16} color="white" />
                  </View>
                )}
              </View>
            </View>
            <Text
              className={`text-xs mt-1 text-center max-w-16 ${
                story.viewed ? "text-gray-500" : "text-gray-800 font-medium"
              }`}
              numberOfLines={1}
            >
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StorySection;
