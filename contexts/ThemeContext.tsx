import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// Define the theme colors and properties
export type ThemeColors = {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  iconBackground: string;
  divider: string;
  primary: string;
  profileGradient: readonly [string, string];
  profileTextColor: string;
  toggleBackground: string;
  toggleIndicator: string;
  badgeBackground: string;
  badgeText: string;
  inputBackground: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  surfaceBackground: string;
  elevation: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme values
export const defaultTheme: ThemeColors = {
  primary: "#0077B5",
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  divider: "#E5E5E5",
  iconBackground: "#F5F5F5",
  cardBackground: "#FFFFFF",
  badgeBackground: "#E3F2FD",
  badgeText: "#0077B5",
  toggleBackground: "#E5E5E5",
  toggleIndicator: "#FFFFFF",
  profileTextColor: "#FFFFFF",
  profileGradient: ["#0077B5", "#00A0DC"] as const,
  border: "#D1D5DB",
  inputBackground: "#F3F4F6",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  surfaceBackground: "#FFFFFF",
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};

// Create the light and dark theme colors
export const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  cardBackground: "#B4CAEC",
  text: "#191919",
  textSecondary: "#4B5563",
  iconBackground: "rgba(10,102,194,0.1)",
  divider: "#E0E0E0",
  primary: "#0A66C2",
  profileGradient: ["#0A66C2", "#077B8A"] as const,
  profileTextColor: "#FFFFFF",
  toggleBackground: "#9CA3AF",
  toggleIndicator: "#FFFFFF",
  badgeBackground: "#EF4444",
  badgeText: "#FFFFFF",
  inputBackground: "#F3F4F6",
  border: "#D1D5DB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  surfaceBackground: "#FFFFFF",
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const darkTheme: ThemeColors = {
  background: "#18191A",
  cardBackground: "#242526",
  text: "#E4E6EB",
  textSecondary: "#B0B3B8",
  iconBackground: "rgba(255,255,255,0.1)",
  divider: "#3E4042",
  primary: "#0A66C2",
  profileGradient: ["#0A66C2", "#077B8A"] as const,
  profileTextColor: "#FFFFFF",
  toggleBackground: "#0A66C2",
  toggleIndicator: "#FFFFFF",
  badgeBackground: "#EF4444",
  badgeText: "#FFFFFF",
  inputBackground: "#3A3B3C",
  border: "#4E4F50",
  success: "#059669",
  error: "#DC2626",
  warning: "#D97706",
  info: "#2563EB",
  surfaceBackground: "#242526",
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>("light");

  // Load theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      } else if (systemTheme) {
        setTheme(systemTheme);
      }
    };
    loadTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
