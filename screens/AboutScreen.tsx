import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AboutScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "About"
>;

interface Section {
  id: string;
  titleKey: string;
  contentKey: string;
  animation?: Animated.Value;
}

const AboutScreen = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections: Section[] = useMemo(
    () => [
      {
        id: "about",
        titleKey: "atomicArtAbout",
        contentKey: "atomicArtAboutContent",
        animation: new Animated.Value(0),
      },
      {
        id: "features",
        titleKey: "mainFeatures",
        contentKey: "mainFeaturesContent",
        animation: new Animated.Value(0),
      },
      {
        id: "tech",
        titleKey: "techHighlights",
        contentKey: "techHighlightsContent",
        animation: new Animated.Value(0),
      },
      {
        id: "terms",
        titleKey: "termsOfUse",
        contentKey: "termsOfUseContent",
        animation: new Animated.Value(0),
      },
      {
        id: "rights",
        titleKey: "contentRights",
        contentKey: "contentRightsContent",
        animation: new Animated.Value(0),
      },
      {
        id: "privacy",
        titleKey: "privacyData",
        contentKey: "privacyDataContent",
        animation: new Animated.Value(0),
      },
      {
        id: "limitations",
        titleKey: "limitations",
        contentKey: "limitationsContent",
        animation: new Animated.Value(0),
      },
      {
        id: "responsible",
        titleKey: "responsibleUse",
        contentKey: "responsibleUseContent",
        animation: new Animated.Value(0),
      },
      {
        id: "mods",
        titleKey: "modifications",
        contentKey: "modificationsContent",
        animation: new Animated.Value(0),
      },
      {
        id: "contractor",
        titleKey: "contractor",
        contentKey: "contractorContent",
        animation: new Animated.Value(0),
      },
    ],
    [],
  );

  const handleToggleSection = (id: string) => {
    const isExpanding = expandedSection !== id;

    // Close current section if any
    if (expandedSection) {
      const currentSection = sections.find((s) => s.id === expandedSection);
      if (currentSection?.animation) {
        Animated.spring(currentSection.animation, {
          toValue: 0,
          damping: 15,
          mass: 1,
          stiffness: 120,
          useNativeDriver: false,
        }).start();
      }
    }

    // Open new section
    if (isExpanding) {
      const newSection = sections.find((s) => s.id === id);
      if (newSection?.animation) {
        Animated.spring(newSection.animation, {
          toValue: 1,
          damping: 15,
          mass: 1,
          stiffness: 120,
          useNativeDriver: false,
        }).start();
      }
    }

    setExpandedSection(isExpanding ? id : null);
  };

  const renderSection = (section: Section) => {
    const isExpanded = expandedSection === section.id;
    const rotateAnimation = section.animation?.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
      extrapolate: "clamp",
    });

    const maxHeight = 500;
    const heightAnimation = section.animation?.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxHeight],
      extrapolate: "clamp",
    });

    const opacityAnimation = section.animation?.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 1],
      extrapolate: "clamp",
    });

    return (
      <View
        key={section.id}
        style={[
          styles.sectionContainer,
          { borderColor: colors.subtext + "55" },
        ]}
      >
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => handleToggleSection(section.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t(section.titleKey)}
          </Text>
          <Animated.View
            style={{
              transform: [{ rotate: rotateAnimation || "0deg" }] as any,
            }}
          >
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.sectionContentWrapper,
            {
              maxHeight: heightAnimation,
              opacity: opacityAnimation,
            },
          ]}
        >
          <View style={styles.sectionContent}>
            <Text style={{ color: colors.subtext }}>
              {t(section.contentKey)}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t("aboutTitle")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {sections.map(renderSection)}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContentWrapper: {
    overflow: "hidden",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default AboutScreen;
