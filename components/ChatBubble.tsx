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
  Easing,
  ActivityIndicator,
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

// Duração de cada efeito em milissegundos
const PIXELATED_DURATION = 5000;
const NOISE_DURATION = 3000;
const TOTAL_ANIMATION_DURATION = PIXELATED_DURATION + NOISE_DURATION;

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  image?: string;
  isLiked: boolean;
  onToggleLike: () => void;
  timestamp?: Date; // Adicionar timestamp opcional
  isGenerating?: boolean;
}

export const ChatBubble = ({
  message,
  isUser,
  image,
  isLiked,
  onToggleLike,
  timestamp,
  isGenerating: initialIsGenerating,
}: ChatBubbleProps) => {
  const { colors, isDarkMode } = useTheme();
  const { showImageViewer } = useImageViewer();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [isGenerating, setIsGenerating] = useState(initialIsGenerating && !!image);
  const [currentEffect, setCurrentEffect] = useState("pixelated");
  
  // Valores animados para os efeitos
  const blurRadius = useRef(new Animated.Value(25)).current; // Valor maior para blur mais potente
  const noiseOpacity = useRef(new Animated.Value(0)).current;
  const hueRotateValue = useRef(new Animated.Value(0)).current; // Valor para hue-rotate (0-360)
  const imageOpacity = useRef(new Animated.Value(0.7)).current;
  const imageScale = useRef(new Animated.Value(0.95)).current;
  const tintColor = useRef(new Animated.Value(0)).current; // Para simular hue-rotate
  const spinAnimation = useRef(new Animated.Value(0)).current; // Para girar o ActivityIndicator

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

  // Efeito para animar o hue-rotate
  useEffect(() => {
    if (isGenerating) {
      // Animar o hue-rotate continuamente durante todo o processo de geração
      Animated.loop(
        Animated.timing(hueRotateValue, {
          toValue: 360,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
      
      // Animar o spinner continuamente
      Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Parar a animação quando não estiver mais gerando
      hueRotateValue.setValue(0);
      spinAnimation.setValue(0);
    }
  }, [isGenerating]);
  
  useEffect(() => {
    if (image && isGenerating) {
      // Sequência de animações para simular o processo de geração
      
      // Fase 1: Pixelado (5 segundos)
      setCurrentEffect("pixelated");
      
      // Começar com muito blur e ir diminuindo
      Animated.timing(blurRadius, {
        toValue: 10,
        duration: PIXELATED_DURATION,
        useNativeDriver: false,
      }).start();
      
      // Fase 2: Ruído (3 segundos após o pixelado)
      setTimeout(() => {
        setCurrentEffect("noise");
        
        // Aumentar e depois diminuir o ruído
        Animated.sequence([
          Animated.timing(noiseOpacity, {
            toValue: 0.5,
            duration: NOISE_DURATION / 2,
            useNativeDriver: false,
          }),
          Animated.timing(noiseOpacity, {
            toValue: 0.2,
            duration: NOISE_DURATION / 2,
            useNativeDriver: false,
          })
        ]).start();
        
        // Continuar diminuindo o blur
        Animated.timing(blurRadius, {
          toValue: 0,
          duration: NOISE_DURATION,
          useNativeDriver: false,
        }).start();
      }, PIXELATED_DURATION);
      
      // Fase 3: Finalizar
      setTimeout(() => {
        setCurrentEffect("final");
        
        // Aumentar a opacidade da imagem para o valor final
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, PIXELATED_DURATION + NOISE_DURATION - 1000);
      
      // Finalização: Imagem normal
      setTimeout(() => {
        setCurrentEffect("normal");
        setIsGenerating(false);
      }, TOTAL_ANIMATION_DURATION);
    }
  }, [image, isGenerating]);

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
    if (imageSource && !isGenerating) {
      showImageViewer({
        source: imageSource,
        isLiked: localIsLiked,
        message
      });
    }
  };

  // Componente de ruído visual
  const NoiseOverlay = () => {
    if (currentEffect !== "noise" && currentEffect !== "pixelated") return null;
    
    return (
      <Animated.View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
          opacity: noiseOpacity,
          zIndex: 2,
          borderRadius: BORDER_RADIUS - 2,
        }}
      />
    );
  };
  
  // Componente de hue-rotate dinâmico
  const HueRotateOverlay = () => {
    if (currentEffect === "normal") return null;
    
    // Interpolar o valor do hue-rotate para cores diferentes
    const hueRotateInterpolation = hueRotateValue.interpolate({
      inputRange: [0, 60, 120, 180, 240, 300, 360],
      outputRange: [
        'rgba(255, 0, 0, 0.2)',    // Vermelho
        'rgba(255, 165, 0, 0.2)',  // Laranja
        'rgba(255, 255, 0, 0.2)',  // Amarelo
        'rgba(0, 255, 0, 0.2)',    // Verde
        'rgba(0, 0, 255, 0.2)',    // Azul
        'rgba(128, 0, 128, 0.2)',  // Roxo
        'rgba(255, 0, 0, 0.2)'     // Volta para vermelho
      ]
    });
    
    return (
      <Animated.View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: hueRotateInterpolation,
          zIndex: 1,
          borderRadius: BORDER_RADIUS - 2,
        }}
      />
    );
  };
  
  // Componente ActivityIndicator com animação de rotação personalizada
  const LoadingIndicator = () => {
    if (!isGenerating) return null;
    
    // Interpolar a rotação para uma animação de 360 graus
    const spin = spinAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator 
          size="large" 
          color="#ffffff" 
          style={styles.activityIndicator} 
        />
      </View>
    );
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
            disabled={isGenerating}
          >
            <Animated.View 
              style={[
                styles.imageWrapper,
                {
                  opacity: imageOpacity,
                }
              ]}
            >
              <Animated.Image
                source={imageSource}
                style={styles.image}
                blurRadius={blurRadius}
              />
            </Animated.View>
            
            <NoiseOverlay />
            <HueRotateOverlay />
            <LoadingIndicator />
            
            {/* Timestamp com BlurView para imagens */}
            {formattedTime && !isGenerating ? (
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
  imageWrapper: {
    width: BUBBLE_MAX_WIDTH,
    height: BUBBLE_MAX_WIDTH * 0.75,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS - 2,
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
  // Estilos para o ActivityIndicator
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  activityIndicator: {
    transform: [{ scale: 1.2 }], // Slightly smaller indicator
  },
});
