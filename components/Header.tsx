import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/theme";
import TokenPill from "./TokenPill";

export const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons
          name="menu"
          size={24}
          color={colors.text}
          style={styles.icon}
        />
      </TouchableOpacity> 

      <Text style={styles.title}>Atomic Chat</Text>

      <TokenPill />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    color: colors.text,
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
