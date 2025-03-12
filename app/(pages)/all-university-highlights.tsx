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
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const AllUniversityHighlights = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Example data, replace with actual API fetching logic
  type Highlight = {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    attendees: number;
    image: string;
  };

  const highlights: Highlight[] = [
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

  const renderHighlightItem = (item: Highlight) => {
    return (
      <TouchableOpacity
        key={item.id}
        className={`mb-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-lg overflow-hidden border ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        }`}
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
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)"]}
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
          >
            <Text className="text-white font-bold text-lg">{item.title}</Text>
          </LinearGradient>
        </View>

        <View className="p-4">
          <Text
            className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons
                name="event"
                size={16}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
              <Text
                className={`ml-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.date}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="location-outline"
                size={16}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
              <Text
                className={`ml-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.location}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name="people"
                size={14}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
              <Text
                className={`ml-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.attendees} attendees
              </Text>
            </View>

            <View>
              <Text
                className={`px-2 py-1 ${
                  isDarkMode
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-gray-100 text-gray-700"
                } rounded-full text-xs capitalize`}
              >
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Enhanced Header */}
      <Animated.View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.2 : 0.1,
          shadowRadius: 3,
          elevation: 4,
          zIndex: 10,
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 0.98],
            extrapolate: "clamp",
          }),
        }}
        className={`${isDarkMode ? "bg-gray-800" : "bg-[#0077B5]"}`}
      >
        <LinearGradient
          colors={isDarkMode ? ["#1F2937", "#111827"] : ["#0077B5", "#00A0DC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top, paddingBottom: 10 }}
        >
          <View className="flex-row items-center px-4 py-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className={`p-2 mr-3 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-blue-600/30"
              }`}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>

            {/* Search Bar in Header */}
            <View
              className={`flex-1 flex-row items-center ${
                isDarkMode ? "bg-gray-700" : "bg-blue-600/30"
              } rounded-full px-3`}
            >
              <Ionicons name="search" size={18} color="white" />
              <TextInput
                className={`flex-1 py-2 px-2 text-white`}
                placeholder="Search university highlights..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filter Categories Section */}
      <View
        className={`px-4 pt-4 pb-2 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <Text
          className={`font-bold text-base mb-3 ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          University Highlights
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedFilter === category.key
                  ? isDarkMode
                    ? "bg-blue-900/50 border border-blue-700"
                    : "bg-[#0077B5]"
                  : isDarkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-white border border-gray-200"
              }`}
              onPress={() => setSelectedFilter(category.key)}
            >
              <Text
                className={`${
                  selectedFilter === category.key
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-300"
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
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#60A5FA" : "#0077B5"}
          />
          <Text
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Loading highlights...
          </Text>
        </View>
      ) : (
        <Animated.ScrollView
          className="px-4 pt-2"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[isDarkMode ? "#60A5FA" : "#0077B5"]}
              tintColor={isDarkMode ? "#60A5FA" : "#0077B5"}
            />
          }
        >
          {filteredHighlights.length > 0 ? (
            <>
              <View
                className={`flex-row items-center mb-3 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } p-3 rounded-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={isDarkMode ? "#60A5FA" : "#0077B5"}
                />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2 font-medium`}
                >
                  Showing {filteredHighlights.length}{" "}
                  {filteredHighlights.length === 1 ? "result" : "results"}
                  {selectedFilter !== "all" &&
                    ` in ${
                      categories.find((c) => c.key === selectedFilter)?.label
                    }`}
                </Text>
              </View>
              {filteredHighlights.map(renderHighlightItem)}
            </>
          ) : (
            <View
              className={`py-16 items-center justify-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl mt-2 border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Ionicons
                name="search-outline"
                size={60}
                color={isDarkMode ? "#4B5563" : "#ccc"}
              />
              <Text
                className={`mt-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } text-center font-bold text-lg`}
              >
                No highlights found
              </Text>
              <Text
                className={`mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-center px-8`}
              >
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : selectedFilter !== "all"
                  ? `No ${
                      categories.find((c) => c.key === selectedFilter)?.label
                    } events found`
                  : "Try adjusting your search or filters"}
              </Text>
              <TouchableOpacity
                className={`mt-6 ${
                  isDarkMode ? "bg-blue-600" : "bg-[#0077B5]"
                } px-6 py-3 rounded-full`}
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
        </Animated.ScrollView>
      )}

      {/* Floating Action Button */}
      {/* Commenting out due to path error - uncomment and fix path when needed
      <TouchableOpacity
        className={`absolute bottom-6 right-6 ${
          isDarkMode ? "bg-blue-600" : "bg-[#0077B5]"
        } w-14 h-14 rounded-full items-center justify-center shadow-lg`}
        onPress={() => router.push("/create-highlight")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      */}
    </View>
  );
};

export default AllUniversityHighlights;
