import * as FileSystem from "expo-file-system";
import { API_BASE_URL } from "@/constants/api";

// Types
export type HashtagItem = {
  id: number;
  tag: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Auth helper
export const getAuthToken = async (): Promise<string> => {
  // Implement your token retrieval logic here
  // For example, using AsyncStorage or a secure store
  return "sample-auth-token";
};

// Default data in case API fails
export const defaultHashtags: HashtagItem[] = [
  { id: 1, tag: "AlumniNetwork" },
  { id: 2, tag: "CareerAdvice" },
  { id: 3, tag: "Networking" },
  { id: 4, tag: "ProfessionalDevelopment" },
  { id: 5, tag: "JobOpportunity" },
  { id: 6, tag: "IndustryInsights" },
  { id: 7, tag: "MentorshipMonday" },
  { id: 8, tag: "AlumniSpotlight" },
];

// API methods
export const api = {
  // Fetch trending hashtags
  fetchTrendingHashtags: async (): Promise<HashtagItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hashtags/trending`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch hashtags");
      return data.hashtags;
    } catch (error) {
      console.error("Error fetching hashtags:", error);
      return defaultHashtags;
    }
  },

  // Create a new post
  createPost: async (postData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      return { success: true, message: "Post created successfully", data };
    } catch (error: any) {
      console.error("Error creating post:", error);
      return {
        success: false,
        message: error.message || "Failed to create post",
      };
    }
  },

  // Upload media
  uploadMedia: async (
    fileUri: string,
    type: string,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    try {
      const formData = new FormData();
      const fileType = fileUri.split(".").pop();
      const fileName = `${Date.now()}.${fileType}`;

      // @ts-ignore - FormData typing issues
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type:
          type === "image"
            ? `image/${fileType}`
            : type === "video"
            ? `video/${fileType}`
            : "application/octet-stream",
      });

      const uploadUrl = `${API_BASE_URL}/media/upload`;

      const response = await FileSystem.uploadAsync(uploadUrl, fileUri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          type,
        },
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      });

      if (response.status !== 200) {
        const errorData = JSON.parse(response.body);
        throw new Error(errorData.message || "Upload failed");
      }

      const responseData = JSON.parse(response.body);
      return responseData.fileUrl;
    } catch (error: any) {
      console.error("Error uploading media:", error);
      throw new Error(error.message || "Failed to upload media");
    }
  },
}; 