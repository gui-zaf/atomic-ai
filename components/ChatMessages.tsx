import React from 'react';
import { StyleSheet, ScrollView, Keyboard } from 'react-native';
import { ChatBubble } from './ChatBubble';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
      onTouchStart={Keyboard.dismiss}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
}); 