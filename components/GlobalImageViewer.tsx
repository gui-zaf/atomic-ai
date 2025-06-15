import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  PanResponder,
  StatusBar,
  Modal,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { BlurView } from "expo-blur";
import { useImageViewer } from "../context/ImageViewerContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Evento global para comunicar o toggle de like
let toggleLikeListeners: ((isLiked: boolean) => void)[] = [];

export const addToggleLikeListener = (callback: (isLiked: boolean) => void) => {
  toggleLikeListeners.push(callback);
  return () => {
    toggleLikeListeners = toggleLikeListeners.filter((cb) => cb !== callback);
  };
};

// Helper function to get the correct image source based on the image path
const getImageSource = (imagePath?: any) => {
  if (!imagePath) return null;

  // If it's already a require'd asset, return it directly
  if (typeof imagePath !== "string") {
    return imagePath;
  }

  // Check if this is one of our sample images
  if (imagePath.includes("cat-in-space")) {
    return require("../assets/samples/cat-in-space.jpeg");
  } else if (imagePath.includes("sunset-beach")) {
    return require("../assets/samples/sunset-beach.jpeg");
  } else if (imagePath.includes("fantasy-castle")) {
    return require("../assets/samples/fantasy-castle.jpeg");
  } else if (imagePath.includes("cyberpunk-city")) {
    return require("../assets/samples/cyberpunk-city.jpeg");
  } else if (imagePath.includes("cute-animals")) {
    return require("../assets/samples/cute-animals.jpeg");
  } else if (imagePath.includes("colorful-landscape")) {
    return require("../assets/samples/colorful-landscape.jpeg");
  } else if (imagePath.includes("sci-fi-portrait")) {
    return require("../assets/samples/sci-fi-portrait.jpeg");
  } else if (imagePath.includes("abstract-art")) {
    return require("../assets/samples/abstract-art.jpeg");
  }

  // Fallback to default sample image
  return require("../assets/carousel/sample-01.jpeg");
};

const GlobalImageViewer = () => {
  const {
    currentImage,
    isVisible,
    hideImageViewer,
    toggleLike,
    isGalleryMode,
    onDeleteImage,
  } = useImageViewer();

  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  // Estado local de like para evitar problemas de dessincronia
  const [localIsLiked, setLocalIsLiked] = useState(false);

  // Sincroniza o estado local com o estado global quando a imagem muda
  useEffect(() => {
    if (currentImage) {
      setLocalIsLiked(currentImage.isLiked);
    }
  }, [currentImage]);

  // Pan responder para gestos de pinch e zoom (simplificado nesta implementação)
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
    }),
  ).current;

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this amazing image!",
      });
    } catch (error) {
      // Silently handle sharing error
    }
  };

  const handleDownload = () => {
    // Implementação futura
  };

  const handleToggleLike = () => {
    // Atualiza o estado local primeiro
    const newLikeState = !localIsLiked;
    setLocalIsLiked(newLikeState);

    // Atualiza o estado global
    toggleLike();

    // Notifica todos os listeners sobre a mudança
    toggleLikeListeners.forEach((listener) => listener(newLikeState));
  };

  const handleDelete = () => {
    if (currentImage?.id && onDeleteImage) {
      Alert.alert(t("deleteImage"), t("deleteImageConfirmation"), [
        { text: t("no"), style: "cancel" },
        {
          text: t("yes"),
          style: "destructive",
          onPress: () => {
            // Armazena o ID antes de fechar o modal
            const imageId = currentImage.id!;
            hideImageViewer();
            // Pequeno atraso para garantir que o modal seja fechado antes da exclusão
            setTimeout(() => {
              onDeleteImage(imageId);
            }, 300);
          },
        },
      ]);
    }
  };

  if (!currentImage) return null;

  // Get the proper image source
  const imageSource = currentImage.source
    ? typeof currentImage.source === "string"
      ? getImageSource(currentImage.source)
      : currentImage.source
    : null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={hideImageViewer}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={hideImageViewer}>
        <View style={styles.container}>
          <BlurView
            intensity={isDarkMode ? 70 : 50}
            style={StyleSheet.absoluteFill}
            tint={isDarkMode ? "dark" : "light"}
          />

          <StatusBar translucent backgroundColor="rgba(0,0,0,0.5)" />

          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={hideImageViewer}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.spacer} />

              {isGalleryMode && (
                <TouchableOpacity
                  style={[styles.closeButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>

          <TouchableWithoutFeedback>
            <View style={styles.imageContainer}>
              <View {...panResponder.panHandlers}>
                <Image
                  source={imageSource}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {currentImage.message && (
                <View style={styles.messageContainer}>
                  <Text style={[styles.messageText, { color: colors.text }]}>
                    {currentImage.message}
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>

          <SafeAreaView style={styles.bottomContainer}>
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleLike}
              >
                <Ionicons
                  name={localIsLiked ? "heart" : "heart-outline"}
                  size={28}
                  color="#FF3B30"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={28} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDownload}
              >
                <Ionicons
                  name="download-outline"
                  size={28}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  safeArea: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  spacer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenWidth,
    maxHeight: screenHeight * 0.6,
  },
  messageContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
    width: "100%",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  bottomContainer: {
    width: "100%",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlobalImageViewer;
