import React, { useState, useRef, useEffect } from "react";
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
  PanResponder,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface ImageViewerProps {
  isVisible: boolean;
  onClose: () => void;
  imageSource: any;
  message?: string;
  isLiked: boolean;
  onToggleLike: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  // Carousel props
  images?: any[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ImageViewer = ({
  isVisible,
  onClose,
  imageSource,
  message,
  isLiked,
  onToggleLike,
  onDelete,
  showDeleteButton = false,
  images,
  currentIndex = 0,
  onIndexChange,
}: ImageViewerProps) => {
  const { colors } = useTheme();
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const translateX = useRef(new Animated.Value(0)).current;
  const isCarousel = images && images.length > 1;

  // Sync local index with props
  useEffect(() => {
    setLocalIndex(currentIndex);
  }, [currentIndex]);

  const getCurrentImage = () => {
    if (isCarousel && images) {
      return images[localIndex];
    }
    return imageSource;
  };

  const goToNext = () => {
    if (isCarousel && images && localIndex < images.length - 1) {
      const newIndex = localIndex + 1;
      setLocalIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  };

  const goToPrevious = () => {
    if (isCarousel && images && localIndex > 0) {
      const newIndex = localIndex - 1;
      setLocalIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => Boolean(isCarousel),
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Boolean(
          isCarousel && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        ),
      onPanResponderMove: (_, gestureState) => {
        if (isCarousel) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isCarousel) {
          const threshold = screenWidth * 0.3;

          if (gestureState.dx > threshold) {
            // Swipe right - previous image
            goToPrevious();
          } else if (gestureState.dx < -threshold) {
            // Swipe left - next image
            goToNext();
          }

          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const handleShare = async () => {
    try {
      await Share.share({
        message: message || "Check out this amazing image!",
      });
    } catch (error) {
      // Silently handle sharing error
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
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <Image
              source={getCurrentImage()}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Navigation arrows for carousel */}
          {isCarousel && (
            <>
              {localIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={goToPrevious}
                >
                  <Ionicons name="chevron-back" size={32} color="#FFF" />
                </TouchableOpacity>
              )}

              {localIndex < images!.length - 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={goToNext}
                >
                  <Ionicons name="chevron-forward" size={32} color="#FFF" />
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Image counter */}
          {isCarousel && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {localIndex + 1} / {images!.length}
              </Text>
            </View>
          )}
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
            <View style={styles.rightActions}>
              {showDeleteButton && onDelete && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDelete}
                >
                  <Ionicons name="trash-outline" size={28} color="#FFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
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
  topActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  closeButton: {
    padding: 0,
  },
  deleteButton: {
    padding: 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageWrapper: {
    width: screenWidth,
    height: screenHeight * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  counter: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counterText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
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
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastLeftButton: {
    marginRight: 0,
  },
  shareButton: {
    marginRight: 0,
  },
});
