import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
  Animated,
  Image,
  ImageBackground,
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

const AppContent = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  const [tokenStoreVisible, setTokenStoreVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  
  // Resetar o estado de carregamento da imagem quando o tema mudar
  useEffect(() => {
    setIsBackgroundLoaded(false);
  }, [isDarkMode]);

  // Gesture handling for swipe to open menu - ONLY for the main content area
  const mainContentPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only activate for touches at the left edge of the screen
        return !menuVisible && evt.nativeEvent.pageX < 20;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to significant horizontal movements from the left edge
        // AND ensure we don't interfere with vertical scrolling
        return (
          !menuVisible &&
          gestureState.dx > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 &&
          gestureState.dx > 0
        );
      },
      onPanResponderMove: (_, gestureState) => {
        // As soon as we detect significant rightward movement, open the menu
        if (!menuVisible && gestureState.dx > 50) {
          setMenuVisible(true);
        }
      },
      onPanResponderRelease: () => {
        // No additional handling needed
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const handleToggleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };

    let aiMessage: Message;

    // Check if this is an image generation command
    if (message.toLowerCase().startsWith("/image")) {
      // Get the prompt from the message
      const prompt = message.substring(6).trim();

      // Random sample image for demo purposes
      const randomImage =
        sampleImages[Math.floor(Math.random() * sampleImages.length)];

      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: prompt
          ? `Here's your "${prompt}" image! ✨`
          : "Here's your generated image! ✨",
        isUser: false,
        image: randomImage,
      };
    } else {
      // For all other messages, including suggestion messages, just send a regular text response
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated AI response. You can replace this with actual AI responses.",
        isUser: false,
      };
    }

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setShowWelcome(false); // Esconder o WelcomeCreator quando houver mensagens
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    // Close keyboard when opening menu
    Keyboard.dismiss();
    setIsInputFocused(false);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const openTokenStore = () => {
    setTokenStoreVisible(true);
    setMenuVisible(false); // Close menu if open
  };

  const closeTokenStore = () => {
    setTokenStoreVisible(false);
  };

  const resetChat = () => {
    setMessages([]);
    setLikedMessages(new Set());
    setMenuVisible(false); // Close menu after resetting
    setShowWelcome(true); // Mostrar o WelcomeCreator quando o chat for resetado
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Main App Content */}
      <View 
        style={[
          styles.container, 
          { display: tokenStoreVisible ? 'none' : 'flex' }
        ]}
      >
        {/* Background Image - Moved outside SafeAreaView to extend beyond safe area */}
        <View style={styles.backgroundContainer}>
          <View style={[
            styles.solidBackground, 
            { backgroundColor: colors.background }
          ]} />
          <Image
            source={isDarkMode 
              ? require('../assets/dark-background.png') 
              : require('../assets/white-background.png')}
            style={[
              styles.backgroundImage,
              isBackgroundLoaded ? {} : { opacity: 0 }
            ]}
            onLoad={() => setIsBackgroundLoaded(true)}
            onError={() => console.log('Erro ao carregar a imagem de fundo')}
          />
        </View>

        {/* This wrapper ensures tapping anywhere dismisses keyboard */}
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          accessible={false}
        >
          <View style={styles.container}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
              {/* Main content area where menu swipe gestures work */}
              <View style={styles.mainContentArea}>
                {/* Edge swipe area for menu - positioned absolutely */}
                <View 
                  style={styles.edgeSwipeArea}
                  {...mainContentPanResponder.panHandlers}
                />
                
                <Header onMenuPress={toggleMenu} onTokenPress={openTokenStore} />
                {/* Mostra WelcomeCreator apenas se showWelcome=true e não houver input em foco */}
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
            </SafeAreaView>

            {/* Input container with extended blur effect */}
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

      {/* Token Store Screen */}
      {tokenStoreVisible && (
        <TokenStoreScreen onClose={closeTokenStore} />
      )}
    </View>
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
    width: 20, // Width of the edge area that responds to swipes
    zIndex: 10,
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
