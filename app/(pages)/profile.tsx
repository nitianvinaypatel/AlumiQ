import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Header from "@/components/home/Header";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

// Sample profile data
const profileData = {
  name: "Sarah Johnson",
  title: "Senior Software Engineer",
  company: "TechVision Inc.",
  location: "San Francisco Bay Area",
  connections: 842,
  profileViews: 142,
  searchAppearances: 28,
  postImpressions: 86,
  about:
    "Experienced software engineer with a passion for building scalable applications and solving complex problems. Skilled in React Native, JavaScript, TypeScript, and cloud technologies. Focused on creating intuitive user experiences and optimizing application performance.",
  skills: [
    "React Native",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "AWS",
    "UI/UX Design",
    "Mobile Development",
  ],
  experience: [
    {
      id: 1,
      role: "Senior Software Engineer",
      company: "TechVision Inc.",
      logo: "https://logo.clearbit.com/google.com",
      duration: "Jan 2020 - Present • 3 yrs 8 mos",
      location: "San Francisco, CA",
      description:
        "Led development of key features for the company's flagship mobile application. Architected and implemented scalable solutions that improved user engagement by 35%.",
      skills: ["React Native", "TypeScript", "GraphQL"],
    },
    {
      id: 2,
      role: "Software Engineer",
      company: "InnovateCorp",
      logo: "https://logo.clearbit.com/microsoft.com",
      duration: "Mar 2018 - Dec 2019 • 1 yr 10 mos",
      location: "Seattle, WA",
      description:
        "Developed and maintained web applications using React and Node.js. Collaborated with design team to implement responsive UI components.",
      skills: ["React", "JavaScript", "Node.js"],
    },
  ],
  education: [
    {
      id: 1,
      school: "University of Technology",
      degree: "Bachelor of Science - Computer Science",
      logo: "https://logo.clearbit.com/stanford.edu",
      years: "2014 - 2018",
      activities: "Coding Club, Hackathon Team, AI Research Group",
      gpa: "3.8/4.0",
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Issued Jan 2022 • Expires Jan 2025",
    },
    {
      id: 2,
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "Issued Mar 2021 • No Expiration",
    },
  ],
};

export default function ProfileScreen() {
  // State
  const [activeTab, setActiveTab] = useState("profile");
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(
    new Animated.Value(Platform.OS === "ios" ? 88 : 64)
  ).current;
  const profileImageScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Derived animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const coverHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 100],
    extrapolate: "clamp",
  });

  const profileImageTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  const profileImageSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [110, 80],
    extrapolate: "clamp",
  });

  const nameOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  // Handlers
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${profileData.name}'s profile on AlumiQ!`,
        url: "https://alumiq.com/profile/sarahjohnson",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSectionExpand = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSkillBadge = (skill: string, index: number) => (
    <View key={index} className="bg-blue-50 rounded-full px-3 py-1.5 mr-2 mb-2">
      <Text className="text-blue-700 text-xs font-medium">{skill}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      {/* Animated Header */}
      {/* <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          backgroundColor: "#0077B5",
          opacity: headerOpacity,
          zIndex: 10,
        }}
      >
        <View
          className="flex-row items-center justify-between px-4"
          style={{ marginTop: Platform.OS === "ios" ? 40 : 10 }}
        >
          <View className="flex-row items-center">
            <Animated.Text
              style={{ opacity: nameOpacity }}
              className="text-white font-bold text-lg ml-2"
            >
              {profileData.name}
            </Animated.Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View> */}
      <Header scrollY={scrollY} />

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View className="bg-white">
          {/* Cover Photo with Gradient */}
          <Animated.View style={{ height: coverHeight }}>
            <LinearGradient
              colors={["#0077B5", "#00A0DC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-full h-full"
            >
              <TouchableOpacity className="absolute right-4 top-10 bg-white/20 rounded-full p-2 backdrop-blur-md">
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Profile Picture */}
          <View className="px-4 pb-4 -mt-14">
            <View className="flex-row justify-between items-end">
              <Animated.View
                className="relative"
                style={{
                  transform: [
                    { translateY: profileImageTranslateY },
                    { scale: profileImageScale },
                  ],
                }}
              >
                <View
                  className="rounded-full border-4 border-white shadow-md overflow-hidden"
                  style={{ width: 110, height: 110 }}
                >
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/women/44.jpg",
                    }}
                    className="w-full h-full"
                  />
                </View>
                <TouchableOpacity className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 border border-gray-300 shadow-sm">
                  <Ionicons name="camera" size={18} color="#0077B5" />
                </TouchableOpacity>

                {/* Online Status Indicator */}
                <View className="absolute top-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></View>
              </Animated.View>

              <View className="flex-row">
                <TouchableOpacity
                  className="bg-gray-100 rounded-full w-10 h-10 items-center justify-center mr-2"
                  onPress={handleShare}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-2">
              <Text className="text-2xl font-bold text-gray-800">
                {profileData.name}
              </Text>
              <Text className="text-gray-600">
                {profileData.title} at {profileData.company}
              </Text>

              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text className="text-gray-500 text-sm ml-1">
                  {profileData.location}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-2" />
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-blue-600 text-sm font-medium">
                    {profileData.connections} connections
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row mt-4">
                <TouchableOpacity className="bg-blue-600 py-2 px-5 rounded-full shadow-sm">
                  <Text className="text-white font-medium">Open to</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-blue-600 py-2 px-5 rounded-full ml-2">
                  <Text className="text-blue-600 font-medium">Add section</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-gray-300 py-2 px-5 rounded-full ml-2">
                  <Text className="text-gray-700 font-medium">More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Tabs */}
        <View className="bg-white mt-2 border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {["Profile", "Activity", "Articles", "Connections"].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`py-3 mr-6 border-b-2 ${
                  activeTab.toLowerCase() === tab.toLowerCase()
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
                onPress={() => setActiveTab(tab.toLowerCase())}
              >
                <Text
                  className={`font-medium ${
                    activeTab.toLowerCase() === tab.toLowerCase()
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Analytics Section */}
        <View className="bg-white mt-2 p-4 rounded-xl mx-4 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-gray-800 text-lg">Analytics</Text>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="eye-off-outline" size={18} color="#666" />
              <Text className="text-gray-600 text-sm ml-1">Private to you</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity className="flex-1 bg-gray-50 rounded-lg p-3 mr-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <Ionicons name="people" size={18} color="#0077B5" />
                </View>
                <Text className="font-bold text-lg ml-2 text-gray-800">
                  {profileData.profileViews}
                </Text>
              </View>
              <Text className="text-gray-600 text-xs mt-1">Profile views</Text>
              <Text className="text-green-600 text-xs mt-1">
                +12% from last week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-gray-50 rounded-lg p-3 mr-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="search" size={18} color="#10B981" />
                </View>
                <Text className="font-bold text-lg ml-2 text-gray-800">
                  {profileData.searchAppearances}
                </Text>
              </View>
              <Text className="text-gray-600 text-xs mt-1">
                Search appearances
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                +5% from last week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-gray-50 rounded-lg p-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                  <Ionicons name="bar-chart" size={18} color="#8B5CF6" />
                </View>
                <Text className="font-bold text-lg ml-2 text-gray-800">
                  {profileData.postImpressions}
                </Text>
              </View>
              <Text className="text-gray-600 text-xs mt-1">
                Post impressions
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                +23% from last week
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View className="bg-white mt-4 p-4 rounded-xl mx-4 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-gray-800">About</Text>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-gray-600 leading-5">
            {showFullAbout
              ? profileData.about
              : `${profileData.about.substring(0, 150)}...`}
          </Text>
          {profileData.about.length > 150 && (
            <TouchableOpacity
              className="mt-2"
              onPress={() => setShowFullAbout(!showFullAbout)}
            >
              <Text className="text-blue-600 font-medium">
                {showFullAbout ? "Show less" : "Show more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Skills Section */}
        <View className="bg-white mt-4 p-4 rounded-xl mx-4 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-gray-800">Skills</Text>
            <TouchableOpacity>
              <Ionicons name="add-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View className="mt-3 flex-row flex-wrap">
            {profileData.skills.map((skill, index) =>
              renderSkillBadge(skill, index)
            )}
          </View>
          <TouchableOpacity className="mt-3">
            <Text className="text-blue-600 font-medium">Show all skills</Text>
          </TouchableOpacity>
        </View>

        {/* Experience Section */}
        <View className="bg-white mt-4 p-4 rounded-xl mx-4 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-gray-800">Experience</Text>
            <View className="flex-row">
              <TouchableOpacity className="mr-4">
                <Ionicons name="add-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Job Items */}
          {profileData.experience.map((exp, index) => (
            <TouchableOpacity
              key={exp.id}
              className={`mt-4 ${
                index < profileData.experience.length - 1
                  ? "border-b border-gray-200 pb-4"
                  : ""
              }`}
              onPress={() => toggleSectionExpand(`exp-${exp.id}`)}
            >
              <View className="flex-row">
                <Image
                  source={{
                    uri:
                      exp.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        exp.company
                      )}&background=0077B5&color=fff`,
                  }}
                  className="w-12 h-12 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800">{exp.role}</Text>
                  <Text className="text-gray-600">{exp.company}</Text>
                  <Text className="text-gray-500 text-xs">{exp.duration}</Text>
                  <Text className="text-gray-500 text-xs">{exp.location}</Text>

                  {(expandedSection === `exp-${exp.id}` || index === 0) && (
                    <>
                      <Text className="mt-2 text-gray-600 leading-5">
                        {exp.description}
                      </Text>
                      <View className="mt-2 flex-row flex-wrap">
                        {exp.skills.map((skill, idx) =>
                          renderSkillBadge(skill, idx)
                        )}
                      </View>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Education Section */}
        <View className="bg-white mt-4 p-4 rounded-xl mx-4 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-gray-800">Education</Text>
            <View className="flex-row">
              <TouchableOpacity className="mr-4">
                <Ionicons name="add-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {profileData.education.map((edu) => (
            <TouchableOpacity
              key={edu.id}
              className="mt-4"
              onPress={() => toggleSectionExpand(`edu-${edu.id}`)}
            >
              <View className="flex-row">
                <Image
                  source={{
                    uri:
                      edu.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        edu.school
                      )}&background=0077B5&color=fff`,
                  }}
                  className="w-12 h-12 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800">{edu.school}</Text>
                  <Text className="text-gray-600">{edu.degree}</Text>
                  <Text className="text-gray-500 text-xs">{edu.years}</Text>

                  {expandedSection === `edu-${edu.id}` && (
                    <>
                      <View className="mt-2 flex-row items-center">
                        <Text className="text-gray-600 font-medium">GPA: </Text>
                        <Text className="text-gray-600">{edu.gpa}</Text>
                      </View>
                      <Text className="mt-2 text-gray-600">
                        <Text className="font-medium">Activities: </Text>
                        {edu.activities}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Certifications Section */}
        <View className="bg-white mt-4 p-4 rounded-xl mx-4 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg text-gray-800">
              Certifications
            </Text>
            <TouchableOpacity>
              <Ionicons name="add-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {profileData.certifications.map((cert, index) => (
            <View
              key={cert.id}
              className={`mt-4 ${
                index < profileData.certifications.length - 1
                  ? "border-b border-gray-200 pb-4"
                  : ""
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-lg bg-blue-50 items-center justify-center">
                  <Ionicons name="ribbon" size={24} color="#0077B5" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800">{cert.name}</Text>
                  <Text className="text-gray-600">{cert.issuer}</Text>
                  <Text className="text-gray-500 text-xs">{cert.date}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
