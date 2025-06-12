import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useImageViewer } from "../context/ImageViewerContext";
import { addToggleLikeListener } from "./GlobalImageViewer";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  image?: string;
  isLiked: boolean;
  onToggleLike: () => void;
}

export const ChatBubble = ({
  message,
  isUser,
  image,
  isLiked,
  onToggleLike,
}: ChatBubbleProps) => {
  const { colors } = useTheme();
  const { showImageViewer } = useImageViewer();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Adicionar listener para sincronizar o estado de like
    // quando alterado no visualizador de imagem
    if (image) {
      const removeListener = addToggleLikeListener((newIsLiked) => {
        setLocalIsLiked(newIsLiked);
        onToggleLike();
      });
      
      return () => {
        removeListener();
      };
    }
  }, [image, onToggleLike]);

  const imageSource = image ? require("../assets/carousel/sample-01.jpeg") : null;

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

  const handleImagePress = () => {
    if (imageSource) {
      showImageViewer({
        source: imageSource,
        isLiked: localIsLiked,
        message
      });
    }
  };

  const handleToggleLike = () => {
    const newLikeState = !localIsLiked;
    setLocalIsLiked(newLikeState);
    onToggleLike();
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <Animated.View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.aiBubble, { backgroundColor: colors.surface }],
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {image && (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleImagePress}
            >
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.actionBar}>
              <View style={styles.leftActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleToggleLike}
                >
                  <Ionicons
                    name={localIsLiked ? "heart" : "heart-outline"}
                    size={22}
                    color="#FF3B30"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.lastLeftButton]}
                  onPress={handleDownload}
                >
                  <Ionicons
                    name="download-outline"
                    size={22}
                    color={isUser ? "#FFF" : colors.text}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShare}
              >
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={isUser ? "#FFF" : colors.text}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : { color: colors.text },
          ]}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: "row",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  aiContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: "center",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: -4,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  lastLeftButton: {
    marginRight: 0,
  },
  shareButton: {
    marginRight: 0,
  },
});
