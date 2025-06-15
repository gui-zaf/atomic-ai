import React from "react";
import { View, StyleSheet } from "react-native";
import { DotTypingAnimation } from "react-native-dot-typing";
import { useTheme } from "../context/ThemeContext";

export const LoadingBubble = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <DotTypingAnimation
        style={styles.dotsAnimation}
        dotColor={colors.text}
        dotMargin={10}
        dotSpeed={0.2}
        dotRadius={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    minHeight: 40,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  dotsAnimation: {
    alignSelf: "center",
    marginRight: 24,
    marginBottom: 12,
  },
});
