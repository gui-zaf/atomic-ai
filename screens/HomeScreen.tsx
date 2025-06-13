import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
  Animated,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { ChatMessages } from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import SideMenu from "../components/SideMenu";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Message, sampleImages, imageDescriptionMapping } from "../types";
import { useKeyboardAnimation } from "../components/hooks/useKeyboardAnimation";
import { useNavigation, useIsFocused, CommonActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LoadingBubble } from "../components/LoadingBubble";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const isFocused = useIsFocused();
  const prevFocusedRef = useRef(false);
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const keyboardAnimation = useKeyboardAnimation(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false)
  );
  
  useEffect(() => {
    setIsBackgroundLoaded(false);
  }, [isDarkMode]);

  // Add initial welcome message and update it when language changes
  useEffect(() => {
    if (messages.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMessages([{
          id: Date.now().toString(),
          text: t('welcomeMessage'),
          isUser: false,
        }]);
      }, 1500);
    } else if (messages.length === 1 && !messages[0].isUser) {
      // If there's only the welcome message, update it
      setMessages([{
        id: Date.now().toString(),
        text: t('welcomeMessage'),
        isUser: false,
      }]);
    }
  }, [language, t]);

  // Effect to handle navigation stack reset when Home screen is focused
  useEffect(() => {
    if (isFocused && !prevFocusedRef.current) {
      prevFocusedRef.current = true;
      
      // Clear the navigation stack only if we arrived from another screen
      const state = navigation.getState();
      if (state.routes.length > 1) {
        // Set timeout to avoid doing this during render
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }, 0);
      }
    } else if (!isFocused) {
      prevFocusedRef.current = false;
    }
  }, [isFocused, navigation]);

  const mainContentPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => 
        !menuVisible && evt.nativeEvent.pageX < 20,
      onMoveShouldSetPanResponder: (_, gestureState) => 
        !menuVisible &&
        gestureState.dx > 20 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 &&
        gestureState.dx > 0,
      onPanResponderMove: (_, gestureState) => {
        if (!menuVisible && gestureState.dx > 50) {
          setMenuVisible(true);
        }
      },
      onPanResponderRelease: () => {},
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const handleToggleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.has(messageId) ? newSet.delete(messageId) : newSet.add(messageId);
      return newSet;
    });
  };

  const handleSendMessage = (message: string) => {
    const timestamp = Date.now();
    const userMessage: Message = {
      id: timestamp.toString(),
      text: message,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Show loading for AI response
    setIsLoading(true);
    
    setTimeout(() => {
      let imageFile: string | undefined;
      let isImageGeneration = false;
      let prompt = message;
      
      // Check if the message starts with /image command
      const isImageCommand = message.toLowerCase().startsWith("/image");
      
      if (isImageCommand) {
        prompt = message.substring(6).trim();
        isImageGeneration = true;
      }
      
      // Check if the message matches any of our predefined suggestion descriptions
      // even without the /image command
      const matchingImage = imageDescriptionMapping.find(
        mapping => mapping.english === message || mapping.portuguese === message
      );
      
      if (matchingImage) {
        imageFile = `../assets/samples/${matchingImage.filename}.jpeg`;
        isImageGeneration = true;
      } else if (isImageGeneration) {
        // If it was an image command but didn't match any predefined suggestion
        // use a random sample as fallback
        imageFile = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      }
      
      const aiMessage: Message = {
        id: (timestamp + 1).toString(),
        text: isImageGeneration
          ? `Here's your "${prompt}" image! ✨`
          : "This is a simulated AI response. You can replace this with actual AI responses.",
        isUser: false,
        ...(isImageGeneration && { image: imageFile }),
      };
      
      setIsLoading(false);
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Keyboard.dismiss();
    setIsInputFocused(false);
  };

  const handleCloseMenu = () => setMenuVisible(false);

  // Navigation functions
  const openTokenStore = () => {
    handleCloseMenu();
    navigation.navigate('TokenStore');
  };

  const openGallery = () => {
    handleCloseMenu();
    navigation.navigate('Gallery');
  };
  
  const openDevelopers = () => {
    handleCloseMenu();
    navigation.navigate('Developers');
  };

  const openHistory = () => {
    handleCloseMenu();
    navigation.navigate('History');
  };

  const openAbout = () => {
    handleCloseMenu();
    navigation.navigate('About');
  };

  const resetChat = () => {
    setIsLoading(true);
    setMessages([]);
    setLikedMessages(new Set());
    setMenuVisible(false);

    setTimeout(() => {
      setIsLoading(false);
      setMessages([{
        id: Date.now().toString(),
        text: t('welcomeMessage'),
        isUser: false,
      }]);
    }, 1500);
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          transform: [{
            translateY: keyboardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10],
            })
          }]
        }
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Main App Content */}
      <View style={styles.container}>
        {/* Background Image - Animated */}
        <Animated.View 
          style={[
            styles.backgroundContainer,
            {
              transform: [{
                scale: keyboardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }],
              opacity: keyboardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
              })
            }
          ]}
        >
          <View style={[styles.solidBackground, { backgroundColor: colors.background }]} />
          <Image
            source={isDarkMode 
              ? require('../assets/dark-background.png') 
              : require('../assets/white-background.png')}
            style={[
              styles.backgroundImage,
              { opacity: isBackgroundLoaded ? 1 : 0 }
            ]}
            onLoad={() => setIsBackgroundLoaded(true)}
            onError={() => {/* Background image load error */}}
          />
        </Animated.View>

        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={styles.container}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
              {/* Main content area */}
              <View style={styles.mainContentArea}>
                <Header onMenuPress={toggleMenu} onTokenPress={openTokenStore} />
                <ChatMessages
                  messages={messages}
                  likedMessages={likedMessages}
                  onToggleLike={handleToggleLike}
                />
                {isLoading && <LoadingBubble />}
              </View>
              
              <View 
                style={styles.edgeSwipeArea}
                {...mainContentPanResponder.panHandlers}
              />
            </SafeAreaView>

            <View style={styles.inputContainer}>
              <SafeAreaView edges={["bottom"]}>
                <View pointerEvents="box-none">
                  <ChatInput 
                    onSend={handleSendMessage}
                    onFocusChange={setIsInputFocused}
                  />
                </View>
              </SafeAreaView>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <SideMenu
          isVisible={menuVisible}
          onClose={handleCloseMenu}
          darkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
          onBuyTokens={openTokenStore}
          onNewChat={resetChat}
          onOpenGallery={openGallery}
          onOpenDevelopers={openDevelopers}
          onOpenHistory={openHistory}
          onOpenAbout={openAbout}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentArea: {
    flex: 1,
    position: 'relative',
  },
  edgeSwipeArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  solidBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    position: 'relative',
    zIndex: 10,
    marginTop: 'auto',
    paddingTop: 16,
  },
});

export default HomeScreen; 