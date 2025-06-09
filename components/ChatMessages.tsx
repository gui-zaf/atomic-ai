import React, { useRef, useEffect } from "react";
import { StyleSheet, ScrollView, Keyboard, Platform } from "react-native";
import { ChatBubble } from "./ChatBubble";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

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

  // Scroll to bottom when keyboard opens
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );

    return () => {
      keyboardShowListener.remove();
    };
  }, []);

  // Scroll to bottom when new messages arrive
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
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
});
