import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { resetPassword, clearError } from "@/app/store/slices/authSlice";
import { BlurView } from "expo-blur";
import { MotiView, AnimatePresence } from "moti";
import { SharedElement } from "react-navigation-shared-element";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTheme, lightTheme, darkTheme } from "@/contexts/ThemeContext";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  error?: string;
  editable?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "next" | "go";
  testID?: string;
  isDarkMode?: boolean;
  themeColors?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  error,
  editable = true,
  onSubmitEditing,
  returnKeyType,
  testID,
  isDarkMode = false,
  themeColors,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowColor: isFocused
            ? themeColors.primary
            : isDarkMode
            ? "#000"
            : "#000",
          shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
          shadowOpacity: isFocused ? 0.25 : 0.1,
          shadowRadius: isFocused ? 8 : 4,
          elevation: isFocused ? 5 : 2,
          backgroundColor: isDarkMode
            ? "rgba(31, 41, 55, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: isFocused
            ? themeColors.primary
            : error
            ? "#EF4444"
            : isDarkMode
            ? "rgba(55, 65, 81, 0.5)"
            : "rgba(229, 231, 235, 0.8)",
        }}
        testID={`${testID}-container`}
      >
        <BlurView
          intensity={isDarkMode ? 70 : 90}
          tint={isDarkMode ? "dark" : "light"}
          className="flex-row items-center"
        >
          <View className="px-4 py-4">
            <Ionicons
              name={icon}
              size={22}
              color={
                isFocused
                  ? themeColors.primary
                  : error
                  ? "#EF4444"
                  : isDarkMode
                  ? "rgba(209, 213, 219, 0.8)"
                  : "rgba(75, 85, 99, 0.8)"
              }
            />
          </View>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize="none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              flex: 1,
              paddingVertical: 16,
              paddingRight: 16,
              fontWeight: "500",
              fontSize: 16,
              color: isDarkMode
                ? "rgba(229, 231, 235, 0.95)"
                : "rgba(31, 41, 55, 0.95)",
            }}
            placeholderTextColor={
              isDarkMode
                ? "rgba(156, 163, 175, 0.7)"
                : "rgba(107, 114, 128, 0.7)"
            }
            editable={editable}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
            testID={testID}
          />
        </BlurView>
      </Animated.View>
      <AnimatePresence>
        {error && (
          <MotiView
            from={{ opacity: 0, translateY: -5 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -5 }}
            transition={{ type: "timing", duration: 300 }}
            className="mt-2"
            testID={`${testID}-error`}
          >
            <Text
              style={{
                color: isDarkMode
                  ? "rgba(248, 113, 113, 0.9)"
                  : "rgba(220, 38, 38, 0.9)",
                fontSize: 14,
                marginLeft: 4,
                fontWeight: "500",
              }}
            >
              {error}
            </Text>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const logoAnimatedValue = useRef(new Animated.Value(1)).current;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  // Theme
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const themeColors = isDarkMode ? darkTheme : lightTheme;

  // Derived animated values for the logo
  const logoScale = logoAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const logoTranslateY = logoAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.timing(logoAnimatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        Animated.timing(logoAnimatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();

    return () => {
      dispatch(clearError());
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email address is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleResetPassword = async () => {
    if (validateEmail(email.trim())) {
      Keyboard.dismiss();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      try {
        await dispatch(resetPassword(email.trim())).unwrap();
        setIsSubmitted(true);
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // Error is handled by the reducer
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gradient colors based on theme
  const gradientColors = isDarkMode
    ? ([
        themeColors.background,
        themeColors.cardBackground,
        themeColors.surfaceBackground,
      ] as const)
    : (["#ffffff", "#f8fafc", "#f1f5f9"] as const);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: isDarkMode ? themeColors.background : "#ffffff",
      }}
      testID="forgot-password-screen"
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
            paddingHorizontal: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScale }],
              marginTop: keyboardVisible ? 40 : 80,
              marginBottom: keyboardVisible ? 32 : 48,
            }}
          >
            <SharedElement id="alumiq-logo">
              <Animated.View
                style={{
                  transform: [{ translateY: logoTranslateY }],
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/AlumiQ.png")}
                  style={{
                    width: 112,
                    height: 112,
                    alignSelf: "center",
                    borderRadius: 56,
                    shadowColor: isDarkMode
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0.3)",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                  resizeMode="contain"
                />
              </Animated.View>
            </SharedElement>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 1000 }}
              style={{
                marginTop: 24,
                display: keyboardVisible ? "none" : "flex",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  textAlign: "center",
                  color: isDarkMode
                    ? "rgba(243, 244, 246, 0.95)"
                    : "rgba(31, 41, 55, 0.95)",
                  letterSpacing: 0.3,
                }}
              >
                Password Reset
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: isDarkMode
                    ? "rgba(209, 213, 219, 0.8)"
                    : "rgba(107, 114, 128, 0.8)",
                  marginTop: 12,
                  fontSize: 16,
                  lineHeight: 22,
                }}
              >
                Enter your email to receive password reset instructions
              </Text>
            </MotiView>
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              marginBottom: 20,
            }}
          >
            <AnimatePresence>
              {error && (
                <MotiView
                  from={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  transition={{ type: "timing", duration: 300 }}
                  style={{
                    backgroundColor: isDarkMode
                      ? "rgba(127, 29, 29, 0.2)"
                      : "rgba(254, 226, 226, 0.8)",
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDarkMode
                      ? "rgba(153, 27, 27, 0.3)"
                      : "rgba(248, 113, 113, 0.3)",
                    marginBottom: 16,
                  }}
                  testID="reset-error"
                >
                  <Text
                    style={{
                      color: isDarkMode
                        ? "rgba(248, 113, 113, 0.9)"
                        : "rgba(185, 28, 28, 0.9)",
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: 15,
                    }}
                  >
                    {error}
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>
            {!isSubmitted ? (
              <>
                <InputField
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  placeholder="Enter your email address"
                  icon="mail-outline"
                  keyboardType="email-address"
                  error={emailError}
                  editable={!isLoading}
                  returnKeyType="go"
                  onSubmitEditing={handleResetPassword}
                  testID="email-input"
                  isDarkMode={isDarkMode}
                  themeColors={themeColors}
                />
                <Animated.View
                  style={{
                    transform: [{ scale: buttonScaleAnim }],
                    shadowColor: themeColors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 6,
                    marginTop: 24,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      animateButton();
                      handleResetPassword();
                    }}
                    style={{
                      backgroundColor: themeColors.primary,
                      borderRadius: 12,
                      paddingVertical: 16,
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    disabled={isLoading}
                    testID="reset-button"
                    activeOpacity={0.85}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: 17,
                          letterSpacing: 0.3,
                        }}
                      >
                        Send Reset Link
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(6, 78, 59, 0.2)"
                    : "rgba(240, 253, 244, 0.8)",
                  padding: 28,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? "rgba(6, 95, 70, 0.3)"
                    : "rgba(167, 243, 208, 0.5)",
                  shadowColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(0, 0, 0, 0.1)",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: isDarkMode ? 4 : 2,
                }}
                testID="success-message"
              >
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: isDarkMode
                        ? "rgba(6, 95, 70, 0.5)"
                        : "rgba(209, 250, 229, 0.8)",
                      borderRadius: 50,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={32}
                      color={isDarkMode ? "#4ADE80" : "#059669"}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    color: isDarkMode
                      ? "rgba(167, 243, 208, 0.9)"
                      : "rgba(6, 95, 70, 0.9)",
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "600",
                    letterSpacing: 0.3,
                  }}
                >
                  Reset Link Sent!
                </Text>
                <Text
                  style={{
                    color: isDarkMode
                      ? "rgba(110, 231, 183, 0.9)"
                      : "rgba(16, 185, 129, 0.9)",
                    textAlign: "center",
                    marginTop: 12,
                    lineHeight: 22,
                    fontSize: 15,
                  }}
                >
                  Please check your email inbox for instructions to reset your
                  password. The link will expire in 24 hours.
                </Text>
              </MotiView>
            )}
            <Link href="/" asChild>
              <TouchableOpacity
                style={{ marginTop: 28 }}
                disabled={isLoading}
                testID="back-to-signin"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color={themeColors.primary}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: themeColors.primary,
                      fontWeight: "500",
                      marginLeft: 8,
                      fontSize: 16,
                    }}
                  >
                    Back to Sign In
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
