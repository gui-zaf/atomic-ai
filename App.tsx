import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TokenProvider } from "./context/TokenContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppContent from "./components/AppContent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <AppContent />
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}
