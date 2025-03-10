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

const { width } = Dimensions.get("window");

// Define types for our data
type HashtagItem = {
  id: number;
  tag: string;
};

type AudienceOption = {
  id: number;
  name: string;
  icon: string;
  description: string;
};

// Sample hashtag suggestions
const hashtagSuggestions: HashtagItem[] = [
  { id: 1, tag: "AlumniNetwork" },
  { id: 2, tag: "CareerAdvice" },
  { id: 3, tag: "Networking" },
  { id: 4, tag: "ProfessionalDevelopment" },
  { id: 5, tag: "JobOpportunity" },
  { id: 6, tag: "IndustryInsights" },
  { id: 7, tag: "MentorshipMonday" },
  { id: 8, tag: "AlumniSpotlight" },
];

// Sample audience options
const audienceOptions: AudienceOption[] = [
  {
    id: 1,
    name: "Anyone",
    icon: "globe",
    description: "Anyone on or off AlumiQ",
  },
  {
    id: 2,
    name: "Connections only",
    icon: "people",
    description: "Connections on AlumiQ",
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
  const [postText, setPostText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState(audienceOptions[0]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerHeight = useRef(new Animated.Value(56)).current;
  const mediaOptionsHeight = useRef(new Animated.Value(0)).current;
  const mediaOptionsOpacity = useRef(new Animated.Value(0)).current;

  // Refs
  const textInputRef = useRef<TextInput>(null);

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
      setPostText(postText + ` #${tag}`);
    }
    setShowTagSuggestions(false);
  };

  const handleRemoveHashtag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    setPostText(postText.replace(`#${tag}`, ""));
  };

  const handlePost = () => {
    // Animation for posting
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
      // Navigate back or show success
      router.back();
    });
  };

  const handleAttachMedia = (type: string) => {
    setMediaAttached(true);
    // Here you would implement actual media attachment
  };

  // Helper to safely check animated value
  const getAnimatedValue = (animatedValue: Animated.Value): number => {
    let value = 0;
    // @ts-ignore - accessing private property for UI state check
    if (animatedValue && animatedValue._value !== undefined) {
      // @ts-ignore
      value = animatedValue._value;
    }
    return value;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 mt-8 bg-white">
        {/* Enhanced Header */}
        <Animated.View
          style={{ height: headerHeight }}
          className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="font-bold text-lg">Create Post</Text>
          <TouchableOpacity
            className={`py-2 px-5 rounded-full ${
              postText.trim().length > 0 ? "bg-blue-600" : "bg-gray-300"
            }`}
            disabled={postText.trim().length === 0}
            onPress={handlePost}
            style={{
              shadowColor:
                postText.trim().length > 0 ? "#0077B5" : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: postText.trim().length > 0 ? 3 : 0,
            }}
          >
            <Text
              className={`font-semibold ${
                postText.trim().length > 0 ? "text-white" : "text-gray-500"
              }`}
            >
              Post
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
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
            {/* User Info with Audience Selector */}
            <View className="p-4 flex-row items-center">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/1.jpg",
                }}
                className="w-12 h-12 rounded-full border border-gray-200"
              />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-800">Sarah Johnson</Text>
                <TouchableOpacity
                  className="flex-row items-center mt-1 bg-gray-100 rounded-full px-3 py-1.5 self-start"
                  onPress={() => setAudienceModalVisible(true)}
                >
                  {selectedAudience.id === 1 ? (
                    <Ionicons name="globe-outline" size={14} color="#0077B5" />
                  ) : selectedAudience.id === 2 ? (
                    <Ionicons name="people-outline" size={14} color="#0077B5" />
                  ) : selectedAudience.id === 3 ? (
                    <Ionicons
                      name="people-circle-outline"
                      size={14}
                      color="#0077B5"
                    />
                  ) : (
                    <Ionicons name="school-outline" size={14} color="#0077B5" />
                  )}
                  <Text className="text-sm ml-1 text-gray-700 font-medium">
                    {selectedAudience.name}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#666"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Content */}
            <View className="px-4 pb-4">
              <TextInput
                ref={textInputRef}
                placeholder="What do you want to share with your alumni network?"
                placeholderTextColor="#9ca3af"
                multiline
                className="text-base text-gray-800 leading-6"
                value={postText}
                onChangeText={setPostText}
                style={{ minHeight: 150 }}
              />

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <View className="flex-row flex-wrap mt-3">
                  {selectedTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                      onPress={() => handleRemoveHashtag(tag)}
                    >
                      <Text className="text-blue-600 font-medium">#{tag}</Text>
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color="#0077B5"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Media Preview (if attached) */}
            {mediaAttached && (
              <View className="mx-4 mb-4 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  source={{
                    uri: "https://source.unsplash.com/random/800x600?networking",
                  }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 items-center justify-center"
                  onPress={() => setMediaAttached(false)}
                >
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* Add Hashtag */}
            <TouchableOpacity
              className="px-4 py-3 flex-row items-center"
              onPress={() => setShowTagSuggestions(!showTagSuggestions)}
            >
              <View className="bg-blue-50 w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="pricetag-outline" size={18} color="#0077B5" />
              </View>
              <Text className="ml-2 text-blue-600 font-medium">
                Add hashtag
              </Text>
            </TouchableOpacity>

            {/* Hashtag Suggestions */}
            {showTagSuggestions && (
              <View className="mx-4 mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <Text className="font-medium text-gray-700 mb-2">
                  Suggested hashtags
                </Text>
                <View className="flex-row flex-wrap">
                  {hashtagSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-full px-3 py-1.5 mr-2 mb-2"
                      onPress={() => handleAddHashtag(item.tag)}
                    >
                      <Text className="text-gray-700">#{item.tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Divider */}
            <View className="h-[1px] bg-gray-200 my-2" />

            {/* Enhanced Media Options */}
            <Animated.View
              style={{
                height: mediaOptionsHeight,
                opacity: mediaOptionsOpacity,
              }}
              className="px-4 overflow-hidden"
            >
              <Text className="font-medium text-gray-800 mb-3">
                Add to your post
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="items-center justify-center w-16 h-16 bg-blue-50 rounded-lg"
                  onPress={() => handleAttachMedia("photo")}
                >
                  <Ionicons name="image-outline" size={22} color="#0077B5" />
                  <Text className="text-xs mt-1 text-gray-700">Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center justify-center w-16 h-16 bg-green-50 rounded-lg"
                  onPress={() => handleAttachMedia("video")}
                >
                  <Ionicons name="videocam-outline" size={22} color="#7FC15E" />
                  <Text className="text-xs mt-1 text-gray-700">Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center justify-center w-16 h-16 bg-yellow-50 rounded-lg"
                  onPress={() => handleAttachMedia("document")}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#E7A33E"
                  />
                  <Text className="text-xs mt-1 text-gray-700">Document</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center justify-center w-16 h-16 bg-purple-50 rounded-lg"
                  onPress={() => handleAttachMedia("poll")}
                >
                  <Ionicons
                    name="stats-chart-outline"
                    size={22}
                    color="#A872E8"
                  />
                  <Text className="text-xs mt-1 text-gray-700">Poll</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        {/* Quick Access Media Bar (always visible) */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                animateMediaOptions(!getAnimatedValue(mediaOptionsOpacity));
                if (keyboardVisible) {
                  Keyboard.dismiss();
                }
              }}
            >
              <Text className="font-medium text-gray-700 mr-2">
                Add to post
              </Text>
              <Ionicons
                name={
                  getAnimatedValue(mediaOptionsOpacity)
                    ? "chevron-down"
                    : "chevron-up"
                }
                size={18}
                color="#666"
              />
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity
                className="items-center justify-center w-10 h-10 rounded-full bg-blue-50 mr-2"
                onPress={() => handleAttachMedia("photo")}
              >
                <Ionicons name="image-outline" size={20} color="#0077B5" />
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center justify-center w-10 h-10 rounded-full bg-green-50 mr-2"
                onPress={() => handleAttachMedia("video")}
              >
                <Ionicons name="videocam-outline" size={20} color="#7FC15E" />
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center justify-center w-10 h-10 rounded-full bg-yellow-50"
                onPress={() => handleAttachMedia("document")}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#E7A33E"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Audience Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={audienceModalVisible}
        onRequestClose={() => setAudienceModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <BlurView intensity={20} className="absolute inset-0" />
          <View className="bg-white rounded-t-xl">
            <View className="px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="font-bold text-lg">Who can see your post?</Text>
              <TouchableOpacity onPress={() => setAudienceModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={audienceOptions}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center p-3 rounded-lg mb-2 ${
                    selectedAudience.id === item.id
                      ? "bg-blue-50 border border-blue-200"
                      : "border border-gray-200"
                  }`}
                  onPress={() => {
                    setSelectedAudience(item);
                    setAudienceModalVisible(false);
                  }}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      selectedAudience.id === item.id
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {item.id === 1 ? (
                      <Ionicons
                        name="globe-outline"
                        size={20}
                        color={
                          selectedAudience.id === item.id ? "#0077B5" : "#666"
                        }
                      />
                    ) : item.id === 2 ? (
                      <Ionicons
                        name="people-outline"
                        size={20}
                        color={
                          selectedAudience.id === item.id ? "#0077B5" : "#666"
                        }
                      />
                    ) : item.id === 3 ? (
                      <Ionicons
                        name="people-circle-outline"
                        size={20}
                        color={
                          selectedAudience.id === item.id ? "#0077B5" : "#666"
                        }
                      />
                    ) : (
                      <Ionicons
                        name="school-outline"
                        size={20}
                        color={
                          selectedAudience.id === item.id ? "#0077B5" : "#666"
                        }
                      />
                    )}
                  </View>
                  <View className="ml-3 flex-1">
                    <Text
                      className={`font-medium ${
                        selectedAudience.id === item.id
                          ? "text-blue-600"
                          : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {item.description}
                    </Text>
                  </View>
                  {selectedAudience.id === item.id && (
                    <Ionicons name="checkmark" size={20} color="#0077B5" />
                  )}
                </TouchableOpacity>
              )}
            />
            <View className="p-4">
              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-lg items-center"
                onPress={() => setAudienceModalVisible(false)}
              >
                <Text className="text-white font-bold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
