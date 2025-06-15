import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type DevelopersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Developers"
>;

const { width } = Dimensions.get("window");

const DevelopersScreen = () => {
  const navigation = useNavigation<DevelopersScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Couldn't open link:", error);
    }
  };

  const renderTechPill = (tech: string) => (
    <View
      key={tech}
      style={[styles.techPill, { backgroundColor: colors.primaryBackground }]}
    >
      <Text style={[styles.techText, { color: colors.primary }]}>{tech}</Text>
    </View>
  );

  const renderDeveloperCard = (
    name: string,
    imagePath: any,
    githubUrl: string,
    linkedinUrl: string,
    technologies: string[],
  ) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image source={imagePath} style={styles.avatar} />
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.title, { color: colors.subtext }]}>
        {t("softwareEngineer")}
      </Text>

      <View style={styles.techContainer}>
        {technologies.map((tech) => renderTechPill(tech))}
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.primaryBackground },
          ]}
          onPress={() => openLink(githubUrl)}
        >
          <Ionicons name="logo-github" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.primary }]}>
            {t("githubLink")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.primaryBackground },
          ]}
          onPress={() => openLink(linkedinUrl)}
        >
          <Ionicons name="logo-linkedin" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.primary }]}>
            {t("linkedinLink")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t("developersTitle")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderDeveloperCard(
            "Guilherme Ferraz",
            require("../assets/guilherme.jpeg"),
            "https://github.com/gui-zaf",
            "https://www.linkedin.com/in/gui-zaf/",
            ["Kotlin", "Swift", "TypeScript", "NodeJS"],
          )}

          {renderDeveloperCard(
            "Davi Almeida",
            require("../assets/davi.jpeg"),
            "https://github.com/Eletronbius",
            "https://www.linkedin.com/in/davi-almeida-6b862a243/",
            ["Java", "JavaScript", "Python", "Go"],
          )}
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
  scrollContent: {
    padding: 16,
    gap: 20,
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    width: width - 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
  },
  techContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  techPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    fontSize: 12,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  socialText: {
    fontWeight: "500",
  },
});

export default DevelopersScreen;
