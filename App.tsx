import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeCreator } from './components/WelcomeCreator';
import ChatInput from './components/ChatInput';
import { colors } from './theme/theme';

export default function App() {
  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="auto" />
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <WelcomeCreator />
        </SafeAreaView>
        <SafeAreaView edges={['bottom']}>
          <ChatInput onSend={handleSendMessage} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
