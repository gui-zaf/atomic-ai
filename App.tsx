import { StatusBar } from "expo-status-bar";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WelcomeCreator } from "./components/WelcomeCreator";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { colors } from "./theme/theme";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

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

    if (message.toLowerCase() === "/image") {
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "Here's a black cat wearing a neon collar at a unicorn-themed party with rainbows! 🐱🌈✨",
        isUser: false,
        image: "sample01",
      };
    } else {
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated AI response. You can replace this with actual AI responses.",
        isUser: false,
      };
    }

    setMessages((prev) => [...prev, userMessage, aiMessage]);
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
              <Header />
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
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
