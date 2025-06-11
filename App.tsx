import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TokenProvider } from "./context/TokenContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AppContent from "./components/AppContent";

const AppWrapper = () => {
  const { colors } = useTheme();
  
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <AppContent />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <AppWrapper />
      </TokenProvider>
    </ThemeProvider>
  );
}
