import React, { memo } from "react";
import { StatusBar } from "react-native";
import { useDrawer } from "./DrawerContext";
import SideDrawer from "./SideDrawer";
import { useTheme } from "../contexts/ThemeContext";

// This component will be rendered at the root level of the app
// Using memo to prevent unnecessary re-renders
const SideDrawerRoot: React.FC = memo(() => {
  const { isDrawerVisible, closeDrawer } = useDrawer();
  const { theme } = useTheme(); // Correctly accessing the theme value

  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"} // Fixed
        backgroundColor="transparent"
        translucent={true}
      />
      <SideDrawer isVisible={isDrawerVisible} onClose={closeDrawer} />
    </>
  );
});

export default SideDrawerRoot;
