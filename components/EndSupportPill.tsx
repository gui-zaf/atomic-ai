import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

interface EndSupportPillProps {
  onPress: () => void;
}

const EndSupportPill = ({ onPress }: EndSupportPillProps) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={t("end")}
    >
      <View
        style={[
          styles.pill,
          { 
            backgroundColor: colors.surface,
            shadowColor: isDarkMode ? 'transparent' : '#000',
          },
        ]}
      >
        <Ionicons
          name="exit-outline"
          size={16}
          color={colors.error}
        />
        <Text
          style={[
            styles.text,
            { color: colors.error },
          ]}
        >
          {t("end")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default EndSupportPill; 