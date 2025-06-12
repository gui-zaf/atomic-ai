import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
  ToastAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useImageViewer } from "../context/ImageViewerContext";
import { addToggleLikeListener } from "../components/GlobalImageViewer";

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
};

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { showImageViewer } = useImageViewer();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: "1",
      source: require("../assets/carousel/sample-01.jpeg"),
      isLiked: false,
      description: "Abstract Art #1",
    },
    {
      id: "2",
      source: require("../assets/carousel/sample-02.jpeg"),
      isLiked: true,
      description: "Abstract Art #2",
    },
    {
      id: "3",
      source: require("../assets/carousel/sample-03.jpeg"),
      isLiked: false,
      description: "Abstract Art #3",
    },
    {
      id: "4",
      source: require("../assets/carousel/sample-04.jpeg"),
      isLiked: true,
      description: "Abstract Art #4",
    }
  ]);
  
  // Estado para controlar o feedback de exclusão
  const [isDeleting, setIsDeleting] = useState(false);
  const deletedItemId = useRef<string | null>(null);

  // Função para atualizar o estado de like de uma imagem
  const handleToggleLike = useCallback((imageId: string, newLikeState: boolean) => {
    setGalleryImages(prevImages => 
      prevImages.map(img => 
        img.id === imageId ? { ...img, isLiked: newLikeState } : img
      )
    );
  }, []);

  // Registra um listener global para likes quando o componente é montado
  React.useEffect(() => {
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

  const handleImagePress = (item: GalleryImage) => {
    // Armazena o ID da imagem sendo visualizada
    currentViewingImageId.current = item.id;
    
    showImageViewer(
      {
        id: item.id,
        source: item.source,
        isLiked: item.isLiked,
        message: item.description,
      },
      {
        isGalleryMode: true,
        onDeleteImage: handleDeleteImage,
      }
    );
  };

  // Função auxiliar para mostrar feedback
  const showFeedback = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // No iOS, podemos usar um Alert simples ou implementar um toast customizado
      Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
    }
  };

  const handleDeleteImage = (id: string) => {
    // Limpar a referência ao ID da imagem atual se for a mesma que está sendo excluída
    if (currentViewingImageId.current === id) {
      currentViewingImageId.current = null;
    }
    
    // Marcar como excluindo e armazenar o ID da imagem
    setIsDeleting(true);
    deletedItemId.current = id;
    
    // Mostrar feedback
    showFeedback('Imagem excluída com sucesso');
    
    // Remover a imagem da lista com um pequeno atraso para o efeito visual
    setTimeout(() => {
      setGalleryImages(prevImages => 
        prevImages.filter(image => image.id !== id)
      );
      setIsDeleting(false);
      deletedItemId.current = null;
    }, 300);
  };

  const renderItem = ({ item }: { item: GalleryImage }) => {
    // Aplicar efeito visual se o item estiver sendo excluído
    const isBeingDeleted = isDeleting && deletedItemId.current === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.imageContainer,
          isBeingDeleted && styles.deletingImage
        ]}
        onPress={() => handleImagePress(item)}
        activeOpacity={0.8}
        disabled={isBeingDeleted}
      >
        <Image 
          source={item.source} 
          style={[
            styles.image,
            isBeingDeleted && { opacity: 0.5 }
          ]} 
        />
        {item.isLiked && (
          <View style={styles.likeIconContainer}>
            <Ionicons name="heart" size={22} color="#FF3B30" />
          </View>
        )}
        {isBeingDeleted && (
          <View style={styles.deletingOverlay}>
            <Ionicons name="trash" size={32} color="#FF3B30" />
          </View>
        )}
      </TouchableOpacity>
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
        Nenhuma imagem na galeria
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
        Use o comando "/image" no chat para gerar novas imagens
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Criar nova imagem</Text>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Galeria</Text>
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
            extraData={[galleryImages, isDeleting, deletedItemId.current]} // Força rerender quando esses estados mudam
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  deletingImage: {
    transform: [{ scale: 0.95 }],
  },
  deletingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
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
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
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