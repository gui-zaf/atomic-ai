import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { useTokens } from '../context/TokenContext';

const TokenPill = () => {
  const { tokens } = useTokens();
  const isZero = tokens === 0;

  return (
    <View style={[
      styles.tokenPill,
      isZero && styles.tokenPillEmpty
    ]}>
      <Ionicons
        name="flash"
        size={16}
        color={isZero ? '#ff3b30' : colors.primary}
      />
      <Text style={[
        styles.tokenCount,
        isZero && styles.tokenCountEmpty
      ]}>
        {tokens}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  tokenPillEmpty: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  tokenCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  tokenCountEmpty: {
    color: '#ff3b30',
  },
});

export default TokenPill; 