export const colors = {
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

export const theme = {
  colors,
} as const;

export type Theme = typeof theme;
