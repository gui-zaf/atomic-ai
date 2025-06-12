import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface DevelopersScreenProps {
  onClose: () => void;
}

const { width } = Dimensions.get("window");

const DevelopersScreen = ({ onClose }: DevelopersScreenProps) => {
  const { colors, isDarkMode } = useTheme();
  
  // Animation for screen transition
  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in when component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // Animate out then close
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Couldn't open link:", error);
    }
  };

  const renderTechPill = (tech: string) => (
    <View key={tech} style={[styles.techPill, { backgroundColor: colors.primaryBackground }]}>
      <Text style={[styles.techText, { color: colors.primary }]}>{tech}</Text>
    </View>
  );

  const renderDeveloperCard = (
    name: string,
    imagePath: any,
    githubUrl: string,
    linkedinUrl: string,
    technologies: string[]
  ) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image source={imagePath} style={styles.avatar} />
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.title, { color: colors.subtext }]}>Software Engineer</Text>
      
      <View style={styles.techContainer}>
        {technologies.map(tech => renderTechPill(tech))}
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: colors.primaryBackground }]} 
          onPress={() => openLink(githubUrl)}
        >
          <Ionicons name="logo-github" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.primary }]}>GitHub</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: colors.primaryBackground }]} 
          onPress={() => openLink(linkedinUrl)}
        >
          <Ionicons name="logo-linkedin" size={20} color={colors.primary} />
          <Text style={[styles.socialText, { color: colors.primary }]}>LinkedIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        }
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Developers</Text>
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
            ["Kotlin", "Swift", "TypeScript", "NodeJS"]
          )}
          
          {renderDeveloperCard(
            "Davi Almeida",
            require("../assets/davi.jpeg"),
            "https://github.com/Eletronbius",
            "https://www.linkedin.com/in/davi-almeida-6b862a243/",
            ["Java", "JavaScript", "Python", "Go"]
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
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