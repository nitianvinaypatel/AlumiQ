import React, { memo } from "react";
import { useDrawer } from "./DrawerContext";
import SideDrawer from "./SideDrawer";
import { StatusBar } from "react-native";

// This component will be rendered at the root level of the app
// Using memo to prevent unnecessary re-renders
const SideDrawerRoot: React.FC = memo(() => {
  const { isDrawerVisible, closeDrawer, isDarkMode } = useDrawer();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <SideDrawer isVisible={isDrawerVisible} onClose={closeDrawer} />
    </>
  );
});

export default SideDrawerRoot;
