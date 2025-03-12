import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/constants/theme";
const { width } = Dimensions.get("window");
// Define types for our data
type AudienceOption = {
  id: number;
  name: string;
  icon: string;
  description: string;
};
type MediaItem = {
  id: string;
  uri: string;
  type: "image" | "video" | "document";
  name?: string;
  size?: number;
  uploading?: boolean;
  uploadProgress?: number;
};
type HashtagItem = {
  id: string;
  tag: string;
  count: number;
};
// Sample trending hashtags
const defaultHashtags: HashtagItem[] = [
  { id: "1", tag: "alumni", count: 2450 },
  { id: "2", tag: "leadership", count: 1850 },
  { id: "3", tag: "technology", count: 1640 },
  { id: "4", tag: "networking", count: 1320 },
  { id: "5", tag: "career", count: 1250 },
  { id: "6", tag: "innovation", count: 980 },
  { id: "7", tag: "mentorship", count: 850 },
  { id: "8", tag: "education", count: 780 },
  { id: "9", tag: "classof2023", count: 620 },
  { id: "10", tag: "reunion", count: 540 },
];
// Sample audience options
const audienceOptions: AudienceOption[] = [
  {
    id: 1,
    name: "Anyone",
    icon: "globe",
    description: "Anyone on or off LinkedIn",
  },
  {
    id: 2,
    name: "Connections only",
    icon: "people",
    description: "Connections on LinkedIn",
  },
  {
    id: 3,
    name: "Group members",
    icon: "people-circle",
    description: "Members of your groups",
  },
  {
    id: 4,
    name: "Class of 2018",
    icon: "school",
    description: "Only visible to your class",
  },
];
export default function AddPostScreen() {
  // Theme
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  // State
  const [postText, setPostText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState(audienceOptions[0]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hashtagSuggestions, setHashtagSuggestions] =
    useState<HashtagItem[]>(defaultHashtags);
  const [isPostingInProgress, setIsPostingInProgress] = useState(false);
  const [isPollModalVisible, setIsPollModalVisible] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollDuration, setPollDuration] = useState("1w"); // Default: 1 week
  const [isLoadingHashtags, setIsLoadingHashtags] = useState(false);
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerHeight = useRef(new Animated.Value(56)).current;
  const mediaOptionsHeight = useRef(new Animated.Value(0)).current;
  const mediaOptionsOpacity = useRef(new Animated.Value(0)).current;
  // Refs
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const videoRef = useRef<Video>(null);
  // Mocked data and functions (removed API calls)
  const mockFetchHashtags = () => {
    setIsLoadingHashtags(true);
    setTimeout(() => {
      setHashtagSuggestions(defaultHashtags);
      setIsLoadingHashtags(false);
    }, 1000);
  };
  const mockUploadMedia = (
    uri: string,
    type: string,
    progressCallback: (progress: number) => void
  ) => {
    return new Promise<string>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progressCallback(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve(uri); // Return the original URI for now
        }
      }, 300);
    });
  };
  useEffect(() => {
    mockFetchHashtags();
  }, []);
  useEffect(() => {
    // Animate content in on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        animateMediaOptions(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        animateMediaOptions(false);
      }
    );
    // Request camera and media library permissions on mount
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const animateMediaOptions = (collapsed: boolean) => {
    Animated.parallel([
      Animated.timing(mediaOptionsHeight, {
        toValue: collapsed ? 0 : 120,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(mediaOptionsOpacity, {
        toValue: collapsed ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const handleAddHashtag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      // Add the hashtag at the cursor position or at the end
      const hashtag = `#${tag} `;
      setPostText(postText + hashtag);
      // Focus back on the input
      textInputRef.current?.focus();
    }
    setShowTagSuggestions(false);
  };
  const handleRemoveHashtag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    // Remove the hashtag from the text
    const regex = new RegExp(`#${tag}\\s?`, "g");
    setPostText(postText.replace(regex, ""));
  };
  const handlePost = async () => {
    if (postText.trim().length === 0 && mediaItems.length === 0) {
      Alert.alert("Empty Post", "Please add some text or media to your post");
      return;
    }
    // Check if all media uploads are complete
    const incompleteUploads = mediaItems.filter((item) => item.uploading);
    if (incompleteUploads.length > 0) {
      Alert.alert(
        "Uploads in Progress",
        "Please wait for media uploads to complete before posting"
      );
      return;
    }
    setIsPostingInProgress(true);
    try {
      // Simulate posting process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Animate out and navigate back
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate back with success message
        router.back();
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setIsPostingInProgress(false);
    }
  };
  const handleAttachMedia = async (type: string) => {
    try {
      if (type === "photo") {
        // Show options for camera or gallery
        Alert.alert("Add Photo", "Choose source", [
          {
            text: "Camera",
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              if (!result.canceled) {
                await processAndUploadMedia(result.assets[0].uri, "image");
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              if (!result.canceled) {
                await processAndUploadMedia(result.assets[0].uri, "image");
              }
            },
          },
          { text: "Cancel", style: "cancel" },
        ]);
      } else if (type === "video") {
        // Show options for camera or gallery
        Alert.alert("Add Video", "Choose source", [
          {
            text: "Camera",
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
                videoMaxDuration: 60,
              });
              if (!result.canceled) {
                await processAndUploadMedia(result.assets[0].uri, "video");
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
              });
              if (!result.canceled) {
                await processAndUploadMedia(result.assets[0].uri, "video");
              }
            },
          },
          { text: "Cancel", style: "cancel" },
        ]);
      } else if (type === "document") {
        const result = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          copyToCacheDirectory: true,
        });
        if (result.canceled === false) {
          await processAndUploadMedia(
            result.assets[0].uri,
            "document",
            result.assets[0].name
          );
        }
      } else if (type === "poll") {
        setIsPollModalVisible(true);
      }
    } catch (error) {
      console.error("Error attaching media:", error);
      Alert.alert("Error", "Failed to attach media");
    }
  };
  const processAndUploadMedia = async (
    uri: string,
    type: string,
    name?: string
  ) => {
    try {
      // Compress image if it's an image
      let processedUri = uri;
      if (type === "image") {
        const manipulateResult = await manipulateAsync(
          uri,
          [{ resize: { width: 1080 } }],
          { compress: 0.8 }
        );
        processedUri = manipulateResult.uri;
      }
      // Generate a unique ID for this media
      const mediaId = Date.now().toString();
      // Add to media items with uploading status
      const newMediaItem: MediaItem = {
        id: mediaId,
        uri: processedUri,
        type: type as "image" | "video" | "document",
        name: name,
        uploading: true,
        uploadProgress: 0,
      };
      setMediaItems((prev) => [...prev, newMediaItem]);
      // Simulate upload using mock function
      try {
        const uploadedUrl = await mockUploadMedia(
          processedUri,
          type,
          (progress) => {
            setMediaItems((prev) =>
              prev.map((item) =>
                item.id === mediaId
                  ? { ...item, uploadProgress: progress }
                  : item
              )
            );
          }
        );
        // Update media item with uploaded URL and mark as complete
        setMediaItems((prev) =>
          prev.map((item) =>
            item.id === mediaId
              ? { ...item, uri: uploadedUrl, uploading: false }
              : item
          )
        );
      } catch (error: any) {
        Alert.alert("Upload Failed", error.message || "Failed to upload media");
        // Remove the failed media item
        setMediaItems((prev) => prev.filter((item) => item.id !== mediaId));
      }
    } catch (error) {
      console.error("Error processing media:", error);
      Alert.alert("Error", "Failed to process media");
    }
  };
  const handleRemoveMedia = (id: string) => {
    // Remove media item
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    } else {
      Alert.alert("Maximum Options", "You can add up to 5 options in a poll");
    }
  };
  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    } else {
      Alert.alert("Minimum Options", "A poll must have at least 2 options");
    }
  };
  const handleUpdatePollOption = (text: string, index: number) => {
    const newOptions = [...pollOptions];
    newOptions[index] = text;
    setPollOptions(newOptions);
  };
  const handleCreatePoll = () => {
    // Validate poll data
    if (!pollQuestion.trim()) {
      Alert.alert("Missing Question", "Please enter a question for your poll");
      return;
    }
    const validOptions = pollOptions.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      Alert.alert(
        "Insufficient Options",
        "Please add at least 2 valid options"
      );
      return;
    }
    // Add poll details to post text
    const pollText = `📊 Poll: ${pollQuestion}\n\nOptions:\n${validOptions
      .map((opt, i) => `- ${opt}`)
      .join("\n")}\n\nThis poll will run for ${
      pollDuration === "1d"
        ? "1 day"
        : pollDuration === "3d"
        ? "3 days"
        : pollDuration === "1w"
        ? "1 week"
        : "2 weeks"
    }.`;
    setPostText(postText ? `${postText}\n\n${pollText}` : pollText);
    setIsPollModalVisible(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"} mt-8`}
      >
        {/* Professional Header */}
        <Animated.View
          style={{ height: headerHeight }}
          className={`px-4 py-3 flex-row items-center justify-between border-b ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <TouchableOpacity
            onPress={() => {
              if (postText.trim().length > 0 || mediaItems.length > 0) {
                // Show confirmation dialog
                Alert.alert(
                  "Discard Post?",
                  "You have unsaved changes. Are you sure you want to discard this post?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Discard",
                      style: "destructive",
                      onPress: () => router.back(),
                    },
                  ]
                );
              } else {
                router.back();
              }
            }}
            className={`w-10 h-10 items-center justify-center rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDarkMode ? "#9CA3AF" : "#666"}
            />
          </TouchableOpacity>
          <Text
            className={`font-bold text-lg ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Create Post
          </Text>
          <TouchableOpacity
            className={`py-2 px-5 rounded-full ${
              (postText.trim().length > 0 || mediaItems.length > 0) &&
              !isPostingInProgress
                ? "bg-blue-700" // LinkedIn blue
                : isDarkMode
                ? "bg-gray-700"
                : "bg-gray-300"
            }`}
            disabled={
              (postText.trim().length === 0 && mediaItems.length === 0) ||
              isPostingInProgress
            }
            onPress={handlePost}
            style={{
              shadowColor:
                (postText.trim().length > 0 || mediaItems.length > 0) &&
                !isPostingInProgress
                  ? "#0a66c2" // LinkedIn blue shadow
                  : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation:
                (postText.trim().length > 0 || mediaItems.length > 0) &&
                !isPostingInProgress
                  ? 3
                  : 0,
            }}
          >
            {isPostingInProgress ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                className={`font-semibold ${
                  postText.trim().length > 0 || mediaItems.length > 0
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* User Info with Audience Selector - LinkedIn Style */}
            <View className="p-4 flex-row items-center">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/1.jpg",
                }}
                className="w-12 h-12 rounded-full border border-gray-200"
              />
              <View className="ml-3 flex-1">
                <Text
                  className={`font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Sarah Johnson
                </Text>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  Product Manager at TechCorp • 3rd
                </Text>
                <TouchableOpacity
                  className={`flex-row items-center mt-1 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full px-3 py-1.5 self-start`}
                  onPress={() => setAudienceModalVisible(true)}
                >
                  {selectedAudience.id === 1 ? (
                    <Ionicons name="globe-outline" size={14} color="#0a66c2" />
                  ) : selectedAudience.id === 2 ? (
                    <Ionicons name="people-outline" size={14} color="#0a66c2" />
                  ) : selectedAudience.id === 3 ? (
                    <Ionicons
                      name="people-circle-outline"
                      size={14}
                      color="#0a66c2"
                    />
                  ) : (
                    <Ionicons name="school-outline" size={14} color="#0a66c2" />
                  )}
                  <Text
                    className={`text-sm ml-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } font-medium`}
                  >
                    {selectedAudience.name}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Post Content */}
            <View className="px-4 pb-4 mt-0">
              <TextInput
                ref={textInputRef}
                placeholder="What do you want to talk about?"
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9ca3af"}
                multiline
                className={`text-base ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } leading-6`}
                value={postText}
                onChangeText={setPostText}
                style={{ minHeight: 150, textAlignVertical: "top" }}
                autoFocus={true}
              />

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <View className="flex-row flex-wrap mt-3">
                  {selectedTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      className={`${
                        isDarkMode
                          ? "bg-blue-900/30 border border-blue-800"
                          : "bg-blue-50"
                      } rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center`}
                      onPress={() => handleRemoveHashtag(tag)}
                    >
                      <Text
                        className={`${
                          isDarkMode ? "text-blue-300" : "text-blue-700"
                        } font-medium`}
                      >
                        #{tag}
                      </Text>
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color={isDarkMode ? "#60A5FA" : "#0a66c2"}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* LinkedIn-style divider */}
            <View
              className={`h-0.5 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              } my-2`}
            />

            {/* Media Attachment Options */}
            <View
              className={`px-4 py-4 ${
                isDarkMode
                  ? "border-t border-gray-700 bg-gray-800/50"
                  : "border-t border-gray-200 bg-gray-50/50"
              }`}
            >
              <Text
                className={`font-medium mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Add to your post
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => handleAttachMedia("photo")}
                  className={`items-center justify-center w-[72px] ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full ${
                      isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                    } items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="image-outline"
                      size={22}
                      color={isDarkMode ? "#60A5FA" : "#0a66c2"}
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAttachMedia("video")}
                  className={`items-center justify-center w-[72px] ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full ${
                      isDarkMode ? "bg-green-900/30" : "bg-green-50"
                    } items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="videocam-outline"
                      size={22}
                      color={isDarkMode ? "#4ADE80" : "#5f9b41"}
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAttachMedia("document")}
                  className={`items-center justify-center w-[72px] ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full ${
                      isDarkMode ? "bg-orange-900/30" : "bg-orange-50"
                    } items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color={isDarkMode ? "#FDBA74" : "#e16745"}
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Document
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAttachMedia("poll")}
                  className={`items-center justify-center w-[72px] ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full ${
                      isDarkMode ? "bg-purple-900/30" : "bg-purple-50"
                    } items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="bar-chart-outline"
                      size={22}
                      color={isDarkMode ? "#C084FC" : "#9333ea"}
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Poll
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowTagSuggestions(!showTagSuggestions)}
                  className={`items-center justify-center w-[72px] ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-full ${
                      isDarkMode ? "bg-pink-900/30" : "bg-pink-50"
                    } items-center justify-center mb-1`}
                  >
                    <Ionicons
                      name="pricetag-outline"
                      size={22}
                      color={isDarkMode ? "#F472B6" : "#ec4899"}
                    />
                  </View>
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Hashtag
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hashtag Input */}
            {showTagSuggestions && (
              <View
                className={`mx-4 mb-4 ${
                  isDarkMode
                    ? "bg-gray-800 rounded-t-xl"
                    : "bg-white rounded-t-xl shadow-sm"
                }`}
              >
                <View
                  className={`px-4 py-3 flex-row items-center border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={isDarkMode ? "#F472B6" : "#ec4899"}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    placeholder="Add a hashtag"
                    placeholderTextColor={isDarkMode ? "#6B7280" : "#9ca3af"}
                    value={postText}
                    onChangeText={setPostText}
                    className={`flex-1 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    } text-base`}
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => setShowTagSuggestions(false)}
                    className={`ml-2 p-1 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Tag Suggestions */}
                <View className="p-2">
                  <Text
                    className={`px-2 py-2 text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Trending hashtags
                  </Text>
                  <View className="flex-row flex-wrap">
                    {hashtagSuggestions.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className={`m-1 px-3 py-2 rounded-full flex-row items-center ${
                          isDarkMode
                            ? "bg-gray-700 border border-gray-600"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                        onPress={() => handleAddHashtag(item.tag)}
                      >
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } font-medium`}
                        >
                          #{item.tag}
                        </Text>
                        <Text
                          className={`ml-1 text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {item.count > 999
                            ? `${(item.count / 1000).toFixed(1)}k`
                            : item.count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </View>

      {/* Audience Selection Modal - LinkedIn Style */}
      <Modal
        visible={audienceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAudienceModalVisible(false)}
      >
        <BlurView intensity={isDarkMode ? 20 : 10} className="absolute inset-0">
          <TouchableOpacity
            className="flex-1"
            onPress={() => setAudienceModalVisible(false)}
          >
            <View className="flex-1 justify-end">
              <View
                className={`${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } rounded-t-xl p-4`}
              >
                <View
                  className={`w-12 h-4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded-full mx-auto mb-4`}
                />
                <Text
                  className={`text-xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Who can see your post?
                </Text>

                {audienceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className={`flex-row items-center p-3 rounded-lg mb-2 ${
                      selectedAudience.id === option.id
                        ? isDarkMode
                          ? "bg-blue-900/30 border border-blue-800"
                          : "bg-blue-50 border border-blue-200"
                        : isDarkMode
                        ? "bg-gray-800"
                        : "bg-white"
                    }`}
                    onPress={() => {
                      setSelectedAudience(option);
                      setAudienceModalVisible(false);
                    }}
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        selectedAudience.id === option.id
                          ? isDarkMode
                            ? "bg-blue-800/50"
                            : "bg-blue-100"
                          : isDarkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={20}
                        color={
                          selectedAudience.id === option.id
                            ? isDarkMode
                              ? "#60A5FA"
                              : "#0a66c2"
                            : isDarkMode
                            ? "#9CA3AF"
                            : "#666"
                        }
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className={`font-medium ${
                          selectedAudience.id === option.id
                            ? isDarkMode
                              ? "text-blue-300"
                              : "text-blue-700"
                            : isDarkMode
                            ? "text-gray-200"
                            : "text-gray-800"
                        }`}
                      >
                        {option.name}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </Text>
                    </View>
                    {selectedAudience.id === option.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={isDarkMode ? "#60A5FA" : "#0a66c2"}
                      />
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-300"
                  } rounded-full py-2.5 mt-3`}
                  onPress={() => setAudienceModalVisible(false)}
                >
                  <Text
                    className={`text-center font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>

      {/* Poll Creation Modal */}
      <Modal
        visible={isPollModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPollModalVisible(false)}
      >
        <BlurView intensity={isDarkMode ? 20 : 10} className="absolute inset-0">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsPollModalVisible(false)}
          >
            <View className="flex-1 justify-end">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}}
                className={`${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                } rounded-t-xl p-4`}
              >
                <View
                  className={`w-12 h-4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded-full mx-auto mb-4`}
                />
                <Text
                  className={`text-xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Create a Poll
                </Text>

                <View className="mb-4">
                  <Text
                    className={`font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Question
                  </Text>
                  <TextInput
                    value={pollQuestion}
                    onChangeText={setPollQuestion}
                    placeholder="Ask a question..."
                    placeholderTextColor={isDarkMode ? "#6B7280" : "#9ca3af"}
                    className={`border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800 text-white"
                        : "border-gray-300 bg-white text-gray-800"
                    } rounded-lg p-3`}
                    multiline
                  />
                </View>

                <View className="mb-4">
                  <Text
                    className={`font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Options
                  </Text>
                  {pollOptions.map((option, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <TextInput
                        value={option}
                        onChangeText={(text) =>
                          handleUpdatePollOption(text, index)
                        }
                        placeholder={`Option ${index + 1}`}
                        placeholderTextColor={
                          isDarkMode ? "#6B7280" : "#9ca3af"
                        }
                        className={`flex-1 border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-800 text-white"
                            : "border-gray-300 bg-white text-gray-800"
                        } rounded-lg p-3 mr-2`}
                      />
                      {pollOptions.length > 2 && (
                        <TouchableOpacity
                          onPress={() => handleRemovePollOption(index)}
                          className={`w-10 h-10 rounded-full ${
                            isDarkMode ? "bg-gray-800" : "bg-gray-100"
                          } items-center justify-center`}
                        >
                          <Ionicons
                            name="close"
                            size={20}
                            color={isDarkMode ? "#E5E7EB" : "#374151"}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  {pollOptions.length < 5 && (
                    <TouchableOpacity
                      onPress={handleAddPollOption}
                      className={`flex-row items-center p-3 ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      } rounded-lg`}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={isDarkMode ? "#60A5FA" : "#0a66c2"}
                      />
                      <Text
                        className={`ml-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Add option
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-4">
                  <Text
                    className={`font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Poll duration
                  </Text>
                  <View className="flex-row flex-wrap">
                    {["1d", "3d", "1w", "2w"].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                          pollDuration === duration
                            ? isDarkMode
                              ? "bg-blue-900/30 border border-blue-800"
                              : "bg-blue-50 border border-blue-200"
                            : isDarkMode
                            ? "bg-gray-800 border border-gray-700"
                            : "bg-white border border-gray-300"
                        }`}
                        onPress={() => setPollDuration(duration)}
                      >
                        <Text
                          className={`${
                            pollDuration === duration
                              ? isDarkMode
                                ? "text-blue-300"
                                : "text-blue-700"
                              : isDarkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {duration === "1d"
                            ? "1 day"
                            : duration === "3d"
                            ? "3 days"
                            : duration === "1w"
                            ? "1 week"
                            : "2 weeks"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="flex-row mt-4">
                  <TouchableOpacity
                    className={`flex-1 mr-2 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-300"
                    }`}
                    onPress={() => setIsPollModalVisible(false)}
                  >
                    <Text
                      className={`text-center font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 ml-2 py-3 rounded-lg ${
                      !pollQuestion.trim() ||
                      pollOptions.filter((o) => o.trim()).length < 2
                        ? isDarkMode
                          ? "bg-blue-900/30"
                          : "bg-blue-100"
                        : "bg-blue-600"
                    }`}
                    onPress={handleCreatePoll}
                    disabled={
                      !pollQuestion.trim() ||
                      pollOptions.filter((o) => o.trim()).length < 2
                    }
                  >
                    <Text
                      className={`text-center font-medium ${
                        !pollQuestion.trim() ||
                        pollOptions.filter((o) => o.trim()).length < 2
                          ? isDarkMode
                            ? "text-blue-300"
                            : "text-blue-400"
                          : "text-white"
                      }`}
                    >
                      Create Poll
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </KeyboardAvoidingView>
  );
}
