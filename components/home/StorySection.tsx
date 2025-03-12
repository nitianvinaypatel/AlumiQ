import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/contexts/ThemeContext"; // Adjust the path as needed

const { width, height } = Dimensions.get("window");

// Define interfaces for type safety
interface StoryItem {
  id: string;
  image: string;
  timestamp: string;
  caption?: string;
}

interface UserStory {
  userId: string;
  username: string;
  profileImage: string;
  stories: StoryItem[];
  viewed: boolean;
  hasUpdate: boolean;
  isYourStory: boolean;
}

// Sample data with multiple stories per user
const initialStoryData: UserStory[] = [
  {
    userId: "you",
    username: "Add story",
    profileImage: "https://via.placeholder.com/150",
    stories: [],
    viewed: false,
    hasUpdate: false,
    isYourStory: true,
  },
  // ... rest of the data remains the same
  {
    userId: "user1",
    username: "john_doe",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    stories: [
      {
        id: "s1-1",
        image: "https://picsum.photos/id/10/800/1400",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        caption: "Amazing sunset view from my window today! 🌅",
      },
      {
        id: "s1-2",
        image: "https://picsum.photos/id/11/800/1400",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    viewed: false,
    hasUpdate: true,
    isYourStory: false,
  },
  {
    userId: "user2",
    username: "sarah.j",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    stories: [
      {
        id: "s2-1",
        image: "https://picsum.photos/id/22/800/1400",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        caption: "New coffee shop discovery! ☕",
      },
    ],
    viewed: false,
    hasUpdate: true,
    isYourStory: false,
  },
  {
    userId: "user3",
    username: "mike_tech",
    profileImage: "https://randomuser.me/api/portraits/men/66.jpg",
    stories: [
      {
        id: "s3-1",
        image: "https://picsum.photos/id/30/800/1400",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: "s3-2",
        image: "https://picsum.photos/id/31/800/1400",
        timestamp: new Date(Date.now() - 9000000).toISOString(),
        caption: "New gadget unboxing",
      },
      {
        id: "s3-3",
        image: "https://picsum.photos/id/32/800/1400",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    viewed: false,
    hasUpdate: true,
    isYourStory: false,
  },
  {
    userId: "user4",
    username: "lisa.design",
    profileImage: "https://randomuser.me/api/portraits/women/33.jpg",
    stories: [
      {
        id: "s4-1",
        image: "https://picsum.photos/id/40/800/1400",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        caption: "Working on a new design project",
      },
    ],
    viewed: true,
    hasUpdate: false,
    isYourStory: false,
  },
];

const StorySection = () => {
  // Get the theme from context
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Apply the theme values
  const themeColors = isDarkMode
    ? require("@/contexts/ThemeContext").darkTheme
    : require("@/contexts/ThemeContext").lightTheme;

  // State to manage all user stories
  const [userStories, setUserStories] = useState<UserStory[]>(initialStoryData);

  // State for viewing story
  const [activeUserIndex, setActiveUserIndex] = useState<number>(-1);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  // State for creating story
  const [createStoryModal, setCreateStoryModal] = useState(false);
  const [storyCaption, setStoryCaption] = useState("");
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const storyDuration = 5000; // 5 seconds per story

  // Your story management
  const [yourStories, setYourStories] = useState<StoryItem[]>([]);
  const [isViewingYourStory, setIsViewingYourStory] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);

  // Handles viewing a user's story
  const handleViewStory = (userId: string) => {
    const userIndex = userStories.findIndex((user) => user.userId === userId);

    if (userIndex !== -1) {
      if (userStories[userIndex].isYourStory) {
        // If it's your story and you have stories, view them, otherwise open create
        if (yourStories.length > 0) {
          setIsViewingYourStory(true);
          setActiveUserIndex(userIndex);
          setActiveStoryIndex(0);
          setStoryModalVisible(true);
          startStoryProgress();
        } else {
          setCreateStoryModal(true);
        }
      } else {
        // View someone else's story
        setIsViewingYourStory(false);
        setActiveUserIndex(userIndex);
        setActiveStoryIndex(0);
        setStoryModalVisible(true);

        // Mark as viewed
        const updatedUserStories = [...userStories];
        updatedUserStories[userIndex].viewed = true;
        updatedUserStories[userIndex].hasUpdate = false;
        setUserStories(updatedUserStories);

        // Start the progress animation
        startStoryProgress();
      }
    }
  };

  // Start the progress animation for the current story
  const startStoryProgress = () => {
    progressAnim.setValue(0);
    if (progressAnimation.current) {
      progressAnimation.current.stop();
    }

    progressAnimation.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: storyDuration,
      useNativeDriver: false,
    });

    progressAnimation.current.start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });
  };

  // Go to the next story or next user's stories
  const goToNextStory = () => {
    if (activeUserIndex === -1) return;

    const currentUserStories = isViewingYourStory
      ? yourStories
      : userStories[activeUserIndex].stories;

    if (activeStoryIndex < currentUserStories.length - 1) {
      // Go to next story of the same user
      setActiveStoryIndex(activeStoryIndex + 1);
      startStoryProgress();
    } else {
      // Go to next user's stories
      if (activeUserIndex < userStories.length - 1) {
        const nextUserIndex = findNextValidUserIndex(activeUserIndex);

        if (nextUserIndex !== -1) {
          setActiveUserIndex(nextUserIndex);
          setActiveStoryIndex(0);
          startStoryProgress();

          // Mark as viewed
          const updatedUserStories = [...userStories];
          updatedUserStories[nextUserIndex].viewed = true;
          updatedUserStories[nextUserIndex].hasUpdate = false;
          setUserStories(updatedUserStories);
        } else {
          // No more stories to show
          closeStoryModal();
        }
      } else {
        // No more users with stories
        closeStoryModal();
      }
    }
  };

  // Go to the previous story or previous user's stories
  const goToPrevStory = () => {
    if (activeUserIndex === -1) return;

    if (activeStoryIndex > 0) {
      // Go to previous story of the same user
      setActiveStoryIndex(activeStoryIndex - 1);
      startStoryProgress();
    } else {
      // Go to previous user's last story
      if (activeUserIndex > 0) {
        const prevUserIndex = findPrevValidUserIndex(activeUserIndex);

        if (prevUserIndex !== -1) {
          const prevUserStories = userStories[prevUserIndex].isYourStory
            ? yourStories
            : userStories[prevUserIndex].stories;

          setActiveUserIndex(prevUserIndex);
          setActiveStoryIndex(prevUserStories.length - 1);
          startStoryProgress();
        }
      }
    }
  };

  // Find the next valid user with stories (skipping users without stories)
  const findNextValidUserIndex = (currentIndex: number) => {
    for (let i = currentIndex + 1; i < userStories.length; i++) {
      if (userStories[i].isYourStory) {
        if (yourStories.length > 0) return i;
      } else if (userStories[i].stories.length > 0) {
        return i;
      }
    }
    return -1;
  };

  // Find the previous valid user with stories
  const findPrevValidUserIndex = (currentIndex: number) => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (userStories[i].isYourStory) {
        if (yourStories.length > 0) return i;
      } else if (userStories[i].stories.length > 0) {
        return i;
      }
    }
    return -1;
  };

  // Handle long press on story to pause
  const handleStoryPress = (pressed: boolean) => {
    if (pressed) {
      if (progressAnimation.current) {
        progressAnimation.current.stop();
        setIsPaused(true);
        setIsLongPressed(true);
      }
    } else {
      if (isPaused) {
        const remaining = storyDuration * (1 - progressAnim._value);
        progressAnimation.current = Animated.timing(progressAnim, {
          toValue: 1,
          duration: remaining,
          useNativeDriver: false,
        });
        progressAnimation.current.start(({ finished }) => {
          if (finished) {
            goToNextStory();
          }
        });
        setIsPaused(false);
        setIsLongPressed(false);
      }
    }
  };

  // Close the story modal
  const closeStoryModal = () => {
    if (progressAnimation.current) {
      progressAnimation.current.stop();
    }
    setStoryModalVisible(false);
    setActiveUserIndex(-1);
    setActiveStoryIndex(0);
    setIsPaused(false);
  };

  // Pick an image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setNewStoryImage(result.assets[0].uri);
    }
  };

  // Create a new story
  const createNewStory = () => {
    if (newStoryImage) {
      const newStory: StoryItem = {
        id: `your-story-${Date.now()}`,
        image: newStoryImage,
        timestamp: new Date().toISOString(),
        caption: storyCaption.trim() || undefined,
      };

      const updatedStories = [newStory, ...yourStories];
      setYourStories(updatedStories);

      // Update the user stories array - ensure your story option shows updates
      const updatedUserStories = [...userStories];
      const yourStoryIndex = updatedUserStories.findIndex(
        (story) => story.isYourStory
      );
      if (yourStoryIndex !== -1) {
        updatedUserStories[yourStoryIndex].hasUpdate = true;
        updatedUserStories[yourStoryIndex].viewed = false;
        updatedUserStories[yourStoryIndex].username = "Your story";
      }
      setUserStories(updatedUserStories);

      // Reset create story state
      setNewStoryImage(null);
      setStoryCaption("");
      setCreateStoryModal(false);
    }
  };

  // Delete your story
  const deleteYourStory = (storyId: string) => {
    Alert.alert("Delete Story", "Are you sure you want to delete this story?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedStories = yourStories.filter(
            (story) => story.id !== storyId
          );
          setYourStories(updatedStories);

          // If this was the last story, close modal and update UI
          if (updatedStories.length === 0) {
            closeStoryModal();

            // Update your story display in the list
            const updatedUserStories = [...userStories];
            const yourStoryIndex = updatedUserStories.findIndex(
              (story) => story.isYourStory
            );
            if (yourStoryIndex !== -1) {
              updatedUserStories[yourStoryIndex].hasUpdate = false;
              updatedUserStories[yourStoryIndex].username = "Add story";
            }
            setUserStories(updatedUserStories);
          } else if (activeStoryIndex >= updatedStories.length) {
            // If we were viewing the last story that was deleted
            setActiveStoryIndex(updatedStories.length - 1);
            startStoryProgress();
          } else {
            // Continue with current story index (now showing next story)
            startStoryProgress();
          }
        },
      },
    ]);
  };

  // Render progress bars for multi-story users
  const renderProgressBars = () => {
    const storiesCount = isViewingYourStory
      ? yourStories.length
      : activeUserIndex !== -1
      ? userStories[activeUserIndex].stories.length
      : 0;

    return (
      <View className="flex-row w-full px-2 mt-2 mb-2">
        {Array.from({ length: storiesCount }).map((_, index) => (
          <View
            key={index}
            className="flex-1 h-0.5 mx-0.5"
            style={{ backgroundColor: isDarkMode ? "#4E4F50" : "#D1D5DB" }}
          >
            {index === activeStoryIndex ? (
              <Animated.View
                className="h-full"
                style={{
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: "#FFFFFF",
                }}
              />
            ) : index < activeStoryIndex ? (
              <View className="h-full w-full bg-white" />
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  // Render the story viewing modal
  const renderStoryModal = () => {
    if (activeUserIndex === -1) return null;

    const currentUser = userStories[activeUserIndex];
    const currentStories = currentUser.isYourStory
      ? yourStories
      : currentUser.stories;

    if (currentStories.length === 0) return null;

    const currentStory = currentStories[activeStoryIndex];

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={storyModalVisible}
        onRequestClose={closeStoryModal}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View className="flex-1 bg-black">
          {/* Progress bars */}
          {renderProgressBars()}

          {/* Header */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: currentUser.profileImage }}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View>
                <Text className="text-white font-semibold">
                  {currentUser.username}
                </Text>
                <Text className="text-gray-300 text-xs">
                  {new Date(currentStory.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              {isViewingYourStory && (
                <TouchableOpacity
                  className="mr-4"
                  onPress={() => deleteYourStory(currentStory.id)}
                >
                  <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeStoryModal}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Story content with touch handlers */}
          <View className="flex-1">
            {/* Left touch area (previous) */}
            <TouchableOpacity
              className="absolute left-0 top-0 w-1/5 h-full z-10"
              onPress={goToPrevStory}
              activeOpacity={1}
            />

            {/* Center area (pause/play on long press) */}
            <Pressable
              className="absolute left-1/5 right-1/5 top-0 bottom-0 z-10"
              onLongPress={() => handleStoryPress(true)}
              onPressOut={() => handleStoryPress(false)}
              delayLongPress={200}
            />

            {/* Right touch area (next) */}
            <TouchableOpacity
              className="absolute right-0 top-0 w-1/5 h-full z-10"
              onPress={goToNextStory}
              activeOpacity={1}
            />

            {/* Story image */}
            <Image
              source={{ uri: currentStory.image }}
              style={{ width: width, height: height - 180 }}
              resizeMode="cover"
              className="flex-1"
            />

            {/* Caption */}
            {currentStory.caption && (
              <View className="absolute bottom-20 left-4 right-4 bg-black bg-opacity-40 p-4 rounded-lg">
                <Text className="text-white">{currentStory.caption}</Text>
              </View>
            )}

            {/* Long press indicator */}
            {isLongPressed && (
              <View className="absolute top-1/2 left-1/2 transform -translate-x-12 -translate-y-12 bg-black bg-opacity-60 rounded-full p-3">
                <MaterialIcons name="pause" size={32} color="white" />
              </View>
            )}
          </View>

          {/* Footer - Reply input */}
          <View className="p-4 flex-row items-center">
            <TextInput
              className="flex-1 rounded-full px-4 py-2 mr-2"
              style={{
                backgroundColor: isDarkMode ? "#3A3B3C" : "#F3F4F6",
                color: isDarkMode ? "#E4E6EB" : "#191919",
              }}
              placeholder={`Reply to ${currentUser.username}...`}
              placeholderTextColor={isDarkMode ? "#B0B3B8" : "#9CA3AF"}
            />
            <TouchableOpacity className="bg-blue-500 rounded-full p-2">
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Render the create story modal
  const renderCreateStoryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={createStoryModal}
        onRequestClose={() => setCreateStoryModal(false)}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View className="flex-1 bg-black">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 mt-8">
            <TouchableOpacity
              onPress={() => {
                setCreateStoryModal(false);
                setNewStoryImage(null);
                setStoryCaption("");
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Create Story</Text>
            <TouchableOpacity
              onPress={createNewStory}
              disabled={!newStoryImage}
              className={!newStoryImage ? "opacity-50" : ""}
            >
              <Text className="text-blue-500 font-bold">Share</Text>
            </TouchableOpacity>
          </View>

          {/* Image preview or picker */}
          <View className="flex-1 justify-center items-center">
            {newStoryImage ? (
              <Image
                source={{ uri: newStoryImage }}
                style={{ width: width, height: width * 1.7 }}
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="p-8 rounded-lg items-center"
                style={{ backgroundColor: isDarkMode ? "#242526" : "#E5E5E5" }}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={64}
                  color="#0077B5"
                />
                <Text
                  style={{ color: isDarkMode ? "#E4E6EB" : "#191919" }}
                  className="mt-4"
                >
                  Select an image from gallery
                </Text>
              </TouchableOpacity>
            )}

            {newStoryImage && (
              <View className="absolute bottom-20 left-4 right-4">
                <TextInput
                  className="bg-opacity-70 rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: isDarkMode
                      ? "rgba(36, 37, 38, 0.8)"
                      : "rgba(255, 255, 255, 0.8)",
                    color: isDarkMode ? "#E4E6EB" : "#191919",
                    borderColor: isDarkMode ? "#4E4F50" : "#D1D5DB",
                    borderWidth: 1,
                  }}
                  placeholder="Write a caption..."
                  placeholderTextColor={isDarkMode ? "#B0B3B8" : "#9CA3AF"}
                  value={storyCaption}
                  onChangeText={setStoryCaption}
                  multiline
                />
              </View>
            )}
          </View>

          {/* Footer - Effects/Tools */}
          {newStoryImage && (
            <View
              className="p-4"
              style={{
                borderTopColor: isDarkMode ? "#3E4042" : "#E5E5E5",
                borderTopWidth: 1,
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity className="items-center mr-6">
                  <View
                    className="p-2 rounded-full mb-1"
                    style={{
                      backgroundColor: isDarkMode ? "#3A3B3C" : "#F3F4F6",
                    }}
                  >
                    <FontAwesome
                      name="font"
                      size={18}
                      color={isDarkMode ? "#E4E6EB" : "#191919"}
                    />
                  </View>
                  <Text
                    style={{ color: isDarkMode ? "#E4E6EB" : "#191919" }}
                    className="text-xs"
                  >
                    Text
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center mr-6">
                  <View
                    className="p-2 rounded-full mb-1"
                    style={{
                      backgroundColor: isDarkMode ? "#3A3B3C" : "#F3F4F6",
                    }}
                  >
                    <FontAwesome
                      name="paint-brush"
                      size={18}
                      color={isDarkMode ? "#E4E6EB" : "#191919"}
                    />
                  </View>
                  <Text
                    style={{ color: isDarkMode ? "#E4E6EB" : "#191919" }}
                    className="text-xs"
                  >
                    Draw
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center mr-6">
                  <View
                    className="p-2 rounded-full mb-1"
                    style={{
                      backgroundColor: isDarkMode ? "#3A3B3C" : "#F3F4F6",
                    }}
                  >
                    <FontAwesome
                      name="magic"
                      size={18}
                      color={isDarkMode ? "#E4E6EB" : "#191919"}
                    />
                  </View>
                  <Text
                    style={{ color: isDarkMode ? "#E4E6EB" : "#191919" }}
                    className="text-xs"
                  >
                    Effects
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center mr-6">
                  <View
                    className="p-2 rounded-full mb-1"
                    style={{
                      backgroundColor: isDarkMode ? "#3A3B3C" : "#F3F4F6",
                    }}
                  >
                    <MaterialIcons
                      name="emoji-emotions"
                      size={18}
                      color={isDarkMode ? "#E4E6EB" : "#191919"}
                    />
                  </View>
                  <Text
                    style={{ color: isDarkMode ? "#E4E6EB" : "#191919" }}
                    className="text-xs"
                  >
                    Stickers
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  // The main component render
  return (
    <View
      className="pt-2 pb-2 shadow-sm mb-2"
      style={{
        backgroundColor: themeColors.cardBackground,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        {userStories.map((user) => (
          <TouchableOpacity
            key={user.userId}
            className="mr-3 mt-1 items-center"
            activeOpacity={0.8}
            onPress={() => handleViewStory(user.userId)}
          >
            <View className="relative">
              {user.isYourStory && yourStories.length === 0 ? (
                <View className="absolute -inset-1 rounded-full justify-center items-center">
                  <LinearGradient
                    colors={[themeColors.primary, themeColors.primary]}
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
              ) : user.hasUpdate ? (
                <View className="absolute -inset-1 rounded-full justify-center items-center">
                  <LinearGradient
                    colors={[themeColors.primary, "#4f46e5"]}
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
                      backgroundColor: user.viewed
                        ? isDarkMode
                          ? "#3E4042"
                          : "#e5e7eb"
                        : isDarkMode
                        ? "#4E4F50"
                        : "#d1d5db",
                    }}
                  />
                </View>
              )}

              <View
                className="rounded-full p-1"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: themeColors.background,
                }}
              >
                <Image
                  source={{ uri: user.profileImage }}
                  className="w-full h-full rounded-full"
                />
                {user.isYourStory && yourStories.length === 0 && (
                  <View
                    className="absolute bottom-0 right-0 rounded-full border-2 w-6 h-6 items-center justify-center"
                    style={{
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.background,
                    }}
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </View>
                )}
              </View>
            </View>
            <Text
              className="text-xs mt-1 text-center max-w-16"
              style={{
                color: user.viewed
                  ? isDarkMode
                    ? "#B0B3B8"
                    : "#6B7280"
                  : isDarkMode
                  ? "#E4E6EB"
                  : "#111827",
                fontWeight: user.viewed ? "normal" : "500",
              }}
              numberOfLines={1}
            >
              {user.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderStoryModal()}
      {renderCreateStoryModal()}
    </View>
  );
};

export default StorySection;
