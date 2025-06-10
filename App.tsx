import { StatusBar } from "expo-status-bar";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WelcomeCreator } from "./components/WelcomeCreator";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { colors } from "./theme/theme";
import { useState, useRef, useEffect } from "react";
import { TokenProvider } from "./context/TokenContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SideMenu from "./components/SideMenu";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

// Sample images for demo purposes
const sampleImages = [
  'sample01', 'sample02', 'sample03', 'sample04'
];

const AppContent = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Gesture handling for swipe to open menu
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only activate for touches at the left edge of the screen
        return !menuVisible && evt.nativeEvent.pageX < 20;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to significant horizontal movements from the left edge
        return !menuVisible && 
               gestureState.dx > 20 && 
               Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
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
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: prompt ? 
          `Here's your "${prompt}" image! ✨` : 
          "Here's your generated image! ✨",
        isUser: false,
        image: randomImage,
      };
    } 
    else {
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
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.background }
      ]} 
      {...panResponder.panHandlers}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* This wrapper ensures tapping anywhere dismisses keyboard */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={styles.container}>
          <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
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
          </SafeAreaView>
          
          <SafeAreaView edges={["bottom"]}>
            <ChatInput onSend={handleSendMessage} />
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
});

export default function App() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
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
