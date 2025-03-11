import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Dimensions,
  Keyboard,
  ScrollView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { signIn, clearError } from "@/app/store/slices/authSlice";
import { BlurView } from "expo-blur";
import { MotiView, AnimatePresence } from "moti";
import { SharedElement } from "react-navigation-shared-element";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  error?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "next" | "go";
  blurOnSubmit?: boolean;
  ref?: React.RefObject<TextInput>;
  testID?: string;
}

const InputField = React.forwardRef<TextInput, InputFieldProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      icon,
      secureTextEntry,
      keyboardType = "default",
      error,
      onSubmitEditing,
      returnKeyType,
      blurOnSubmit,
      testID,
    },
    ref
  ) => {
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
            shadowColor: isFocused ? "#0077B5" : "#000",
            shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
            shadowOpacity: isFocused ? 0.2 : 0.1,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 4 : 2,
          }}
          className={`bg-white/90 rounded-xl overflow-hidden
          ${isFocused ? "border-[#0077B5] border" : "border-gray-100 border"}
          ${error ? "border-red-400" : ""}`}
          testID={`${testID}-container`}
        >
          <BlurView
            intensity={80}
            tint="light"
            className="flex-row items-center"
          >
            <View className="px-4 py-3.5">
              <Ionicons
                name={icon}
                size={20}
                color={isFocused ? "#0077B5" : error ? "#EF4444" : "#94A3B8"}
              />
            </View>
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize="none"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-1 py-3.5 text-gray-700 pr-4 font-medium"
              placeholderTextColor="#94A3B8"
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKeyType}
              blurOnSubmit={blurOnSubmit}
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
              className="mt-1"
              testID={`${testID}-error`}
            >
              <Text className="text-red-500 text-sm ml-1">{error}</Text>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    );
  }
);

const SocialButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  onPress: () => void;
  testID?: string;
}> = ({ icon, color, label, onPress, testID }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-white/95 p-4 rounded-2xl border border-gray-200 flex-row items-center justify-center px-10 space-x-3"
        testID={testID}
        activeOpacity={0.9}
      >
        <Ionicons name={icon} size={24} color={color} />
        <Text className="text-gray-900 font-semibold text-base">{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const logoAnimatedValue = useRef(new Animated.Value(1)).current;

  // Derived animated values for the logo
  const logoScale = logoAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
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
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail(email.trim());
    const isPasswordValid = validatePassword(password.trim());

    if (isEmailValid && isPasswordValid) {
      Keyboard.dismiss();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(signIn({ email: email.trim(), password: password.trim() }));
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSocialSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // Implement social sign-in logic
  };

  const gradientColors = useMemo(() => ["#ffffff", "#f3f4f6", "#e5e7eb"], []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID="login-screen"
    >
      <StatusBar style="dark" />
      <LinearGradient colors={gradientColors} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScale }],
            }}
            className={`${keyboardVisible ? "mt-10 mb-6" : "mt-20 mb-10"}`}
          >
            <SharedElement id="alumiq-logo">
              <Animated.View
                style={{
                  transform: [{ translateY: logoTranslateY }],
                }}
              >
                <Image
                  source={require("@/assets/images/AlumiQ.png")}
                  className="w-24 h-24 self-center rounded-full"
                  resizeMode="contain"
                />
              </Animated.View>
            </SharedElement>

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 1000 }}
              className={keyboardVisible ? "hidden" : ""}
            >
              <Text className="text-3xl font-bold text-center text-gray-800 mt-4">
                Welcome Back
              </Text>
              <Text className="text-center text-gray-500 mt-2">
                Sign in to continue to AlumiQ
              </Text>
            </MotiView>
          </Animated.View>

          <View className="space-y-4 gap-4">
            <AnimatePresence>
              {error && (
                <MotiView
                  from={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  transition={{ type: "timing", duration: 300 }}
                  className="bg-red-50 p-4 rounded-xl backdrop-blur-lg"
                  testID="login-error"
                >
                  <Text className="text-red-500 text-center">{error}</Text>
                </MotiView>
              )}
            </AnimatePresence>

            <InputField
              ref={emailRef}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              placeholder="Email"
              icon="mail-outline"
              keyboardType="email-address"
              error={emailError}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              testID="email-input"
            />

            <View className="relative">
              <InputField
                ref={passwordRef}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                placeholder="Password"
                icon="lock-closed-outline"
                secureTextEntry={!showPassword}
                error={passwordError}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                testID="password-input"
              />
              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="absolute right-4 top-4"
                testID="toggle-password-visibility"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }],
                shadowColor: "#0077B5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  animateButton();
                  handleLogin();
                }}
                className={`bg-[#0077B5] mt-6 rounded-xl py-4 ${
                  isLoading ? "opacity-70" : ""
                }`}
                disabled={isLoading}
                testID="sign-in-button"
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              className="mt-4"
              testID="forgot-password-link"
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <Link href="/(auth)/forgot-password" asChild>
                <Text className="text-center text-[#0077B5] font-medium">
                  Forgot Password?
                </Text>
              </Link>
            </TouchableOpacity>

            <View className="mt-8">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-gray-500">or continue with</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              <View className="flex-col justify-center space-y-4 gap-3">
                <SocialButton
                  icon="logo-google"
                  color="#DB4437"
                  label="Sign in with Google"
                  onPress={() => handleSocialSignIn("Google")}
                  testID="google-sign-in"
                />

                <SocialButton
                  icon="logo-facebook"
                  color="#1877F2"
                  label="Sign in with Facebook"
                  onPress={() => handleSocialSignIn("Facebook")}
                  testID="facebook-sign-in"
                />
              </View>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Don't have an account?</Text>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity
                    className="ml-1"
                    testID="signup-link"
                    onPress={() =>
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }
                  >
                    <Text className="text-[#0077B5] font-semibold">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
