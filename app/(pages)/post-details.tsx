import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Share,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme, lightTheme, darkTheme } from "@/contexts/ThemeContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  SlideInRight,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Define types for our data
interface Comment {
  id: number;
  user: string;
  userImage: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: number;
  userName: string;
  userTitle: string;
  userImage: string;
  timeAgo: string;
  content: string;
  image: string | null;
  likes: number;
  likedBy: string[];
  isLiked: boolean;
  comments: number;
  commentsList: Comment[];
}

const PostDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const commentInputScale = useSharedValue(1);
  const likeScale = useSharedValue(1);

  // In a real app, you would fetch post details by ID from an API
  // For now, we'll assume the post was passed via params or mock it
  const post: Post =
    params.post && typeof params.post === "string"
      ? JSON.parse(params.post)
      : {
          id: 1,
          userName: "Emily Rodriguez",
          userTitle: "Marketing Director at GlobalBrands",
          userImage: "https://randomuser.me/api/portraits/women/10.jpg",
          timeAgo: "2h ago",
          content:
            "Excited to announce our latest marketing campaign that increased user engagement by 45%! Check out the case study on our website. #Marketing #DigitalStrategy",
          image: null,
          likes: 36,
          likedBy: ["John Doe", "Sarah Wong", "34 others"],
          isLiked: false,
          comments: 5,
          commentsList: [
            {
              id: 101,
              user: "John Doe",
              userImage: "https://randomuser.me/api/portraits/men/5.jpg",
              text: "Impressive results! Would love to hear more about your approach.",
              timestamp: "1h ago",
              likes: 3,
              isLiked: false,
            },
            {
              id: 102,
              user: "Sarah Clark",
              userImage: "https://randomuser.me/api/portraits/women/7.jpg",
              text: "Congratulations on the success! Our team is looking for similar strategies.",
              timestamp: "2h ago",
              likes: 5,
              isLiked: false,
            },
          ],
        };

  const [currentPost, setCurrentPost] = useState<Post>(post);

  // Animation styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(
          headerOpacity.value,
          [0, 1],
          [-20, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const commentInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: commentInputScale.value }],
  }));

  // Start animations when component mounts
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withTiming(1, { duration: 700 });
  }, []);

  // Simulate loading for future API integration
  const fetchPostDetails = async (postId: number) => {
    setIsLoading(true);
    // In a real app, you would fetch post details from an API
    // await api.getPostDetails(postId)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    setIsSendingComment(true);
    commentInputScale.value = withSpring(0.95, { damping: 10 }, () => {
      commentInputScale.value = withSpring(1);
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment: Comment = {
      id: Date.now(),
      user: "You",
      userImage: "https://randomuser.me/api/portraits/women/1.jpg",
      text: comment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };

    setCurrentPost((prev: Post) => ({
      ...prev,
      comments: prev.comments + 1,
      commentsList: [newComment, ...(prev.commentsList || [])],
    }));

    setComment("");
    setIsSendingComment(false);

    // In a real app, you would make an API call here
    // await api.addComment(post.id, comment)
  };

  const handleLikeComment = (commentId: number) => {
    setCurrentPost((prev: Post) => ({
      ...prev,
      commentsList: prev.commentsList.map((item: Comment) => {
        if (item.id === commentId) {
          return {
            ...item,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            isLiked: !item.isLiked,
          };
        }
        return item;
      }),
    }));

    // In a real app: api.likeComment(post.id, commentId)
  };

  const handleLikePost = () => {
    likeScale.value = withSpring(1.3, { damping: 10 }, () => {
      likeScale.value = withSpring(1);
    });

    setCurrentPost((prev: Post) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));

    // In a real app: api.likePost(post.id)
  };

  const handleSharePost = async () => {
    try {
      await Share.share({
        message: `Check out this post from ${currentPost.userName}: ${currentPost.content}`,
        title: "Share Post",
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const renderComment = ({ item, index }: { item: Comment; index: number }) => {
    const isFirst = index === 0;

    return (
      <Animated.View
        entering={
          isFirst
            ? SlideInRight.delay(300).springify()
            : FadeIn.delay(100 * index).duration(400)
        }
        className="py-3 border-b"
        style={{ borderColor: theme.divider }}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.userImage }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <View
              className="p-3 rounded-lg"
              style={{
                backgroundColor: theme.inputBackground,
                ...theme.elevation,
              }}
            >
              <Text className="font-semibold" style={{ color: theme.text }}>
                {item.user}
              </Text>
              <Text className="mt-1" style={{ color: theme.textSecondary }}>
                {item.text}
              </Text>
            </View>
            <View className="flex-row mt-2 items-center">
              <Text
                className="text-xs mr-4"
                style={{ color: theme.textSecondary }}
              >
                {item.timestamp}
              </Text>
              <TouchableOpacity
                className="flex-row items-center mr-4"
                onPress={() => handleLikeComment(item.id)}
              >
                <Ionicons
                  name={item.isLiked ? "heart" : "heart-outline"}
                  size={14}
                  color={item.isLiked ? theme.primary : theme.textSecondary}
                  style={{ marginRight: 3 }}
                />
                <Text
                  className="text-xs mr-1"
                  style={{
                    color: item.isLiked ? theme.primary : theme.textSecondary,
                  }}
                >
                  Like
                </Text>
                {item.likes > 0 && (
                  <Text
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    · {item.likes}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={theme.textSecondary}
                  style={{ marginRight: 3 }}
                />
                <Text
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: theme.background,
        paddingTop: insets.top,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Enhanced Header */}
        <Animated.View
          style={[
            headerAnimatedStyle,
            {
              borderBottomWidth: 1,
              borderColor: theme.divider,
              ...theme.elevation,
            },
          ]}
        >
          <LinearGradient
            colors={
              isDarkMode
                ? [theme.cardBackground, theme.background]
                : [theme.surfaceBackground, theme.background]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="py-3 px-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="p-2 rounded-full mr-2"
                  style={{ backgroundColor: theme.iconBackground }}
                >
                  <Ionicons name="arrow-back" size={22} color={theme.primary} />
                </TouchableOpacity>
                <Text
                  className="font-semibold text-lg"
                  style={{ color: theme.text }}
                >
                  Post
                </Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  className="p-2 rounded-full mr-2"
                  style={{ backgroundColor: theme.iconBackground }}
                >
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 rounded-full"
                  style={{ backgroundColor: theme.iconBackground }}
                  onPress={handleSharePost}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={theme.primary} />
            <Text className="mt-4" style={{ color: theme.textSecondary }}>
              Loading post...
            </Text>
          </View>
        ) : (
          <Animated.View style={contentAnimatedStyle} className="flex-1">
            <FlatList
              data={currentPost.commentsList}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListHeaderComponent={() => (
                <View className="px-4">
                  {/* Post Content */}
                  <View
                    className="pt-4 pb-3 mb-2"
                    style={{
                      borderBottomWidth: 1,
                      borderColor: theme.divider,
                    }}
                  >
                    <View className="flex-row items-center">
                      <TouchableOpacity>
                        <Image
                          source={{ uri: currentPost.userImage }}
                          className="w-12 h-12 rounded-full"
                          style={{
                            borderWidth: 2,
                            borderColor: theme.primary,
                          }}
                        />
                      </TouchableOpacity>
                      <View className="ml-3 flex-1">
                        <TouchableOpacity>
                          <Text
                            className="font-bold text-base"
                            style={{ color: theme.text }}
                          >
                            {currentPost.userName}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {currentPost.userTitle}
                        </Text>
                        <View className="flex-row items-center">
                          <Text
                            className="text-xs"
                            style={{ color: theme.textSecondary, opacity: 0.7 }}
                          >
                            {currentPost.timeAgo}
                          </Text>
                          <Text
                            style={{
                              color: theme.textSecondary,
                              marginHorizontal: 4,
                            }}
                          >
                            •
                          </Text>
                          <Ionicons
                            name="globe-outline"
                            size={12}
                            color={theme.textSecondary}
                          />
                        </View>
                      </View>
                      <TouchableOpacity className="p-2">
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={20}
                          color={theme.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="mt-3 mb-2">
                      <Text
                        className="text-base leading-6"
                        style={{ color: theme.text }}
                      >
                        {currentPost.content}
                      </Text>
                    </View>

                    {currentPost.image && (
                      <View
                        className="rounded-lg overflow-hidden mt-2 mb-3"
                        style={theme.elevation}
                      >
                        <Image
                          source={{ uri: currentPost.image }}
                          className="w-full h-56"
                          resizeMode="cover"
                        />
                      </View>
                    )}

                    {/* Post Stats */}
                    <View className="flex-row justify-between items-center mt-3 pt-2">
                      {currentPost.likes > 0 && (
                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => {
                            // In a real app, navigate to likes list
                          }}
                        >
                          <View
                            className="rounded-full w-5 h-5 items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Ionicons name="heart" size={12} color="white" />
                          </View>
                          <Text
                            className="text-xs ml-1"
                            style={{ color: theme.textSecondary }}
                          >
                            {currentPost.likes}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {currentPost.comments > 0 && (
                        <TouchableOpacity className="flex-row items-center">
                          <Text
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {currentPost.comments} comments
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Post Actions */}
                  <View
                    className="flex-row justify-between py-2 mb-4"
                    style={{
                      borderBottomWidth: 1,
                      borderColor: theme.divider,
                      borderRadius: 12,
                      backgroundColor: theme.surfaceBackground,
                      ...theme.elevation,
                    }}
                  >
                    <AnimatedTouchable
                      className="flex-row items-center flex-1 justify-center py-2"
                      onPress={handleLikePost}
                      style={likeAnimatedStyle}
                    >
                      <Ionicons
                        name={currentPost.isLiked ? "heart" : "heart-outline"}
                        size={22}
                        color={
                          currentPost.isLiked
                            ? theme.primary
                            : theme.textSecondary
                        }
                      />
                      <Text
                        className="ml-2 font-medium"
                        style={{
                          color: currentPost.isLiked
                            ? theme.primary
                            : theme.textSecondary,
                        }}
                      >
                        Like
                      </Text>
                    </AnimatedTouchable>

                    <TouchableOpacity className="flex-row items-center flex-1 justify-center py-2">
                      <Ionicons
                        name="chatbubble-outline"
                        size={22}
                        color={theme.textSecondary}
                      />
                      <Text
                        className="ml-2 font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        Comment
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center flex-1 justify-center py-2"
                      onPress={handleSharePost}
                    >
                      <Ionicons
                        name="share-outline"
                        size={22}
                        color={theme.textSecondary}
                      />
                      <Text
                        className="ml-2 font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Comments Header */}
                  <View className="pt-1 pb-2 flex-row justify-between items-center">
                    <Text
                      className="font-semibold text-base"
                      style={{ color: theme.text }}
                    >
                      Comments ({currentPost.comments})
                    </Text>
                    <TouchableOpacity className="flex-row items-center">
                      <Text
                        className="mr-1 text-sm"
                        style={{ color: theme.primary }}
                      >
                        Most Relevant
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </Animated.View>
        )}

        {/* Enhanced Comment Input */}
        <Animated.View
          style={[
            commentInputAnimatedStyle,
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.surfaceBackground,
              borderTopWidth: 1,
              borderColor: theme.divider,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
              ...theme.elevation,
            },
          ]}
        >
          <View className="px-4 pt-3 pb-2">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/1.jpg",
                }}
                className="w-10 h-10 rounded-full"
              />
              <View
                className="flex-1 flex-row ml-3 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: theme.inputBackground,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <TextInput
                  className="flex-1"
                  placeholder="Write a comment..."
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  placeholderTextColor={theme.textSecondary}
                  style={{ color: theme.text }}
                />
                <View className="flex-row items-center">
                  <TouchableOpacity className="mr-2">
                    <Ionicons
                      name="image-outline"
                      size={22}
                      color={theme.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="mr-2">
                    <Ionicons
                      name="happy-outline"
                      size={22}
                      color={theme.primary}
                    />
                  </TouchableOpacity>
                  {comment.trim() !== "" && (
                    <TouchableOpacity
                      onPress={handleCommentSubmit}
                      disabled={isSendingComment}
                    >
                      {isSendingComment ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                      ) : (
                        <Ionicons name="send" size={22} color={theme.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
