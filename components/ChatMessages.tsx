import React, { useRef, useEffect } from "react";
import { StyleSheet, ScrollView, Keyboard, Platform } from "react-native";
import { ChatBubble } from "./ChatBubble";
import { Message } from "../types";

interface ChatMessagesProps {
  messages: Message[];
  likedMessages: Set<string>;
  onToggleLike: (messageId: string) => void;
}

export const ChatMessages = ({
  messages,
  likedMessages,
  onToggleLike,
}: ChatMessagesProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => keyboardShowListener.remove();
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
      directionalLockEnabled={true}
      scrollEventThrottle={16}
      decelerationRate="normal"
      nestedScrollEnabled={true}
      overScrollMode="always"
      removeClippedSubviews={false}
      pinchGestureEnabled={false}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          image={message.image}
          isLiked={likedMessages.has(message.id)}
          onToggleLike={() => onToggleLike(message.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    zIndex: 5,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 8,
    paddingTop: 8,
  },
});
