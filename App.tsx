import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeCreator } from './components/WelcomeCreator';
import { Header } from './components/Header';
import { ChatMessages } from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import { colors } from './theme/theme';
import { useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
  }>>([]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };
    
    // Simulate AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: "This is a simulated AI response. You can replace this with actual AI responses.",
      isUser: false,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="auto" />
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <Header />
          {messages.length === 0 ? (
            <WelcomeCreator />
          ) : (
            <ChatMessages messages={messages} />
          )}
        </SafeAreaView>
        <SafeAreaView edges={['bottom']}>
          <ChatInput onSend={handleSendMessage} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
