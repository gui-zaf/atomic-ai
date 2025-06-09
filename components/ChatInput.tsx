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
  TextInputSubmitEditingEventData
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAmazeSuggestion } from "../services/amazeService";
import { useTokens } from "../context/TokenContext";
import { useTheme } from "../context/ThemeContext";
import RechargeTimer from "./RechargeTimer";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const { colors } = useTheme();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { decrementToken, tokens, resetTokens } = useTokens();

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

  // Handle submit event to send message
  const handleSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    // Prevent default behavior and send message
    if (Platform.OS === 'ios') {
      e.preventDefault?.();
    }
    handleSend();
    return false;
  };

  return (
    <>
      <RechargeTimer />
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background }
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
              <Ionicons name="bulb" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.surface,
                color: colors.text
              }
            ]}
            placeholder="Message"
            placeholderTextColor={colors.subtext}
            value={message}
            onChangeText={setMessage}
            multiline={Platform.OS !== 'ios'}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSubmitEditing}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim()
                ? [styles.sendButtonActive, { backgroundColor: colors.primary }]
                : [styles.sendButtonInactive, { backgroundColor: colors.surface }],
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={message.trim() ? "#fff" : colors.subtext}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 40,
    borderRadius: 20,
    maxHeight: 100,
    minHeight: 36,
    ...Platform.select({
      ios: {
        paddingTop: 8,
      },
    }),
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bulbButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {},
  sendButtonInactive: {},
});

export default ChatInput;
