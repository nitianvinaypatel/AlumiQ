import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
  StatusBar,
  Pressable,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
// Import useTheme hook and theme types
import { useTheme } from "@/contexts/ThemeContext";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  isEdited?: boolean;
  replyTo?: {
    id: string;
    text: string;
    sender: "user" | "other";
  };
  attachments?: Array<{
    type: "image" | "file" | "audio";
    url: string;
    name?: string;
    size?: string;
  }>;
}

// Dummy data for the chat
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "Hi there! Thanks for connecting.",
    sender: "other",
    timestamp: "10:30 AM",
    status: "read",
  },
  {
    id: "2",
    text: "Hello! Nice to connect with you too.",
    sender: "user",
    timestamp: "10:31 AM",
    status: "read",
  },
  {
    id: "3",
    text: "I saw that you have experience in React Native development. I'm working on a project that might interest you.",
    sender: "other",
    timestamp: "10:32 AM",
    status: "read",
  },
  {
    id: "4",
    text: "That sounds interesting! I'd love to hear more about it.",
    sender: "user",
    timestamp: "10:33 AM",
    status: "read",
  },
  {
    id: "5",
    text: "Great! It's a social networking app for alumni. We're looking for developers to join our team.",
    sender: "other",
    timestamp: "10:35 AM",
    status: "read",
    attachments: [
      {
        type: "image",
        url: "https://picsum.photos/400/300",
        name: "project_preview.jpg",
      },
    ],
  },
  {
    id: "6",
    text: "Here are some project details for your reference.",
    sender: "other",
    timestamp: "10:36 AM",
    status: "read",
    attachments: [
      {
        type: "file",
        url: "#",
        name: "project_brief.pdf",
        size: "2.4 MB",
      },
    ],
  },
];

const ChatScreen = () => {
  const params = useLocalSearchParams();
  const { userId, userName, userAvatar } = params;
  const router = useRouter();

  // Get the theme from context
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Apply the theme values
  const themeColors = isDarkMode
    ? require("@/contexts/ThemeContext").darkTheme
    : require("@/contexts/ThemeContext").lightTheme;

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const [headerOpacity] = useState(() =>
    scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    })
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      ...(replyingTo
        ? {
            replyTo: {
              id: replyingTo.id,
              text: replyingTo.text,
              sender: replyingTo.sender,
            },
          }
        : {}),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setReplyingTo(null);

    // Simulate "delivered" status after a short delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 500);

    // Simulate "other user is typing"
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    // Simulate a reply after a delay
    setTimeout(() => {
      setIsTyping(false);

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon with more details about the project requirements and timeline.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, reply]);

      // Update status of user's message to "read"
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, status: "read" } : msg
          )
        );
      }, 1000);
    }, 3000);
  };

  const handleLongPress = (message: ChatMessage) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMessage(message);
    setShowOptions(true);
  };

  const handleReply = () => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setShowOptions(false);
      setSelectedMessage(null);
      inputRef.current?.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const deleteMessage = () => {
    if (selectedMessage) {
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== selectedMessage.id)
      );
      setShowOptions(false);
      setSelectedMessage(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderAttachment = (
    attachment: NonNullable<ChatMessage["attachments"]>[number]
  ) => {
    if (attachment.type === "image") {
      return (
        <TouchableOpacity className="mt-2 rounded-lg overflow-hidden">
          <Image
            source={{ uri: attachment.url }}
            className="w-48 h-36 rounded-lg"
            resizeMode="cover"
          />
          <View
            className={`absolute bottom-2 left-2 ${
              isDarkMode ? "bg-black/70" : "bg-black/60"
            } px-2 py-1 rounded-md`}
          >
            <Text className="text-white text-xs">{attachment.name}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (attachment.type === "file") {
      return (
        <TouchableOpacity
          className={`mt-2 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg p-3 flex-row items-center`}
        >
          <View className="bg-blue-500 w-10 h-10 rounded-lg items-center justify-center mr-3">
            <FontAwesome name="file-pdf-o" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text
              className={`font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {attachment.name}
            </Text>
            <Text
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-xs`}
            >
              {attachment.size}
            </Text>
          </View>
          <TouchableOpacity
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } p-2 rounded-full`}
          >
            <Ionicons
              name="download-outline"
              size={18}
              color={isDarkMode ? "#e5e7eb" : "#555"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderReplyPreview = (replyData: ChatMessage["replyTo"]) => {
    if (!replyData) return null;

    return (
      <View
        className={`${
          isDarkMode
            ? "bg-gray-800 border-l-2 border-blue-400"
            : "bg-gray-100 border-l-2 border-blue-500"
        } rounded-md p-2 mb-2 mx-1 flex-row justify-between items-center`}
      >
        <View className="flex-1">
          <Text className="text-blue-500 text-xs font-medium">
            Reply to{" "}
            {replyData.sender === "user" ? "yourself" : userName || "User"}
          </Text>
          <Text
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } text-xs`}
            numberOfLines={1}
          >
            {replyData.text}
          </Text>
        </View>
        <TouchableOpacity onPress={cancelReply}>
          <Ionicons
            name="close"
            size={18}
            color={isDarkMode ? "#9ca3af" : "#666"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageStatus = (status: string) => {
    if (status === "sent") {
      return (
        <Ionicons
          name="checkmark"
          size={14}
          color={isDarkMode ? "#9CA3AF" : "#9CA3AF"}
        />
      );
    } else if (status === "delivered") {
      return (
        <Ionicons
          name="checkmark-done"
          size={14}
          color={isDarkMode ? "#9CA3AF" : "#9CA3AF"}
        />
      );
    } else if (status === "read") {
      return (
        <Ionicons
          name="checkmark-done"
          size={14}
          color={isDarkMode ? "#60A5FA" : "#3B82F6"}
        />
      );
    }
    return null;
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <Pressable
      onLongPress={() => handleLongPress(item)}
      className={`mb-3 max-w-[85%] ${
        item.sender === "user" ? "self-end" : "self-start"
      }`}
    >
      {item.replyTo && (
        <View
          className={`mb-1 rounded-t-lg px-3 py-1.5 ${
            item.sender === "user"
              ? isDarkMode
                ? "bg-blue-600/30 rounded-l-lg"
                : "bg-blue-600/20 rounded-l-lg"
              : isDarkMode
              ? "bg-gray-700 rounded-r-lg"
              : "bg-gray-200 rounded-r-lg"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Reply to{" "}
            {item.replyTo.sender === "user" ? "yourself" : userName || "User"}
          </Text>
          <Text
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
            numberOfLines={1}
          >
            {item.replyTo.text}
          </Text>
        </View>
      )}

      <View
        className={`${
          item.sender === "user"
            ? "bg-blue-500 rounded-t-lg rounded-l-lg"
            : isDarkMode
            ? "bg-gray-700 rounded-t-lg rounded-r-lg shadow-sm"
            : "bg-white rounded-t-lg rounded-r-lg shadow-sm"
        } px-4 py-2.5`}
      >
        <Text
          className={`${
            item.sender === "user"
              ? "text-white"
              : isDarkMode
              ? "text-gray-200"
              : "text-gray-800"
          }`}
        >
          {item.text}
        </Text>

        {item.attachments?.map((attachment, index) => (
          <View key={index}>{renderAttachment(attachment)}</View>
        ))}

        <View className="flex-row items-center justify-end mt-1 space-x-1">
          {item.isEdited && (
            <Text
              className={`text-xs ${
                item.sender === "user" ? "text-blue-200" : "text-gray-400"
              }`}
            >
              Edited
            </Text>
          )}
          <Text
            className={`text-xs ${
              item.sender === "user" ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {item.timestamp}
          </Text>
          {item.sender === "user" && (
            <View className="ml-1">
              {renderMessageStatus(item.status || "sent")}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    // Group messages by sender and show avatar only for first message in group
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar =
      item.sender === "other" &&
      (!prevMessage || prevMessage.sender !== "other");

    return (
      <View className="flex-row mb-1">
        {item.sender === "other" && showAvatar ? (
          <Image
            source={{
              uri:
                (userAvatar as string) ||
                "https://randomuser.me/api/portraits/women/1.jpg",
            }}
            className="w-8 h-8 rounded-full mr-2 mt-1"
          />
        ) : (
          <View className="w-8 mr-2" />
        )}
        <View className="flex-1">{renderMessage({ item })}</View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <Animated.View
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
        style={{ opacity: headerOpacity }}
      >
        <BlurView
          intensity={90}
          tint={isDarkMode ? "dark" : "light"}
          className="px-4 pt-12 pb-3"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="p-2 mr-2 -ml-2"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDarkMode ? "#e5e7eb" : "#333"}
                />
              </TouchableOpacity>

              <Image
                source={{
                  uri:
                    (userAvatar as string) ||
                    "https://randomuser.me/api/portraits/women/1.jpg",
                }}
                className="w-10 h-10 rounded-full mr-3"
              />

              <View>
                <Text
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  } text-base`}
                >
                  {(userName as string) || "Chat User"}
                </Text>
                <Text className="text-xs text-green-500">
                  {isTyping ? "Typing..." : "Online"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="p-2 mr-3"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <Ionicons
                  name="call"
                  size={22}
                  color={isDarkMode ? "#e5e7eb" : "#333"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <Ionicons
                  name="videocam"
                  size={22}
                  color={isDarkMode ? "#e5e7eb" : "#333"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 ml-3"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={isDarkMode ? "#e5e7eb" : "#333"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerClassName="p-4 pb-2"
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListFooterComponent={
          isTyping ? (
            <View className="flex-row items-center ml-10 mb-4">
              <View
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } px-4 py-3 rounded-full`}
              >
                <View className="flex-row items-center space-x-1">
                  <ActivityIndicator
                    size="small"
                    color={isDarkMode ? "#9ca3af" : "#666"}
                  />
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-xs ml-1`}
                  >
                    Typing...
                  </Text>
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Message Options Modal */}
      {showOptions && (
        <Pressable
          className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
          onPress={() => setShowOptions(false)}
        >
          <View
            className={`absolute bottom-24 right-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg overflow-hidden`}
          >
            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}
              onPress={handleReply}
            >
              <Ionicons name="return-up-back" size={20} color="#3B82F6" />
              <Text
                className={`ml-3 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Reply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}
              onPress={() => {
                setShowOptions(false);
                setSelectedMessage(null);
              }}
            >
              <Ionicons name="copy-outline" size={20} color="#3B82F6" />
              <Text
                className={`ml-3 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Copy Text
              </Text>
            </TouchableOpacity>
            {selectedMessage?.sender === "user" && (
              <TouchableOpacity
                className={`flex-row items-center px-4 py-3 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                }`}
                onPress={() => {
                  setShowOptions(false);
                  setSelectedMessage(null);
                }}
              >
                <Ionicons name="pencil" size={20} color="#3B82F6" />
                <Text
                  className={`ml-3 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Edit Message
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={deleteMessage}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="ml-3 text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      {/* Attachment Options */}
      {showAttachmentOptions && (
        <Pressable
          className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
          onPress={() => setShowAttachmentOptions(false)}
        >
          <View
            className={`absolute bottom-24 left-4 right-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg overflow-hidden`}
          >
            <Text
              className={`px-4 pt-3 pb-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-xs font-medium`}
            >
              SHARE
            </Text>
            <View className="flex-row justify-around px-2 pb-4">
              <TouchableOpacity className="items-center p-2">
                <View
                  className={`w-12 h-12 ${
                    isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="image"
                    size={22}
                    color={isDarkMode ? "#60A5FA" : "#3B82F6"}
                  />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Photos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center p-2">
                <View
                  className={`w-12 h-12 ${
                    isDarkMode ? "bg-purple-900/30" : "bg-purple-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="document"
                    size={22}
                    color={isDarkMode ? "#A78BFA" : "#8B5CF6"}
                  />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Files
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center p-2">
                <View
                  className={`w-12 h-12 ${
                    isDarkMode ? "bg-green-900/30" : "bg-green-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="location"
                    size={22}
                    color={isDarkMode ? "#34D399" : "#10B981"}
                  />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center p-2">
                <View
                  className={`w-12 h-12 ${
                    isDarkMode ? "bg-red-900/30" : "bg-red-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="mic"
                    size={22}
                    color={isDarkMode ? "#F87171" : "#EF4444"}
                  />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Audio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center p-2">
                <View
                  className={`w-12 h-12 ${
                    isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"
                  } rounded-full items-center justify-center mb-1`}
                >
                  <Ionicons
                    name="person"
                    size={22}
                    color={isDarkMode ? "#FBBF24" : "#F59E0B"}
                  />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      )}

      {/* Input Area */}
      <View
        className={`border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        {replyingTo && renderReplyPreview(replyingTo)}

        <View className="flex-row items-center p-2">
          <TouchableOpacity
            className="p-2 mx-1"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAttachmentOptions(true);
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={isDarkMode ? "#9ca3af" : "#666"}
            />
          </TouchableOpacity>

          <View
            className={`flex-1 flex-row items-center ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } rounded-full px-3 py-1 mx-1`}
          >
            <TextInput
              ref={inputRef}
              className={`flex-1 py-1.5 px-1 ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
              placeholder="Type a message..."
              placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              style={{ maxHeight: 100 }}
            />

            <TouchableOpacity className="p-1 mr-1">
              <Ionicons
                name="happy-outline"
                size={22}
                color={isDarkMode ? "#9ca3af" : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <MaterialIcons
                name="gif"
                size={22}
                color={isDarkMode ? "#9ca3af" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {newMessage.trim() ? (
            <TouchableOpacity
              className="p-2 bg-blue-500 rounded-full mx-1"
              onPress={sendMessage}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="p-2 mx-1"
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <Ionicons
                name="mic"
                size={24}
                color={isDarkMode ? "#9ca3af" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
