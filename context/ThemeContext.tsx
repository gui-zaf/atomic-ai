import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme, lightColors, darkColors, ColorScheme } from "../theme/theme";

// Define a more flexible color type
type ColorType = {
  primary: string;
  primaryBackground: string;
  background: string;
  surface: string;
  text: string;
  subtext: string;
  icon: {
    active: string;
    disabled: string;
  };
  error: string;
  menuBackground?: string;
  switchTrack?: string;
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ColorType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setColorScheme(savedTheme);
        } else if (systemColorScheme) {
          // Use system preference if no saved preference
          setColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Get colors based on current scheme
  const colors = colorScheme === "dark" ? darkColors : lightColors;

  const toggleTheme = async () => {
    const newColorScheme: ColorScheme =
      colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newColorScheme);

    try {
      await AsyncStorage.setItem("theme", newColorScheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode: colorScheme === "dark",
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
