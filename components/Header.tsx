import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TokenPill from "./TokenPill";
import { useTheme } from "../context/ThemeContext";
import { BlurView } from "expo-blur";
import { colors } from "../theme/theme";

interface HeaderProps {
  onMenuPress: () => void;
  onTokenPress?: () => void;
}

export const Header = ({ onMenuPress, onTokenPress }: HeaderProps) => {
  const { colors, isDarkMode } = useTheme();
  const isAndroid = Platform.OS === "android";

  return (
    <View style={styles.headerWrapper}>
      {isAndroid ? (
        <View
          style={[
            styles.blurContainer,
            {
              backgroundColor: colors.background,
              opacity: 0.9,
            },
          ]}
        />
      ) : (
        <BlurView
          intensity={40}
          tint={isDarkMode ? "dark" : "light"}
          style={styles.blurContainer}
        />
      )}

      <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    zIndex: 10,
    position: "absolute",
    width: "100%",
  },
  blurContainer: {
    width: "100%",
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    zIndex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    opacity: 1,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: 42,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    opacity: 1,
  },
});
