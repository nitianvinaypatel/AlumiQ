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
import Header from "@/components/profile/Header";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/contexts/ThemeContext";

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
  profileStrength: 85, // percentage of profile completion
  isPremium: true,
  premiumBadge: "Premium",
  networkStats: {
    weeklyGrowth: 12,
    monthlyGrowth: 47,
    industryConnections: 324,
    schoolConnections: 156,
    newConnectionsThisWeek: 8,
  },
  dashboardMetrics: {
    profileRank: "Top 5%",
    searchAppearanceGrowth: "+15%",
    contentEngagement: "+23%",
    weeklyActivity: 78,
  },
  openToWork: {
    status: true,
    roles: ["Software Engineer", "Tech Lead", "Engineering Manager"],
    locations: ["San Francisco Bay Area", "Remote", "Seattle, WA"],
    startDate: "Immediately",
  },
  notifications: [
    {
      id: 1,
      type: "connection",
      content: "David Wilson accepted your connection request",
      timestamp: "2h ago",
      isRead: false,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 2,
      type: "post",
      content: "Your post received 25 new likes",
      timestamp: "5h ago",
      isRead: true,
      image: null,
    },
    {
      id: 3,
      type: "job",
      content: "5 new jobs match your preferences",
      timestamp: "1d ago",
      isRead: false,
      image: null,
    },
    {
      id: 4,
      type: "profile",
      content: "Your profile appeared in 12 searches this week",
      timestamp: "2d ago",
      isRead: true,
      image: null,
    },
  ],
  connectionRequests: [
    {
      id: 1,
      name: "Emily Chen",
      title: "Product Manager at TechCorp",
      photo: "https://randomuser.me/api/portraits/women/12.jpg",
      mutualConnections: 15,
      timestamp: "3d ago",
    },
    {
      id: 2,
      name: "James Wilson",
      title: "Frontend Developer at StartupX",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      mutualConnections: 8,
      timestamp: "1w ago",
    },
  ],
  skillAssessments: [
    {
      id: 1,
      skill: "JavaScript",
      status: "completed",
      score: "Top 15%",
      badge: true,
    },
    {
      id: 2,
      skill: "React",
      status: "completed",
      score: "Top 5%",
      badge: true,
    },
    {
      id: 3,
      skill: "TypeScript",
      status: "available",
      badge: false,
    },
    {
      id: 4,
      skill: "Node.js",
      status: "available",
      badge: false,
    },
  ],
  about:
    "Experienced software engineer with a passion for building scalable applications and solving complex problems. Skilled in React Native, JavaScript, TypeScript, and cloud technologies. Focused on creating intuitive user experiences and optimizing application performance.\n\nI've led multiple cross-functional teams to deliver high-impact projects that increased user engagement and revenue. My approach combines technical excellence with strong communication skills to ensure alignment between business goals and technical implementation.",
  skills: [
    { name: "React Native", endorsements: 78 },
    { name: "JavaScript", endorsements: 92 },
    { name: "TypeScript", endorsements: 65 },
    { name: "Node.js", endorsements: 47 },
    { name: "GraphQL", endorsements: 38 },
    { name: "AWS", endorsements: 42 },
    { name: "UI/UX Design", endorsements: 31 },
    { name: "Mobile Development", endorsements: 56 },
    { name: "System Architecture", endorsements: 29 },
    { name: "Team Leadership", endorsements: 34 },
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
      achievements: [
        "Spearheaded the migration from REST to GraphQL, reducing API calls by 40% and improving app performance",
        "Mentored 5 junior developers, leading to 3 promotions within the team",
        "Implemented CI/CD pipeline that reduced deployment time by 60%",
      ],
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
      achievements: [
        "Reduced page load time by 45% through code optimization and lazy loading",
        "Implemented A/B testing framework that increased conversion rates by 12%",
      ],
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
      courses: [
        "Data Structures & Algorithms",
        "Machine Learning",
        "Software Engineering",
        "Database Systems",
      ],
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Issued Jan 2022 • Expires Jan 2025",
      credentialId: "AWS-CSA-123456",
      credentialURL: "https://aws.amazon.com/verification",
    },
    {
      id: 2,
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "Issued Mar 2021 • No Expiration",
      credentialId: "PSM-I-987654",
      credentialURL: "https://www.scrum.org/certificates",
    },
  ],
  recommendations: [
    {
      id: 1,
      name: "Alex Chen",
      relationship: "Managed Sarah directly at TechVision Inc.",
      title: "Engineering Manager at TechVision Inc.",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Sarah is an exceptional engineer who consistently delivers high-quality work. Her technical skills are top-notch, and she has a unique ability to understand business requirements and translate them into elegant technical solutions. She's also a great team player who elevates everyone around her.",
    },
    {
      id: 2,
      name: "Maya Patel",
      relationship: "Worked with Sarah on the same team at InnovateCorp",
      title: "Senior Product Designer at DesignHub",
      photo: "https://randomuser.me/api/portraits/women/22.jpg",
      text: "Working with Sarah was a pleasure. She has a deep understanding of both technical constraints and user experience, making her an invaluable partner for designers. She's collaborative, solution-oriented, and always willing to go the extra mile to create the best possible product.",
    },
  ],
  accomplishments: {
    patents: [
      {
        id: 1,
        title:
          "Method and System for Optimizing Mobile Application Performance",
        issuer: "US Patent Office",
        date: "Issued Jun 2021",
        patentNumber: "US 12,345,678",
      },
    ],
    publications: [
      {
        id: 1,
        title: "Scaling React Native Applications for Enterprise Use",
        publisher: "Medium - Better Programming",
        date: "Published Aug 2022",
        url: "https://medium.com/better-programming",
      },
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Professional working proficiency" },
      { language: "French", proficiency: "Elementary proficiency" },
    ],
    volunteering: [
      {
        organization: "Code for Good",
        role: "Volunteer Developer",
        cause: "Education",
        duration: "2019 - Present",
      },
    ],
  },
  peopleAlsoViewed: [
    {
      id: 1,
      name: "David Wilson",
      title: "Senior Frontend Engineer at TechVision Inc.",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      connections: 621,
      mutualConnections: 28,
    },
    {
      id: 2,
      name: "Jennifer Lee",
      title: "Product Manager at InnovateCorp",
      photo: "https://randomuser.me/api/portraits/women/33.jpg",
      connections: 843,
      mutualConnections: 15,
    },
    {
      id: 3,
      name: "Michael Brown",
      title: "CTO at StartupX",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
      connections: 1254,
      mutualConnections: 8,
    },
  ],
  resources: [
    {
      id: 1,
      title: "Creator mode",
      description:
        "Get discovered, showcase content on your profile, and get access to creator tools",
      icon: "create-outline" as const,
    },
    {
      id: 2,
      title: "My Network",
      description: "See and manage your connections and interests",
      icon: "people-outline" as const,
    },
    {
      id: 3,
      title: "Salary insights",
      description: "See how your salary compares to others in the community",
      icon: "cash-outline" as const,
    },
  ],
  jobRecommendations: [
    {
      id: 1,
      title: "Senior React Native Developer",
      company: "InnovateX",
      logo: "https://logo.clearbit.com/facebook.com",
      location: "San Francisco, CA (Remote)",
      postedDate: "2 days ago",
      applicants: 34,
      matchPercentage: 92,
      salary: "$140K - $180K",
      skills: ["React Native", "TypeScript", "Redux"],
    },
    {
      id: 2,
      title: "Engineering Manager - Mobile",
      company: "TechGrowth",
      logo: "https://logo.clearbit.com/apple.com",
      location: "Cupertino, CA",
      postedDate: "1 week ago",
      applicants: 56,
      matchPercentage: 85,
      salary: "$160K - $210K",
      skills: ["Team Leadership", "Mobile Development", "Agile"],
    },
    {
      id: 3,
      title: "Lead Software Engineer",
      company: "FutureTech",
      logo: "https://logo.clearbit.com/amazon.com",
      location: "Seattle, WA (Hybrid)",
      postedDate: "3 days ago",
      applicants: 42,
      matchPercentage: 88,
      salary: "$150K - $190K",
      skills: ["JavaScript", "System Architecture", "AWS"],
    },
  ],
  activityFeed: [
    {
      id: 1,
      type: "post",
      content:
        "Just published a new article on optimizing React Native performance. Check it out!",
      likes: 87,
      comments: 23,
      timestamp: "2 days ago",
      link: "https://medium.com/@sarahjohnson/optimizing-react-native",
    },
    {
      id: 2,
      type: "share",
      content:
        "Great insights on the future of mobile development from the React Native team.",
      originalPost: {
        author: "React Native",
        authorPhoto: "https://logo.clearbit.com/reactnative.dev",
        preview: "Announcing the new architecture for React Native...",
      },
      likes: 42,
      comments: 7,
      timestamp: "1 week ago",
    },
    {
      id: 3,
      type: "achievement",
      content: "Earned AWS Certified Solutions Architect certification",
      likes: 156,
      comments: 34,
      timestamp: "3 months ago",
    },
  ],
  profileCompletionTips: [
    {
      id: 1,
      title: "Add a featured section",
      description: "Showcase your best work, publications, or projects",
      icon: "star-outline" as const,
    },
    {
      id: 2,
      title: "Add industry information",
      description: "Help others understand your industry focus",
      icon: "business-outline" as const,
    },
  ],
};

export default function ProfileScreen() {
  // State
  const [activeTab, setActiveTab] = useState("profile");
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConnectionRequests, setShowConnectionRequests] = useState(false);

  // Theme
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

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

  const renderSkillBadge = (
    skill: string,
    index: number,
    endorsements?: number
  ) => (
    <View
      key={index}
      className={`${
        isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
      } rounded-lg px-3 py-2 mr-2 mb-2`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`${
            isDarkMode ? "text-blue-400" : "text-blue-700"
          } text-xs font-medium`}
        >
          {skill}
        </Text>
        {endorsements !== undefined && (
          <View
            className={`${
              isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
            } rounded-full px-1.5 py-0.5 ml-2`}
          >
            <Text
              className={`${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              } text-xs font-semibold`}
            >
              {endorsements}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const handleEndorse = (skillIndex: number) => {
    // In a real app, this would call an API to add an endorsement
    console.log(`Endorsed skill: ${profileData.skills[skillIndex].name}`);
    // Show a toast or some feedback
  };

  const handleApplyForJob = (jobId: number) => {
    // In a real app, this would navigate to the job application page
    console.log(`Applied for job ID: ${jobId}`);
  };

  const handleSaveJob = (jobId: number) => {
    // In a real app, this would save the job to the user's saved jobs
    console.log(`Saved job ID: ${jobId}`);
  };

  const handleLikeActivity = (activityId: number) => {
    // In a real app, this would call an API to like the activity
    console.log(`Liked activity ID: ${activityId}`);
  };

  const handleCommentActivity = (activityId: number) => {
    // In a real app, this would open a comment input
    console.log(`Commenting on activity ID: ${activityId}`);
  };

  const handleShareActivity = (activityId: number) => {
    // In a real app, this would open a share dialog
    console.log(`Sharing activity ID: ${activityId}`);
  };

  const handleAcceptConnection = (requestId: number) => {
    // In a real app, this would call an API to accept the connection
    console.log(`Accepted connection request ID: ${requestId}`);
  };

  const handleIgnoreConnection = (requestId: number) => {
    // In a real app, this would call an API to ignore the connection
    console.log(`Ignored connection request ID: ${requestId}`);
  };

  const handleTakeSkillAssessment = (skillId: number) => {
    // In a real app, this would navigate to the skill assessment
    console.log(`Taking skill assessment ID: ${skillId}`);
  };

  const handleMarkNotificationAsRead = (notificationId: number) => {
    // In a real app, this would call an API to mark the notification as read
    console.log(`Marked notification ID: ${notificationId} as read`);
  };

  const renderDashboardContent = () => (
    <View className="flex-1">
      <View
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-4 rounded-xl mx-4 shadow-sm ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        } border mt-2`}
      >
        <Text
          className={`font-bold text-xl ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } mb-4`}
        >
          Your Dashboard
        </Text>

        {/* Dashboard Metrics */}
        <View className="flex-row flex-wrap justify-between">
          <View
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg p-3 w-[48%] mb-3`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } text-xs`}
            >
              Profile rank
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {profileData.dashboardMetrics.profileRank}
              </Text>
              <View className="ml-2 bg-green-100 rounded-full px-2 py-0.5">
                <Text className="text-green-800 text-xs">Top performer</Text>
              </View>
            </View>
          </View>

          <View
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg p-3 w-[48%] mb-3`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } text-xs`}
            >
              Search appearances
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {profileData.searchAppearances}
              </Text>
              <Text className="ml-2 text-green-600 text-xs">
                {profileData.dashboardMetrics.searchAppearanceGrowth}
              </Text>
            </View>
          </View>

          <View
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg p-3 w-[48%] mb-3`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } text-xs`}
            >
              Content engagement
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {profileData.postImpressions}
              </Text>
              <Text className="ml-2 text-green-600 text-xs">
                {profileData.dashboardMetrics.contentEngagement}
              </Text>
            </View>
          </View>

          <View
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } rounded-lg p-3 w-[48%] mb-3`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } text-xs`}
            >
              Weekly activity
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {profileData.dashboardMetrics.weeklyActivity}
              </Text>
              <Text className="ml-2 text-blue-600 text-xs">actions</Text>
            </View>
          </View>
        </View>

        {/* Activity Chart Placeholder */}
        <View
          className={`mt-4 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } h-40 rounded-lg items-center justify-center`}
        >
          <Text className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
            Activity Chart
          </Text>
        </View>

        {/* Premium Upsell */}
        <TouchableOpacity
          className={`mt-4 ${
            isDarkMode ? "bg-amber-900/30" : "bg-amber-50"
          } p-3 rounded-lg ${
            isDarkMode ? "border-amber-800/50" : "border-amber-100"
          } border`}
          onPress={() => setShowPremiumModal(true)}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="star"
              size={20}
              color={isDarkMode ? "#F59E0B" : "#F59E0B"}
            />
            <View className="ml-2 flex-1">
              <Text
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Unlock more insights with Premium
              </Text>
              <Text
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-xs mt-1`}
              >
                See who viewed your profile, detailed analytics, and more
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#666"}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        } border`}
      >
        <Text
          className={`font-bold text-lg ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } mb-3`}
        >
          Recent Activity
        </Text>

        {profileData.activityFeed.slice(0, 2).map((activity) => (
          <View
            key={activity.id}
            className={`mb-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b pb-4`}
          >
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
              <Text
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-xs`}
              >
                {activity.timestamp}
              </Text>
            </View>
            <Text
              className={`mt-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {activity.content}
            </Text>
            <View className="mt-2 flex-row items-center">
              <View
                className={`flex-row items-center ${
                  isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                } rounded-full px-2 py-1`}
              >
                <Ionicons name="thumbs-up" size={12} color="#0077B5" />
                <Text className="text-blue-600 text-xs ml-1">
                  {activity.likes}
                </Text>
              </View>
              <Text
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-xs ml-2`}
              >
                {activity.comments} comments
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          className={`flex-row items-center justify-center py-2 ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          } border-t`}
          onPress={() => setActiveTab("activity")}
        >
          <Text className="text-blue-600 font-medium">View all activity</Text>
          <Ionicons name="chevron-forward" size={16} color="#0077B5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Use the Header component */}
      <Header
        scrollY={scrollY}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadNotificationsCount={
          profileData.notifications.filter((n) => !n.isRead).length
        }
      />

      {/* Notifications Panel */}
      {showNotifications && (
        <View
          className={`absolute top-24 right-4 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-xl z-50 w-80`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDarkMode ? 0.3 : 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View
            className={`p-3 ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            } border-b flex-row justify-between items-center`}
          >
            <Text
              className={`font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Notifications
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm">Mark all as read</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-80">
            {profileData.notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                className={`p-3 ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } border-b flex-row ${
                  !notification.isRead
                    ? isDarkMode
                      ? "bg-blue-900/20"
                      : "bg-blue-50"
                    : ""
                }`}
                onPress={() => handleMarkNotificationAsRead(notification.id)}
              >
                <View className="mr-3">
                  {notification.image ? (
                    <Image
                      source={{ uri: notification.image }}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <View
                      className={`w-10 h-10 rounded-full ${
                        isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                      } items-center justify-center`}
                    >
                      <Ionicons
                        name={
                          notification.type === "connection"
                            ? "people"
                            : notification.type === "post"
                            ? "thumbs-up"
                            : notification.type === "job"
                            ? "briefcase"
                            : "person"
                        }
                        size={18}
                        color="#0077B5"
                      />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {notification.content}
                  </Text>
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } text-xs mt-1`}
                  >
                    {notification.timestamp}
                  </Text>
                </View>
                {!notification.isRead && (
                  <View className="w-2 h-2 rounded-full bg-blue-600 self-start mt-2" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            className={`p-3 ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            } border-t`}
          >
            <Text className="text-blue-600 font-medium text-center">
              View all notifications
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
        <View className={`${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          {/* Cover Photo with Gradient */}
          <Animated.View style={{ height: coverHeight }}>
            <LinearGradient
              colors={themeColors.profileGradient}
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
                  className={`rounded-full ${
                    isDarkMode ? "border-gray-800" : "border-white"
                  } border-4 shadow-md overflow-hidden`}
                  style={{ width: 110, height: 110 }}
                >
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/women/44.jpg",
                    }}
                    className="w-full h-full"
                  />
                </View>
                <TouchableOpacity
                  className={`absolute bottom-1 right-1 ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  } rounded-full p-1.5 ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  } border shadow-sm`}
                >
                  <Ionicons name="camera" size={18} color="#0077B5" />
                </TouchableOpacity>

                {/* Premium Badge */}
                {profileData.isPremium && (
                  <View className="absolute top-0 left-0 bg-amber-500 rounded-full p-1 border-2 border-white">
                    <Ionicons name="star" size={14} color="white" />
                  </View>
                )}

                {/* Online Status Indicator */}
                <View className="absolute top-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></View>
              </Animated.View>

              <View className="flex-row">
                <TouchableOpacity
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full w-10 h-10 items-center justify-center mr-2`}
                  onPress={handleShare}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color={isDarkMode ? "#E5E7EB" : "#666"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full w-10 h-10 items-center justify-center`}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={isDarkMode ? "#E5E7EB" : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-2">
              <View className="flex-row items-center">
                <Text
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {profileData.name}
                </Text>
                {profileData.isPremium && (
                  <View className="ml-2 bg-amber-500 rounded-full px-2 py-0.5">
                    <Text className="text-white text-xs font-semibold">
                      {profileData.premiumBadge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {profileData.title} at {profileData.company}
              </Text>

              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDarkMode ? "#9CA3AF" : "#666"}
                />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm ml-1`}
                >
                  {profileData.location}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-2" />
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-blue-600 text-sm font-medium">
                    {profileData.connections} connections
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Open to Work Banner */}
              {profileData.openToWork && profileData.openToWork.status && (
                <View
                  className={`mt-3 ${
                    isDarkMode
                      ? "bg-blue-900/20 border-blue-800/30"
                      : "bg-blue-50 border-blue-100"
                  } border rounded-lg p-3`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-8 h-8 rounded-full ${
                        isDarkMode ? "bg-blue-900/40" : "bg-blue-100"
                      } items-center justify-center`}
                    >
                      <Ionicons name="briefcase" size={16} color="#0077B5" />
                    </View>
                    <View className="ml-2 flex-1">
                      <Text
                        className={`font-semibold ${
                          isDarkMode ? "text-blue-300" : "text-blue-800"
                        }`}
                      >
                        Open to work
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-blue-200" : "text-blue-700"
                        } text-xs`}
                      >
                        {profileData.openToWork.roles.join(", ")}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-blue-600 text-xs">
                          See all details
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={12}
                          color="#0077B5"
                        />
                      </View>
                    </View>
                    <TouchableOpacity className="bg-blue-600 rounded-full py-1 px-3">
                      <Text className="text-white text-xs font-medium">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View className="flex-row mt-4">
                <TouchableOpacity className="bg-blue-600 py-2 px-5 rounded-full shadow-sm">
                  <Text className="text-white font-medium">Message</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-blue-600 py-2 px-5 rounded-full ml-2">
                  <Text className="text-blue-600 font-medium">Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`border ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300"
                      : "border-gray-300 text-gray-700"
                  } py-2 px-5 rounded-full ml-2`}
                >
                  <Text
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    More
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Profile Highlights */}
              <View className="mt-4 flex-row">
                <TouchableOpacity className="flex-row items-center mr-6">
                  <View
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                    } items-center justify-center`}
                  >
                    <Ionicons name="school" size={16} color="#0077B5" />
                  </View>
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-sm ml-2`}
                  >
                    {profileData.education[0].school}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center">
                  <View
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                    } items-center justify-center`}
                  >
                    <Ionicons name="business" size={16} color="#0077B5" />
                  </View>
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-sm ml-2`}
                  >
                    {profileData.company}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Tabs */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } mt-2 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {[
              "Profile",
              "Activity",
              "Articles",
              "Connections",
              "Dashboard",
            ].map((tab) => (
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
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" ? (
          renderDashboardContent()
        ) : (
          <>
            {/* Premium Features Banner */}
            {!profileData.isPremium && (
              <TouchableOpacity
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-700 to-amber-600"
                    : "bg-gradient-to-r from-amber-500 to-amber-400"
                } mt-2 p-4 mx-4 rounded-xl shadow-sm`}
                onPress={() => setShowPremiumModal(true)}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                    <Ionicons name="star" size={20} color="white" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-white">
                      Unlock Premium Features
                    </Text>
                    <Text className="text-white text-xs mt-1 opacity-90">
                      See who viewed your profile, access advanced insights, and
                      more
                    </Text>
                  </View>
                  <View className="bg-white rounded-full px-3 py-1">
                    <Text className="text-amber-500 font-medium">Try Free</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Network Growth Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Your Network
                </Text>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-medium">See all</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 flex-row justify-between">
                <View
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg p-3 w-[48%]`}
                >
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-xs`}
                  >
                    Weekly growth
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className={`font-bold text-lg ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      +{profileData.networkStats.weeklyGrowth}
                    </Text>
                    <Text
                      className={`ml-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } text-xs`}
                    >
                      connections
                    </Text>
                  </View>
                </View>

                <View
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg p-3 w-[48%]`}
                >
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-xs`}
                  >
                    Monthly growth
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className={`font-bold text-lg ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      +{profileData.networkStats.monthlyGrowth}
                    </Text>
                    <Text
                      className={`ml-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } text-xs`}
                    >
                      connections
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-4 flex-row flex-wrap">
                <View className="flex-row items-center mr-4 mb-2">
                  <View
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                    } items-center justify-center`}
                  >
                    <Ionicons name="business" size={16} color="#0077B5" />
                  </View>
                  <View className="ml-2">
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      } font-medium`}
                    >
                      {profileData.networkStats.industryConnections}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs`}
                    >
                      Industry
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mr-4 mb-2">
                  <View
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                    } items-center justify-center`}
                  >
                    <Ionicons name="school" size={16} color="#0077B5" />
                  </View>
                  <View className="ml-2">
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      } font-medium`}
                    >
                      {profileData.networkStats.schoolConnections}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs`}
                    >
                      School
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-2">
                  <View
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-green-900/20" : "bg-green-50"
                    } items-center justify-center`}
                  >
                    <Ionicons
                      name="people"
                      size={16}
                      color={isDarkMode ? "#4ADE80" : "#10B981"}
                    />
                  </View>
                  <View className="ml-2">
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      } font-medium`}
                    >
                      {profileData.networkStats.newConnectionsThisWeek}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs`}
                    >
                      New this week
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className={`mt-4 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } pt-3`}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-blue-600 font-medium">
                    Grow your network
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#0077B5" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Profile Strength Meter */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Profile Strength
                </Text>
                <Text className="text-blue-600 font-medium">
                  {profileData.profileStrength}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View
                className={`h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } rounded-full mt-2 overflow-hidden`}
              >
                <View
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${profileData.profileStrength}%` }}
                />
              </View>

              {/* Completion Tips */}
              <View className="mt-4">
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Ways to strengthen your profile:
                </Text>
                {profileData.profileCompletionTips.map((tip) => (
                  <TouchableOpacity
                    key={tip.id}
                    className={`flex-row items-center py-2 border-b ${
                      isDarkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <View
                      className={`w-8 h-8 rounded-full ${
                        isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                      } items-center justify-center`}
                    >
                      <Ionicons name={tip.icon} size={16} color="#0077B5" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className={`font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {tip.title}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {tip.description}
                      </Text>
                    </View>
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color="#0077B5"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* About Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  About
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              </View>
              <Text
                className={`mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } leading-5`}
              >
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

            {/* Skills Section - Enhanced with Skill Assessments */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Skills & Endorsements
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              {/* Skill Assessments */}
              <View
                className={`mt-3 mb-4 ${
                  isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                } p-3 rounded-lg`}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Skill Assessments
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-blue-600 text-sm">See all</Text>
                  </TouchableOpacity>
                </View>

                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-xs mt-1 mb-3`}
                >
                  Demonstrate your skills with assessments to earn badges and
                  stand out
                </Text>

                <View className="flex-row flex-wrap">
                  {profileData.skillAssessments.map((assessment) => (
                    <View key={assessment.id} className="w-1/2 pr-2 mb-2">
                      <View
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        } rounded-lg p-2 border ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        }`}
                      >
                        <View className="flex-row items-center">
                          {assessment.badge ? (
                            <View
                              className={`w-8 h-8 rounded-full ${
                                isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                              } items-center justify-center`}
                            >
                              <Ionicons
                                name="ribbon"
                                size={16}
                                color="#0077B5"
                              />
                            </View>
                          ) : (
                            <View
                              className={`w-8 h-8 rounded-full ${
                                isDarkMode ? "bg-gray-600" : "bg-gray-100"
                              } items-center justify-center`}
                            >
                              <Ionicons
                                name="document-text-outline"
                                size={16}
                                color={isDarkMode ? "#9CA3AF" : "#666"}
                              />
                            </View>
                          )}
                          <View className="ml-2 flex-1">
                            <Text
                              className={`font-medium ${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              } text-xs`}
                            >
                              {assessment.skill}
                            </Text>
                            {assessment.status === "completed" ? (
                              <Text className="text-green-600 text-xs">
                                {assessment.score}
                              </Text>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  handleTakeSkillAssessment(assessment.id)
                                }
                              >
                                <Text className="text-blue-600 text-xs">
                                  Take assessment
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mt-3">
                {(showAllSkills
                  ? profileData.skills
                  : profileData.skills.slice(0, 5)
                ).map((skill, index) => (
                  <View
                    key={index}
                    className={`${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    } border ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    } rounded-lg px-3 py-3 mb-2`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text
                          className={`font-medium ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {skill.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <View
                            className={`${
                              isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                            } rounded-full px-1.5 py-0.5`}
                          >
                            <Text
                              className={`${
                                isDarkMode ? "text-blue-300" : "text-blue-800"
                              } text-xs font-semibold`}
                            >
                              {skill.endorsements}
                            </Text>
                          </View>
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } text-xs ml-1`}
                          >
                            endorsements
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        className={`${
                          isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                        } py-1.5 px-3 rounded-full`}
                        onPress={() => handleEndorse(index)}
                      >
                        <Text
                          className={`${
                            isDarkMode ? "text-blue-400" : "text-blue-700"
                          } text-xs font-medium`}
                        >
                          Endorse
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                className="mt-3"
                onPress={() => setShowAllSkills(!showAllSkills)}
              >
                <Text className="text-blue-600 font-medium">
                  {showAllSkills
                    ? "Show less"
                    : `Show all ${profileData.skills.length} skills`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Job Recommendations Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Jobs For You
                </Text>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-medium">See all</Text>
                </TouchableOpacity>
              </View>

              {(showAllJobs
                ? profileData.jobRecommendations
                : profileData.jobRecommendations.slice(0, 2)
              ).map((job) => (
                <View
                  key={job.id}
                  className={`mb-4 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } pb-4`}
                >
                  <View className="flex-row">
                    <Image
                      source={{ uri: job.logo }}
                      className="w-14 h-14 rounded-lg"
                    />
                    <View className="ml-3 flex-1">
                      <View className="flex-row justify-between">
                        <Text
                          className={`font-bold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {job.title}
                        </Text>
                        <View
                          className={`${
                            isDarkMode ? "bg-green-900/30" : "bg-green-100"
                          } rounded-full px-2 py-1`}
                        >
                          <Text
                            className={`${
                              isDarkMode ? "text-green-400" : "text-green-800"
                            } text-xs font-semibold`}
                          >
                            {job.matchPercentage}% match
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {job.company}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {job.location}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {job.postedDate}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-gray-400 mx-2" />
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {job.applicants} applicants
                        </Text>
                      </View>

                      {/* Salary Information */}
                      <View className="flex-row items-center mt-2">
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color={isDarkMode ? "#4ADE80" : "#10B981"}
                        />
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          } text-xs ml-1 font-medium`}
                        >
                          {job.salary}
                        </Text>
                      </View>

                      {/* Matching Skills */}
                      <View className="flex-row flex-wrap mt-2">
                        {job.skills.map((skill, idx) => (
                          <View
                            key={idx}
                            className={`${
                              isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                            } rounded-full px-2 py-1 mr-1 mb-1`}
                          >
                            <Text
                              className={`${
                                isDarkMode ? "text-blue-400" : "text-blue-700"
                              } text-xs`}
                            >
                              {skill}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Action Buttons */}
                      <View className="flex-row mt-3">
                        <TouchableOpacity
                          className="bg-blue-600 py-2 px-4 rounded-full mr-2"
                          onPress={() => handleApplyForJob(job.id)}
                        >
                          <Text className="text-white text-xs font-medium">
                            Apply
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={`border ${
                            isDarkMode ? "border-gray-600" : "border-gray-300"
                          } py-2 px-4 rounded-full`}
                          onPress={() => handleSaveJob(job.id)}
                        >
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            } text-xs font-medium`}
                          >
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {profileData.jobRecommendations.length > 2 && (
                <TouchableOpacity
                  className="mt-2"
                  onPress={() => setShowAllJobs(!showAllJobs)}
                >
                  <Text className="text-blue-600 font-medium">
                    {showAllJobs
                      ? "Show less"
                      : `Show all ${profileData.jobRecommendations.length} jobs`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Experience Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Experience
                </Text>
                <View className="flex-row">
                  <TouchableOpacity className="mr-4">
                    <Ionicons
                      name="add-outline"
                      size={24}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Job Items */}
              {profileData.experience.map((exp, index) => (
                <TouchableOpacity
                  key={exp.id}
                  className={`mt-4 ${
                    index < profileData.experience.length - 1
                      ? `border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        } pb-4`
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
                      <Text
                        className={`font-bold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {exp.role}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {exp.company}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {exp.duration}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {exp.location}
                      </Text>

                      {(expandedSection === `exp-${exp.id}` || index === 0) && (
                        <>
                          <Text
                            className={`mt-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } leading-5`}
                          >
                            {exp.description}
                          </Text>

                          {/* Achievements */}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <View className="mt-3">
                              <Text
                                className={`font-semibold ${
                                  isDarkMode ? "text-gray-200" : "text-gray-700"
                                }`}
                              >
                                Key Achievements:
                              </Text>
                              {exp.achievements.map((achievement, idx) => (
                                <View key={idx} className="flex-row mt-1">
                                  <Text
                                    className={`${
                                      isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    } mr-2`}
                                  >
                                    •
                                  </Text>
                                  <Text
                                    className={`${
                                      isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    } flex-1`}
                                  >
                                    {achievement}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}

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
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border mb-6`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Education
                </Text>
                <View className="flex-row">
                  <TouchableOpacity className="mr-4">
                    <Ionicons
                      name="add-outline"
                      size={24}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
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
                      <Text
                        className={`font-bold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {edu.school}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {edu.degree}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {edu.years}
                      </Text>

                      {expandedSection === `edu-${edu.id}` && (
                        <>
                          <View className="mt-2 flex-row items-center">
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              } font-medium`}
                            >
                              GPA:{" "}
                            </Text>
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {edu.gpa}
                            </Text>
                          </View>
                          <Text
                            className={`mt-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
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
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Certifications
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              {profileData.certifications.map((cert, index) => (
                <View
                  key={cert.id}
                  className={`mt-4 ${
                    index < profileData.certifications.length - 1
                      ? `border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        } pb-4`
                      : ""
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-12 h-12 rounded-lg ${
                        isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                      } items-center justify-center`}
                    >
                      <Ionicons name="ribbon" size={24} color="#0077B5" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className={`font-bold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {cert.name}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {cert.issuer}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs`}
                      >
                        {cert.date}
                      </Text>

                      {expandedSection === `cert-${cert.id}` && (
                        <View className="mt-2">
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } text-xs`}
                          >
                            <Text className="font-medium">Credential ID: </Text>
                            {cert.credentialId}
                          </Text>
                          <TouchableOpacity className="mt-1">
                            <Text className="text-blue-600 text-xs">
                              Show credential
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => toggleSectionExpand(`cert-${cert.id}`)}
                    >
                      <Ionicons
                        name={
                          expandedSection === `cert-${cert.id}`
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={18}
                        color={isDarkMode ? "#9CA3AF" : "#666"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Recommendations Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Recommendations
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              {(showAllRecommendations
                ? profileData.recommendations
                : profileData.recommendations.slice(0, 1)
              ).map((rec, index) => (
                <View
                  key={rec.id}
                  className={`mt-4 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } pb-4`}
                >
                  <View className="flex-row items-start">
                    <Image
                      source={{ uri: rec.photo }}
                      className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-3 flex-1">
                      <Text
                        className={`font-bold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {rec.name}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } text-sm`}
                      >
                        {rec.title}
                      </Text>
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-xs mt-1`}
                      >
                        {rec.relationship}
                      </Text>

                      <Text
                        className={`mt-3 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } leading-5 italic`}
                      >
                        "{rec.text}"
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {profileData.recommendations.length > 1 && (
                <TouchableOpacity
                  className="mt-3"
                  onPress={() =>
                    setShowAllRecommendations(!showAllRecommendations)
                  }
                >
                  <Text className="text-blue-600 font-medium">
                    {showAllRecommendations
                      ? "Show less"
                      : `Show all ${profileData.recommendations.length} recommendations`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Accomplishments Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Accomplishments
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              {/* Patents */}
              {profileData.accomplishments.patents.length > 0 && (
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => toggleSectionExpand("patents")}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-lg ${
                          isDarkMode ? "bg-amber-900/30" : "bg-amber-50"
                        } items-center justify-center`}
                      >
                        <Ionicons
                          name="document-text"
                          size={20}
                          color="#F59E0B"
                        />
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          Patents
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {profileData.accomplishments.patents.length} patent
                          {profileData.accomplishments.patents.length > 1
                            ? "s"
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === "patents"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </View>

                  {expandedSection === "patents" && (
                    <View
                      className={`mt-3 ml-13 border-l-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } pl-4`}
                    >
                      {profileData.accomplishments.patents.map((patent) => (
                        <View key={patent.id} className="mb-3">
                          <Text
                            className={`font-medium ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {patent.title}
                          </Text>
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } text-xs`}
                          >
                            {patent.issuer} • {patent.date}
                          </Text>
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } text-xs`}
                          >
                            Patent No: {patent.patentNumber}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {/* Publications */}
              {profileData.accomplishments.publications.length > 0 && (
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => toggleSectionExpand("publications")}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-lg ${
                          isDarkMode ? "bg-purple-900/30" : "bg-purple-50"
                        } items-center justify-center`}
                      >
                        <Ionicons
                          name="book"
                          size={20}
                          color={isDarkMode ? "#A78BFA" : "#8B5CF6"}
                        />
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          Publications
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {profileData.accomplishments.publications.length}{" "}
                          publication
                          {profileData.accomplishments.publications.length > 1
                            ? "s"
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === "publications"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </View>

                  {expandedSection === "publications" && (
                    <View
                      className={`mt-3 ml-13 border-l-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } pl-4`}
                    >
                      {profileData.accomplishments.publications.map((pub) => (
                        <View key={pub.id} className="mb-3">
                          <Text
                            className={`font-medium ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {pub.title}
                          </Text>
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } text-xs`}
                          >
                            {pub.publisher} • {pub.date}
                          </Text>
                          <TouchableOpacity>
                            <Text className="text-blue-600 text-xs mt-1">
                              View publication
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {/* Languages */}
              {profileData.accomplishments.languages.length > 0 && (
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => toggleSectionExpand("languages")}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-lg ${
                          isDarkMode ? "bg-green-900/30" : "bg-green-50"
                        } items-center justify-center`}
                      >
                        <Ionicons
                          name="globe"
                          size={20}
                          color={isDarkMode ? "#4ADE80" : "#10B981"}
                        />
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          Languages
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {profileData.accomplishments.languages.length}{" "}
                          language
                          {profileData.accomplishments.languages.length > 1
                            ? "s"
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === "languages"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </View>

                  {expandedSection === "languages" && (
                    <View
                      className={`mt-3 ml-13 border-l-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } pl-4`}
                    >
                      {profileData.accomplishments.languages.map(
                        (lang, idx) => (
                          <View
                            key={idx}
                            className="mb-2 flex-row justify-between"
                          >
                            <Text
                              className={`font-medium ${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {lang.language}
                            </Text>
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              } text-xs`}
                            >
                              {lang.proficiency}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {/* Volunteering */}
              {profileData.accomplishments.volunteering.length > 0 && (
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => toggleSectionExpand("volunteering")}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-lg ${
                          isDarkMode ? "bg-red-900/30" : "bg-red-50"
                        } items-center justify-center`}
                      >
                        <Ionicons
                          name="heart"
                          size={20}
                          color={isDarkMode ? "#F87171" : "#EF4444"}
                        />
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          Volunteer Experience
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {profileData.accomplishments.volunteering.length}{" "}
                          position
                          {profileData.accomplishments.volunteering.length > 1
                            ? "s"
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedSection === "volunteering"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#666"}
                    />
                  </View>

                  {expandedSection === "volunteering" && (
                    <View
                      className={`mt-3 ml-13 border-l-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } pl-4`}
                    >
                      {profileData.accomplishments.volunteering.map(
                        (vol, idx) => (
                          <View key={idx} className="mb-3">
                            <Text
                              className={`font-medium ${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {vol.role}
                            </Text>
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              } text-xs`}
                            >
                              {vol.organization} • {vol.duration}
                            </Text>
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              } text-xs mt-1`}
                            >
                              Cause: {vol.cause}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Resources Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border`}
            >
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } mb-3`}
              >
                Resources
              </Text>

              {profileData.resources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  className={`flex-row items-center py-3 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-lg ${
                      isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                    } items-center justify-center`}
                  >
                    <Ionicons name={resource.icon} size={20} color="#0077B5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {resource.title}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs`}
                    >
                      {resource.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={isDarkMode ? "#9CA3AF" : "#666"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* People Also Viewed Section */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              } border mb-6`}
            >
              <Text
                className={`font-bold text-lg ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } mb-3`}
              >
                People Also Viewed
              </Text>

              {profileData.peopleAlsoViewed.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  className={`flex-row items-center py-3 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <Image
                    source={{ uri: person.photo }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {person.name}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } text-xs`}
                    >
                      {person.title}
                    </Text>
                    <Text
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs mt-1`}
                    >
                      {person.mutualConnections} mutual connections
                    </Text>
                  </View>
                  <TouchableOpacity className="border border-blue-600 rounded-full py-1.5 px-3">
                    <Text className="text-blue-600 text-xs font-medium">
                      Connect
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>

            {/* Connection Requests Section */}
            {profileData.connectionRequests.length > 0 && (
              <View
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } mt-4 p-4 rounded-xl mx-4 shadow-sm ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } border`}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Connection Requests
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setShowConnectionRequests(!showConnectionRequests)
                    }
                  >
                    <Text className="text-blue-600 font-medium">
                      {showConnectionRequests ? "Collapse" : "Expand"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {(showConnectionRequests
                  ? profileData.connectionRequests
                  : profileData.connectionRequests.slice(0, 1)
                ).map((request) => (
                  <View
                    key={request.id}
                    className={`mb-4 border-b ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } pb-4`}
                  >
                    <View className="flex-row">
                      <Image
                        source={{ uri: request.photo }}
                        className="w-14 h-14 rounded-full"
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          className={`font-bold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {request.name}
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          } text-xs`}
                        >
                          {request.title}
                        </Text>
                        <Text
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs mt-1`}
                        >
                          {request.mutualConnections} mutual connections •{" "}
                          {request.timestamp}
                        </Text>

                        <View className="flex-row mt-3">
                          <TouchableOpacity
                            className="bg-blue-600 py-1.5 px-4 rounded-full mr-2"
                            onPress={() => handleAcceptConnection(request.id)}
                          >
                            <Text className="text-white text-xs font-medium">
                              Accept
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className={`border ${
                              isDarkMode ? "border-gray-600" : "border-gray-300"
                            } py-1.5 px-4 rounded-full`}
                            onPress={() => handleIgnoreConnection(request.id)}
                          >
                            <Text
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              } text-xs font-medium`}
                            >
                              Ignore
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}

                {profileData.connectionRequests.length > 1 &&
                  !showConnectionRequests && (
                    <TouchableOpacity
                      className="flex-row items-center justify-center py-2"
                      onPress={() => setShowConnectionRequests(true)}
                    >
                      <Text className="text-blue-600 font-medium">
                        See all {profileData.connectionRequests.length} requests
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#0077B5" />
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-6 right-6 flex-col items-end space-y-3">
        {/* Theme Toggle Button */}
        <TouchableOpacity
          className={`${
            isDarkMode ? "bg-gray-700" : "bg-white"
          } w-12 h-12 rounded-full items-center justify-center shadow-lg`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={22}
            color={isDarkMode ? "#F59E0B" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Premium Modal */}
      {showPremiumModal && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center px-6">
          <View
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl p-5 w-full max-w-md`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="#F59E0B" />
                <Text
                  className={`font-bold text-xl ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } ml-2`}
                >
                  Premium Features
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDarkMode ? "#9CA3AF" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2`}
                >
                  See who viewed your profile
                </Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2`}
                >
                  Access advanced insights and analytics
                </Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2`}
                >
                  Send direct messages to anyone
                </Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2`}
                >
                  Get featured in search results
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } ml-2`}
                >
                  Access exclusive learning content
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-amber-500 py-3 rounded-full">
              <Text className="text-white font-bold text-center">
                Try Premium Free for 1 Month
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3"
              onPress={() => setShowPremiumModal(false)}
            >
              <Text
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-center`}
              >
                Maybe later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
