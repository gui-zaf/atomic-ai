import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TokenStoreScreen from '../screens/TokenStoreScreen';
import GalleryScreen from '../screens/GalleryScreen';
import DevelopersScreen from '../screens/DevelopersScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';
import { useTheme } from '../context/ThemeContext';

// Define the stack navigator param list
export type RootStackParamList = {
  Home: undefined;
  TokenStore: undefined;
  Gallery: undefined;
  Developers: undefined;
  History: undefined;
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyle: { backgroundColor: colors.background },
          presentation: 'card',
          detachPreviousScreen: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TokenStore" component={TokenStoreScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Developers" component={DevelopersScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 