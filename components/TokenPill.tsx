import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokens } from "../context/TokenContext";
import { useTheme } from "../context/ThemeContext";

const TokenPill = () => {
  const { tokens } = useTokens();
  const { colors } = useTheme();
  const isZero = tokens === 0;

  // Error colors for light/dark mode
  const errorColor = colors.error;
  const errorBgColor =
    colors.text === "#FFFFFF"
      ? "rgba(255, 69, 58, 0.2)"
      : "rgba(255, 59, 48, 0.1)";

  return (
    <View
      style={[
        styles.tokenPill,
        { backgroundColor: colors.surface },
        isZero && { backgroundColor: errorBgColor },
      ]}
    >
      <Ionicons
        name="flash"
        size={16}
        color={isZero ? errorColor : colors.primary}
      />
      <Text
        style={[
          styles.tokenCount,
          { color: colors.primary },
          isZero && { color: errorColor },
        ]}
      >
        {tokens}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tokenPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  tokenCount: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TokenPill;
