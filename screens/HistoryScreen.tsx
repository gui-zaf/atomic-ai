import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useHistory, HistoryItem } from "../context/HistoryContext";
import { HistoryCard } from "../components/HistoryCard";

type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "History"
>;

type Props = {
  navigation: HistoryScreenNavigationProp;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { historyItems, toggleExpandItem, deleteHistoryItem } = useHistory();

  // Animation for list items
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: HistoryItem;
    index: number;
  }) => {
    const animationDelay = index * 100;

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
        <HistoryCard
          item={item}
          onToggleExpand={() => toggleExpandItem(item.id)}
          onDelete={() => deleteHistoryItem(item.id)}
        />
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="time-outline"
        size={80}
        color={colors.primary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {t("noRequestHistory")}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
        {t("historyWillAppear")}
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="chatbubble-outline"
          size={22}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>{t("startConversation")}</Text>
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
            Histórico
          </Text>
          {historyItems.length > 0 && (
            <TouchableOpacity
              style={styles.headerRight}
              onPress={() => {
                // Implement clear all functionality
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
          {historyItems.length === 0 && <View style={styles.headerRight} />}
        </View>

        {historyItems.length > 0 ? (
          <>
            <View
              style={[styles.statsBar, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.statsText, { color: colors.subtext }]}>
                {historyItems.length}{" "}
                {historyItems.length === 1 ? "interação" : "interações"}
              </Text>
            </View>
            <FlatList
              data={historyItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
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
    fontSize: 20,
    fontWeight: "700",
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  statsBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
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

export default HistoryScreen;
