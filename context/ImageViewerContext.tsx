import React, { createContext, useContext, useState, ReactNode } from "react";

type ImageData = {
  source: any;
  isLiked: boolean;
  message?: string;
  id?: string; // ID da imagem para operações como exclusão
};

interface ImageViewerContextType {
  showImageViewer: (imageData: ImageData, options?: ViewerOptions) => void;
  hideImageViewer: () => void;
  currentImage: ImageData | null;
  isVisible: boolean;
  toggleLike: () => void;
  onDeleteImage?: (id: string) => void;
  isGalleryMode: boolean;
}

type ViewerOptions = {
  isGalleryMode?: boolean;
  onDeleteImage?: (id: string) => void;
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

  const showImageViewer = (imageData: ImageData, options?: ViewerOptions) => {
    setCurrentImage(imageData);
    setIsVisible(true);
    setIsGalleryMode(options?.isGalleryMode || false);
    setOnDeleteImage(options?.onDeleteImage);
  };

  const hideImageViewer = () => {
    setIsVisible(false);
    // Limpar a imagem após a animação de saída
    setTimeout(() => {
      setCurrentImage(null);
      setIsGalleryMode(false);
      setOnDeleteImage(undefined);
    }, 300);
  };

  const toggleLike = () => {
    if (currentImage) {
      // Cria uma cópia do objeto para evitar mutações diretas
      setCurrentImage({
        ...currentImage,
        isLiked: !currentImage.isLiked,
      });
    }
  };

  return (
    <ImageViewerContext.Provider
      value={{
        showImageViewer,
        hideImageViewer,
        currentImage,
        isVisible,
        toggleLike,
        onDeleteImage,
        isGalleryMode,
      }}
    >
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
