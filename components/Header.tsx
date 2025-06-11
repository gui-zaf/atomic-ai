import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TokenPill from "./TokenPill";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  onMenuPress: () => void;
  onTokenPress?: () => void;
}

export const Header = ({ onMenuPress, onTokenPress }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
        <Ionicons
          name="menu"
          size={24}
          color={colors.text}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Atomic Chat</Text>

      <TokenPill onPress={onTokenPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    opacity: 0.7,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    opacity: 0.7,
  },
});
