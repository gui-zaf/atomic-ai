import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
  PanResponder,
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        // Se o movimento for principalmente vertical, o ScrollView deve assumir.
        return Math.abs(dy) > 5 && Math.abs(dy) > Math.abs(dx);
      },
      // Permite que outras views se tornem o 'responder'. Importante para botões filhos.
      onPanResponderTerminationRequest: () => true,
    }),
  ).current;

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
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
      {...panResponder.panHandlers}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          image={message.image}
          isLiked={likedMessages.has(message.id)}
          onToggleLike={() => onToggleLike(message.id)}
          timestamp={message.timestamp}
          isGenerating={message.isGenerating}
        />
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
});
