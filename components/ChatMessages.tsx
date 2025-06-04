import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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