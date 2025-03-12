import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { Stack, Link, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Enhanced Message interface with more LinkedIn-like properties
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
    title?: string;
    company?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isTyping?: boolean;
  lastMessageSender?: "user" | "other";
  hasAttachment?: boolean;
  isArchived?: boolean;
  isSpam?: boolean;
  isRead?: boolean;
  dateGroup?: string;
}

// Quick reply suggestions
const QUICK_REPLIES = [
  "Thanks for reaching out!",
  "I'm interested in learning more.",
  "Let's connect for a call.",
  "What opportunities are you looking for?",
  "I'll get back to you soon.",
];

// Enhanced dummy messages with more professional content
const DUMMY_MESSAGES: Message[] = [
  {
    id: "1",
    sender: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isOnline: true,
      title: "Talent Acquisition Manager",
      company: "TechCorp Inc.",
    },
    lastMessage: "Hey, are you attending the networking event next week?",
    timestamp: "10:30 AM",
    unread: true,
    lastMessageSender: "other",
    dateGroup: "Today",
  },
  {
    id: "2",
    sender: {
      id: "user2",
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      isOnline: false,
      title: "Software Engineer",
      company: "InnovateTech",
    },
    lastMessage:
      "Thanks for connecting! I'd love to discuss potential opportunities.",
    timestamp: "Yesterday",
    unread: false,
    lastMessageSender: "other",
    isRead: true,
    dateGroup: "Yesterday",
  },
  {
    id: "3",
    sender: {
      id: "user3",
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isOnline: true,
      title: "Recruiter",
      company: "Global Staffing Solutions",
    },
    lastMessage: "I just shared a job posting that might interest you.",
    timestamp: "Yesterday",
    unread: true,
    lastMessageSender: "other",
    hasAttachment: true,
    dateGroup: "Yesterday",
  },
  {
    id: "4",
    sender: {
      id: "user4",
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      isOnline: false,
      title: "Product Manager",
      company: "InnovateTech",
    },
    lastMessage: "Looking forward to our coffee chat tomorrow!",
    timestamp: "Monday",
    unread: false,
    lastMessageSender: "user",
    isRead: true,
    dateGroup: "This Week",
  },
  {
    id: "5",
    sender: {
      id: "user5",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      isOnline: true,
      title: "HR Director",
      company: "Future Enterprises",
    },
    lastMessage:
      "Can you send me your resume? I might have an opportunity for you.",
    timestamp: "Last week",
    unread: false,
    lastMessageSender: "other",
    isRead: true,
    dateGroup: "Last Week",
  },
  {
    id: "6",
    sender: {
      id: "user6",
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      isOnline: false,
      title: "CTO",
      company: "StartupX",
    },
    lastMessage: "I'd like to discuss a potential collaboration opportunity.",
    timestamp: "Last week",
    unread: false,
    lastMessageSender: "other",
    isRead: true,
    isTyping: true,
    dateGroup: "Last Week",
  },
  {
    id: "7",
    sender: {
      id: "user7",
      name: "Sophia Garcia",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      isOnline: false,
      title: "Marketing Director",
      company: "MediaMax",
    },
    lastMessage: "Thanks for the introduction! Let's connect soon.",
    timestamp: "2 weeks ago",
    unread: false,
    lastMessageSender: "other",
    isRead: true,
    isArchived: true,
    dateGroup: "Older",
  },
];

// Message filter types
type FilterType = "all" | "unread" | "archived" | "spam";
// Message tab types
type TabType = "focused" | "other" | "archived";

const MessagesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [activeTab, setActiveTab] = useState<TabType>("focused");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showComposeOptions, setShowComposeOptions] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    if (activeTab !== "focused" || activeFilter !== "all") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeFilter]);

  // Mark message as read
  const markAsRead = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, unread: false, isRead: true } : msg
      )
    );
  };

  // Archive message
  const archiveMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, isArchived: true } : msg
      )
    );
  };

  // Delete message
  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  // Filter messages based on active tab and filter
  const getFilteredMessages = () => {
    let filtered = messages;

    // Apply tab filter
    if (activeTab === "focused") {
      filtered = filtered.filter((msg) => !msg.isArchived && !msg.isSpam);
    } else if (activeTab === "other") {
      filtered = filtered.filter((msg) => msg.isSpam && !msg.isArchived);
    } else if (activeTab === "archived") {
      filtered = filtered.filter((msg) => msg.isArchived);
    }

    // Apply additional filters
    if (activeFilter === "unread") {
      filtered = filtered.filter((msg) => msg.unread);
    } else if (activeFilter === "archived") {
      filtered = filtered.filter((msg) => msg.isArchived);
    } else if (activeFilter === "spam") {
      filtered = filtered.filter((msg) => msg.isSpam);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (msg.sender.company &&
            msg.sender.company
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (msg.sender.title &&
            msg.sender.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    msgs.forEach((msg) => {
      const group = msg.dateGroup || "Other";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(msg);
    });

    return groups;
  };

  const filteredMessages = getFilteredMessages();
  const groupedMessages = groupMessagesByDate(filteredMessages);
  const dateGroups = Object.keys(groupedMessages);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      className={`flex-row items-center bg-white rounded-xl mb-3 p-3 ${
        item.unread ? "bg-blue-50" : ""
      }`}
      onPress={() => {
        markAsRead(item.id);
        router.push({
          pathname: "/(pages)/chat",
          params: {
            userId: item.sender.id,
            userName: item.sender.name,
            userAvatar: item.sender.avatar,
            userTitle: item.sender.title || "",
            userCompany: item.sender.company || "",
          },
        });
      }}
    >
      <View className="relative mr-3">
        <Image
          source={{ uri: item.sender.avatar }}
          className="w-[50px] h-[50px] rounded-full"
        />
        {item.sender.isOnline && (
          <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-semibold text-gray-800">
            {item.sender.name}
          </Text>
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
        </View>

        {item.sender.title && (
          <Text className="text-xs text-gray-500 mb-1">
            {item.sender.title}
            {item.sender.company ? ` at ${item.sender.company}` : ""}
          </Text>
        )}

        <View className="flex-row items-center">
          {item.lastMessageSender === "user" && (
            <Text className="text-xs text-gray-500 mr-1">You: </Text>
          )}

          {item.isTyping ? (
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600 italic">typing</Text>
              <View className="flex-row ml-1">
                <View className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-0.5 animate-bounce" />
                <View
                  className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-0.5 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <View
                  className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-0.5 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </View>
            </View>
          ) : (
            <View className="flex-row items-center flex-1">
              <Text
                className={`text-sm ${
                  item.unread ? "font-medium text-gray-800" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>

              {item.hasAttachment && (
                <Ionicons
                  name="attach"
                  size={16}
                  color="#666"
                  className="ml-1"
                />
              )}
            </View>
          )}
        </View>
      </View>

      <View className="flex-row items-center">
        {item.unread ? (
          <View className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" />
        ) : item.isRead && item.lastMessageSender === "user" ? (
          <Ionicons
            name="checkmark-done"
            size={16}
            color="#0077B5"
            className="ml-2"
          />
        ) : null}

        <TouchableOpacity
          className="ml-2 p-1"
          onPress={(e) => {
            e.stopPropagation();
            // Show message options
          }}
        >
          <Ionicons name="ellipsis-vertical" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }: { item: string }) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-500 mb-2">{item}</Text>
      {groupedMessages[item].map((message) => (
        <View key={message.id}>{renderMessageItem({ item: message })}</View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 ">
      <Stack.Screen
        options={{
          title: "Messages",
          headerTintColor: "#0077B5",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f8f9fa" },
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity
                className="mr-4"
                onPress={() => setShowFilterMenu(!showFilterMenu)}
              >
                <Ionicons name="filter" size={22} color="#0077B5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="settings-outline" size={22} color="#0077B5" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${
            activeTab === "focused" ? "border-b-2 border-blue-600" : ""
          }`}
          onPress={() => setActiveTab("focused")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "focused" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Focused
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${
            activeTab === "other" ? "border-b-2 border-blue-600" : ""
          }`}
          onPress={() => setActiveTab("other")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "other" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Other
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${
            activeTab === "archived" ? "border-b-2 border-blue-600" : ""
          }`}
          onPress={() => setActiveTab("archived")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "archived" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Archived
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-white rounded-lg mx-4 my-4 px-3 py-2 shadow-sm">
        <Ionicons name="search" size={20} color="#666" className="mr-2" />
        <TextInput
          className="flex-1 h-10 text-base"
          placeholder="Search messages"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter menu */}
      {showFilterMenu && (
        <View className="absolute top-[140px] right-4 z-10 bg-white rounded-lg shadow-lg p-3 w-48">
          <Text className="text-sm font-medium text-gray-800 mb-2">
            Filter by:
          </Text>
          <TouchableOpacity
            className={`flex-row items-center py-2 ${
              activeFilter === "all" ? "bg-blue-50" : ""
            }`}
            onPress={() => {
              setActiveFilter("all");
              setShowFilterMenu(false);
            }}
          >
            <Ionicons
              name={
                activeFilter === "all" ? "radio-button-on" : "radio-button-off"
              }
              size={18}
              color={activeFilter === "all" ? "#0077B5" : "#666"}
              className="mr-2"
            />
            <Text className="text-sm text-gray-700">All messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center py-2 ${
              activeFilter === "unread" ? "bg-blue-50" : ""
            }`}
            onPress={() => {
              setActiveFilter("unread");
              setShowFilterMenu(false);
            }}
          >
            <Ionicons
              name={
                activeFilter === "unread"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color={activeFilter === "unread" ? "#0077B5" : "#666"}
              className="mr-2"
            />
            <Text className="text-sm text-gray-700">Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center py-2 ${
              activeFilter === "archived" ? "bg-blue-50" : ""
            }`}
            onPress={() => {
              setActiveFilter("archived");
              setShowFilterMenu(false);
            }}
          >
            <Ionicons
              name={
                activeFilter === "archived"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color={activeFilter === "archived" ? "#0077B5" : "#666"}
              className="mr-2"
            />
            <Text className="text-sm text-gray-700">Archived</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center py-2 ${
              activeFilter === "spam" ? "bg-blue-50" : ""
            }`}
            onPress={() => {
              setActiveFilter("spam");
              setShowFilterMenu(false);
            }}
          >
            <Ionicons
              name={
                activeFilter === "spam" ? "radio-button-on" : "radio-button-off"
              }
              size={18}
              color={activeFilter === "spam" ? "#0077B5" : "#666"}
              className="mr-2"
            />
            <Text className="text-sm text-gray-700">Spam</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Message list */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0077B5" />
          <Text className="mt-2 text-gray-600">Loading messages...</Text>
        </View>
      ) : filteredMessages.length > 0 ? (
        <FlatList
          data={dateGroups}
          keyExtractor={(item) => item}
          renderItem={renderDateGroup}
          contentContainerClassName="px-4 py-2"
        />
      ) : (
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
          <Text className="mt-4 text-base text-gray-500">
            No messages found
          </Text>
          {searchQuery && (
            <TouchableOpacity
              className="mt-3 py-2 px-4 bg-blue-500 rounded-full"
              onPress={() => setSearchQuery("")}
            >
              <Text className="text-white font-medium">Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Compose button with options */}
      <TouchableOpacity
        className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-blue-500 justify-center items-center shadow-md"
        onPress={() => setShowComposeOptions(!showComposeOptions)}
      >
        <Ionicons
          name={showComposeOptions ? "close" : "create-outline"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Compose options menu */}
      {showComposeOptions && (
        <View className="absolute right-5 bottom-24 bg-white rounded-lg shadow-lg p-3 w-60">
          <TouchableOpacity className="flex-row items-center py-3">
            <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3">
              <Ionicons name="person-add" size={18} color="#0077B5" />
            </View>
            <Text className="text-gray-800 font-medium">New connection</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3">
              <Ionicons name="people" size={18} color="#0077B5" />
            </View>
            <Text className="text-gray-800 font-medium">New group message</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3">
              <Ionicons name="mail" size={18} color="#0077B5" />
            </View>
            <Text className="text-gray-800 font-medium">Compose message</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick replies */}
      <View className="bg-white border-t border-gray-200 py-3 px-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Quick replies
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_REPLIES.map((reply, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-100 rounded-full py-2 px-4 mr-2"
            >
              <Text className="text-sm text-gray-800">{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default MessagesScreen;
