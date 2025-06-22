import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { ChatBubble } from "../components/ChatBubble";
import { Message } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendSupportMessage, getRandomSupportName } from "../config/api";

// Storage keys
const SUPPORT_STATE_KEY = "support_screen_state";
const SUPPORT_MESSAGES_KEY = "support_messages";
const SUPPORT_TIME_KEY = "support_estimated_time";
const SUPPORT_CONTEXT_ID_KEY = "support_context_id";

type SupportScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Support"
>;

type Props = {
  navigation: SupportScreenNavigationProp;
};

type SupportScreenState = "initial" | "queue" | "chat";

const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [screenState, setScreenState] = useState<SupportScreenState>("initial");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [likedMessages] = useState(new Set<string>());
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [contextId, setContextId] = useState<string | undefined>(undefined);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load saved state on component mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(SUPPORT_STATE_KEY);
        const savedMessages = await AsyncStorage.getItem(SUPPORT_MESSAGES_KEY);
        const savedTime = await AsyncStorage.getItem(SUPPORT_TIME_KEY);
        const savedContextId = await AsyncStorage.getItem(SUPPORT_CONTEXT_ID_KEY);

        if (savedState) {
          setScreenState(savedState as SupportScreenState);
        }

        if (savedMessages) {
          // Parse messages and convert timestamp strings back to Date objects
          const parsedMessages = JSON.parse(savedMessages).map(
            (msg: Message) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
            })
          );
          setMessages(parsedMessages);
        }

        if (savedTime) {
          setEstimatedTime(savedTime);
        }
        
        if (savedContextId) {
          setContextId(savedContextId);
        }
      } catch (error) {
        console.log("Error loading saved support state:", error);
      }
    };

    loadSavedState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(SUPPORT_STATE_KEY, screenState);
      } catch (error) {
        console.log("Error saving support state:", error);
      }
    };

    saveState();
  }, [screenState]);

  // Save messages when they change
  useEffect(() => {
    const saveMessages = async () => {
      if (messages.length > 0) {
        try {
          await AsyncStorage.setItem(
            SUPPORT_MESSAGES_KEY,
            JSON.stringify(messages)
          );
        } catch (error) {
          console.log("Error saving support messages:", error);
        }
      }
    };

    saveMessages();
  }, [messages]);

  // Save estimated time when it changes
  useEffect(() => {
    const saveTime = async () => {
      if (estimatedTime) {
        try {
          await AsyncStorage.setItem(SUPPORT_TIME_KEY, estimatedTime);
        } catch (error) {
          console.log("Error saving estimated time:", error);
        }
      }
    };

    saveTime();
  }, [estimatedTime]);
  
  // Save context ID when it changes
  useEffect(() => {
    const saveContextId = async () => {
      if (contextId) {
        try {
          await AsyncStorage.setItem(SUPPORT_CONTEXT_ID_KEY, contextId);
        } catch (error) {
          console.log("Error saving context ID:", error);
        }
      }
    };
    
    saveContextId();
  }, [contextId]);

  useEffect(() => {
    if (screenState === "queue") {
      // Add 1 minute to current time for estimated wait time only if not already set
      if (!estimatedTime) {
        const now = new Date();
        const estimatedWaitTime = new Date(now.getTime() + 60000); // add 1 minute
        const timeString = estimatedWaitTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setEstimatedTime(timeString);
      }

      // Start a 5-second timer before changing to chat state
      const timer = setTimeout(() => {
        setScreenState("chat");
        // Add initial support message if no messages exist
        if (messages.length === 0) {
          sendInitialSupportMessage();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [screenState, estimatedTime, messages]);
  
  const sendInitialSupportMessage = () => {
    const supportName = getRandomSupportName();
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: `Olá! Meu nome é ${supportName}, sou o atendente de suporte do Atomic AI. Como posso ajudar você hoje? Poderia se apresentar, por favor?`,
      isUser: false,
      timestamp: new Date(),
    };
    
    // Gerar um ID de contexto único
    const newContextId = `support-${Date.now()}`;
    setContextId(newContextId);
    
    // Adicionar a mensagem inicial
    setMessages([initialMessage]);
  };

  useEffect(() => {
    // Track keyboard visibility
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Cleanup listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSpeakWithExpert = () => {
    setScreenState("queue");
  };

  const handleExitQueue = () => {
    setScreenState("initial");
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("Sending message to support API:", messageText);
      const response = await sendSupportMessage(messageText, contextId);
      console.log("Support API response:", response);
      
      // Check the structure of the response to extract the text
      let responseText = "";
      const responseObj = response as any; // Type assertion to handle unknown response structure
      
      if (responseObj && typeof responseObj === 'object') {
        if (responseObj.text) {
          responseText = responseObj.text;
        } else if (responseObj.response) {
          responseText = responseObj.response;
        } else if (responseObj.message) {
          responseText = responseObj.message;
        }
      } else if (typeof response === 'string') {
        responseText = response;
      } else {
        console.log("Unexpected response structure:", response);
        responseText = "Desculpe, não consegui processar sua mensagem corretamente.";
      }
      
      if (responseObj && responseObj.contextId) {
        setContextId(responseObj.contextId);
      }
      
      const supportReply: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, supportReply]);
    } catch (error) {
      console.log("Error sending support message:", error);
      
      // Fallback message in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, estou tendo dificuldades para processar sua mensagem. Poderia tentar novamente mais tarde?",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleLike = () => {
    // Not implemented for support chat
  };

  const handleEndSupport = () => {
    Alert.alert(
      t("endSupportTitle") || "End Support",
      t("endSupportMessage") ||
        "Are you sure you want to end this support session?",
      [
        {
          text: t("cancel") || "Cancel",
          style: "cancel",
        },
        {
          text: t("end") || "End",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear saved state
              await AsyncStorage.removeItem(SUPPORT_STATE_KEY);
              await AsyncStorage.removeItem(SUPPORT_MESSAGES_KEY);
              await AsyncStorage.removeItem(SUPPORT_TIME_KEY);
              await AsyncStorage.removeItem(SUPPORT_CONTEXT_ID_KEY);

              // Reset current state
              setScreenState("initial");
              setMessages([]);
              setEstimatedTime("");
              setContextId(undefined);
            } catch (error) {
              console.log("Error clearing support state:", error);
            }
          },
        },
      ]
    );
  };

  const renderHeaderRight = () => {
    if (screenState !== "initial") {
      return (
        <TouchableOpacity
          onPress={handleEndSupport}
          style={styles.endSupportButton}
        >
          <Ionicons name="close-circle" size={26} color={colors.error} />
        </TouchableOpacity>
      );
    }
    return <View style={styles.headerRight} />;
  };

  const renderContent = () => {
    switch (screenState) {
      case "initial":
        return (
          <View style={styles.content}>
            <Ionicons
              name="headset-outline"
              size={80}
              color={colors.primary}
              style={styles.supportIcon}
            />
            <Text style={[styles.title, { color: colors.text }]}>
              {t("supportTitle")}
            </Text>
            <Text style={[styles.message, { color: colors.subtext }]}>
              {t("supportMessage")}
            </Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSpeakWithExpert}
            >
              <Text style={styles.buttonText}>{t("speakWithExpert")}</Text>
            </TouchableOpacity>
          </View>
        );

      case "queue":
        return (
          <View style={styles.queueContent}>
            <View
              style={[styles.queueCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.queueNumber}>
                <Text
                  style={[styles.queueNumberText, { color: colors.primary }]}
                >
                  1
                </Text>
              </View>

              <Text style={[styles.queueTitle, { color: colors.text }]}>
                {t("inQueueMessage")}
              </Text>

              <View style={styles.estimatedTimeContainer}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.estimatedTime, { color: colors.text }]}>
                  {t("estimatedTime")} {estimatedTime}
                </Text>
              </View>

              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>

              <TouchableOpacity
                style={[
                  styles.exitQueueButton,
                  { backgroundColor: colors.error },
                ]}
                onPress={handleExitQueue}
              >
                <Text style={styles.buttonText}>{t("exitQueue")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "chat":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <View style={styles.chatContainer}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                keyboardShouldPersistTaps="handled"
              >
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg.text}
                    isUser={msg.isUser}
                    isLiked={false}
                    onToggleLike={handleToggleLike}
                    timestamp={msg.timestamp}
                  />
                ))}
                {isTyping && (
                  <View style={styles.typingContainer}>
                    <View style={[styles.typingBubble, { backgroundColor: colors.surface }]}>
                      <ActivityIndicator size="small" color={colors.primary} style={styles.typingIndicator} />
                      <Text style={{ color: colors.subtext }}>
                        Digitando...
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: "transparent" },
                  isKeyboardVisible && { marginBottom: -80 },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, backgroundColor: colors.surface },
                  ]}
                  placeholder="Digite uma mensagem..."
                  placeholderTextColor={colors.subtext}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  multiline={true}
                  editable={!isTyping}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor: inputMessage.trim() && !isTyping
                        ? colors.primary
                        : colors.surface,
                    },
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Ionicons
                    name="arrow-up"
                    size={22}
                    color={inputMessage.trim() && !isTyping ? "#fff" : colors.subtext}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t("supportTitle")}
          </Text>
          {renderHeaderRight()}
        </View>

        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  endSupportButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  supportIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  queueContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  queueCard: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  queueNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  queueNumberText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  queueTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  estimatedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  estimatedTime: {
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    marginBottom: 24,
  },
  exitQueueButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keyboardView: {
    flex: 1,
    width: "100%",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  typingContainer: {
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  typingBubble: {
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: "60%",
    flexDirection: "row",
    alignItems: "center",
  },
  typingIndicator: {
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

export default SupportScreen;
