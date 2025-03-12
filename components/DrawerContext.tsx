import React, { createContext, useState, useContext } from "react";

// Define the context type
interface DrawerContextType {
  isDrawerVisible: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

// Create the context with a default value
const DrawerContext = createContext<DrawerContextType>({
  isDrawerVisible: false,
  toggleDrawer: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
});

// Create a provider component
export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev);
  };

  const openDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerVisible,
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// Create a custom hook to use the drawer context
export const useDrawer = () => useContext(DrawerContext);

export default DrawerContext;
