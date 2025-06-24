import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAmazeSuggestion } from "../services/amazeService";
import { useTokens } from "../context/TokenContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import RechargeTimer from "./RechargeTimer";
import SuggestionCarousel from "./SuggestionCarousel";
import { BlurView } from "expo-blur";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSendAIMessage: (message: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

const ChatInput = ({
  onSend,
  onSendAIMessage,
  onFocusChange = () => {},
}: ChatInputProps) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { decrementToken, resetTokens } = useTokens();

  // Animation values
  const suggestionsOpacity = useRef(new Animated.Value(1)).current;
  const containerTranslateY = useRef(new Animated.Value(0)).current;

  // Track keyboard visibility with animations
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(suggestionsOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(containerTranslateY, {
            toValue: -10,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setShowSuggestions(false));
        onFocusChange(true);
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setShowSuggestions(true);
        Animated.parallel([
          Animated.timing(suggestionsOpacity, {
            toValue: 1,
            duration: 300,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.timing(containerTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        onFocusChange(false);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [onFocusChange, suggestionsOpacity, containerTranslateY]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    if (trimmedMessage.toLowerCase() === "/tokens") {
      handleTokenCommand();
      setMessage("");
      return;
    }

    if (decrementToken()) {
      onSend(trimmedMessage);
      setMessage("");
    } else {
      Alert.alert(
        t("tokensExhausted"),
        t("tokensExhaustedMessage"),
        [{ text: t("ok") }],
      );
    }
  };

  const handleTokenCommand = () => {
    resetTokens(3);
    Alert.alert(
      t("tokensRefreshed"),
      t("tokensRefreshedMessage"),
      [{ text: t("ok") }],
    );
  };

  const handleSuggestion = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const suggestion = await getAmazeSuggestion();
      setMessage(suggestion);
    } catch (error) {
      onSendAIMessage(t("suggestionError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setTimeout(() => Keyboard.dismiss(), 100);
  };

  const handleSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (Platform.OS === "ios") {
      e.preventDefault?.();
    }
    handleSend();
  };

  return (
    <>
      <RechargeTimer />
      <Animated.View
        style={[
          styles.inputWrapper,
          { transform: [{ translateY: containerTranslateY }] },
          isKeyboardVisible && styles.inputWrapperKeyboardOpen,
        ]}
      >
        {Platform.OS === "ios" || Platform.OS === "android" ? (
          <BlurView
            intensity={40}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.blurContainer}
          />
        ) : (
          <View
            style={[
              styles.blurContainer,
              {
                backgroundColor: colors.background,
                opacity: 0.9,
              },
            ]}
          />
        )}

        {showSuggestions && (
          <Animated.View
            style={[styles.suggestionsWrapper, { opacity: suggestionsOpacity }]}
          >
            <SuggestionCarousel onSelectSuggestion={handleSelectSuggestion} />
          </Animated.View>
        )}

        <View
          style={[
            styles.container,
            isKeyboardVisible && styles.containerKeyboardOpen,
          ]}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[styles.bulbButton, { backgroundColor: colors.surface }]}
              onPress={handleSuggestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="bulb" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                },
              ]}
              placeholder={t("inputPlaceholder")}
              placeholderTextColor={colors.subtext}
              value={message}
              onChangeText={setMessage}
              multiline={true}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSubmitEditing}
              scrollEnabled={true}
              enablesReturnKeyAutomatically={true}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: message.trim()
                    ? colors.primary
                    : colors.surface,
                },
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons
                name="arrow-up"
                size={22}
                color={message.trim() ? "#fff" : colors.subtext}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 0,
  },
  inputWrapperKeyboardOpen: {
    marginBottom: -20,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -300,
    height: 350,
    zIndex: 1,
  },
  suggestionsWrapper: {
    position: "relative",
    zIndex: 25,
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  containerKeyboardOpen: {
    marginBottom: -20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingRight: 42,
    borderRadius: 22,
    maxHeight: 100,
    minHeight: 42,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  bulbButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatInput;
