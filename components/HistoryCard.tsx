import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { HistoryItem } from "../context/HistoryContext";
import { imageDescriptionMapping } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Definir um tipo para as chaves do imageMap
type ImageKey = 'cat-in-space' | 'sunset-beach' | 'fantasy-castle' | 
  'cyberpunk-city' | 'cute-animals' | 'colorful-landscape' | 
  'sci-fi-portrait' | 'abstract-art';

// Mapeamento estático para as imagens
const imageMap: Record<ImageKey, any> = {
  'cat-in-space': require('../assets/samples/cat-in-space.jpeg'),
  'sunset-beach': require('../assets/samples/sunset-beach.jpeg'),
  'fantasy-castle': require('../assets/samples/fantasy-castle.jpeg'),
  'cyberpunk-city': require('../assets/samples/cyberpunk-city.jpeg'),
  'cute-animals': require('../assets/samples/cute-animals.jpeg'),
  'colorful-landscape': require('../assets/samples/colorful-landscape.jpeg'),
  'sci-fi-portrait': require('../assets/samples/sci-fi-portrait.jpeg'),
  'abstract-art': require('../assets/samples/abstract-art.jpeg'),
};

interface HistoryCardProps {
  item: HistoryItem;
  onToggleExpand: () => void;
  onDelete: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onToggleExpand,
  onDelete,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Determina a imagem correta com base no prompt
  const imageSource = useMemo(() => {
    if (item.type !== 'image') return null;

    // Verifica se o prompt corresponde a alguma das descrições predefinidas
    const matchingImage = imageDescriptionMapping.find(
      mapping => mapping.english === item.prompt || mapping.portuguese === item.prompt
    );

    if (matchingImage && matchingImage.filename in imageMap) {
      // Se encontrar uma correspondência, usa a imagem específica
      return imageMap[matchingImage.filename as ImageKey];
    }

    // Fallback para guilherme.jpeg se nada funcionar
    return require('../assets/guilherme.jpeg');
  }, [item]);

  // Format the timestamp
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  // Render different card types
  const renderCardContent = () => {
    switch (item.type) {
      case "simulated":
        return (
          <>
            <View style={styles.badgeContainer}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                Chat
              </Text>
            </View>
            <Text
              style={[styles.previewText, { color: colors.text }]}
              numberOfLines={item.expanded ? undefined : 2}
            >
              {item.response || ""}
            </Text>
          </>
        );

      case "image":
        return (
          <View style={styles.imageCardContent}>
            {imageSource && (
              <Image
                source={imageSource}
                style={styles.thumbnail}
              />
            )}
            <View style={styles.imageTextContainer}>
              <View style={styles.badgeContainer}>
                <Ionicons name="image-outline" size={16} color="#7E57C2" />
                <Text style={[styles.badgeText, { color: "#7E57C2" }]}>
                  Imagem
                </Text>
              </View>
              <Text
                style={[styles.promptSummary, { color: colors.text }]}
                numberOfLines={item.expanded ? undefined : 2}
              >
                {item.prompt || ""}
              </Text>
            </View>
          </View>
        );

      case "error":
        return (
          <>
            <View style={styles.errorHeader}>
              <Ionicons name="warning-outline" size={20} color={colors.error} />
              <Text style={[styles.badgeText, { color: colors.error, marginLeft: 4 }]}>
                Erro
              </Text>
            </View>
            <Text
              style={[styles.errorSubtitle, { color: colors.text }]}
              numberOfLines={item.expanded ? undefined : 2}
            >
              {t("history.failed_to_get_suggestion")}
            </Text>
          </>
        );

      default:
        return null;
    }
  };

  // Render expanded details
  const renderExpandedDetails = () => {
    if (!item.expanded) return null;

    return (
      <Animated.View style={styles.expandedContent}>
        <View style={[styles.detailsContainer, { borderTopColor: colors.surface }]}>
          {item.prompt && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                Prompt:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {item.prompt}
              </Text>
            </View>
          )}

          {item.response && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                Resposta:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {item.response}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtext }]}>
              Data:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDate(item.timestamp)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtext }]}>
              Tokens:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {item.tokensUsed}
            </Text>
          </View>

          {item.model && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>
                Modelo:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {item.model}
              </Text>
            </View>
          )}

          {item.type === "image" && (
            <Image
              source={imageSource}
              style={[styles.fullImage, { backgroundColor: colors.background }]}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" style={styles.deleteIcon} />
            <Text style={styles.deleteButtonText}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onToggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {renderCardContent()}
        <Ionicons
          name={item.expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.subtext}
          style={styles.chevron}
        />
      </View>
      {renderExpandedDetails()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  previewText: {
    flex: 1,
    fontSize: 14,
    paddingRight: 24,
  },
  imageCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  imageTextContainer: {
    flex: 1,
  },
  promptSummary: {
    fontSize: 14,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    flex: 1,
    paddingRight: 24,
  },
  chevron: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  expandedContent: {
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  fullImage: {
    width: SCREEN_WIDTH - 64,
    height: SCREEN_WIDTH - 64,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    alignSelf: "center",
  },
  deleteButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  deleteIcon: {
    marginRight: 6
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
}); 