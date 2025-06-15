import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useTokens } from "../context/TokenContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type TokenStoreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TokenStore"
>;

interface TokenPlan {
  id: string;
  name: string;
  tokens: number;
  price: string;
  featured: boolean;
  features: {
    titleKey: string;
    included: boolean;
    icon?: string;
  }[];
  descriptionKey: string;
  color?: string;
}

const { width } = Dimensions.get("window");

const TokenStoreScreen = () => {
  const navigation = useNavigation<TokenStoreScreenNavigationProp>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { addTokens } = useTokens();
  const [selectedPlan, setSelectedPlan] = useState<TokenPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const plans: TokenPlan[] = [
    {
      id: "basic",
      name: "Neural",
      tokens: 50,
      price: "$4.99",
      featured: false,
      features: [
        { titleKey: "50 Tokens", included: true, icon: "flash" },
        { titleKey: "standardGeneration", included: true, icon: "image" },
        { titleKey: "basicChat", included: true, icon: "chatbubble" },
        { titleKey: "prioritySupport", included: false, icon: "help-circle" },
        { titleKey: "advancedFeatures", included: false, icon: "star" },
      ],
      descriptionKey: "casualUser",
    },
    {
      id: "pro",
      name: "Quantum",
      tokens: 150,
      price: "$9.99",
      featured: false,
      features: [
        { titleKey: "150 Tokens", included: true, icon: "flash" },
        { titleKey: "hdGeneration", included: true, icon: "image" },
        { titleKey: "advancedChat", included: true, icon: "chatbubble" },
        { titleKey: "prioritySupport", included: true, icon: "help-circle" },
        { titleKey: "advancedFeatures", included: false, icon: "star" },
      ],
      descriptionKey: "regularUser",
      color: "#0071E3",
    },
    {
      id: "unlimited",
      name: "Singularity",
      tokens: 500,
      price: "$19.99",
      featured: true,
      features: [
        { titleKey: "500 Tokens", included: true, icon: "flash" },
        { titleKey: "fourKGeneration", included: true, icon: "image" },
        { titleKey: "premiumChat", included: true, icon: "chatbubble" },
        { titleKey: "prioritySupport", included: true, icon: "help-circle" },
        { titleKey: "advancedFeatures", included: true, icon: "star" },
      ],
      descriptionKey: "powerUser",
    },
  ];

  const handlePlanSelect = (plan: TokenPlan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handlePurchase = () => {
    if (selectedPlan) {
      setModalVisible(false);

      // Wait a bit before showing success message (simulate purchase)
      setTimeout(() => {
        // Add tokens to user's account
        addTokens(selectedPlan.tokens);

        // Show success message
        Alert.alert(
          t("purchaseSuccessful"),
          t("tokensAdded").replace("{0}", selectedPlan.tokens.toString()),
          [{ text: t("ok"), onPress: () => navigation.goBack() }],
        );
      }, 1000);
    }
  };

  const renderFeatureItem = (feature: {
    titleKey: string;
    included: boolean;
    icon?: string;
  }) => (
    <View key={feature.titleKey} style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        {feature.icon && (
          <Ionicons
            name={feature.icon as any}
            size={16}
            color={feature.included ? colors.primary : colors.subtext}
          />
        )}
      </View>
      <Text
        style={[
          styles.featureText,
          {
            color: feature.included ? colors.text : colors.subtext,
            textDecorationLine: feature.included ? "none" : "line-through",
          },
        ]}
      >
        {feature.titleKey.includes("Tokens")
          ? feature.titleKey
          : t(feature.titleKey)}
      </Text>
      <Ionicons
        name={feature.included ? "checkmark-circle" : "close-circle"}
        size={18}
        color={feature.included ? colors.primary : colors.subtext}
        style={styles.checkIcon}
      />
    </View>
  );

  const renderPlanCard = (plan: TokenPlan) => {
    const isFeatured = plan.featured;
    const planColor = plan.color || colors.primary;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          {
            backgroundColor: colors.surface,
            borderColor: isFeatured ? planColor : "transparent",
            borderWidth: isFeatured ? 2 : 0,
          },
        ]}
        onPress={() => handlePlanSelect(plan)}
        activeOpacity={0.7}
      >
        {isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: planColor }]}>
            <Text style={styles.featuredText}>{t("bestValue")}</Text>
          </View>
        )}

        <Text
          style={[
            styles.planName,
            { color: colors.text },
            isFeatured && { color: planColor },
          ]}
        >
          {plan.name}
        </Text>

        <View style={styles.tokenContainer}>
          <Ionicons
            name="flash"
            size={20}
            color={isFeatured ? planColor : colors.primary}
          />
          <Text
            style={[
              styles.tokenAmount,
              { color: isFeatured ? planColor : colors.primary },
            ]}
          >
            {plan.tokens}
          </Text>
          <Text style={[styles.tokenLabel, { color: colors.subtext }]}>
            {t("tokens")}
          </Text>
        </View>

        <Text style={[styles.planPrice, { color: colors.text }]}>
          {plan.price}
        </Text>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature) => renderFeatureItem(feature))}
        </View>

        <Text style={[styles.planDescription, { color: colors.subtext }]}>
          {t(plan.descriptionKey)}
        </Text>

        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: isFeatured ? planColor : colors.primary },
          ]}
          onPress={() => handlePlanSelect(plan)}
        >
          <Text style={styles.buyButtonText}>{t("buyNow")}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t("tokenStoreTitle")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="flash" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.introTitle, { color: colors.text }]}>
              {t("powerUpAI")}
            </Text>
            <Text style={[styles.introText, { color: colors.subtext }]}>
              {t("purchaseTokensDescription")}
            </Text>
          </View>

          <View style={styles.plansContainer}>
            {plans.map((plan) => renderPlanCard(plan))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Purchase Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          edges={["top", "bottom"]}
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          ]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t("confirmPurchase")}
            </Text>
            {selectedPlan && (
              <>
                <Text
                  style={[styles.modalDescription, { color: colors.subtext }]}
                >
                  {t("aboutToPurchase")
                    .replace("{0}", selectedPlan.tokens.toString())
                    .replace("{1}", selectedPlan.price)}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.cancelButton,
                      { backgroundColor: colors.surface },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={[styles.cancelButtonText, { color: colors.text }]}
                    >
                      {t("cancel")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.confirmButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handlePurchase}
                  >
                    <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  introContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0, 113, 227, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  introText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  plansContainer: {
    marginTop: 16,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  featuredBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
  },
  featuredText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tokenAmount: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 4,
  },
  tokenLabel: {
    fontSize: 16,
    marginLeft: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIconContainer: {
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  checkIcon: {
    marginLeft: 8,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  buyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  confirmButton: {},
  cancelButtonText: {
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default TokenStoreScreen;
