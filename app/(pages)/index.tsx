import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function PagesIndex() {
  const router = useRouter();

  // Redirect to home page if someone navigates directly to this route
  useEffect(() => {
    router.replace("/");
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Redirecting...</Text>
    </View>
  );
}
