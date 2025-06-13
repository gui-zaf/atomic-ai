import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Share,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useImageViewer } from "../context/ImageViewerContext";
import { addToggleLikeListener } from "./GlobalImageViewer";
import { BlurView } from "expo-blur";

// Obter a largura da tela para calcular a largura do componente
const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Definir a largura máxima da bolha de chat
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.8;
// Definir border radius consistente
const BORDER_RADIUS = 16;

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  image?: string;
  isLiked: boolean;
  onToggleLike: () => void;
  timestamp?: Date; // Adicionar timestamp opcional
}

export const ChatBubble = ({
  message,
  isUser,
  image,
  isLiked,
  onToggleLike,
  timestamp,
}: ChatBubbleProps) => {
  const { colors, isDarkMode } = useTheme();
  const { showImageViewer } = useImageViewer();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  // Memorizando o tempo formatado para que ele não mude nas re-renderizações
  const formattedTime = useMemo(() => {
    if (!timestamp) return '';
    
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [timestamp]);

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

  // Helper function to get the correct image source based on the image path
  const getImageSource = (imagePath?: string) => {
    if (!imagePath) return null;
    
    // Check if this is one of our sample images
    if (imagePath.includes('cat-in-space')) {
      return require('../assets/samples/cat-in-space.jpeg');
    } else if (imagePath.includes('sunset-beach')) {
      return require('../assets/samples/sunset-beach.jpeg');
    } else if (imagePath.includes('fantasy-castle')) {
      return require('../assets/samples/fantasy-castle.jpeg');
    } else if (imagePath.includes('cyberpunk-city')) {
      return require('../assets/samples/cyberpunk-city.jpeg');
    } else if (imagePath.includes('cute-animals')) {
      return require('../assets/samples/cute-animals.jpeg');
    } else if (imagePath.includes('colorful-landscape')) {
      return require('../assets/samples/colorful-landscape.jpeg');
    } else if (imagePath.includes('sci-fi-portrait')) {
      return require('../assets/samples/sci-fi-portrait.jpeg');
    } else if (imagePath.includes('abstract-art')) {
      return require('../assets/samples/abstract-art.jpeg');
    }
    
    // Fallback to default sample image
    return require('../assets/carousel/sample-01.jpeg');
  };

  const imageSource = getImageSource(image);

  const handleImagePress = () => {
    if (imageSource) {
      showImageViewer({
        source: imageSource,
        isLiked: localIsLiked,
        message
      });
    }
  };

  // Renderização condicional dependendo se é uma mensagem com imagem ou texto
  if (image && imageSource) {
    return (
      <View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.aiContainer,
        ]}
      >
        <Animated.View
          style={[
            styles.imageBubble,
            isUser
              ? [styles.userImageBubble, { backgroundColor: colors.primary }]
              : [styles.aiImageBubble, { backgroundColor: colors.surface }],
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleImagePress}
            style={[
              styles.imageContainer,
              isUser ? styles.userImageContainer : styles.aiImageContainer
            ]}
          >
            <Image
              source={imageSource}
              style={styles.image}
            />
            
            {/* Timestamp com BlurView para imagens */}
            {formattedTime ? (
              <View style={styles.imageTimeContainer}>
                <BlurView 
                  intensity={70} 
                  tint={isDarkMode ? "dark" : "light"} 
                  style={styles.timeBlurPill}
                >
                  <Text style={[styles.timeText, { color: colors.text }]}>
                    {formattedTime}
                  </Text>
                </BlurView>
              </View>
            ) : null}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Renderização padrão para mensagens de texto
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
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : { color: colors.text },
          ]}
        >
          {message}
        </Text>
        
        {/* Timestamp para mensagens de texto */}
        {formattedTime ? (
          <View style={styles.timeWrapper}>
            <Text style={[
              styles.timeStampText, 
              { color: isUser ? 'rgba(255, 255, 255, 0.7)' : colors.subtext }
            ]}>
              {formattedTime}
            </Text>
          </View>
        ) : null}
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
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
  },
  // Bolha específica para imagens - com pequena margem para efeito visual
  imageBubble: {
    maxWidth: "80%",
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    padding: 2,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    position: 'relative', // Para posicionar o timestamp absolutamente
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  userImageBubble: {
    borderTopRightRadius: 4,
  },
  aiImageBubble: {
    borderTopLeftRadius: 4,
  },
  userImageContainer: {
    borderTopRightRadius: 4,
  },
  aiImageContainer: {
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
    width: BUBBLE_MAX_WIDTH,
    height: BUBBLE_MAX_WIDTH * 0.75, // Proporção 4:3, mais agradável visualmente
    resizeMode: "cover",
  },
  // Estilos para timestamp em mensagens de texto
  timeWrapper: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  timeStampText: {
    fontSize: 10,
    opacity: 0.8,
  },
  // Estilos para timestamp em imagens
  imageTimeContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 10,
  },
  timeBlurPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
