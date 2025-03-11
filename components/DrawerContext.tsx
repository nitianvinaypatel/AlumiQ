import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the context type
interface DrawerContextType {
  isDrawerVisible: boolean;
  isDarkMode: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDarkMode: () => void;
}

// Create the context with a default value
const DrawerContext = createContext<DrawerContextType>({
  isDrawerVisible: false,
  isDarkMode: false,
  toggleDrawer: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDarkMode: () => {},
});

// Create a provider component
export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference on initial render
  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const value = await AsyncStorage.getItem("@darkMode");
        if (value !== null) {
          setIsDarkMode(value === "true");
        }
      } catch (e) {
        console.log("Error loading dark mode preference");
      }
    };

    loadDarkModePreference();
  }, []);

  // Save dark mode preference when it changes
  useEffect(() => {
    const saveDarkModePreference = async () => {
      try {
        await AsyncStorage.setItem("@darkMode", isDarkMode ? "true" : "false");
      } catch (e) {
        console.log("Error saving dark mode preference");
      }
    };

    saveDarkModePreference();
  }, [isDarkMode]);

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev);
  };

  const openDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerVisible,
        isDarkMode,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        toggleDarkMode,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// Create a custom hook to use the drawer context
export const useDrawer = () => useContext(DrawerContext);

export default DrawerContext;
