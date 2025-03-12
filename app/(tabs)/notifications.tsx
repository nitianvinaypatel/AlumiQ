import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SectionList,
  Switch,
  Animated,
  Platform,
  RefreshControl,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Header from "@/components/home/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReAnimated, {
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInRight,
  Layout,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/contexts/ThemeContext";

// Define notification interface with more detailed typing
interface User {
  id: string;
  name: string;
  avatar: string;
  headline?: string;
}

interface NotificationAction {
  label: string;
  action: string;
  icon?: string;
}

interface NotificationActions {
  primary?: NotificationAction;
  secondary?: NotificationAction;
}

interface Notification {
  id: string;
  user?: User;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionable?: boolean;
  category?: "connection" | "post" | "message" | "job" | "event" | "profile";
  priority?: "high" | "medium" | "low";
  actions?: NotificationActions;
}

// Sample notification data (enhanced)
const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Alex Morgan",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      headline: "Senior Product Manager at TechCorp",
    },
    title: "New Connection Request",
    content: "Alex Morgan wants to connect with you",
    timestamp: "10 min ago",
    isRead: false,
    actionable: true,
    category: "connection",
    priority: "high",
    actions: {
      primary: {
        label: "Accept",
        action: "accept_connection",
        icon: "check",
      },
      secondary: {
        label: "Decline",
        action: "decline_connection",
        icon: "x",
      },
    },
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      headline: "Software Engineer",
    },
    title: "Post Liked",
    content: "James Wilson liked your post about the tech conference",
    timestamp: "1 hour ago",
    isRead: false,
    category: "post",
    priority: "medium",
    actions: {
      primary: {
        label: "View Post",
        action: "view_post",
        icon: "eye",
      },
    },
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Sophia Lee",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      headline: "Marketing Director",
    },
    title: "New Comment",
    content:
      'Sophia Lee commented on your post: "Great insights! Would love to discuss more."',
    timestamp: "3 hours ago",
    isRead: true,
    category: "post",
    priority: "medium",
    actions: {
      primary: {
        label: "Reply",
        action: "reply_comment",
        icon: "message-circle",
      },
      secondary: {
        label: "View Post",
        action: "view_post",
        icon: "eye",
      },
    },
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Robert Chen",
      avatar: "https://randomuser.me/api/portraits/men/13.jpg",
      headline: "Recruiter at TechCorp",
    },
    title: "Job Recommendation",
    content:
      'Robert Chen shared a job that matches your profile: "Senior Developer at TechCorp"',
    timestamp: "Yesterday",
    isRead: true,
    actionable: true,
    category: "job",
    priority: "high",
    actions: {
      primary: {
        label: "View Job",
        action: "view_job",
        icon: "briefcase",
      },
    },
  },
  {
    id: "5",
    title: "Upcoming Event",
    content: "Tech Networking Mixer happening this Friday at 6 PM",
    timestamp: "2 days ago",
    isRead: true,
    actionable: true,
    category: "event",
    priority: "medium",
    actions: {
      primary: {
        label: "RSVP",
        action: "rsvp_event",
        icon: "calendar",
      },
    },
  },
  {
    id: "6",
    title: "Profile Views",
    content: "Your profile has been viewed by 12 people this week",
    timestamp: "3 days ago",
    isRead: false,
    category: "profile",
    priority: "low",
    actions: {
      primary: {
        label: "See Viewers",
        action: "view_profile_viewers",
        icon: "users",
      },
    },
  },
];

// Group notifications by date
const groupByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach((notification) => {
    let dateGroup = "Older";

    if (
      notification.timestamp.includes("min") ||
      notification.timestamp.includes("hour")
    ) {
      dateGroup = "Today";
    } else if (notification.timestamp.includes("Yesterday")) {
      dateGroup = "Yesterday";
    } else if (notification.timestamp.includes("days")) {
      const days = parseInt(notification.timestamp);
      if (days < 7) dateGroup = "This Week";
    }

    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }

    groups[dateGroup].push(notification);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
};

// Helper function to get the correct icon name for Feather icons
const getFeatherIconName = (iconName: string): any => {
  // Map of icon names that might need conversion
  const iconMap: Record<string, string> = {
    "message-circle": "message-circle",
    check: "check",
    x: "x",
    eye: "eye",
    briefcase: "briefcase",
    calendar: "calendar",
    users: "users",
    bell: "bell",
    user: "user",
    settings: "settings",
    "check-circle": "check-circle",
  };

  return iconMap[iconName] || "bell"; // Default to bell if icon not found
};

export default function NotificationsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] =
    useState<Notification[]>(NOTIFICATIONS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "unread" | "connections" | "posts" | "jobs"
  >("all");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  // Get the theme from context
  const { theme: themeType } = useTheme();
  const isDarkMode = themeType === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(!notificationsEnabled);
  }, [notificationsEnabled]);

  // Handle notification action
  const handleAction = useCallback(
    (action: string, notificationId: string) => {
      // Mark as read when action is taken
      markAsRead(notificationId);

      // Handle different actions
      switch (action) {
        case "accept_connection":
          // Logic to accept connection
          break;
        case "decline_connection":
          // Logic to decline connection
          deleteNotification(notificationId);
          break;
        case "view_post":
          // Navigate to post
          router.push("/(pages)/post/details" as any);
          break;
        case "reply_comment":
          // Navigate to reply
          router.push({
            pathname: "/(pages)/post/details" as any,
            params: { showComments: "true" },
          });
          break;
        case "view_job":
          // Navigate to job
          router.push("/(tabs)/jobs");
          break;
        case "view_profile":
          // Navigate to profile
          router.push("/(pages)/profile/details" as any);
          break;
        case "rsvp_event":
          // RSVP to event
          router.push("/(pages)/events/details" as any);
          break;
        default:
          break;
      }
    },
    [markAsRead, deleteNotification, router]
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === filter.slice(0, -1)); // Remove plural 's'
  }, [notifications, filter]);

  // Group notifications
  const groupedNotifications = useMemo(
    () => groupByDate(filteredNotifications),
    [filteredNotifications]
  );

  // Count unread notifications
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notifications.forEach((notification) => {
      if (notification.category) {
        counts[notification.category] =
          (counts[notification.category] || 0) + 1;
      }
    });
    return counts;
  }, [notifications]);

  // Render notification item with swipe actions
  const renderNotification = useCallback(
    ({ item, index }: { item: Notification; index: number }) => {
      const opacity = useSharedValue(1);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
        };
      });

      return (
        <View>
          <ReAnimated.View
            entering={SlideInRight.delay(index * 50).springify()}
            exiting={FadeOut.duration(300)}
            layout={Layout.springify()}
          >
            <Animated.View style={animatedStyle}>
              <TouchableOpacity
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } ${
                  item.isRead
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-white"
                    : isDarkMode
                    ? "bg-blue-900/10"
                    : "bg-blue-50/10"
                }`}
                onPress={() => markAsRead(item.id)}
                activeOpacity={0.7}
              >
                <View className="flex-row">
                  {item.user ? (
                    <View className="mr-3">
                      <View
                        className={`rounded-full overflow-hidden border ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        } shadow-sm`}
                      >
                        <Image
                          source={{ uri: item.user.avatar }}
                          className="w-12 h-12"
                        />
                      </View>
                      {!item.isRead && (
                        <ReAnimated.View
                          className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"
                          entering={FadeIn.duration(400)}
                        />
                      )}
                    </View>
                  ) : (
                    <View className="mr-3">
                      <View
                        className={`w-12 h-12 rounded-full ${
                          isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                        } items-center justify-center border ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        } shadow-sm`}
                      >
                        <Ionicons
                          name={
                            item.category === "event"
                              ? "calendar-outline"
                              : item.category === "job"
                              ? "briefcase-outline"
                              : item.category === "profile"
                              ? "person-outline"
                              : "notifications-outline"
                          }
                          size={22}
                          color={isDarkMode ? "#60A5FA" : "#0077B5"}
                        />
                      </View>
                      {!item.isRead && (
                        <ReAnimated.View
                          className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"
                          entering={FadeIn.duration(400)}
                        />
                      )}
                    </View>
                  )}

                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text
                        className={`font-semibold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        } flex-1`}
                      >
                        {item.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Text
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } mr-2`}
                        >
                          {item.timestamp}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            opacity.value = withTiming(
                              0,
                              { duration: 300 },
                              () => {
                                deleteNotification(item.id);
                              }
                            );
                          }}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Ionicons
                            name="close-outline"
                            size={16}
                            color={isDarkMode ? "#9CA3AF" : "#999"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {item.user?.headline && (
                      <Text
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } mt-0.5 mb-1`}
                      >
                        {item.user.headline}
                      </Text>
                    )}

                    <Text
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mt-1 text-sm leading-5`}
                    >
                      {item.content}
                    </Text>

                    {item.priority === "high" && !item.isRead && (
                      <View>
                        <ReAnimated.View
                          className="mt-2 flex-row items-center"
                          entering={FadeIn.delay(300).duration(400)}
                        >
                          <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" />
                          <Text className="text-xs text-blue-600 font-medium">
                            {item.category === "job"
                              ? "Recommended for you"
                              : item.category === "connection"
                              ? "New connection"
                              : "Important"}
                          </Text>
                        </ReAnimated.View>
                      </View>
                    )}

                    {(item.actions?.primary || item.actions?.secondary) && (
                      <View>
                        <ReAnimated.View
                          className="flex-row mt-3"
                          entering={FadeIn.delay(200).duration(400)}
                        >
                          {item.actions.primary && (
                            <TouchableOpacity
                              className="bg-blue-600 rounded-md px-4 py-2 mr-2 flex-row items-center shadow-sm"
                              style={{ elevation: 1 }}
                              onPress={() =>
                                handleAction(
                                  item.actions!.primary!.action,
                                  item.id
                                )
                              }
                            >
                              {item.actions.primary.icon && (
                                <Ionicons
                                  name={
                                    item.actions.primary.icon === "check"
                                      ? "checkmark-outline"
                                      : item.actions.primary.icon === "eye"
                                      ? "eye-outline"
                                      : item.actions.primary.icon ===
                                        "message-circle"
                                      ? "chatbubble-outline"
                                      : item.actions.primary.icon ===
                                        "briefcase"
                                      ? "briefcase-outline"
                                      : item.actions.primary.icon === "calendar"
                                      ? "calendar-outline"
                                      : item.actions.primary.icon === "users"
                                      ? "people-outline"
                                      : "arrow-forward-outline"
                                  }
                                  size={16}
                                  color="white"
                                  style={{ marginRight: 4 }}
                                />
                              )}
                              <Text className="text-white text-xs font-medium">
                                {item.actions.primary.label}
                              </Text>
                            </TouchableOpacity>
                          )}

                          {item.actions.secondary && (
                            <TouchableOpacity
                              className={`${
                                isDarkMode ? "bg-gray-700" : "bg-white"
                              } border ${
                                isDarkMode
                                  ? "border-gray-600"
                                  : "border-gray-200"
                              } rounded-md px-4 py-2 flex-row items-center shadow-sm`}
                              style={{ elevation: 1 }}
                              onPress={() =>
                                handleAction(
                                  item.actions!.secondary!.action,
                                  item.id
                                )
                              }
                            >
                              {item.actions.secondary.icon && (
                                <Ionicons
                                  name={
                                    item.actions.secondary.icon === "x"
                                      ? "close-outline"
                                      : item.actions.secondary.icon === "eye"
                                      ? "eye-outline"
                                      : "arrow-forward-outline"
                                  }
                                  size={16}
                                  color={isDarkMode ? "#E5E7EB" : "#374151"}
                                  style={{ marginRight: 4 }}
                                />
                              )}
                              <Text
                                className={`${
                                  isDarkMode ? "text-gray-200" : "text-gray-700"
                                } text-xs font-medium`}
                              >
                                {item.actions.secondary.label}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </ReAnimated.View>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </ReAnimated.View>
        </View>
      );
    },
    [markAsRead, deleteNotification, handleAction, isDarkMode]
  );

  // Render section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <ReAnimated.View
        entering={FadeIn.duration(400)}
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } px-4 py-3 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <View className="flex-row items-center">
          <Ionicons
            name={
              section.title === "Today"
                ? "today-outline"
                : section.title === "Yesterday"
                ? "calendar-outline"
                : section.title === "This Week"
                ? "time-outline"
                : "calendar-clear-outline"
            }
            size={16}
            color={isDarkMode ? "#9CA3AF" : "#666"}
            style={{ marginRight: 6 }}
          />
          <Text
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } tracking-wide`}
          >
            {section.title}
          </Text>
        </View>
      </ReAnimated.View>
    ),
    [isDarkMode]
  );

  // Empty state component
  const EmptyState = useCallback(
    () => (
      <ReAnimated.View
        entering={FadeIn.duration(600)}
        className="flex-1 items-center justify-center p-6"
      >
        <ReAnimated.View
          entering={FadeIn.delay(300).duration(500)}
          className={`w-16 h-16 rounded-full ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
          } items-center justify-center mb-4`}
        >
          <Ionicons
            name="notifications-off-outline"
            size={32}
            color={isDarkMode ? "#60A5FA" : "#0077B5"}
          />
        </ReAnimated.View>
        <Text
          className={`text-xl font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } mt-2 text-center`}
        >
          No Notifications
        </Text>
        <Text
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-center mt-2 max-w-xs leading-5`}
        >
          {notificationsEnabled
            ? filter !== "all"
              ? `You don't have any ${filter} notifications at the moment.`
              : "You're all caught up! Check back later for updates."
            : "Turn on notifications to stay updated."}
        </Text>

        {filter !== "all" && (
          <TouchableOpacity
            className="mt-6 bg-blue-600 py-2.5 px-6 rounded-md shadow-sm"
            onPress={() => setFilter("all")}
          >
            <Text className="text-white font-medium">
              View All Notifications
            </Text>
          </TouchableOpacity>
        )}
      </ReAnimated.View>
    ),
    [notificationsEnabled, filter, isDarkMode]
  );

  // Notifications disabled state
  const NotificationsDisabled = useCallback(
    () => (
      <ReAnimated.View
        entering={FadeIn.duration(600)}
        className="flex-1 items-center justify-center p-6"
      >
        <ReAnimated.View
          entering={FadeIn.delay(300).duration(500)}
          className={`w-20 h-20 rounded-full ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } items-center justify-center mb-4`}
        >
          <Ionicons
            name="notifications-off-outline"
            size={40}
            color={isDarkMode ? "#6B7280" : "#9CA3AF"}
          />
        </ReAnimated.View>
        <Text
          className={`text-xl font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } mt-2 text-center`}
        >
          Notifications Disabled
        </Text>
        <Text
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-center mt-2 mb-6 max-w-xs leading-5`}
        >
          Enable notifications to stay updated on connections, messages, and
          opportunities
        </Text>

        <TouchableOpacity
          className="bg-blue-600 py-3 px-8 rounded-md shadow-sm"
          activeOpacity={0.8}
          onPress={toggleNotifications}
        >
          <Text className="text-white font-semibold">Enable Notifications</Text>
        </TouchableOpacity>
      </ReAnimated.View>
    ),
    [toggleNotifications, isDarkMode]
  );

  // Floating settings button
  const SettingsButton = () => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePress = () => {
      scale.value = withTiming(0.9, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 }, () => {
          // router.push("/(pages)/settings" as any);
        });
      });
    };

    return (
      <View>
        <ReAnimated.View
          entering={FadeIn.delay(800).duration(500)}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
          }}
        >
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg rounded-full w-12 h-12 items-center justify-center border ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}
              style={{ elevation: 3 }}
              onPress={handlePress}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
            </TouchableOpacity>
          </Animated.View>
        </ReAnimated.View>
      </View>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerStyle: {
            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
          },
          headerTintColor: isDarkMode ? "#60A5FA" : "#0077B5",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 8 }}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
              />
            </View>
          ),
        }}
      />

      {/* Header Component */}
      <Header scrollY={scrollY} />

      {/* Filter Tabs - Horizontally scrollable */}
      {notifications.length > 0 && notificationsEnabled && (
        <ReAnimated.View
          entering={FadeIn.duration(400)}
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } shadow-sm`}
        >
          <View
            className={`px-4 py-3 flex-row justify-between items-center border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={20}
                color={isDarkMode ? "#60A5FA" : "#0077B5"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-base font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Notifications
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                className={`flex-row items-center ${
                  isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                } px-2 py-1 rounded-full`}
                onPress={markAllAsRead}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={isDarkMode ? "#60A5FA" : "#0077B5"}
                />
                <Text
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } font-medium ml-1`}
                >
                  Mark all as read
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
            className={`border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <AnimatedFilterTab
              label="All"
              count={notifications.length}
              active={filter === "all"}
              onPress={() => setFilter("all")}
              icon="bell"
              isDarkMode={isDarkMode}
            />
            <AnimatedFilterTab
              label="Unread"
              count={unreadCount}
              active={filter === "unread"}
              onPress={() => setFilter("unread")}
              icon="alert-circle"
              isDarkMode={isDarkMode}
            />
            <AnimatedFilterTab
              label="Connections"
              count={categoryCounts["connection"] || 0}
              active={filter === "connections"}
              onPress={() => setFilter("connections")}
              icon="users"
              isDarkMode={isDarkMode}
            />
            <AnimatedFilterTab
              label="Posts"
              count={categoryCounts["post"] || 0}
              active={filter === "posts"}
              onPress={() => setFilter("posts")}
              icon="message-square"
              isDarkMode={isDarkMode}
            />
            <AnimatedFilterTab
              label="Jobs"
              count={categoryCounts["job"] || 0}
              active={filter === "jobs"}
              onPress={() => setFilter("jobs")}
              icon="briefcase"
              isDarkMode={isDarkMode}
            />
          </ScrollView>
        </ReAnimated.View>
      )}

      {/* Notification List or Empty States */}
      {notificationsEnabled ? (
        <SectionList
          sections={groupedNotifications}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={EmptyState}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
              progressBackgroundColor={isDarkMode ? "#1F2937" : "#FFFFFF"}
            />
          }
          stickySectionHeadersEnabled
        />
      ) : (
        <NotificationsDisabled />
      )}

      {/* Floating settings button */}
      <SettingsButton />
    </View>
  );
}

// Filter Tab Component
interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  icon: any; // Using any to avoid type issues with Feather icons
  isDarkMode?: boolean;
}

const FilterTab = ({
  label,
  count,
  active,
  onPress,
  icon,
  isDarkMode = false,
}: FilterTabProps) => (
  <TouchableOpacity
    className={`px-4 py-3 mx-1 rounded-full flex-row items-center ${
      active
        ? isDarkMode
          ? "bg-blue-900/30"
          : "bg-blue-50"
        : isDarkMode
        ? "bg-gray-700"
        : "bg-gray-50"
    }`}
    onPress={onPress}
  >
    <View className="mr-2">
      <Ionicons
        name={
          icon === "bell"
            ? "notifications-outline"
            : icon === "alert-circle"
            ? "alert-circle-outline"
            : icon === "users"
            ? "people-outline"
            : icon === "message-square"
            ? "chatbox-outline"
            : icon === "briefcase"
            ? "briefcase-outline"
            : "notifications-outline"
        }
        size={16}
        color={
          active
            ? isDarkMode
              ? "#60A5FA"
              : "#0077B5"
            : isDarkMode
            ? "#9CA3AF"
            : "#666"
        }
      />
    </View>
    <Text
      className={`text-sm font-medium ${
        active
          ? isDarkMode
            ? "text-blue-400"
            : "text-blue-700"
          : isDarkMode
          ? "text-gray-300"
          : "text-gray-700"
      }`}
    >
      {label}
    </Text>
    {count > 0 && (
      <View
        className={`ml-1 px-1.5 rounded-full ${
          active ? "bg-blue-600" : isDarkMode ? "bg-gray-600" : "bg-gray-400"
        }`}
      >
        <Text className="text-xs text-white">{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);
// Filter Tab Component with animation
const AnimatedFilterTab = ({
  label,
  count,
  active,
  onPress,
  icon,
  isDarkMode = false,
}: FilterTabProps) => {
  const animatedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animatedScale.value,
            [1, 1.1, 1],
            [1, 1.1, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const handlePress = () => {
    animatedScale.value = withTiming(1.1, { duration: 100 }, () => {
      animatedScale.value = withTiming(1, { duration: 100 }, () => {
        onPress();
      });
    });
  };

  return (
    <View>
      <ReAnimated.View style={animatedStyle} entering={FadeIn.duration(400)}>
        <TouchableOpacity
          className={`px-4 py-3 mx-1 rounded-full flex-row items-center ${
            active
              ? isDarkMode
                ? "bg-blue-900/30"
                : "bg-blue-50"
              : isDarkMode
              ? "bg-gray-700"
              : "bg-gray-50"
          }`}
          onPress={handlePress}
        >
          <View
            className={`w-6 h-6 rounded-full items-center justify-center ${
              active
                ? isDarkMode
                  ? "bg-blue-800/50"
                  : "bg-blue-100"
                : isDarkMode
                ? "bg-gray-600"
                : "bg-gray-200"
            }`}
          >
            <Ionicons
              name={
                icon === "bell"
                  ? "notifications-outline"
                  : icon === "users"
                  ? "people-outline"
                  : icon === "message-square"
                  ? "chatbox-outline"
                  : icon === "briefcase"
                  ? "briefcase-outline"
                  : "notifications-outline"
              }
              size={16}
              color={
                active
                  ? isDarkMode
                    ? "#60A5FA"
                    : "#0077B5"
                  : isDarkMode
                  ? "#9CA3AF"
                  : "#666"
              }
            />
          </View>
          <Text
            className={`text-sm font-medium ${
              active
                ? isDarkMode
                  ? "text-blue-400"
                  : "text-blue-700"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {label}
          </Text>
          {count > 0 && (
            <View
              className={`ml-1 px-1.5 rounded-full ${
                active
                  ? "bg-blue-600"
                  : isDarkMode
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }`}
            >
              <Text className="text-xs text-white">{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </ReAnimated.View>
    </View>
  );
};
