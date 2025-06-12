import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DotTypingAnimation } from 'react-native-dot-typing';
import { useTheme } from '../context/ThemeContext';

export const LoadingBubble = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.animationWrapper}>
        <DotTypingAnimation
          dotColor={colors.text}
          dotMargin={3}
          dotSpeed={0.2}
          dotRadius={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    minHeight: 40,
    alignSelf: 'flex-start',
    borderRadius: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  animationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
}); 