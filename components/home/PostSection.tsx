import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/contexts/ThemeContext";

const PostSection = ({
  posts: initialPosts = [],
  refreshing = false,
}: {
  posts: any[];
  refreshing?: boolean;
}) => {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Get the theme from context
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Apply the theme values
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Update posts when initialPosts changes (e.g., after a refresh)
    setPosts(initialPosts);
  }, [initialPosts]);

  // Navigate to post detail screen
  const navigateToPostDetail = (post: any) => {
    // Serialize the post object to pass as a parameter
    router.push({
      pathname: "/(pages)/post-details",
      params: { id: post.id, post: JSON.stringify(post) },
    });
  };

  // Toggle like on a post with animation
  const handleLike = (postId: number) => {
    // Start loading animation
    setLoadingStates((current) => ({ ...current, [postId]: true }));

    // Simulate API call with a short delay
    setTimeout(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            // Toggle liked status
            const liked = post.isLiked || false;
            return {
              ...post,
              isLiked: !liked,
              likes: liked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        })
      );

      // End loading animation
      setLoadingStates((current) => ({ ...current, [postId]: false }));
    }, 300);
  };

  // Toggle comments visibility
  const toggleComments = (postId: number) => {
    setShowComments((current) => ({
      ...current,
      [postId]: !current[postId],
    }));
  };

  // Add a new comment
  const addComment = (postId: number) => {
    if (!commentText[postId] || commentText[postId].trim() === "") return;

    // Simulate API call
    setLoadingStates((current) => ({
      ...current,
      [`comment_${postId}`]: true,
    }));

    setTimeout(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            const newComment = {
              id: Date.now(),
              user: "You",
              text: commentText[postId],
              timestamp: "Just now",
            };

            return {
              ...post,
              comments: post.comments + 1,
              commentsList: [...(post.commentsList || []), newComment],
            };
          }
          return post;
        })
      );

      // Clear the comment input
      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));

      setLoadingStates((current) => ({
        ...current,
        [`comment_${postId}`]: false,
      }));
    }, 500);
  };

  // Format the number of likes for display
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count;
  };

  // Handle share functionality
  const handleShare = (post: any) => {
    Alert.alert(
      "Share Post",
      "Choose where to share this post",
      [
        { text: "Copy Link", onPress: () => console.log("Copy Link") },
        { text: "Share to Feed", onPress: () => console.log("Share to Feed") },
        { text: "Message", onPress: () => console.log("Message") },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const renderPost = (post: any) => {
    return (
      <MotiView
        key={post.id}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350 }}
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} mt-2 p-4 shadow-sm rounded-lg`}
      >
        {/* Post header */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => console.log("View profile")}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: post.userImage }}
              className={`w-12 h-12 rounded-full border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            />
            <View className="ml-3">
              <Text className={`font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{post.userName}</Text>
              <Text className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{post.userTitle}</Text>
              <Text className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{post.timeAgo}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color={isDarkMode ? "#A0A0A0" : "#666"} />
          </TouchableOpacity>
        </View>

        {/* Post content - make it touchable to navigate to detail screen */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigateToPostDetail(post)}
          className="mt-3"
        >
          <Text className={`${isDarkMode ? "text-gray-200" : "text-gray-800"} leading-6`}>{post.content}</Text>
          {post.image && (
            <Image
              source={{ uri: post.image }}
              className="w-full h-56 rounded-lg mt-3"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>

        {/* Post stats */}
        {(post.likes > 0 || post.comments > 0) && (
          <View className="flex-row justify-between mt-3">
            {post.likes > 0 && (
              <View className="flex-row items-center">
                <View className="bg-blue-500 w-5 h-5 rounded-full items-center justify-center">
                  <Ionicons name="heart" size={12} color="white" />
                </View>
                <Text className={`ml-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {formatCount(post.likes)}
                </Text>
              </View>
            )}
            {post.comments > 0 && (
              <Text className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {formatCount(post.comments)} comments
              </Text>
            )}
          </View>
        )}

        {/* Post actions */}
        <View className={`flex-row justify-between mt-3 pt-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
          <TouchableOpacity
            className="flex-row items-center flex-1 justify-center"
            activeOpacity={0.7}
            onPress={() => handleLike(post.id)}
            disabled={loadingStates[post.id]}
          >
            {loadingStates[post.id] ? (
              <ActivityIndicator size="small" color={themeColors.primary} />
            ) : (
              <>
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={post.isLiked ? themeColors.primary : isDarkMode ? "#A0A0A0" : "#666"}
                />
                <Text
                  className={`ml-2 ${post.isLiked ? "text-blue-600" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Like
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center flex-1 justify-center"
            activeOpacity={0.7}
            onPress={() => navigateToPostDetail(post)}
          >
            <Ionicons name="chatbubble-outline" size={20} color={isDarkMode ? "#A0A0A0" : "#666"} />
            <Text className={`ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center flex-1 justify-center"
            activeOpacity={0.7}
            onPress={() => handleShare(post)}
          >
            <Ionicons name="share-outline" size={20} color={isDarkMode ? "#A0A0A0" : "#666"} />
            <Text className={`ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Comment Option */}
        <TouchableOpacity
          className={`mt-3 flex-row items-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-full px-4 py-2`}
          onPress={() => navigateToPostDetail(post)}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/women/1.jpg",
            }}
            className="w-8 h-8 rounded-full"
          />
          <Text className={`ml-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Write a comment...</Text>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      className="flex-1"
    >
      <View>
        {posts.length === 0 && !refreshing ? (
          <View className="py-8 items-center justify-center">
            <MaterialCommunityIcons
              name="post-outline"
              size={48}
              color={isDarkMode ? "#4B5563" : "#ccc"}
            />
            <Text className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No posts to display</Text>
          </View>
        ) : (
          posts.map((post: any) => renderPost(post))
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostSection;
