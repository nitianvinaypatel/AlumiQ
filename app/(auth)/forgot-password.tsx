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
          shadowColor: isFocused ? "#1E40AF" : "#000",
          shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
          shadowOpacity: isFocused ? 0.25 : 0.1,
          shadowRadius: isFocused ? 8 : 4,
          elevation: isFocused ? 5 : 2,
        }}
        className={`bg-white/95 rounded-xl overflow-hidden
          ${isFocused ? "border-blue-700 border" : "border-gray-100 border"}
          ${error ? "border-red-400" : ""}`}
        testID={`${testID}-container`}
      >
        <BlurView intensity={90} tint="light" className="flex-row items-center">
          <View className="px-4 py-4">
            <Ionicons
              name={icon}
              size={22}
              color={isFocused ? "#1E40AF" : error ? "#EF4444" : "#64748B"}
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
            className="flex-1 py-4 text-gray-800 pr-4 font-medium text-base"
            placeholderTextColor="#94A3B8"
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
            <Text className="text-red-500 text-sm ml-1 font-medium">
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID="forgot-password-screen"
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
          className="px-7"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScale }],
            }}
            className={`${keyboardVisible ? "mt-10 mb-8" : "mt-20 mb-12"}`}
          >
            <SharedElement id="alumiq-logo">
              <Animated.View
                style={{
                  transform: [{ translateY: logoTranslateY }],
                }}
                className="items-center"
              >
                <Image
                  source={require("@/assets/images/AlumiQ.png")}
                  className="w-28 h-28 self-center rounded-full shadow-md"
                  resizeMode="contain"
                />
              </Animated.View>
            </SharedElement>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 1000 }}
              className={keyboardVisible ? "hidden" : "mt-6"}
            >
              <Text className="text-3xl font-bold text-center text-gray-800">
                Password Reset
              </Text>
              <Text className="text-center text-gray-500 mt-3 text-base">
                Enter your email to receive password reset instructions
              </Text>
            </MotiView>
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim }} className="space-y-5">
            <AnimatePresence>
              {error && (
                <MotiView
                  from={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  transition={{ type: "timing", duration: 300 }}
                  className="bg-red-50 p-4 rounded-xl border border-red-100 mb-2"
                  testID="reset-error"
                >
                  <Text className="text-red-600 text-center font-medium">
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
                />
                <Animated.View
                  style={{
                    transform: [{ scale: buttonScaleAnim }],
                    shadowColor: "#1E40AF",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 6,
                  }}
                  className="mt-4"
                >
                  <TouchableOpacity
                    onPress={() => {
                      animateButton();
                      handleResetPassword();
                    }}
                    className={`bg-[#0077B5] rounded-xl py-4 ${
                      isLoading ? "opacity-70" : ""
                    }`}
                    disabled={isLoading}
                    testID="reset-button"
                    activeOpacity={0.85}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">
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
                className="bg-green-50 p-7 rounded-xl shadow-sm border border-green-100"
                testID="success-message"
              >
                <View className="items-center mb-4">
                  <View className="bg-green-100 rounded-full p-3 mb-2">
                    <Ionicons name="checkmark" size={32} color="#22C55E" />
                  </View>
                </View>
                <Text className="text-green-800 text-center text-xl font-semibold">
                  Reset Link Sent!
                </Text>
                <Text className="text-green-600 text-center mt-3 leading-5">
                  Please check your email inbox for instructions to reset your
                  password. The link will expire in 24 hours.
                </Text>
              </MotiView>
            )}
            <Link href="/" asChild>
              <TouchableOpacity
                className="mt-6"
                disabled={isLoading}
                testID="back-to-signin"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color="#0077B5"
                  />
                  <Text className="text-center text-[#0077B5] font-medium ml-2 text-base">
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
