import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
  Share,
  ActionSheetIOS,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { ImageViewer } from "../components/ImageViewer";

interface GalleryScreenProps {
  onClose: () => void;
  onNavigateToChat: () => void;
}

interface GalleryImage {
  id: string;
  source: any;
  isLiked: boolean;
  animatedValue?: Animated.Value;
}

const { width } = Dimensions.get("window");
const imageSize = (width - 48) / 2; // 16px padding + 16px gap

const initialImages: GalleryImage[] = [
  { id: "1", source: require("../assets/carousel/sample-01.jpeg"), isLiked: false, animatedValue: new Animated.Value(1) },
  { id: "2", source: require("../assets/carousel/sample-02.jpeg"), isLiked: false, animatedValue: new Animated.Value(1) },
  { id: "3", source: require("../assets/carousel/sample-03.jpeg"), isLiked: false, animatedValue: new Animated.Value(1) },
  { id: "4", source: require("../assets/carousel/sample-04.jpeg"), isLiked: false, animatedValue: new Animated.Value(1) },
];

const GalleryScreen = ({ onClose, onNavigateToChat }: GalleryScreenProps) => {
  const { colors } = useTheme();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  
  // Animation for screen transition
  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

  const handleToggleLike = (imageId: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, isLiked: !img.isLiked } : img
      )
    );
  };



  const handleImagePress = (image: GalleryImage) => {
    const index = images.findIndex(img => img.id === image.id);
    setSelectedImage(image);
    setSelectedIndex(index);
    setImageViewerVisible(true);
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const imageToDelete = images.find(img => img.id === imageId);
            if (imageToDelete?.animatedValue) {
              // Animate out the image being deleted
              Animated.timing(imageToDelete.animatedValue, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
              }).start(() => {
                // Remove from array after animation
                setImages(prev => prev.filter(img => img.id !== imageId));
                setImageViewerVisible(false);
                setSelectedImage(null);
              });
            } else {
              // Fallback if no animation value
              setImages(prev => prev.filter(img => img.id !== imageId));
              setImageViewerVisible(false);
              setSelectedImage(null);
            }
          }
        }
      ]
    );
  };

  const handleIndexChange = (newIndex: number) => {
    if (images[newIndex]) {
      setSelectedIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  // Sync selectedImage with images array when it changes
  React.useEffect(() => {
    if (selectedImage && images[selectedIndex]) {
      setSelectedImage(images[selectedIndex]);
    }
  }, [images, selectedIndex]);

  const handleCurrentImageToggleLike = () => {
    if (selectedImage) {
      handleToggleLike(selectedImage.id);
      // Update the selectedImage state to reflect the change immediately
      setSelectedImage(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this amazing image from Atomic AI!",
      });
    } catch (error) {
      // Silently handle sharing error
    }
  };

  const handleDownload = () => {
    Alert.alert(
      "Download",
      "Image downloaded to your device!",
      [{ text: "OK" }]
    );
  };

  const showContextMenu = (image: GalleryImage) => {
    const options = [
      image.isLiked ? "Unlike" : "Like",
      "Download", 
      "Share", 
      "Delete",
      "Cancel"
    ];
    
    const destructiveButtonIndex = 3; // Delete
    const cancelButtonIndex = 4;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          handleContextMenuAction(image, buttonIndex);
        }
      );
    } else {
      // For Android, show alert with options
      Alert.alert(
        "Image Actions",
        "Choose an action:",
        [
          {
            text: image.isLiked ? "Unlike" : "Like",
            onPress: () => handleContextMenuAction(image, 0)
          },
          {
            text: "Download",
            onPress: () => handleContextMenuAction(image, 1)
          },
          {
            text: "Share",
            onPress: () => handleContextMenuAction(image, 2)
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleContextMenuAction(image, 3)
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    }
  };

  const handleContextMenuAction = (image: GalleryImage, buttonIndex: number) => {
    switch (buttonIndex) {
      case 0: // Like/Unlike
        handleToggleLike(image.id);
        break;
      case 1: // Download
        handleDownload();
        break;
      case 2: // Share
        handleShare();
        break;
      case 3: // Delete
        handleDeleteImage(image.id);
        break;
    }
  };

  const renderImageItem = ({ item }: { item: GalleryImage }) => {
    const animatedValue = item.animatedValue || new Animated.Value(1);
    
    return (
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: animatedValue,
            transform: [{
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              })
            }],
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(item)}
          onLongPress={() => showContextMenu(item)}
          style={styles.imageContainer}
          delayLongPress={500}
        >
          <Image
            source={item.source}
            style={[
              styles.image,
              { width: imageSize, height: imageSize }
            ]}
            resizeMode="cover"
          />
          
          {/* Heart indicator for liked images */}
          {item.isLiked && (
            <View style={styles.likeIndicator}>
              <Ionicons
                name="heart"
                size={16}
                color={colors.error}
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={80} color={colors.subtext} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No images created yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
        Start creating amazing images with AI
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={onNavigateToChat}
      >
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Image</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Gallery</Text>
          <View style={styles.iconButton} />
        </View>

        {/* Content */}
        {images.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer
          isVisible={isImageViewerVisible}
          onClose={() => {
            setImageViewerVisible(false);
            setSelectedImage(null);
          }}
          imageSource={selectedImage.source}
          message="AI Generated Image"
          isLiked={selectedImage.isLiked}
          onToggleLike={handleCurrentImageToggleLike}
          onDelete={() => handleDeleteImage(selectedImage.id)}
          showDeleteButton={true}
          images={images.map(img => img.source)}
          currentIndex={selectedIndex}
          onIndexChange={handleIndexChange}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  animatedContainer: {
    marginBottom: 4,
  },
  imageContainer: {
    backgroundColor: "transparent",
    position: "relative",
  },
  image: {
    borderRadius: 12,
  },
  likeIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GalleryScreen; 