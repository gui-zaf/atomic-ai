import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export const WelcomeCreator = () => {
  const { colors } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Ionicons name="sparkles" size={42} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>What will you create?</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 28,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});
