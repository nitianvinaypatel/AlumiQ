import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/constants/theme";
import Header from "@/components/home/Header";

const { width } = Dimensions.get("window");

// Job types for type safety
type JobCategory = {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
};

type JobListing = {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  posted: string;
  isRemote: boolean;
  isFeatured: boolean;
  isRecent: boolean;
  requirements: string[];
  skills: string[];
  isSaved: boolean;
  matchPercentage: number;
};

// Sample job categories
const jobCategories: JobCategory[] = [
  {
    id: 1,
    name: "Engineering",
    icon: "code-outline" as keyof typeof Ionicons.glyphMap,
    count: 128,
  },
  {
    id: 2,
    name: "Marketing",
    icon: "bar-chart-outline" as keyof typeof Ionicons.glyphMap,
    count: 64,
  },
  {
    id: 3,
    name: "Design",
    icon: "color-palette-outline" as keyof typeof Ionicons.glyphMap,
    count: 42,
  },
  {
    id: 4,
    name: "Product",
    icon: "cube-outline" as keyof typeof Ionicons.glyphMap,
    count: 36,
  },
  {
    id: 5,
    name: "Finance",
    icon: "cash-outline" as keyof typeof Ionicons.glyphMap,
    count: 29,
  },
];

// Sample job listings
const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechVision Inc.",
    logo: "https://logo.clearbit.com/google.com",
    location: "San Francisco, CA",
    salary: "$120K - $150K",
    posted: "2d",
    isRemote: true,
    isFeatured: true,
    isRecent: true,
    requirements: [
      "5+ years of experience with React Native",
      "Strong knowledge of JavaScript and TypeScript",
      "Experience with RESTful APIs and GraphQL",
    ],
    skills: ["React Native", "TypeScript", "GraphQL", "Node.js"],
    isSaved: false,
    matchPercentage: 92,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "CreativeStudio",
    logo: "https://logo.clearbit.com/figma.com",
    location: "New York, NY",
    salary: "$90K - $120K",
    posted: "1d",
    isRemote: true,
    isFeatured: false,
    isRecent: true,
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma and design systems",
      "Experience with user research and testing",
    ],
    skills: ["UI/UX", "Figma", "Design Systems", "Prototyping"],
    isSaved: true,
    matchPercentage: 85,
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AnalyticsPro",
    logo: "https://logo.clearbit.com/databricks.com",
    location: "Boston, MA",
    salary: "$110K - $140K",
    posted: "3d",
    isRemote: false,
    isFeatured: true,
    isRecent: false,
    requirements: [
      "MS or PhD in Computer Science, Statistics, or related field",
      "Experience with machine learning frameworks",
      "Strong programming skills in Python",
    ],
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    isSaved: false,
    matchPercentage: 78,
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "GrowthBoost",
    logo: "https://logo.clearbit.com/hubspot.com",
    location: "Chicago, IL",
    salary: "$85K - $110K",
    posted: "5d",
    isRemote: true,
    isFeatured: false,
    isRecent: false,
    requirements: [
      "5+ years of marketing experience",
      "Experience with digital marketing campaigns",
      "Strong analytical skills",
    ],
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    isSaved: false,
    matchPercentage: 81,
  },
];

export default function JobsScreen() {
  // Theme
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>(jobListings);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchBarWidth = useRef(new Animated.Value(width - 80)).current;
  const filtersHeight = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation derived values
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 5],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  // Effects
  useEffect(() => {
    // Simulate loading jobs when category changes
    if (selectedCategory !== null) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Filter jobs based on category (in a real app, this would be an API call)
        setJobs(
          jobListings.filter((job) =>
            selectedCategory === 1
              ? job.title.includes("Engineer")
              : selectedCategory === 2
              ? job.title.includes("Market")
              : selectedCategory === 3
              ? job.title.includes("Design")
              : selectedCategory === 4
              ? job.title.includes("Product")
              : selectedCategory === 5
              ? job.title.includes("Finance")
              : true
          )
        );
      }, 1000);
    }
  }, [selectedCategory]);

  // Handlers
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
      // Shuffle the jobs to simulate new data
      setJobs([...jobListings].sort(() => Math.random() - 0.5));
    }, 1500);
  };

  const toggleSaveJob = (id: number) => {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filtersHeight, {
      toValue: showFilters ? 0 : 180,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchFocus = (focused: boolean) => {
    setSearchFocused(focused);
    Animated.timing(searchBarWidth, {
      toValue: focused ? width - 40 : width - 80,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const applyToJob = (id: number) => {
    // In a real app, this would navigate to an application form
    console.log(`Applying to job ${id}`);
  };

  const renderJobCard = (job: JobListing) => (
    <Animated.View
      key={job.id}
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
      className={`mt-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-sm overflow-hidden border ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      }`}
    >
      {job.isFeatured && (
        <LinearGradient
          colors={["#0077B5", "#00A0DC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg z-10"
        >
          <Text className="text-white text-xs font-bold">Featured</Text>
        </LinearGradient>
      )}

      <View className="p-4">
        <View className="flex-row">
          <View
            className={`w-14 h-14 rounded-lg overflow-hidden ${
              isDarkMode ? "bg-gray-700" : "bg-blue-50"
            } items-center justify-center`}
          >
            {job.logo ? (
              <Image
                source={{ uri: job.logo }}
                className="w-full h-full"
                defaultSource={{
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job.company
                  )}&background=0077B5&color=fff`,
                }}
              />
            ) : (
              <View className="w-full h-full bg-blue-100 items-center justify-center">
                <Text className="text-blue-600 font-bold text-lg">
                  {job.company.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className={`font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } text-lg`}
                >
                  {job.title}
                </Text>
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {job.company}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleSaveJob(job.id)}
                className={`w-9 h-9 items-center justify-center rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <Ionicons
                  name={job.isSaved ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={
                    job.isSaved ? "#0077B5" : isDarkMode ? "#9CA3AF" : "#666"
                  }
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mt-1 flex-wrap">
              <View className="flex-row items-center mr-3">
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDarkMode ? "#9CA3AF" : "#666"}
                />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-xs ml-1`}
                >
                  {job.location}
                </Text>
              </View>

              {job.isRemote && (
                <View className="flex-row items-center mr-3">
                  <Ionicons
                    name="globe-outline"
                    size={14}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } text-xs ml-1`}
                  >
                    Remote
                  </Text>
                </View>
              )}

              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={
                    job.isRecent ? "green" : isDarkMode ? "#9CA3AF" : "#666"
                  }
                />
                <Text
                  className={`text-xs ml-1 ${
                    job.isRecent
                      ? "text-green-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Posted {job.posted} ago
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <View
            className={`${
              isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
            } px-2 py-1 rounded-md`}
          >
            <Text
              className={`${
                isDarkMode ? "text-blue-300" : "text-blue-700"
              } text-xs font-medium`}
            >
              {job.salary}
            </Text>
          </View>
          <View className="ml-auto flex-row items-center">
            <Text
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-xs mr-1`}
            >
              Match
            </Text>
            <View
              className={`${
                isDarkMode ? "bg-green-900/30" : "bg-green-100"
              } px-2 py-1 rounded-md`}
            >
              <Text
                className={`${
                  isDarkMode ? "text-green-300" : "text-green-700"
                } text-xs font-bold`}
              >
                {job.matchPercentage}%
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-3">
          {job.requirements.slice(0, 2).map((req, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <View
                className={`w-1.5 h-1.5 rounded-full ${
                  isDarkMode ? "bg-gray-500" : "bg-gray-400"
                } mr-2`}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                {req}
              </Text>
            </View>
          ))}
          {job.requirements.length > 2 && (
            <Text
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-xs mt-1`}
            >
              +{job.requirements.length - 2} more requirements
            </Text>
          )}
        </View>

        <View className="mt-3 flex-row flex-wrap">
          {job.skills.slice(0, 3).map((skill, index) => (
            <View
              key={index}
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              } rounded-full px-2 py-1 mr-2 mb-2`}
            >
              <Text
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } text-xs`}
              >
                {skill}
              </Text>
            </View>
          ))}
          {job.skills.length > 3 && (
            <View
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              } rounded-full px-2 py-1 mr-2 mb-2`}
            >
              <Text
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } text-xs`}
              >
                +{job.skills.length - 3}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-3 flex-row">
          <TouchableOpacity
            className="bg-blue-600 py-2.5 px-5 rounded-lg flex-1 mr-2"
            onPress={() => applyToJob(job.id)}
            style={{
              shadowColor: "#0077B5",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text className="text-white font-medium text-center">
              Apply Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`border ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            } py-2.5 px-5 rounded-lg`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } font-medium`}
            >
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Enhanced Header */}

      <Header scrollY={scrollY} />

      <Animated.ScrollView
        ref={scrollViewRef}
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
        {/* My Jobs Section */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-4 mt-2 rounded-xl mx-4 shadow-sm border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <Text
            className={`font-bold text-lg ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            My Jobs
          </Text>
          <View className="flex-row mt-3 justify-between">
            <TouchableOpacity className="items-center">
              <View
                className={`w-12 h-12 rounded-full ${
                  isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                } items-center justify-center`}
              >
                <Ionicons name="bookmark" size={22} color="#0077B5" />
              </View>
              <Text
                className={`text-sm mt-1 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Saved
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                12
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View
                className={`w-12 h-12 rounded-full ${
                  isDarkMode ? "bg-green-900/30" : "bg-green-50"
                } items-center justify-center`}
              >
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              </View>
              <Text
                className={`text-sm mt-1 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Applied
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                5
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View
                className={`w-12 h-12 rounded-full ${
                  isDarkMode ? "bg-yellow-900/30" : "bg-yellow-50"
                } items-center justify-center`}
              >
                <Ionicons name="notifications" size={22} color="#F59E0B" />
              </View>
              <Text
                className={`text-sm mt-1 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Alerts
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                3
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View
                className={`w-12 h-12 rounded-full ${
                  isDarkMode ? "bg-purple-900/30" : "bg-purple-50"
                } items-center justify-center`}
              >
                <Ionicons name="calendar" size={22} color="#8B5CF6" />
              </View>
              <Text
                className={`text-sm mt-1 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Interviews
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                2
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Categories */}
        <View className="mt-4 px-4">
          <Text
            className={`font-bold text-lg ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            } mb-3`}
          >
            Browse by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {jobCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`mr-3 rounded-xl overflow-hidden border ${
                  selectedCategory === category.id
                    ? isDarkMode
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-blue-400 bg-blue-50"
                    : isDarkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
                style={{ width: width * 0.35 }}
                onPress={() =>
                  setSelectedCategory(
                    category.id === selectedCategory ? null : category.id
                  )
                }
              >
                <View className="p-3">
                  <View
                    className={`w-10 h-10 rounded-lg items-center justify-center mb-2 ${
                      selectedCategory === category.id
                        ? isDarkMode
                          ? "bg-blue-800/50"
                          : "bg-blue-100"
                        : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                    }`}
                  >
                    <Ionicons
                      name={
                        selectedCategory !== category.id
                          ? category.icon
                          : (category.icon.replace(
                              "-outline",
                              ""
                            ) as keyof typeof Ionicons.glyphMap)
                      }
                      size={20}
                      color={
                        selectedCategory === category.id
                          ? isDarkMode
                            ? "#60A5FA"
                            : "#0077B5"
                          : isDarkMode
                          ? "#9CA3AF"
                          : "#666"
                      }
                    />
                  </View>
                  <Text
                    className={`font-medium ${
                      selectedCategory === category.id
                        ? isDarkMode
                          ? "text-blue-300"
                          : "text-blue-700"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-800"
                    }`}
                  >
                    {category.name}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedCategory === category.id
                        ? isDarkMode
                          ? "text-blue-400"
                          : "text-blue-500"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {category.count} jobs
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Jobs */}
        <View className="mt-4 px-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Text
              className={`font-bold text-lg ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Recommended for you
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-medium mr-1`}
              >
                See All
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
            </TouchableOpacity>
          </View>
          <Text
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } text-sm`}
          >
            Based on your profile and search history
          </Text>

          {/* Loading Indicator */}
          {isLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#0077B5" />
              <Text
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mt-2`}
              >
                Loading jobs...
              </Text>
            </View>
          ) : jobs.length === 0 ? (
            <View className="py-8 items-center">
              <Ionicons
                name="search"
                size={48}
                color={isDarkMode ? "#4B5563" : "#d1d5db"}
              />
              <Text
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mt-2 text-center`}
              >
                No jobs found
              </Text>
              <Text
                className={`${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                } text-center`}
              >
                Try adjusting your search criteria
              </Text>
              <TouchableOpacity
                className="mt-4 bg-blue-600 py-2 px-4 rounded-lg"
                onPress={() => {
                  setSelectedCategory(null);
                  setJobs(jobListings);
                }}
              >
                <Text className="text-white font-medium">Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Job Cards
            jobs.map((job) => renderJobCard(job))
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
