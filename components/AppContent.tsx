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
import { Header } from "./Header";
import { WelcomeCreator } from "./WelcomeCreator";
import { ChatMessages } from "./ChatMessages";
import ChatInput from "./ChatInput";
import SideMenu from "./SideMenu";
import { useTheme } from "../context/ThemeContext";
import { Message, sampleImages } from "../types";
import TokenStoreScreen from "../screens/TokenStoreScreen";
import { useKeyboardAnimation } from "./hooks/useKeyboardAnimation";

const AppContent = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  const [tokenStoreVisible, setTokenStoreVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  const keyboardAnimation = useKeyboardAnimation(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false)
  );
  
  useEffect(() => {
    setIsBackgroundLoaded(false);
  }, [isDarkMode]);

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

    const isImageCommand = message.toLowerCase().startsWith("/image");
    const aiMessage: Message = {
      id: (timestamp + 1).toString(),
      text: isImageCommand
        ? `Here's your "${message.substring(6).trim()}" image! ✨`
        : "This is a simulated AI response. You can replace this with actual AI responses.",
      isUser: false,
      ...(isImageCommand && {
        image: sampleImages[Math.floor(Math.random() * sampleImages.length)],
      }),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setShowWelcome(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Keyboard.dismiss();
    setIsInputFocused(false);
  };

  const handleCloseMenu = () => setMenuVisible(false);

  const openTokenStore = () => {
    setTokenStoreVisible(true);
    setMenuVisible(false);
  };

  const closeTokenStore = () => setTokenStoreVisible(false);

  const resetChat = () => {
    setMessages([]);
    setLikedMessages(new Set());
    setMenuVisible(false);
    setShowWelcome(true);
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
              outputRange: [0, -10], // Subtle upward movement when keyboard shows
            })
          }]
        }
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Main App Content */}
      <View 
        style={[
          styles.container, 
          { display: tokenStoreVisible ? 'none' : 'flex' }
        ]}
      >
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
              {/* Main content area - removed PanResponder to prevent scroll conflicts */}
              <View style={styles.mainContentArea}>
                <Header onMenuPress={toggleMenu} onTokenPress={openTokenStore} />
                {showWelcome && !isInputFocused && !menuVisible ? (
                  <WelcomeCreator />
                ) : (
                  <ChatMessages
                    messages={messages}
                    likedMessages={likedMessages}
                    onToggleLike={handleToggleLike}
                  />
                )}
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
        />
      </View>

      {tokenStoreVisible && (
        <TokenStoreScreen onClose={closeTokenStore} />
      )}
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

export default AppContent;
