import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useImageViewer } from "../context/ImageViewerContext";
import { addToggleLikeListener } from "../components/GlobalImageViewer";
import { useHistory, HistoryItem } from "../context/HistoryContext";
import { imageDescriptionMapping } from "../types";

type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Gallery"
>;

type Props = {
  navigation: GalleryScreenNavigationProp;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH / 2 - 12;

type GalleryImage = {
  id: string;
  source: any;
  isLiked: boolean;
  description: string;
  likeCount: number;
};

// Definir um tipo para as chaves do imageMap
type ImageKey =
  | "cat-in-space"
  | "sunset-beach"
  | "fantasy-castle"
  | "cyberpunk-city"
  | "cute-animals"
  | "colorful-landscape"
  | "sci-fi-portrait"
  | "abstract-art";

// Mapeamento estático para as imagens
const imageMap: Record<ImageKey, any> = {
  "cat-in-space": require("../assets/samples/cat-in-space.jpeg"),
  "sunset-beach": require("../assets/samples/sunset-beach.jpeg"),
  "fantasy-castle": require("../assets/samples/fantasy-castle.jpeg"),
  "cyberpunk-city": require("../assets/samples/cyberpunk-city.jpeg"),
  "cute-animals": require("../assets/samples/cute-animals.jpeg"),
  "colorful-landscape": require("../assets/samples/colorful-landscape.jpeg"),
  "sci-fi-portrait": require("../assets/samples/sci-fi-portrait.jpeg"),
  "abstract-art": require("../assets/samples/abstract-art.jpeg"),
};

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { showImageViewer } = useImageViewer();
  const { historyItems, updateLikeStatus } = useHistory();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Animation for list items
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Determina a imagem correta com base no prompt
  const getImageSource = useCallback((prompt: string) => {
    // Verifica se o prompt corresponde a alguma das descrições predefinidas
    const matchingImage = imageDescriptionMapping.find(
      (mapping) =>
        mapping.english === prompt || mapping.portuguese === prompt,
    );

    if (matchingImage && matchingImage.filename in imageMap) {
      // Se encontrar uma correspondência, usa a imagem específica
      return imageMap[matchingImage.filename as ImageKey];
    }

    // Fallback para uma imagem padrão
    return require("../assets/samples/abstract-art.jpeg");
  }, []);

  // Filtrar apenas imagens do histórico e transformá-las em imagens da galeria
  useEffect(() => {
    const imageHistoryItems = historyItems.filter(item => item.type === "image");
    
    const galleryImagesFromHistory = imageHistoryItems.map(item => {
      return {
        id: item.id,
        source: getImageSource(item.prompt || ""),
        isLiked: item.isLiked || false,
        description: item.prompt || "",
        likeCount: item.likeCount || 0,
      };
    });
    
    setGalleryImages(galleryImagesFromHistory);
  }, [historyItems, getImageSource]);

  // Função para atualizar o estado de like de uma imagem
  const handleToggleLike = useCallback(
    (imageId: string, newLikeState: boolean) => {
      // Atualizar o estado local
      setGalleryImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId 
            ? { 
                ...img, 
                isLiked: newLikeState,
                likeCount: newLikeState ? 1 : 0 // Incrementa ou zera o contador de likes
              } 
            : img
        ),
      );
      
      // Atualizar o estado no contexto do histórico para persistência
      updateLikeStatus(imageId, newLikeState);
    },
    [updateLikeStatus],
  );

  // Registra um listener global para likes quando o componente é montado
  useEffect(() => {
    const removeListener = addToggleLikeListener((newIsLiked) => {
      // Atualizar o estado da imagem atual
      if (currentViewingImageId.current) {
        handleToggleLike(currentViewingImageId.current, newIsLiked);
      }
    });

    return () => {
      removeListener();
    };
  }, [handleToggleLike]);

  // Referência para armazenar o ID da imagem que está sendo visualizada atualmente
  const currentViewingImageId = React.useRef<string | null>(null);

  // Criar callbacks para cada imagem que serão usados no imageViewer
  const createToggleLikeHandler = useCallback((imageId: string) => {
    // Retorna uma função que será chamada pelo ImageViewer
    return (newLikeState: boolean) => {
      handleToggleLike(imageId, newLikeState);
    };
  }, [handleToggleLike]);

  const handleImagePress = (item: GalleryImage) => {
    // Ensure the item has a valid ID before proceeding
    if (!item.id) {
      console.error("Cannot view image with invalid ID");
      return;
    }
    
    // Armazena o ID da imagem sendo visualizada
    currentViewingImageId.current = item.id;

    showImageViewer(
      {
        id: item.id,
        source: item.source,
        isLiked: item.isLiked,
        message: item.description,
        likeCount: item.likeCount,
      },
      {
        isGalleryMode: false, // Não mostra opção de exclusão na galeria
        onToggleLike: createToggleLikeHandler(item.id),
      },
    );
  };

  const renderItem = ({ item, index }: { item: GalleryImage, index: number }) => {
    const animationDelay = index * 50;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleImagePress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={item.source}
            style={styles.image}
          />
          {item.isLiked && (
            <View style={styles.likeIconContainer}>
              <Ionicons name="heart" size={22} color="#FF3B30" />
              <Text style={styles.likeCountText}>{item.likeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="images-outline"
        size={80}
        color={colors.primary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {t("noImagesInGallery")}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
        {t("createImageInstructions")}
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="add"
          size={22}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>{t("createNewImage")}</Text>
      </TouchableOpacity>
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
            {t("galleryTitle")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {galleryImages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={galleryImages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            extraData={[galleryImages]} // Força rerender quando o estado muda
          />
        )}
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
  list: {
    padding: 4,
  },
  imageContainer: {
    margin: 4,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  likeIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  likeCountText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default GalleryScreen;
