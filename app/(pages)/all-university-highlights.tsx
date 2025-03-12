import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AllUniversityHighlights = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Example data, replace with actual API fetching logic
  const highlights = [
    {
      id: 1,
      title: "Alumni Mentorship Program Launch",
      description:
        "Connect with industry leaders and advance your career through our structured mentorship program.",
      date: "March 15, 2023",
      location: "New York",
      category: "networking",
      attendees: 120,
      image:
        "https://thearchitecturedesigns.com/wp-content/uploads/2020/04/University-of-Georgia-10.jpg",
    },
    {
      id: 2,
      title: "Annual Innovation Summit",
      description:
        "Join thought leaders and innovators to explore emerging technologies and future trends.",
      date: "April 10, 2023",
      location: "San Francisco",
      category: "conference",
      attendees: 350,
      image:
        "https://th.bing.com/th/id/R.cb4b57f6f2d29ad7fa056cda179934f0?rik=sZbqvvAo1l7lpA&riu=http%3a%2f%2fwww.timesnews.co.uk%2fwp-content%2fuploads%2f2013%2f11%2fHarvard-University.jpg&ehk=Tq5%2fCwirwQzWPWayvjbDf8%2bgrGsuB7p3jBUpszITQ1g%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 3,
      title: "Distinguished Alumni Awards Ceremony",
      description:
        "Celebrating excellence and outstanding achievements of our university's most accomplished graduates.",
      date: "June 22, 2023",
      location: "Chicago",
      category: "celebration",
      attendees: 275,
      image:
        "https://1.bp.blogspot.com/-TtlrJj6dDUM/WXWPd145E3I/AAAAAAAAlbc/0owXAO51ehUTUejCsDOUETjtgWXjAlNEACLcBGAs/s1600/University+of+Oxford+3.jpg",
    },
    {
      id: 4,
      title: "Global Alumni Networking Night",
      description:
        "Connect with fellow alumni from around the world in this virtual networking event.",
      date: "August 5, 2023",
      location: "Virtual",
      category: "networking",
      attendees: 430,
      image:
        "https://th.bing.com/th/id/R.789b7ef19c0c4d8ad6f78e5ac747ffdc?rik=i9eWFtzH%2bkDjcQ&riu=http%3a%2f%2ffearthetalons.com%2fimages%2flovett.jpg&ehk=q4KNN0mcluJa47AjwksCc%2bwH4E9kFdHfb%2fRnuVbSBSM%3d&risl=&pid=ImgRaw&r=0",
    },
  ];

  // Filter categories
  const categories = [
    { key: "all", label: "All" },
    { key: "networking", label: "Networking" },
    { key: "conference", label: "Conferences" },
    { key: "celebration", label: "Celebrations" },
  ];

  // Simulate API fetch
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredHighlights = highlights.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilter === "all" || item.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const renderHighlightItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden"
        // onPress={() =>
        //   router.push({
        //     pathname: `/highlights/${item.id}`,
        //     params: { id: item.id },
        //   })
        // }
      >
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-48 rounded-t-xl"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-2">
            <Text className="text-white font-bold text-lg">{item.title}</Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-gray-700 mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={16} color="#0077B5" />
              <Text className="ml-1 text-gray-700">{item.date}</Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#0077B5" />
              <Text className="ml-1 text-gray-700">{item.location}</Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="people" size={14} color="#0077B5" />
              <Text className="ml-1 text-gray-700">
                {item.attendees} attendees
              </Text>
            </View>

            <View>
              <Text className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="bg-[#0077B5] shadow-md"
        style={{ paddingTop: insets.top, paddingBottom: 10 }}
      >
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-white">
            University Highlights
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="p-1 relative"
          >
            <Ionicons name="notifications" size={24} color="white" />
            <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter Section */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white rounded-full px-3 shadow-sm border border-gray-100">
          <Ionicons name="search" size={20} color="#0077B5" />
          <TextInput
            className="flex-1 p-3 text-gray-800"
            placeholder="Search events, locations, keywords..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedFilter === category.key
                  ? "bg-[#0077B5]"
                  : "bg-white border border-gray-200"
              }`}
              onPress={() => setSelectedFilter(category.key)}
            >
              <Text
                className={`${
                  selectedFilter === category.key
                    ? "text-white"
                    : "text-gray-700"
                } font-medium`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0077B5" />
          <Text className="mt-2 text-gray-600">Loading highlights...</Text>
        </View>
      ) : (
        <ScrollView
          className="px-4 pt-2"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0077B5"]}
            />
          }
        >
          {filteredHighlights.length > 0 ? (
            <>
              <Text className="text-gray-700 mb-2">
                Showing {filteredHighlights.length}{" "}
                {filteredHighlights.length === 1 ? "result" : "results"}
              </Text>
              {filteredHighlights.map(renderHighlightItem)}
            </>
          ) : (
            <View className="py-16 items-center justify-center">
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text className="mt-4 text-gray-600 text-center font-medium">
                No highlights found
              </Text>
              <Text className="mt-1 text-gray-500 text-center">
                Try adjusting your search or filters
              </Text>
              <TouchableOpacity
                className="mt-4 bg-[#0077B5] px-6 py-3 rounded-full"
                onPress={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
              >
                <Text className="text-white font-medium">Clear filters</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Floating Action Button */}
      {/* <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#0077B5] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/create-highlight")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity> */}
    </View>
  );
};

export default AllUniversityHighlights;
