import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
  View,
} from "react-native";
import { ChatBubble } from "./ChatBubble";
import { Message } from "../types";

interface ChatMessagesProps {
  messages: Message[];
  likedMessages: Set<string>;
  onToggleLike: (id: string) => void;
}

export const ChatMessages = ({
  messages,
  likedMessages,
  onToggleLike,
}: ChatMessagesProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      alwaysBounceVertical={true}
      bounces={true}
      directionalLockEnabled={false}
      scrollEventThrottle={16}
      decelerationRate="normal"
      nestedScrollEnabled={true}
      overScrollMode="always"
      removeClippedSubviews={false}
      pinchGestureEnabled={false}
    >
      {messages.map((message, index) => (
        <View 
          key={message.id}
          style={
            index === 0 
              ? styles.firstBubbleContainer 
              : index === messages.length - 1 
                ? isKeyboardVisible 
                  ? styles.lastBubbleContainerKeyboard 
                  : styles.lastBubbleContainer 
                : undefined
          }
        >
          <ChatBubble
            message={message.text}
            isUser={message.isUser}
            image={message.image}
            isLiked={likedMessages.has(message.id)}
            onToggleLike={() => onToggleLike(message.id)}
            timestamp={message.timestamp}
            isGenerating={message.isGenerating}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  firstBubbleContainer: {
    marginTop: 60,
  },
  lastBubbleContainer: {
    marginBottom: 140,
  },
  lastBubbleContainerKeyboard: {
    marginBottom: 20,
  },
});
