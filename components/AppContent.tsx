import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";
import { WelcomeCreator } from "./WelcomeCreator";
import { ChatMessages } from "./ChatMessages";
import ChatInput from "./ChatInput";
import SideMenu from "./SideMenu";
import { useTheme } from "../context/ThemeContext";
import { Message, sampleImages } from "../types";

const AppContent = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);

  // Gesture handling for swipe to open menu - ONLY for the main content area
  const mainContentPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only activate for touches at the left edge of the screen
        return !menuVisible && evt.nativeEvent.pageX < 20;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to significant horizontal movements from the left edge
        // AND ensure we don't interfere with vertical scrolling
        return (
          !menuVisible &&
          gestureState.dx > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 &&
          gestureState.dx > 0
        );
      },
      onPanResponderMove: (_, gestureState) => {
        // As soon as we detect significant rightward movement, open the menu
        if (!menuVisible && gestureState.dx > 50) {
          setMenuVisible(true);
        }
      },
      onPanResponderRelease: () => {
        // No additional handling needed
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const handleToggleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };

    let aiMessage: Message;

    // Check if this is an image generation command
    if (message.toLowerCase().startsWith("/image")) {
      // Get the prompt from the message
      const prompt = message.substring(6).trim();

      // Random sample image for demo purposes
      const randomImage =
        sampleImages[Math.floor(Math.random() * sampleImages.length)];

      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: prompt
          ? `Here's your "${prompt}" image! ✨`
          : "Here's your generated image! ✨",
        isUser: false,
        image: randomImage,
      };
    } else {
      // For all other messages, including suggestion messages, just send a regular text response
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated AI response. You can replace this with actual AI responses.",
        isUser: false,
      };
    }

    setMessages((prev) => [...prev, userMessage, aiMessage]);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    // Close keyboard when opening menu
    Keyboard.dismiss();
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* This wrapper ensures tapping anywhere dismisses keyboard */}
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View style={styles.container}>
          <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            {/* Main content area where menu swipe gestures work */}
            <View
              style={styles.mainContentArea}
              {...mainContentPanResponder.panHandlers}
            >
              <Header onMenuPress={toggleMenu} />
              {messages.length === 0 ? (
                <WelcomeCreator />
              ) : (
                <ChatMessages
                  messages={messages}
                  likedMessages={likedMessages}
                  onToggleLike={handleToggleLike}
                />
              )}
            </View>
          </SafeAreaView>

          <SafeAreaView edges={["bottom"]}>
            {/* 
              Input area that handles its own gestures.
              pointerEvents="box-none" means this View doesn't receive touch events,
              but its children do. This prevents the parent's pan responder from
              interfering with the carousel's scroll.
            */}
            <View pointerEvents="box-none">
              <ChatInput onSend={handleSendMessage} />
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>

      <SideMenu
        isVisible={menuVisible}
        onClose={handleCloseMenu}
        darkMode={isDarkMode}
        onToggleDarkMode={toggleTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentArea: {
    flex: 1,
  },
});

export default AppContent;
