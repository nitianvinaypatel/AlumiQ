import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
// @ts-ignore
import * as Haptics from "expo-haptics";
import { useDrawer } from "@/components/DrawerContext";
import Header from "@/components/home/Header";
import { LinearGradient } from "expo-linear-gradient";

// Type definitions
type Referral = {
  id: string;
  company: string;
  logo: string;
  position: string;
  location: string;
  postedBy: {
    name: string;
    avatar: string;
    role: string;
  };
  skills: string[];
  postedDate: string;
  salary?: string;
  jobType?: string;
};

type MyReferral = {
  id: string;
  candidate: {
    name: string;
    avatar: string;
  };
  company: string;
  position: string;
  status: string;
  statusColor: string;
  applicationDate: string;
  lastUpdate: string;
};

// Enhanced mock data
const REFERRAL_OPPORTUNITIES: Referral[] = [
  {
    id: "1",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/150px-Google_%22G%22_logo.svg.png",
    position: "Software Engineer",
    location: "Mountain View, CA",
    postedBy: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Senior Software Engineer",
    },
    skills: ["JavaScript", "Python", "Algorithms"],
    postedDate: "2 days ago",
    salary: "$130k - $160k",
    jobType: "Full-time",
  },
  {
    id: "2",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    position: "Product Manager",
    location: "Redmond, WA",
    postedBy: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Product Lead",
    },
    skills: ["Product Strategy", "User Research", "Agile"],
    postedDate: "1 week ago",
    salary: "$140k - $180k",
    jobType: "Full-time",
  },
  {
    id: "3",
    company: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    position: "Data Scientist",
    location: "Seattle, WA",
    postedBy: {
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "Data Science Manager",
    },
    skills: ["Python", "Machine Learning", "SQL"],
    postedDate: "3 days ago",
    salary: "$125k - $155k",
    jobType: "Full-time",
  },
  {
    id: "4",
    company: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
    position: "iOS Developer",
    location: "Cupertino, CA",
    postedBy: {
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      role: "Engineering Manager",
    },
    skills: ["Swift", "UIKit", "SwiftUI"],
    postedDate: "Just now",
    salary: "$130k - $170k",
    jobType: "Full-time",
  },
];

// Enhanced My Referrals mock data
const MY_REFERRALS: MyReferral[] = [
  {
    id: "101",
    candidate: {
      name: "Alex Thompson",
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    },
    company: "Salesforce",
    position: "Software Engineer",
    status: "In Review",
    statusColor: "#FFA500",
    applicationDate: "Mar 2, 2025",
    lastUpdate: "5 days ago",
  },
  {
    id: "102",
    candidate: {
      name: "Jessica Lee",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    company: "Netflix",
    position: "Data Analyst",
    status: "Interview",
    statusColor: "#0077B5",
    applicationDate: "Feb 23, 2025",
    lastUpdate: "Yesterday",
  },
  {
    id: "103",
    candidate: {
      name: "Marcus Johnson",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    company: "Adobe",
    position: "UX Designer",
    status: "Hired",
    statusColor: "#00A86B",
    applicationDate: "Jan 15, 2025",
    lastUpdate: "2 weeks ago",
  },
];

// Filters for opportunity data
const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "product", label: "Product" },
  { id: "data", label: "Data" },
  { id: "design", label: "Design" },
];

// Helper function for haptic feedback
const triggerHaptic = (style = "light") => {
  try {
    if (Haptics && Haptics.impactAsync) {
      if (style === "medium") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (style === "heavy") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  } catch (error) {
    console.log("Haptics not available");
  }
};

const GetReferral = () => {
  const insets = useSafeAreaInsets();
  const { toggleDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState("opportunities");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtered data
  const filteredOpportunities = useMemo(() => {
    return REFERRAL_OPPORTUNITIES.filter((item) => {
      // Filter by search query
      const matchesQuery = !searchQuery
        ? true
        : item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          );

      // Filter by category
      let matchesFilter = true;
      if (activeFilter !== "all") {
        const filterMapping: Record<string, string[]> = {
          engineering: [
            "Software Engineer",
            "iOS Developer",
            "Android Developer",
          ],
          product: ["Product Manager", "Product Owner"],
          data: ["Data Scientist", "Data Analyst", "Data Engineer"],
          design: ["UX Designer", "UI Designer", "Product Designer"],
        };

        matchesFilter =
          filterMapping[activeFilter]?.some((title) =>
            item.position.toLowerCase().includes(title.toLowerCase())
          ) || false;
      }

      return matchesQuery && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleRequestReferral = (opportunity: Referral) => {
    triggerHaptic("medium");
    Alert.alert(
      "Request Referral",
      `Would you like to request a referral for ${opportunity.position} at ${opportunity.company}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request",
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                "Referral Requested",
                "Your referral request has been submitted successfully. The alumni will review your application and respond shortly."
              );
            }, 1000);
          },
        },
      ]
    );
  };

  const toggleFavorite = (id: string) => {
    triggerHaptic();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleTabChange = (tab: string) => {
    if (activeTab !== tab) {
      triggerHaptic();
      setActiveTab(tab);
    }
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const renderOpportunityCard = ({ item }: { item: Referral }) => {
    const isExpanded = expandedCardId === item.id;

    return (
      <Animated.View
        style={{
          transform: [
            {
              scale:
                expandedCardId === item.id
                  ? scrollY.interpolate({
                      inputRange: [0, 50, 100],
                      outputRange: [1, 0.98, 0.98],
                      extrapolate: "clamp",
                    })
                  : 1,
            },
          ],
        }}
      >
        <TouchableOpacity
          className="bg-white rounded-xl shadow-md mb-4 overflow-hidden border border-gray-100"
          activeOpacity={0.95}
          onPress={() => toggleCardExpansion(item.id)}
          onLongPress={() => {
            triggerHaptic("medium");
            router.push({
              pathname: "/(pages)/referral-details" as any,
              params: { id: item.id },
            });
          }}
        >
          <LinearGradient
            colors={["rgba(37, 99, 235, 0.05)", "rgba(255, 255, 255, 0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            {/* Top row: Company and position */}
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: item.logo }}
                className="w-12 h-12 rounded-lg bg-white p-1 shadow-sm"
                resizeMode="contain"
              />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-800 text-base">
                  {item.position}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-gray-600 text-xs font-medium">
                    {item.company}
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />
                  <Text className="text-gray-500 text-xs">{item.location}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="p-2"
              >
                <Ionicons
                  name={
                    favorites.includes(item.id)
                      ? "bookmark"
                      : "bookmark-outline"
                  }
                  size={22}
                  color={favorites.includes(item.id) ? "#2563EB" : "#9CA3AF"}
                />
              </TouchableOpacity>
            </View>

            {/* Job details */}
            {isExpanded && (
              <View className="mb-3 bg-blue-50 p-3 rounded-lg">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <FontAwesome5
                      name="money-bill-wave"
                      size={12}
                      color="#6B7280"
                    />
                    <Text className="text-gray-700 text-xs font-medium ml-2">
                      {item.salary || "Competitive"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={14}
                      color="#6B7280"
                    />
                    <Text className="text-gray-700 text-xs font-medium ml-2">
                      Posted {item.postedDate}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="briefcase-outline"
                    size={12}
                    color="#6B7280"
                  />
                  <Text className="text-gray-700 text-xs font-medium ml-2">
                    {item.jobType || "Full-time"}
                  </Text>
                </View>
              </View>
            )}

            {/* Skills */}
            <View className="flex-row flex-wrap mb-4">
              {item.skills.map((skill: string, index: number) => (
                <View
                  key={index}
                  className="bg-blue-50 rounded-md px-3 py-1 mr-2 mb-1 border border-blue-100"
                >
                  <Text className="text-blue-700 text-xs font-medium">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>

            {/* Bottom section */}
            <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.postedBy.avatar }}
                  className="w-7 h-7 rounded-full border border-gray-200"
                />
                <View className="ml-2">
                  <Text className="text-gray-700 text-xs font-medium">
                    {item.postedBy.name}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {item.postedBy.role}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-md"
                onPress={() => handleRequestReferral(item)}
              >
                <Text className="text-white text-xs font-semibold">
                  Request Referral
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMyReferralCard = ({ item }: { item: MyReferral }) => (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden border border-gray-100"
      activeOpacity={0.95}
      onPress={() => {
        triggerHaptic();
        router.push({
          pathname: "/(pages)/referral-status" as any,
          params: { id: item.id },
        });
      }}
    >
      <View className="p-4">
        {/* Candidate and status */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: item.candidate.avatar }}
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <View className="ml-3">
              <Text className="font-medium text-gray-800 text-sm">
                {item.candidate.name}
              </Text>
              <Text className="text-gray-600 text-xs mt-1">
                {item.position} at {item.company}
              </Text>
            </View>
          </View>
          <View
            className="px-3 py-1.5 rounded-md"
            style={{ backgroundColor: `${item.statusColor}15` }}
          >
            <Text
              className="font-semibold text-xs"
              style={{ color: item.statusColor }}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Application details */}
        <View className="mb-3 bg-gray-50 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={12} color="#6B7280" />
              <Text className="text-gray-700 text-xs ml-2">
                Applied: {item.applicationDate}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={12} color="#6B7280" />
              <Text className="text-gray-700 text-xs ml-2">
                Updated: {item.lastUpdate}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-end pt-2 border-t border-gray-100">
          <TouchableOpacity className="px-3 py-1.5">
            <Text className="text-blue-600 text-xs font-medium">
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSkeletonCard = () => (
    <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100 p-4">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-lg bg-gray-200" />
        <View className="ml-3 flex-1">
          <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
          <View className="h-3 bg-gray-200 rounded-md w-1/2" />
        </View>
        <View className="w-8 h-8 rounded-md bg-gray-200" />
      </View>
      <View className="flex-row flex-wrap mb-4">
        <View className="bg-gray-200 rounded-md h-6 w-20 mr-2 mb-1" />
        <View className="bg-gray-200 rounded-md h-6 w-24 mr-2 mb-1" />
        <View className="bg-gray-200 rounded-md h-6 w-16 mr-2 mb-1" />
      </View>
      <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full bg-gray-200" />
          <View className="ml-2">
            <View className="h-3 bg-gray-200 rounded-md w-20 mb-1" />
            <View className="h-3 bg-gray-200 rounded-md w-16" />
          </View>
        </View>
        <View className="bg-gray-200 rounded-md h-8 w-24" />
      </View>
    </View>
  );

  const renderFilterChips = () => (
    <View className="flex-row mb-4 px-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            className={`mr-2 px-4 py-2 rounded-full border ${
              activeFilter === filter.id
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-200"
            }`}
            onPress={() => {
              triggerHaptic();
              setActiveFilter(filter.id);
            }}
          >
            <Text
              className={`text-xs font-medium ${
                activeFilter === filter.id ? "text-white" : "text-gray-700"
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <Header scrollY={scrollY} />

      {/* Tab Bar */}
      <View className="flex-row bg-white px-5 py-3 border-b border-gray-200 shadow-sm">
        <TouchableOpacity
          className={`py-2 mr-8 ${
            activeTab === "opportunities"
              ? "border-b-2 border-blue-600"
              : "border-b-2 border-transparent"
          }`}
          onPress={() => handleTabChange("opportunities")}
        >
          <Text
            className={`font-semibold ${
              activeTab === "opportunities" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Opportunities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2 mr-5 flex-row items-center ${
            activeTab === "my-referrals"
              ? "border-b-2 border-blue-600"
              : "border-b-2 border-transparent"
          }`}
          onPress={() => handleTabChange("my-referrals")}
        >
          <Text
            className={`font-semibold ${
              activeTab === "my-referrals" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            My Referrals
          </Text>
          <View className="bg-blue-600 rounded-full w-5 h-5 items-center justify-center ml-2">
            <Text className="text-white text-xs font-bold">
              {MY_REFERRALS.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-4 font-medium">
            Processing your request...
          </Text>
        </View>
      ) : isInitialLoading ? (
        <FlatList
          data={[1, 2, 3]}
          renderItem={renderSkeletonCard}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <View className="mb-4">
              <View className="h-5 bg-gray-200 rounded-md w-1/3 mb-4" />
              {renderFilterChips()}
            </View>
          }
        />
      ) : activeTab === "opportunities" ? (
        <FlatList
          data={filteredOpportunities}
          renderItem={renderOpportunityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListHeaderComponent={
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-4">
                {filteredOpportunities.length} available opportunities
              </Text>
              {renderFilterChips()}
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-800 text-lg font-bold mt-4">
                No matching opportunities
              </Text>
              <Text className="text-gray-500 text-center mt-2 mb-4 px-8">
                We couldn't find any opportunities matching your criteria.
              </Text>
            </View>
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      ) : (
        <FlatList
          data={MY_REFERRALS}
          renderItem={renderMyReferralCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListHeaderComponent={
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium">
                {MY_REFERRALS.length} active referrals
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-800 text-lg font-bold mt-4">
                No active referrals
              </Text>
              <Text className="text-gray-500 text-center mt-2 mb-4 px-8">
                You haven't referred any candidates yet. Start by exploring
                available opportunities.
              </Text>
            </View>
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

export default GetReferral;
