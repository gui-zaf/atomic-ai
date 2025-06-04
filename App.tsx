import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { WelcomeCreator } from './components/WelcomeCreator';
import { colors } from './theme/theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <WelcomeCreator />
      <StatusBar style="auto" />
    </View>
  );
}
