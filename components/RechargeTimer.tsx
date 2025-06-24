import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Keyboard, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTokens } from "../context/TokenContext";
import { useTheme } from "../context/ThemeContext";

const formatTimeRemaining = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const RechargeTimer = () => {
  const { isRecharging, rechargeTimeRemaining, tokens } = useTokens();
  const { colors } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Cores de erro (vermelho) como no TokenPill
  const errorColor = colors.error;
  const errorBgColor =
    colors.text === "#FFFFFF"
      ? "rgba(255, 69, 58, 0.2)"
      : "rgba(255, 59, 48, 0.1)";

  // Monitorar o estado do teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Mostrar apenas quando estiver recarregando e sem tokens
  if (!isRecharging || tokens > 0) return null;

  return (
    <View style={[
      styles.container,
      keyboardVisible ? styles.containerKeyboardVisible : null
    ]}>
      <View style={[styles.timerPill, { backgroundColor: errorBgColor }]}>
        <Ionicons name="time-outline" size={16} color={errorColor} />
        <Text style={[styles.timerText, { color: errorColor }]}>
          {formatTimeRemaining(rechargeTimeRemaining)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 148, // Posicionado acima da view de sugestões quando o teclado está fechado
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  containerKeyboardVisible: {
    bottom: 20, // Posicionado mais acima quando o teclado está aberto
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default RechargeTimer;
