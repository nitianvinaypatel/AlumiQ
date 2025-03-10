import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Navigate to the tabs after splash screen - using the correct path format
      router.replace("/(tabs)/home" as any);
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.appName}>AlumiQ</Text>
        <Text style={styles.tagline}>Connect with your university network</Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077B5" />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Where alumni connections thrive</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={20} color="#0077B5" />
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="briefcase" size={20} color="#0077B5" />
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={20} color="#0077B5" />
          </View>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#0077B5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0077B5",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    position: "absolute",
    top: height * 0.5,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: width * 0.6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E1F0FA",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
});
