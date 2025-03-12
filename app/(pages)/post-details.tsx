import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";

const PostDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [comment, setComment] = useState("");

  // In a real app, you would fetch post details by ID from an API
  // For now, we'll assume the post was passed via params or mock it
  const post = params.post
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

  const [currentPost, setCurrentPost] = useState(post);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "You",
      userImage: "https://randomuser.me/api/portraits/women/1.jpg",
      text: comment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };

    setCurrentPost((prev) => ({
      ...prev,
      comments: prev.comments + 1,
      commentsList: [newComment, ...(prev.commentsList || [])],
    }));

    setComment("");

    // In a real app, you would make an API call here
    // api.addComment(post.id, comment).then(...).catch(...)
  };

  const handleLikeComment = (commentId) => {
    setCurrentPost((prev) => ({
      ...prev,
      commentsList: prev.commentsList.map((item) => {
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
    setCurrentPost((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));

    // In a real app: api.likePost(post.id)
  };

  const renderComment = ({ item }) => (
    <View className="py-3 border-b border-gray-100">
      <View className="flex-row">
        <Image
          source={{ uri: item.userImage }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <View className="bg-gray-50 p-3 rounded-lg">
            <Text className="font-semibold text-gray-800">{item.user}</Text>
            <Text className="text-gray-700 mt-1">{item.text}</Text>
          </View>
          <View className="flex-row mt-2 items-center">
            <Text className="text-xs text-gray-500 mr-4">{item.timestamp}</Text>
            <TouchableOpacity
              className="flex-row items-center mr-4"
              onPress={() => handleLikeComment(item.id)}
            >
              <Text className="text-xs text-gray-500 mr-1">Like</Text>
              {item.likes > 0 && (
                <Text className="text-xs text-gray-500">· {item.likes}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-xs text-gray-500">Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white mt-8 pt-2">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center border-b border-gray-200 py-2 px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0077B5" />
          </TouchableOpacity>
          <Text className="font-semibold text-lg ml-4">Post</Text>
        </View>

        <FlatList
          data={currentPost.commentsList}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <View className="px-4">
              {/* Post Content */}
              <View className="pt-4 pb-3 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: currentPost.userImage }}
                    className="w-12 h-12 rounded-full border border-gray-200"
                  />
                  <View className="ml-3">
                    <Text className="font-bold text-gray-800">
                      {currentPost.userName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {currentPost.userTitle}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {currentPost.timeAgo}
                    </Text>
                  </View>
                </View>

                <Text className="mt-3 text-gray-800 leading-6">
                  {currentPost.content}
                </Text>

                {currentPost.image && (
                  <Image
                    source={{ uri: currentPost.image }}
                    className="w-full h-56 rounded-lg mt-3"
                    resizeMode="cover"
                  />
                )}

                {/* Post Stats */}
                <View className="flex-row justify-between items-center mt-3 pt-2">
                  {currentPost.likes > 0 && (
                    <View className="flex-row items-center">
                      <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                        <Ionicons name="thumbs-up" size={12} color="white" />
                      </View>
                      <Text className="text-xs text-gray-500 ml-1">
                        {currentPost.likes}
                      </Text>
                    </View>
                  )}
                  {currentPost.comments > 0 && (
                    <Text className="text-xs text-gray-500">
                      {currentPost.comments} comments
                    </Text>
                  )}
                </View>
              </View>

              {/* Post Actions */}
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <TouchableOpacity
                  className="flex-row items-center flex-1 justify-center py-2"
                  onPress={handleLikePost}
                >
                  <Ionicons
                    name={currentPost.isLiked ? "heart" : "heart-outline"}
                    size={22}
                    color={currentPost.isLiked ? "#0077B5" : "#666"}
                  />
                  <Text
                    className={`ml-2 ${
                      currentPost.isLiked ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    Like
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center flex-1 justify-center py-2">
                  <Ionicons name="chatbubble-outline" size={22} color="#666" />
                  <Text className="ml-2 text-gray-600">Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center flex-1 justify-center py-2">
                  <Ionicons name="share-outline" size={22} color="#666" />
                  <Text className="ml-2 text-gray-600">Share</Text>
                </TouchableOpacity>
              </View>

              {/* Comments Header */}
              <View className="pt-3 pb-2">
                <Text className="font-semibold text-gray-800">Comments</Text>
              </View>
            </View>
          )}
          ListFooterComponent={<View className="h-20" />}
        />

        {/* Comment Input */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-1 flex-row ml-3 bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                className="flex-1"
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              {comment.trim() !== "" && (
                <TouchableOpacity onPress={handleCommentSubmit}>
                  <Ionicons name="send" size={24} color="#0077B5" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
