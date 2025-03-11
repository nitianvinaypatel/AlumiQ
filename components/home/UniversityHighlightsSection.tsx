import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UniversityHighlights } from "../../helpers/homeData";

const UniversityHighlightsSection = () => {
  return (
    <View className="mt-2 mb-3 overflow-hidden">
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <LinearGradient
            colors={["#0077B5", "#4f46e5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-8 h-8 rounded-lg items-center justify-center mr-2"
          >
            <Ionicons name="school" size={18} color="white" />
          </LinearGradient>
          <Text className="font-bold text-lg text-gray-800">
            University Highlights
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-blue-600 font-medium mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#0077B5" />
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
            <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
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
                <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md">
                  <Text className="text-blue-600 text-xs font-medium">
                    {item.category}
                  </Text>
                </View>
              </View>

              <View className="p-3">
                <Text className="font-bold text-base text-gray-800">
                  {item.title}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <View className="bg-blue-50 p-1 rounded-md">
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#0077B5"
                      />
                    </View>
                    <Text className="text-gray-600 text-xs ml-1 font-medium">
                      {item.date}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-blue-50 p-1 rounded-md">
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#0077B5"
                      />
                    </View>
                    <Text className="text-gray-600 text-xs ml-1 font-medium">
                      {item.location}
                    </Text>
                  </View>
                </View>

                <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
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
                    <Text className="text-gray-600 text-xs ml-1">
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
