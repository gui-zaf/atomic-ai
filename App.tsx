import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TokenProvider } from "./context/TokenContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ImageViewerProvider } from "./context/ImageViewerContext";
import AppNavigator from "./navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalImageViewer from "./components/GlobalImageViewer";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <TokenProvider>
            <ImageViewerProvider>
              <SafeAreaProvider>
                <KeyboardAvoidingView
                  style={styles.container}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                  <AppNavigator />
                  <GlobalImageViewer />
                </KeyboardAvoidingView>
              </SafeAreaProvider>
            </ImageViewerProvider>
          </TokenProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
