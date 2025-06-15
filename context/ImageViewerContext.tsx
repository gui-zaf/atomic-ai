import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ImageData = {
  source: any;
  isLiked: boolean;
  message?: string;
  id?: string; // ID da imagem para operações como exclusão
  likeCount?: number; // Contador de likes
};

interface ImageViewerContextType {
  showImageViewer: (imageData: ImageData, options?: ViewerOptions) => void;
  hideImageViewer: () => void;
  currentImage: ImageData | null;
  isVisible: boolean;
  toggleLike: () => void;
  onDeleteImage?: (id: string) => void;
  onToggleLike?: (isLiked: boolean) => void;
  isGalleryMode: boolean;
}

type ViewerOptions = {
  isGalleryMode?: boolean;
  onDeleteImage?: (id: string) => void;
  onToggleLike?: (isLiked: boolean) => void;
};

const ImageViewerContext = createContext<ImageViewerContextType | undefined>(
  undefined,
);

export const ImageViewerProvider = ({ children }: { children: ReactNode }) => {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [onDeleteImage, setOnDeleteImage] = useState<
    ((id: string) => void) | undefined
  >(undefined);
  const [onToggleLike, setOnToggleLike] = useState<
    ((isLiked: boolean) => void) | undefined
  >(undefined);

  const showImageViewer = useCallback((imageData: ImageData, options?: ViewerOptions) => {
    // Ensure imageData has a valid ID or generate one if missing
    const validatedImageData = {
      ...imageData,
      id: imageData.id || `img_${Date.now()}`,
      likeCount: imageData.likeCount || 0
    };
    
    setCurrentImage(validatedImageData);
    setIsVisible(true);
    setIsGalleryMode(options?.isGalleryMode || false);
    setOnDeleteImage(options?.onDeleteImage);
    setOnToggleLike(options?.onToggleLike);
  }, []);

  const hideImageViewer = useCallback(() => {
    setIsVisible(false);
    // Limpar a imagem após a animação de saída
    setTimeout(() => {
      setCurrentImage(null);
      setIsGalleryMode(false);
      setOnDeleteImage(undefined);
      setOnToggleLike(undefined);
    }, 300);
  }, []);

  const toggleLike = useCallback(() => {
    if (currentImage) {
      const newLikeState = !currentImage.isLiked;
      
      // Cria uma cópia do objeto para evitar mutações diretas
      setCurrentImage((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isLiked: newLikeState,
          likeCount: newLikeState ? 1 : 0, // Atualiza o contador de likes
        };
      });
      
      // Chama o callback se existir
      if (onToggleLike) {
        onToggleLike(newLikeState);
      }
    }
  }, [currentImage, onToggleLike]);

  // Memorizar o value do context para evitar renderizações desnecessárias
  const contextValue = React.useMemo(() => ({
    showImageViewer,
    hideImageViewer,
    currentImage,
    isVisible,
    toggleLike,
    onDeleteImage,
    onToggleLike,
    isGalleryMode,
  }), [
    showImageViewer,
    hideImageViewer,
    currentImage,
    isVisible,
    toggleLike,
    onDeleteImage,
    onToggleLike,
    isGalleryMode,
  ]);

  return (
    <ImageViewerContext.Provider value={contextValue}>
      {children}
    </ImageViewerContext.Provider>
  );
};

export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  if (context === undefined) {
    throw new Error(
      "useImageViewer must be used within an ImageViewerProvider",
    );
  }
  return context;
};
