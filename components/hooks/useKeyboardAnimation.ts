import { useRef, useEffect } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';

export const useKeyboardAnimation = (
  onKeyboardShow?: () => void,
  onKeyboardHide?: () => void
) => {
  const keyboardAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardAnimation, {
          toValue: 1,
          duration: Platform.OS === "ios" ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
        onKeyboardShow?.();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => {
        Animated.timing(keyboardAnimation, {
          toValue: 0,
          duration: Platform.OS === "ios" ? event.duration || 250 : 300,
          useNativeDriver: false,
        }).start();
        onKeyboardHide?.();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardAnimation, onKeyboardShow, onKeyboardHide]);

  return keyboardAnimation;
}; 