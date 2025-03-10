import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Button from "@/components/Button";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// Story data
const storyData = [
  {
    id: 1,
    name: "Your Story",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    isYourStory: true,
    viewed: false,
  },
  {
    id: 2,
    name: "David Kim",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    isYourStory: false,
    viewed: false,
    hasUpdate: true,
  },
  {
    id: 3,
    name: "Sarah Lee",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    isYourStory: false,
    viewed: false,
    hasUpdate: true,
  },
  {
    id: 4,
    name: "Michael Chen",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    isYourStory: false,
    viewed: true,
    hasUpdate: false,
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    isYourStory: false,
    viewed: false,
    hasUpdate: true,
  },
  {
    id: 6,
    name: "James Wilson",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    isYourStory: false,
    viewed: true,
    hasUpdate: false,
  },
  {
    id: 7,
    name: "Olivia Taylor",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    isYourStory: false,
    viewed: false,
    hasUpdate: true,
  },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchFocused, setSearchFocused] = useState(false);
  const [stories, setStories] = useState(storyData);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 3],
    extrapolate: "clamp",
  });

  const handleViewStory = (id: number) => {
    setStories(
      stories.map((story) =>
        story.id === id ? { ...story, viewed: true, hasUpdate: false } : story
      )
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" backgroundColor="white" />

      {/* Enhanced Header */}
      <Animated.View
        style={{
          opacity: headerOpacity,
          elevation: headerElevation,
        }}
        className="bg-white px-4 pt-10 py-2 flex-row items-center justify-between border-b border-gray-200 shadow-sm"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="relative">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-11 h-11 rounded-full border-2 border-blue-500"
            />
            <View className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border border-white"></View>
          </View>
          <View
            className={`flex-1 flex-row items-center bg-gray-100 rounded-full ${
              searchFocused ? "border border-blue-400" : ""
            }`}
          >
            <Ionicons
              name="search"
              size={18}
              color="#6b7280"
              style={{ marginLeft: 12 }}
            />
            <TextInput
              placeholder="Search alumni..."
              className="px-2 py-2 text-sm flex-1"
              placeholderTextColor="#6b7280"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.7} className="mr-3 relative">
            <Ionicons name="notifications-outline" size={24} color="#0077B5" />
            <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#0077B5"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

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
        {/* Stories Section */}
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
                  {/* Story ring */}
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

                  {/* Profile image */}
                  <View
                    className="bg-white rounded-full p-1"
                    style={{ width: 64, height: 64 }}
                  >
                    <Image
                      source={{ uri: story.image }}
                      className="w-full h-full rounded-full"
                    />

                    {/* Add button for your story */}
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

        {/* University Highlights with Gradient */}
        <View className="mt-2 mb-3 overflow-hidden">
          <View className="px-4 mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <LinearGradient
                colors={["#0077B5", "#4f46e5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-8 h-8 rounded-lg items-center justify-center mr-2"
              >
                <Ionicons name="school" size={18} color="white" />
              </LinearGradient>
              <Text className="font-bold text-lg text-gray-800">
                University Highlights
              </Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium mr-1">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#0077B5" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
            className="pb-1"
          >
            {[
              {
                id: 1,
                title: "Annual Alumni Gala",
                date: "Jun 15, 2023",
                location: "Grand Hall",
                attendees: 120,
                image:
                  "https://thearchitecturedesigns.com/wp-content/uploads/2020/04/University-of-Georgia-10.jpg",
                category: "Networking",
                featured: true,
              },
              {
                id: 2,
                title: "Career Fair 2023",
                date: "May 22, 2023",
                location: "Student Center",
                attendees: 350,
                image:
                  "https://th.bing.com/th/id/R.cb4b57f6f2d29ad7fa056cda179934f0?rik=sZbqvvAo1l7lpA&riu=http%3a%2f%2fwww.timesnews.co.uk%2fwp-content%2fuploads%2f2013%2f11%2fHarvard-University.jpg&ehk=Tq5%2fCwirwQzWPWayvjbDf8%2bgrGsuB7p3jBUpszITQ1g%3d&risl=&pid=ImgRaw&r=0",
                category: "Career",
                featured: false,
              },
              {
                id: 3,
                title: "Research Symposium",
                date: "Jul 10, 2023",
                location: "Science Building",
                attendees: 85,
                image:
                  "https://1.bp.blogspot.com/-TtlrJj6dDUM/WXWPd145E3I/AAAAAAAAlbc/0owXAO51ehUTUejCsDOUETjtgWXjAlNEACLcBGAs/s1600/University+of+Oxford+3.jpg",
                category: "Academic",
                featured: true,
              },
              {
                id: 4,
                title: "Homecoming Weekend",
                date: "Aug 05, 2023",
                location: "Main Campus",
                attendees: 500,
                image:
                  "https://th.bing.com/th/id/R.789b7ef19c0c4d8ad6f78e5ac747ffdc?rik=i9eWFtzH%2bkDjcQ&riu=http%3a%2f%2ffearthetalons.com%2fimages%2flovett.jpg&ehk=q4KNN0mcluJa47AjwksCc%2bwH4E9kFdHfb%2fRnuVbSBSM%3d&risl=&pid=ImgRaw&r=0",
                category: "Social",
                featured: false,
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                className="mr-4"
                activeOpacity={0.9}
                style={{ width: width * 0.7 }}
              >
                <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <View className="relative">
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-40 rounded-t-xl"
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                      }}
                    />
                    {item.featured && (
                      <View className="absolute top-3 right-3 bg-blue-500 px-2 py-1 rounded-md">
                        <Text className="text-white text-xs font-bold">
                          Featured
                        </Text>
                      </View>
                    )}
                    <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md">
                      <Text className="text-blue-600 text-xs font-medium">
                        {item.category}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3">
                    <Text className="font-bold text-base text-gray-800">
                      {item.title}
                    </Text>

                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <View className="bg-blue-50 p-1 rounded-md">
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#0077B5"
                          />
                        </View>
                        <Text className="text-gray-600 text-xs ml-1 font-medium">
                          {item.date}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <View className="bg-blue-50 p-1 rounded-md">
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#0077B5"
                          />
                        </View>
                        <Text className="text-gray-600 text-xs ml-1 font-medium">
                          {item.location}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="flex-row items-center -space-x-2">
                          {[1, 2, 3].map((avatar) => (
                            <Image
                              key={avatar}
                              source={{
                                uri: `https://randomuser.me/api/portraits/${
                                  avatar % 2 === 0 ? "men" : "women"
                                }/${avatar + 10}.jpg`,
                              }}
                              className="w-6 h-6 rounded-full border border-white"
                            />
                          ))}
                        </View>
                        <Text className="text-gray-600 text-xs ml-1">
                          +{item.attendees} attending
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="bg-blue-500 px-3 py-1.5 rounded-md"
                        activeOpacity={0.8}
                      >
                        <Text className="text-white text-xs font-medium">
                          RSVP
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Create Post Card */}
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
                <Ionicons name="calendar" size={18} color="#E7A33E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <View className="bg-red-50 p-1.5 rounded-full">
                <Ionicons name="school" size={18} color="#F5987E" />
              </View>
              <Text className="ml-2 text-gray-700 font-medium">Alumni</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Feed Posts */}
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="bg-white p-4 mt-3 mx-3 rounded-xl shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri:
                      item === 1
                        ? "https://randomuser.me/api/portraits/women/44.jpg"
                        : item === 2
                        ? "https://randomuser.me/api/portraits/men/32.jpg"
                        : "https://randomuser.me/api/portraits/women/68.jpg",
                  }}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
                <View className="ml-3">
                  <View className="flex-row items-center">
                    <Text className="font-bold text-gray-800">
                      {item === 1
                        ? "Sarah Johnson"
                        : item === 2
                        ? "Michael Chen"
                        : "Emily Rodriguez"}
                    </Text>
                    {item === 2 && (
                      <View className="ml-2 bg-blue-100 px-1.5 py-0.5 rounded">
                        <Text className="text-blue-700 text-xs font-medium">
                          Recruiter
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-xs">
                      {item === 1
                        ? "Class of 2018 • Psychology"
                        : item === 2
                        ? "Class of 2015 • Computer Science"
                        : "Class of 2019 • Business"}
                    </Text>
                    <View className="w-1 h-1 bg-gray-400 rounded-full mx-1.5"></View>
                    <Text className="text-gray-500 text-xs">{item}h ago</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 text-gray-800 leading-5">
              {item === 1
                ? "Just attended the alumni networking event! Great to reconnect with old classmates and make new connections. The panel discussion on career transitions was particularly insightful. #AlumniPride #ClassOf2018"
                : item === 2
                ? "Looking for software engineering interns from our university! If you're interested or know someone who might be, please reach out. We have several positions available for summer 2023."
                : "Excited to announce that our alumni association is organizing a fundraiser for the new campus library. Let's give back to our alma mater! The goal is to raise $50,000 by the end of the month. #GivingBack #AlumniImpact"}
            </Text>

            {item === 1 && (
              <Image
                source={{
                  uri: "https://source.unsplash.com/random/800x600?networking,event",
                }}
                className="w-full h-48 rounded-lg mt-3"
                resizeMode="cover"
              />
            )}

            {item === 2 && (
              <TouchableOpacity activeOpacity={0.9} className="mt-3">
                <LinearGradient
                  colors={["#f0f9ff", "#dbeafe"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-3 rounded-lg border border-blue-200"
                >
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-lg">
                      <FontAwesome5
                        name="briefcase"
                        size={16}
                        color="#0077B5"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-bold text-gray-800">
                        Software Engineering Intern
                      </Text>
                      <Text className="text-gray-600 text-sm mt-0.5">
                        TechVision Inc. • San Francisco, CA
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-blue-600 text-xs font-medium">
                          Apply Now
                        </Text>
                        <MaterialIcons
                          name="arrow-forward-ios"
                          size={12}
                          color="#0077B5"
                          style={{ marginLeft: 4 }}
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {item === 3 && (
              <TouchableOpacity activeOpacity={0.9} className="mt-3">
                <LinearGradient
                  colors={["#fff7ed", "#ffedd5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-3 rounded-lg border border-orange-200"
                >
                  <View className="flex-row items-center">
                    <View className="bg-orange-100 p-2 rounded-lg">
                      <FontAwesome5
                        name="hand-holding-heart"
                        size={16}
                        color="#f97316"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-bold text-gray-800">
                        Library Fundraiser Campaign
                      </Text>
                      <Text className="text-gray-600 text-sm mt-0.5">
                        Goal: $50,000 • Ends: June 30, 2023
                      </Text>
                      <View className="mt-2 bg-gray-200 h-2 rounded-full w-full overflow-hidden">
                        <View
                          className="bg-orange-500 h-full rounded-full"
                          style={{ width: "35%" }}
                        ></View>
                      </View>
                      <Text className="text-gray-600 text-xs mt-1">
                        $17,500 raised so far
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View className="mt-3 flex-row items-center">
              <View className="flex-row items-center">
                <View className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
                  <Ionicons name="thumbs-up" size={12} color="#fff" />
                </View>
                <View className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                  <Ionicons name="heart" size={12} color="#fff" />
                </View>
                <Text className="ml-1.5 text-gray-500 text-xs">
                  {42 + item * 11}
                </Text>
              </View>
              <Text className="ml-auto text-gray-500 text-xs">
                {7 + item * 3} comments • {2 + item} shares
              </Text>
            </View>

            <View className="mt-3 flex-row justify-between border-t border-gray-200 pt-3">
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="thumbs-up-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600 font-medium">Like</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600 font-medium">Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={20} color="#666" />
                <Text className="ml-2 text-gray-600 font-medium">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Bottom padding */}
        <View className="h-4" />
      </Animated.ScrollView>
    </View>
  );
}
