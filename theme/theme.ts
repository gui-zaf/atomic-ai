export const lightColors = {
  // Primary colors
  primary: "#0071E3",
  primaryBackground: "#EDF6FF",

  // Background colors
  background: "#FFFFFF",
  surface: "#F5F5F7",

  // Text colors
  text: "#272729",
  subtext: "#979798",

  // Icon colors
  icon: {
    active: "#0071E3",
    disabled: "#979798",
  },

  // Error color
  error: "#FF3B30",
} as const;

export const darkColors = {
  // Primary colors
  primary: "#0A84FF",
  primaryBackground: "#1C1C1E",

  // Background colors
  background: "#151a21",
  surface: "#0e1117",
  menuBackground: "#0e1117",

  // Text colors
  text: "#FFFFFF",
  subtext: "#8E8E93",

  // Icon colors
  icon: {
    active: "#0A84FF",
    disabled: "#8E8E93",
  },

  // Error color
  error: "#FF453A",

  // Switch colors
  switchTrack: "#181818",
} as const;

export const colors = lightColors;

export const theme = {
  light: {
    colors: lightColors,
  },
  dark: {
    colors: darkColors,
  },
  current: "light",
} as const;

export type Theme = typeof theme;

export type ColorScheme = "light" | "dark";
