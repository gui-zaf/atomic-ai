import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

interface SuggestionCarouselProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const { width } = Dimensions.get("window");

const SuggestionCarousel = ({
  onSelectSuggestion,
}: SuggestionCarouselProps) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const suggestions = [
    {
      id: "1",
      translationKey: "catInSpace",
      descriptionKey: "catInSpaceDesc",
      icon: "planet",
    },
    {
      id: "2",
      translationKey: "sunsetBeach",
      descriptionKey: "sunsetBeachDesc",
      icon: "sunny",
    },
    {
      id: "3",
      translationKey: "fantasycastle",
      descriptionKey: "fantasycastleDesc",
      icon: "home",
    },
    {
      id: "4",
      translationKey: "cyberpunkCity",
      descriptionKey: "cyberpunkCityDesc",
      icon: "flash",
    },
    {
      id: "5",
      translationKey: "cuteAnimals",
      descriptionKey: "cuteAnimalsDesc",
      icon: "paw",
    },
    {
      id: "6",
      translationKey: "colorfulLandscape",
      descriptionKey: "colorfulLandscapeDesc",
      icon: "color-palette",
    },
    {
      id: "7",
      translationKey: "sciFiPortrait",
      descriptionKey: "sciFiPortraitDesc",
      icon: "person",
    },
    {
      id: "8",
      translationKey: "abstractArt",
      descriptionKey: "abstractArtDesc",
      icon: "color-wand",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeader, { color: colors.subtext }]}>
        {t("suggestions")}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        decelerationRate="fast"
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        disableIntervalMomentum={true}
        pagingEnabled={false}
        snapToAlignment="start"
        removeClippedSubviews={false}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[styles.suggestionBox, { backgroundColor: colors.surface }]}
            onPress={() => onSelectSuggestion(t(suggestion.descriptionKey))}
          >
            <Ionicons
              name={suggestion.icon as any}
              size={20}
              color={colors.primary}
            />
            <Text
              style={[styles.suggestionText, { color: colors.text }]}
              numberOfLines={1}
            >
              {t(suggestion.translationKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    zIndex: 20,
    elevation: 20,
    position: "relative",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  suggestionBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 18,
    maxWidth: width * 0.5,
    minWidth: width * 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default SuggestionCarousel;
