import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
import {
  useNavigation,
  useIsFocused,
  CommonActions,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LoadingBubble } from "../components/LoadingBubble";
import { useTokens } from "../context/TokenContext";
import { useHistory } from "../context/HistoryContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendChatMessage } from "../config/api";

// Chave para armazenar as mensagens no AsyncStorage
const MESSAGES_STORAGE_KEY = '@atomic_chat_messages';
const LIKED_MESSAGES_STORAGE_KEY = '@atomic_chat_liked_messages';
const CONTEXT_ID_STORAGE_KEY = '@atomic_chat_context_id';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const keyboardAnimation = useKeyboardAnimation(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );

  const { tokens } = useTokens();
  const { addHistoryItem } = useHistory();

  useEffect(() => {
    setIsBackgroundLoaded(false);
  }, [isDarkMode]);

  // Carregar mensagens do AsyncStorage ao iniciar o aplicativo
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        const storedLikedMessages = await AsyncStorage.getItem(LIKED_MESSAGES_STORAGE_KEY);
        
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          // Converter strings de data de volta para objetos Date
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        }
        
        if (storedLikedMessages) {
          const parsedLikedMessages = JSON.parse(storedLikedMessages);
          setLikedMessages(new Set(parsedLikedMessages));
        }
        
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setIsInitialLoad(false);
      }
    };

    loadMessages();
  }, []);

  // Add initial welcome message and update it when language changes
  useEffect(() => {
    if (messages.length === 0 && !isInitialLoad) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const welcomeMessage = {
          id: Date.now().toString(),
          text: t("welcomeMessage"),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        // Salvar a mensagem de boas-vindas no AsyncStorage
        saveMessagesToStorage([welcomeMessage]);
      }, 1500);
    } else if (messages.length === 1 && !messages[0].isUser) {
      // If there's only the welcome message, update it when language changes
      const updatedWelcomeMessage = {
        id: messages[0].id,
        text: t("welcomeMessage"),
        isUser: false,
        timestamp: messages[0].timestamp,
      };
      setMessages([updatedWelcomeMessage]);
      // Atualizar a mensagem de boas-vindas no AsyncStorage
      saveMessagesToStorage([updatedWelcomeMessage]);
    }
  }, [language, t, isInitialLoad]);

  // Salvar mensagens no AsyncStorage sempre que houver mudanças
  useEffect(() => {
    if (!isInitialLoad) {
      saveMessagesToStorage(messages);
    }
  }, [messages, isInitialLoad]);

  // Salvar mensagens curtidas no AsyncStorage sempre que houver mudanças
  useEffect(() => {
    if (!isInitialLoad) {
      saveLikedMessagesToStorage(likedMessages);
    }
  }, [likedMessages, isInitialLoad]);

  // Função para salvar mensagens no AsyncStorage
  const saveMessagesToStorage = async (messagesToSave: Message[]) => {
    try {
      // Precisamos converter as datas para string antes de salvar
      const messagesToStore = messagesToSave.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? msg.timestamp.toISOString() : new Date().toISOString()
      }));
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  };

  // Função para salvar mensagens curtidas no AsyncStorage
  const saveLikedMessagesToStorage = async (likedMessagesToSave: Set<string>) => {
    try {
      const likedMessagesArray = Array.from(likedMessagesToSave);
      await AsyncStorage.setItem(LIKED_MESSAGES_STORAGE_KEY, JSON.stringify(likedMessagesArray));
    } catch (error) {
      console.error('Erro ao salvar mensagens curtidas:', error);
    }
  };

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
              routes: [{ name: "Home" }],
            }),
          );
        }, 0);
      }
    } else if (!isFocused) {
      prevFocusedRef.current = false;
    }
  }, [isFocused, navigation]);

  const handleToggleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.has(messageId) ? newSet.delete(messageId) : newSet.add(messageId);
      return newSet;
    });
  };

  const handleSendMessage = async (message: string) => {
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const userMessage: Message = {
      id: timestamp.toString(),
      text: message,
      isUser: true,
      timestamp: currentDate,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show loading for AI response
    setIsLoading(true);

    let imageFile: string | undefined;
    let isImageGeneration = false;
    let prompt = message;
    let aiResponseText = "";

    // Check if the message starts with /image command
    const isImageCommand = message.toLowerCase().startsWith("/image");

    if (isImageCommand) {
      prompt = message.substring(6).trim();
      isImageGeneration = true;
    }

    // Check if the message matches any of our predefined suggestion descriptions
    // even without the /image command
    const matchingImage = imageDescriptionMapping.find(
      (mapping) =>
        mapping.english === message || mapping.portuguese === message,
    );

    if (matchingImage) {
      imageFile = `../assets/samples/${matchingImage.filename}.jpeg`;
      isImageGeneration = true;
    } else if (isImageGeneration) {
      // If it was an image command but didn't match any predefined suggestion
      // use a random sample as fallback
      imageFile =
        sampleImages[Math.floor(Math.random() * sampleImages.length)];
    }

    // Se não for geração de imagem, enviar para a API
    if (!isImageGeneration) {
      try {
        // Obter o contextId do AsyncStorage ou criar um novo
        let contextId = await AsyncStorage.getItem(CONTEXT_ID_STORAGE_KEY);
        
        const data = await sendChatMessage(message, contextId || undefined);
        
        // Salvar o contextId para futuras requisições
        if (data.contextId) {
          await AsyncStorage.setItem(CONTEXT_ID_STORAGE_KEY, data.contextId);
        }
        
        aiResponseText = data.response;
      } catch (error) {
        console.error('Erro ao chamar a API:', error);
        
        // Usar a mensagem de erro do LanguageContext
        aiResponseText = t("apiError");
        
        // Adicionar o erro ao histórico
        addHistoryItem({
          id: (timestamp + 3).toString(),
          timestamp: new Date(),
          type: "error",
          error: t("apiError"),
          tokensUsed: 0,
          expanded: false,
        });
      }
    }

    const responseTimestamp = new Date(timestamp + 1500);
    const aiMessage: Message = {
      id: (timestamp + 1).toString(),
      text: isImageGeneration
        ? `${prompt}`
        : aiResponseText || "This is a simulated AI response. You can replace this with actual AI responses.",
      isUser: false,
      timestamp: responseTimestamp,
      ...(isImageGeneration && {
        image: imageFile,
        isGenerating: true,
      }),
    };

    setIsLoading(false);
    setMessages((prev) => [...prev, aiMessage]);

    // Add to history
    if (isImageGeneration) {
      addHistoryItem({
        id: (timestamp + 2).toString(),
        timestamp: new Date(),
        type: "image",
        prompt: prompt,
        tokensUsed: 1,
        model: "DALL-E",
        expanded: false,
      });
    } else {
      addHistoryItem({
        id: (timestamp + 2).toString(),
        timestamp: new Date(),
        type: "simulated",
        prompt: message,
        response: aiMessage.text,
        tokensUsed: 1,
        expanded: false,
      });
    }
  };

  const handleSendAIMessage = (message: string) => {
    const timestamp = Date.now();
    const aiMessage: Message = {
      id: timestamp.toString(),
      text: message,
      isUser: false,
      timestamp: new Date(timestamp),
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Add error to history
    if (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("failed")
    ) {
      addHistoryItem({
        id: (timestamp + 1).toString(),
        timestamp: new Date(),
        type: "error",
        error: t("historyApiErrorDetail"),
        tokensUsed: 0,
        expanded: false,
      });
    }
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
    navigation.navigate("TokenStore");
  };

  const openGallery = () => {
    handleCloseMenu();
    navigation.navigate("Support");
  };

  const openDevelopers = () => {
    handleCloseMenu();
    navigation.navigate("Developers");
  };

  const openHistory = () => {
    handleCloseMenu();
    navigation.navigate("History");
  };

  const openAbout = () => {
    handleCloseMenu();
    navigation.navigate("About");
  };

  const resetChat = () => {
    setIsLoading(true);
    setMessages([]);
    setLikedMessages(new Set());
    setMenuVisible(false);

    // Limpar mensagens do AsyncStorage
    AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
    AsyncStorage.removeItem(LIKED_MESSAGES_STORAGE_KEY);

    setTimeout(() => {
      setIsLoading(false);
      const welcomeMessage = {
        id: Date.now().toString(),
        text: t("welcomeMessage"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      // Salvar a nova mensagem de boas-vindas no AsyncStorage
      saveMessagesToStorage([welcomeMessage]);
    }, 1500);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          transform: [
            {
              translateY: keyboardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        },
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
              transform: [
                {
                  scale: keyboardAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
              opacity: keyboardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
              }),
            },
          ]}
        >
          <View
            style={[
              styles.solidBackground,
              { backgroundColor: colors.background },
            ]}
          />
        </Animated.View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
              {/* Main content area */}
              <View style={styles.mainContentArea}>
                <Header
                  onMenuPress={toggleMenu}
                  onTokenPress={openTokenStore}
                />
                <ChatMessages
                  messages={messages}
                  likedMessages={likedMessages}
                  onToggleLike={handleToggleLike}
                />
                {isLoading && <LoadingBubble />}
              </View>
            </SafeAreaView>

            <View style={styles.inputContainer}>
              <SafeAreaView edges={["bottom"]}>
                <View pointerEvents="box-none">
                  <ChatInput
                    onSend={handleSendMessage}
                    onSendAIMessage={handleSendAIMessage}
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
    position: "relative",
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  solidBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inputContainer: {
    position: "relative",
    zIndex: 10,
    marginTop: "auto",
    paddingTop: 16,
  },
});

export default HomeScreen;
