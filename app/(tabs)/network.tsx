import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/home/Header";

const { width } = Dimensions.get("window");

// Sample data for network stats
const networkStats = [
  {
    id: 1,
    icon: "people" as const,
    label: "Connections",
    count: 412,
    color: "#0077B5",
  },
  {
    id: 2,
    icon: "person-add" as const,
    label: "People I Follow",
    count: 28,
    color: "#0077B5",
  },
  {
    id: 3,
    icon: "calendar" as const,
    label: "Events",
    count: 5,
    color: "#E7A33E",
  },
  {
    id: 4,
    icon: "newspaper" as const,
    label: "Pages",
    count: 16,
    color: "#7FC15E",
  },
  {
    id: 5,
    icon: "briefcase" as const,
    label: "Companies",
    count: 8,
    color: "#F5987E",
  },
];

// Sample data for invitations
const invitationData = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Software Engineer at TechVision Inc.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    mutualConnections: 8,
    university: "Stanford University",
    isAlumni: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Product Manager at InnovateCorp",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    mutualConnections: 12,
    university: "Stanford University",
    isAlumni: true,
  },
];

// Sample data for people you may know
const suggestedPeople = [
  {
    id: 1,
    name: "Emily Rodriguez",
    title: "Marketing Director at GlobalBrands",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    mutualConnections: 5,
    university: "Stanford University",
    graduationYear: "2018",
    department: "Business",
    reason: "From your university",
  },
  {
    id: 2,
    name: "David Kim",
    title: "Data Scientist at AnalyticsPro",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    mutualConnections: 3,
    university: "Stanford University",
    graduationYear: "2019",
    department: "Computer Science",
    reason: "Similar profile",
  },
  {
    id: 3,
    name: "Olivia Taylor",
    title: "UX Designer at CreativeStudio",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    mutualConnections: 7,
    university: "Stanford University",
    graduationYear: "2017",
    department: "Design",
    reason: "Based on your interests",
  },
  {
    id: 4,
    name: "James Wilson",
    title: "Project Manager at BuildTech",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    mutualConnections: 2,
    university: "Stanford University",
    graduationYear: "2016",
    department: "Engineering",
    reason: "From your university",
  },
];

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Alumni Networking Mixer",
    date: "Jun 15, 2023",
    location: "San Francisco, CA",
    attendees: 68,
    image:
      "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-2747449.jpg&fm=jpg",
  },
  {
    id: 2,
    title: "Tech Industry Panel",
    date: "Jul 22, 2023",
    location: "Virtual Event",
    attendees: 124,
    image:
      "https://www.focuseventphotography.com/wp-content/uploads/2019/12/corporate-events-photographer-mirage-las-vegas.jpg",
  },
];

export default function NetworkScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [invitations, setInvitations] = useState(invitationData);
  const [suggestions, setSuggestions] = useState(suggestedPeople);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchFocused, setSearchFocused] = useState(false);

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

  const handleAcceptInvitation = (id: number) => {
    setInvitations(invitations.filter((invitation) => invitation.id !== id));
  };

  const handleIgnoreInvitation = (id: number) => {
    setInvitations(invitations.filter((invitation) => invitation.id !== id));
  };

  const handleDismissSuggestion = (id: number) => {
    setSuggestions(suggestions.filter((person) => person.id !== id));
  };

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 3],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Enhanced Header */}

      {/* <Animated.View
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
      </Animated.View> */}
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
        {/* Network Stats Cards */}
        <View className="px-4 py-3">
          <Text className="font-bold text-lg text-gray-800 mb-3">
            Network Overview
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {networkStats.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                className="mr-3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                style={{ width: width * 0.4 }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[stat.color + "10", stat.color + "05"]}
                  className="p-4"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="bg-white p-2 rounded-lg">
                      <Ionicons name={stat.icon} size={20} color={stat.color} />
                    </View>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={16}
                      color="#0077B5"
                    />
                  </View>
                  <Text className="font-bold text-2xl text-gray-800">
                    {stat.count}
                  </Text>
                  <Text className="text-gray-600 mt-1">{stat.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View className="mt-2 bg-white p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-bold text-lg text-gray-800">
              Upcoming Events
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium mr-1">View All</Text>
              <Ionicons
                name="chevron-forward-circle-outline"
                size={16}
                color="#0077B5"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="mr-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                style={{ width: width * 0.7 }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: event.image }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="font-bold text-gray-800">{event.title}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#0077B5"
                      />
                      <Text className="text-gray-600 text-xs ml-1">
                        {event.date}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#0077B5"
                      />
                      <Text className="text-gray-600 text-xs ml-1">
                        {event.location}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-2 flex-row items-center justify-between">
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
                            className="w-5 h-5 rounded-full border border-white"
                          />
                        ))}
                      </View>
                      <Text className="text-gray-600 text-xs ml-1">
                        +{event.attendees} attending
                      </Text>
                    </View>
                    <TouchableOpacity className="bg-blue-500 px-3 py-1 rounded-md">
                      <Text className="text-white text-xs font-medium">
                        RSVP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Invitations */}
        {invitations.length > 0 && (
          <View className="bg-white p-4 mt-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-lg text-gray-800">
                Invitations
              </Text>
              {invitations.length > 2 && (
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-blue-600 font-medium mr-1">
                    See all
                  </Text>
                  <Feather name="chevron-right" size={16} color="#0077B5" />
                </TouchableOpacity>
              )}
            </View>

            {/* Invitation Cards */}
            {invitations.map((invitation) => (
              <View
                key={invitation.id}
                className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: invitation.image }}
                    className="w-16 h-16 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-bold text-gray-800">
                        {invitation.name}
                      </Text>
                      {invitation.isAlumni && (
                        <View className="ml-2 bg-blue-100 px-1.5 py-0.5 rounded">
                          <Text className="text-blue-700 text-xs font-medium">
                            Alumni
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-600 text-sm">
                      {invitation.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons
                        name="school-outline"
                        size={12}
                        color="#6b7280"
                      />
                      <Text className="text-gray-500 text-xs ml-1">
                        {invitation.university}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <View className="flex-row items-center -space-x-2">
                        {[1, 2].map((avatar) => (
                          <Image
                            key={avatar}
                            source={{
                              uri: `https://randomuser.me/api/portraits/${
                                avatar % 2 === 0 ? "men" : "women"
                              }/${avatar + 15}.jpg`,
                            }}
                            className="w-4 h-4 rounded-full border border-white"
                          />
                        ))}
                      </View>
                      <Text className="text-gray-500 text-xs ml-1">
                        {invitation.mutualConnections} mutual connections
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row mt-3 pt-2 border-t border-gray-100">
                  <TouchableOpacity
                    className="flex-1 flex-row justify-center items-center py-2 mr-2 border border-gray-300 rounded-md"
                    onPress={() => handleIgnoreInvitation(invitation.id)}
                  >
                    <Text className="text-gray-700 font-medium">Ignore</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 flex-row justify-center items-center py-2 bg-blue-500 rounded-md"
                    onPress={() => handleAcceptInvitation(invitation.id)}
                  >
                    <Text className="text-white font-medium">Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* People You May Know */}
        <View className="bg-white p-4 mt-2 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-lg text-gray-800">
              People you may know
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium mr-1">See all</Text>
              <Ionicons
                name="chevron-forward-circle-outline"
                size={16}
                color="#0077B5"
              />
            </TouchableOpacity>
          </View>

          {/* People Cards */}
          {suggestions.map((person) => (
            <View
              key={person.id}
              className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-3"
            >
              <View className="flex-row">
                <Image
                  source={{ uri: person.image }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800">
                        {person.name}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {person.title}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDismissSuggestion(person.id)}
                    >
                      <Ionicons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Ionicons name="school-outline" size={12} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">
                      {person.university} • {person.graduationYear} •{" "}
                      {person.department}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <View className="bg-gray-100 rounded-full px-2 py-0.5">
                      <Text className="text-gray-600 text-xs">
                        {person.reason}
                      </Text>
                    </View>
                    {person.mutualConnections > 0 && (
                      <View className="flex-row items-center ml-2">
                        <View className="flex-row items-center -space-x-2">
                          <Image
                            source={{
                              uri: `https://randomuser.me/api/portraits/men/15.jpg`,
                            }}
                            className="w-4 h-4 rounded-full border border-white"
                          />
                        </View>
                        <Text className="text-gray-500 text-xs ml-1">
                          {person.mutualConnections} mutual
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View className="flex-row mt-3 pt-2 border-t border-gray-100">
                <TouchableOpacity className="flex-row items-center justify-center py-2 px-4 bg-blue-50 rounded-md mr-2">
                  <Ionicons
                    name="person-add-outline"
                    size={16}
                    color="#0077B5"
                  />
                  <Text className="text-blue-600 font-medium ml-1">
                    Connect
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center justify-center py-2 px-4 border border-gray-200 rounded-md">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color="#666"
                  />
                  <Text className="text-gray-700 font-medium ml-1">
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity className="mt-2 py-3 flex-row items-center justify-center">
            <Text className="text-blue-600 font-medium mr-1">
              Show more suggestions
            </Text>
            <Ionicons
              name="chevron-down-circle-outline"
              size={16}
              color="#0077B5"
            />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
