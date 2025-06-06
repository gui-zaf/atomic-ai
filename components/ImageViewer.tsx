import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Share,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/theme";

interface ImageViewerProps {
  isVisible: boolean;
  onClose: () => void;
  imageSource: any;
  message?: string;
  isLiked: boolean;
  onToggleLike: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ImageViewer = ({
  isVisible,
  onClose,
  imageSource,
  message,
  isLiked,
  onToggleLike,
}: ImageViewerProps) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: message || "Check out this amazing image!",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    // Implementar download aqui
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <SafeAreaView style={styles.bottomContainer}>
          {message && <Text style={styles.messageText}>{message}</Text>}
          <View style={styles.actionBar}>
            <View style={styles.leftActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onToggleLike}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? colors.error : "#FFF"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.lastLeftButton]}
                onPress={handleDownload}
              >
                <Ionicons name="download-outline" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    padding: 16,
    alignSelf: "flex-end",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  messageText: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginRight: 16,
  },
  lastLeftButton: {
    marginRight: 0,
  },
  shareButton: {
    marginRight: 0,
  },
});
