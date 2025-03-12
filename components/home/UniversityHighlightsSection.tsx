import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UniversityHighlights } from "../../helpers/homeData";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { darkTheme, lightTheme } from "../../contexts/ThemeContext";

const UniversityHighlightsSection = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Determine theme colors based on current theme
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <View
      className={`pt-2 mb-3 overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <LinearGradient
            colors={colors.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-8 h-8 rounded-lg items-center justify-center mr-2"
          >
            <Ionicons name="school" size={18} color="white" />
          </LinearGradient>
          <Text
            className={`font-bold text-lg ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            University Highlights
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(pages)/all-university-highlights")}
          className="flex-row items-center"
        >
          <Text className="text-blue-600 font-medium mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        className="pb-1"
      >
        {UniversityHighlights.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="mr-4"
            activeOpacity={0.9}
            style={{ width: 280 }}
          >
            <View
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-xl overflow-hidden shadow-sm ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="relative">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-40 rounded-t-xl"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                  }}
                />
                {item.featured && (
                  <View className="absolute top-3 right-3 bg-blue-500 px-2 py-1 rounded-md">
                    <Text className="text-white text-xs font-bold">
                      Featured
                    </Text>
                  </View>
                )}
                <View
                  className={`absolute top-3 left-3 ${
                    theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
                  } px-2 py-1 rounded-md`}
                >
                  <Text className="text-blue-600 text-xs font-medium">
                    {item.category}
                  </Text>
                </View>
              </View>

              <View className="p-3">
                <Text
                  className={`font-bold text-base ${
                    theme === "dark" ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <View
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                      } p-1 rounded-md`}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                    <Text
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } text-xs ml-1 font-medium`}
                    >
                      {item.date}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                      } p-1 rounded-md`}
                    >
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                    <Text
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } text-xs ml-1 font-medium`}
                    >
                      {item.location}
                    </Text>
                  </View>
                </View>

                <View
                  className={`mt-3 pt-3 border-t ${
                    theme === "dark" ? "border-gray-700" : "border-gray-100"
                  } flex-row items-center justify-between`}
                >
                  <View className="flex-row items-center">
                    <View className="flex-row items-center -space-x-2">
                      {[1, 2, 3].map((avatar) => (
                        <Image
                          key={avatar}
                          source={{
                            uri: `https://randomuser.me/api/portraits/${
                              avatar % 2 === 0 ? "men" : "women"
                            }/${avatar + 10}.jpg`,
                          }}
                          className="w-6 h-6 rounded-full border border-white"
                        />
                      ))}
                    </View>
                    <Text
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } text-xs ml-1`}
                    >
                      +{item.attendees} attending
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-blue-500 px-3 py-1.5 rounded-md"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-xs font-medium">RSVP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UniversityHighlightsSection;
