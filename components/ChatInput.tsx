import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAmazeSuggestion } from "../services/amazeService";
import { useTokens } from "../context/TokenContext";
import { useTheme } from "../context/ThemeContext";
import RechargeTimer from "./RechargeTimer";
import SuggestionCarousel from "./SuggestionCarousel";
import { BlurView } from "expo-blur";

interface ChatInputProps {
  onSend: (message: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

const ChatInput = ({ onSend, onFocusChange = () => {} }: ChatInputProps) => {
  const { colors, isDarkMode } = useTheme();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { decrementToken, resetTokens } = useTokens();

  // Track keyboard visibility
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Hide suggestions when keyboard opens
        setShowSuggestions(false);
        onFocusChange(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        // Show suggestions when keyboard closes
        setShowSuggestions(true);
        onFocusChange(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [onFocusChange]);

  const handleSend = () => {
    if (message.trim()) {
      // Check for /tokens command
      if (message.trim().toLowerCase() === "/tokens") {
        // Add tokens and show alert
        handleTokenCommand();
        setMessage("");
        return;
      }

      if (decrementToken()) {
        onSend(message.trim());
        setMessage("");
      } else {
        Alert.alert(
          "Tokens Esgotados",
          "Seus tokens gratuitos acabaram. Aguarde a recarga ou adquira mais tokens.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const handleTokenCommand = () => {
    // Reset tokens and cooldown
    resetTokens();
    // Show alert with information about tokens
    Alert.alert(
      "Tokens Refreshed",
      "You received 10 additional tokens and cooldown has been reset!",
      [{ text: "OK" }]
    );
  };

  const handleSuggestion = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const suggestion = await getAmazeSuggestion();
      setMessage(suggestion);
    } catch (error) {
      Alert.alert("Error", "Failed to get suggestion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    // Use the full description as a regular message
    setMessage(suggestion);
    // Focus the input to allow user to edit if needed
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
  };

  // Handle submit event to send message
  const handleSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Prevent default behavior and send message
    if (Platform.OS === "ios") {
      e.preventDefault?.();
    }
    handleSend();
  };

  return (
    <>
      <RechargeTimer />
      <View style={styles.inputWrapper}>
        <BlurView 
          intensity={10} 
          tint={isDarkMode ? "dark" : "light"}
          style={styles.blurContainer}
        />
        
        {/* Suggestions with higher z-index */}
        {showSuggestions && (
          <View style={styles.suggestionsWrapper}>
            <SuggestionCarousel onSelectSuggestion={handleSelectSuggestion} />
          </View>
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
              placeholder="Message"
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
                message.trim()
                  ? [styles.sendButtonActive, { backgroundColor: colors.primary }]
                  : [
                      styles.sendButtonInactive,
                      { backgroundColor: colors.surface },
                    ],
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    zIndex: 10,
    marginTop: 8,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -300,
    height: 350,
    zIndex: 1,
  },
  suggestionsWrapper: {
    position: 'relative',
    zIndex: 25,
    marginTop: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'transparent',
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
    textAlignVertical: 'center',
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
  sendButtonActive: {},
  sendButtonInactive: {},
});

export default ChatInput;
