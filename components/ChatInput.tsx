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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { decrementToken } = useTokens();

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (message.trim()) {
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

  return (
    <>
      <RechargeTimer />
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
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
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
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
  containerKeyboardOpen: {
    marginBottom: -34,
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
