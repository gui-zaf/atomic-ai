import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTokens } from "../context/TokenContext";

interface TokenStoreScreenProps {
  onClose: () => void;
}

interface TokenPlan {
  id: string;
  name: string;
  tokens: number;
  price: string;
  featured: boolean;
  features: {
    title: string;
    included: boolean;
    icon?: string;
  }[];
  description: string;
  color?: string;
}

const { width } = Dimensions.get("window");

const plans: TokenPlan[] = [
  {
    id: "basic",
    name: "Neural",
    tokens: 50,
    price: "$4.99",
    featured: false,
    features: [
      { title: "50 Tokens", included: true, icon: "flash" },
      { title: "Standard Generation", included: true, icon: "image" },
      { title: "Basic Chat", included: true, icon: "chatbubble" },
      { title: "Priority Support", included: false, icon: "help-circle" },
      { title: "Advanced Features", included: false, icon: "star" },
    ],
    description:
      "Perfect for casual users looking to explore AI capabilities with basic features.",
  },
  {
    id: "pro",
    name: "Quantum",
    tokens: 150,
    price: "$9.99",
    featured: false,
    features: [
      { title: "150 Tokens", included: true, icon: "flash" },
      { title: "HD Generation", included: true, icon: "image" },
      { title: "Advanced Chat", included: true, icon: "chatbubble" },
      { title: "Priority Support", included: true, icon: "help-circle" },
      { title: "Advanced Features", included: false, icon: "star" },
    ],
    description:
      "Our most popular plan. Perfect balance of features and value for regular users.",
    color: "#0071E3",
  },
  {
    id: "unlimited",
    name: "Singularity",
    tokens: 500,
    price: "$19.99",
    featured: true,
    features: [
      { title: "500 Tokens", included: true, icon: "flash" },
      { title: "4K Generation", included: true, icon: "image" },
      { title: "Premium Chat", included: true, icon: "chatbubble" },
      { title: "Priority Support", included: true, icon: "help-circle" },
      { title: "Advanced Features", included: true, icon: "star" },
    ],
    description:
      "For power users who need it all. Unlimited access to our most advanced AI features.",
  },
];

const TokenStoreScreen = ({ onClose }: TokenStoreScreenProps) => {
  const { colors, isDarkMode } = useTheme();
  const { addTokens } = useTokens();
  const [selectedPlan, setSelectedPlan] = useState<TokenPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Configure pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        // Only capture horizontal swipes that start from the left edge
        return (
          gestureState.dx > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 &&
          evt.nativeEvent.pageX < 50
        );
      },
      onPanResponderGrant: () => {
        // When gesture starts
      },
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        // No longer moving the screen horizontally
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        // If swiped far enough, trigger the close animation
        if (gestureState.dx > width * 0.25) {
          handleClose();
        }
      },
    })
  ).current;

  // Start entrance animation when component mounts
  useEffect(() => {
    // Começar animação após um pequeno delay para garantir que o background já esteja aplicado
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
      ]).start();
    }, 50);
  }, []);

  // Handle back button with animation
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handlePlanSelect = (plan: TokenPlan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handlePurchase = () => {
    if (selectedPlan) {
      setModalVisible(false);

      // Show loading or processing indicator here if needed

      // Wait a bit before showing success message (simulate purchase)
      setTimeout(() => {
        // Add the tokens from the selected plan
        addTokens(selectedPlan.tokens);

        Alert.alert(
          "Purchase Successful!",
          `You've purchased ${selectedPlan.tokens} tokens with the ${selectedPlan.name} plan!`,
          [{ text: "OK", onPress: handleClose }]
        );
      }, 1000);
    }
  };

  return (
    <>
      {/* Background layer to cover any white flashes */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.background, zIndex: 99 },
        ]}
      />

      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            backgroundColor: colors.background,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              Token Store
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Choose Your AI Plan
            </Text>

            <View style={styles.plansContainer}>
              {plans.map((plan, index) => (
                <Animated.View
                  key={plan.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + index * 20],
                        }),
                      },
                      { scale: scaleAnim },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.planCard,
                      { backgroundColor: colors.surface },
                      plan.featured && [
                        styles.featuredCard,
                        {
                          backgroundColor: isDarkMode
                            ? colors.primaryBackground
                            : colors.surface,
                          borderColor: plan.color || colors.primary,
                        },
                      ],
                    ]}
                    onPress={() => handlePlanSelect(plan)}
                    activeOpacity={0.7}
                  >
                    {plan.featured && (
                      <View
                        style={[
                          styles.featuredBadge,
                          { backgroundColor: plan.color || colors.primary },
                        ]}
                      >
                        <Text style={styles.featuredText}>Best Value</Text>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.planName,
                        { color: colors.text },
                        plan.featured && {
                          color: plan.color || colors.primary,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {plan.name}
                    </Text>

                    <View style={styles.tokenContainer}>
                      <Ionicons
                        name="flash"
                        size={24}
                        color={
                          plan.featured
                            ? plan.color || colors.primary
                            : colors.primary
                        }
                      />
                      <Text style={[styles.tokenCount, { color: colors.text }]}>
                        {plan.tokens}
                      </Text>
                    </View>

                    <Text style={[styles.price, { color: colors.text }]}>
                      {plan.price}
                    </Text>

                    <View style={styles.featuresList}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Ionicons
                            name={
                              feature.included
                                ? "checkmark-circle"
                                : "close-circle"
                            }
                            size={18}
                            color={
                              feature.included ? colors.primary : colors.subtext
                            }
                          />
                          <Text
                            style={[
                              styles.featureText,
                              {
                                color: feature.included
                                  ? colors.text
                                  : colors.subtext,
                              },
                            ]}
                          >
                            {feature.title}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        {
                          backgroundColor: plan.featured
                            ? plan.color || colors.primary
                            : colors.surface,
                          borderColor: plan.color || colors.primary,
                        },
                      ]}
                      onPress={() => handlePlanSelect(plan)}
                    >
                      <Text
                        style={[
                          styles.selectButtonText,
                          {
                            color: plan.featured
                              ? "white"
                              : plan.color || colors.primary,
                          },
                        ]}
                      >
                        Select Plan
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, { color: colors.subtext }]}>
                * Tokens are used for AI-generated content
              </Text>
              <Text style={[styles.infoText, { color: colors.subtext }]}>
                * Free tokens recharge every 12 hours
              </Text>
            </View>
          </ScrollView>

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.background },
                ]}
              >
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                {selectedPlan && (
                  <>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {selectedPlan.name} Plan
                    </Text>

                    <View style={styles.modalTokenContainer}>
                      <Ionicons name="flash" size={32} color={colors.primary} />
                      <Text
                        style={[styles.modalTokenCount, { color: colors.text }]}
                      >
                        {selectedPlan.tokens} Tokens
                      </Text>
                    </View>

                    <Text
                      style={[styles.modalDescription, { color: colors.text }]}
                    >
                      {selectedPlan.description}
                    </Text>

                    <Text style={[styles.modalPrice, { color: colors.text }]}>
                      {selectedPlan.price}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={handlePurchase}
                    >
                      <Text style={styles.purchaseButtonText}>
                        Purchase Now
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  plansContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  featuredCard: {
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  featuredText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  planName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tokenCount: {
    fontSize: 28,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  featuresList: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 15,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  modalTokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  modalTokenCount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  modalPrice: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  purchaseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TokenStoreScreen;
