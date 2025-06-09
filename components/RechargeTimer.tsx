import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { useTokens } from '../context/TokenContext';

const formatTimeRemaining = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const RechargeTimer = () => {
  const { isRecharging, rechargeTimeRemaining } = useTokens();
  
  if (!isRecharging) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.timerPill}>
        <Ionicons
          name="time-outline"
          size={16}
          color={colors.text}
        />
        <Text style={styles.timerText}>
          {formatTimeRemaining(rechargeTimeRemaining)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  }
});

export default RechargeTimer; 