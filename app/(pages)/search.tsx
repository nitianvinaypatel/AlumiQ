import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Define types for search results
interface SearchResult {
  id: string;
  type: "user" | "post" | "job" | "event";
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
}

// Dummy data for search results
const DUMMY_SEARCH_RESULTS: SearchResult[] = [
  {
    id: "1",
    type: "user",
    title: "Sarah Johnson",
    subtitle: "Software Engineer at Google",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    tags: ["Tech", "Engineering"],
  },
  {
    id: "2",
    type: "user",
    title: "Michael Chen",
    subtitle: "Product Manager at Microsoft",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    tags: ["Product", "Management"],
  },
  {
    id: "3",
    type: "post",
    title: "Exciting new job opportunities in AI",
    subtitle: "Posted by Emily Rodriguez",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    tags: ["Jobs", "AI"],
  },
  {
    id: "4",
    type: "job",
    title: "Senior Developer Position",
    subtitle: "TechCorp • San Francisco, CA",
    tags: ["Full-time", "Remote"],
  },
  {
    id: "5",
    type: "event",
    title: "Annual Alumni Networking Event",
    subtitle: "Dec 15, 2023 • San Francisco",
    tags: ["Networking", "In-person"],
  },
  {
    id: "6",
    type: "user",
    title: "David Kim",
    subtitle: "Marketing Director at Netflix",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    tags: ["Marketing", "Entertainment"],
  },
  {
    id: "7",
    type: "post",
    title: "Tips for networking in the tech industry",
    subtitle: "Posted by Priya Patel",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    tags: ["Career", "Networking"],
  },
];

// Filter categories
const FILTER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "user", label: "People" },
  { id: "post", label: "Posts" },
  { id: "job", label: "Jobs" },
  { id: "event", label: "Events" },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "software engineer",
    "networking event",
    "product manager",
  ]);
  const router = useRouter();

  // Focus the search input when the screen loads
  useEffect(() => {
    // Simulate search results
    if (searchQuery.trim() !== "") {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = DUMMY_SEARCH_RESULTS.filter(
          (result) =>
            (activeFilter === "all" || result.type === activeFilter) &&
            (result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (result.subtitle &&
                result.subtitle
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())) ||
              (result.tags &&
                result.tags.some((tag) =>
                  tag.toLowerCase().includes(searchQuery.toLowerCase())
                )))
        );
        setResults(filtered);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [searchQuery, activeFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== "" && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white p-3 rounded-lg mb-2 shadow-sm"
      activeOpacity={0.7}
      onPress={() => {
        // Navigate based on result type
        switch (item.type) {
          case "user":
            console.log(`Navigate to user profile: ${item.id}`);
            break;
          case "post":
            console.log(`Navigate to post: ${item.id}`);
            break;
          case "job":
            console.log(`Navigate to job: ${item.id}`);
            break;
          case "event":
            console.log(`Navigate to event: ${item.id}`);
            break;
        }
      }}
    >
      {item.type === "user" && item.image && (
        <Image
          source={{ uri: item.image }}
          className="w-12 h-12 rounded-full mr-3"
        />
      )}

      {item.type === "post" && item.image && (
        <View className="w-12 h-12 rounded-lg mr-3 bg-gray-200 justify-center items-center overflow-hidden">
          <Image source={{ uri: item.image }} className="w-full h-full" />
        </View>
      )}

      {(item.type === "job" || item.type === "event") && (
        <View className="w-12 h-12 rounded-lg mr-3 bg-blue-100 justify-center items-center">
          <Ionicons
            name={item.type === "job" ? "briefcase" : "calendar"}
            size={24}
            color="#0077B5"
          />
        </View>
      )}

      <View className="flex-1">
        <Text className="font-semibold text-gray-800">{item.title}</Text>
        {item.subtitle && (
          <Text className="text-sm text-gray-600 mt-1">{item.subtitle}</Text>
        )}

        {item.tags && item.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {item.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1"
              >
                <Text className="text-xs text-gray-700">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 border-b border-gray-100"
      onPress={() => handleSearch(item)}
    >
      <Ionicons name="time-outline" size={20} color="#999" className="mr-3" />
      <Text className="flex-1 text-gray-700">{item}</Text>
      <TouchableOpacity
        onPress={() =>
          setRecentSearches((prev) => prev.filter((search) => search !== item))
        }
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="bg-white pt-12 pb-2 px-4 shadow-sm">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search alumni, posts, jobs..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={FILTER_CATEGORIES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mr-2 ${
                activeFilter === item.id ? "bg-blue-500" : "bg-gray-200"
              }`}
              onPress={() => setActiveFilter(item.id)}
            >
              <Text
                className={`${
                  activeFilter === item.id ? "text-white" : "text-gray-700"
                } font-medium`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerClassName="pb-2"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0077B5" />
          <Text className="mt-2 text-gray-600">Searching...</Text>
        </View>
      ) : searchQuery.trim() === "" ? (
        <View className="flex-1 px-4 py-2">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Recent Searches
          </Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={renderRecentSearch}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500">No recent searches</Text>
              </View>
            }
          />

          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Suggested Searches
            </Text>
            <View className="flex-row flex-wrap">
              {[
                "Software Engineer",
                "Product Manager",
                "Marketing",
                "Remote Jobs",
                "Networking Events",
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-200 rounded-full px-3 py-2 mr-2 mb-2"
                  onPress={() => handleSearch(item)}
                >
                  <Text className="text-gray-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderSearchResult}
          contentContainerClassName="p-4"
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text className="mt-4 text-lg text-gray-500 text-center">
            No results found for "{searchQuery}"
          </Text>
          <Text className="mt-2 text-gray-500 text-center">
            Try different keywords or browse suggested searches
          </Text>
        </View>
      )}
    </View>
  );
}
