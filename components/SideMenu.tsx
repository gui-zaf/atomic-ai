import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Switch,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
  darkMode?: boolean;
  onToggleDarkMode?: (value: boolean) => void;
  onBuyTokens?: () => void;
  onNewChat?: () => void;
  onOpenGallery?: () => void;
  onOpenDevelopers?: () => void;
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.8;

const SideMenu = ({
  isVisible,
  onClose,
  userName = "Guilherme Ferraz",
  darkMode = false,
  onToggleDarkMode = () => {},
  onBuyTokens,
  onNewChat,
  onOpenGallery,
  onOpenDevelopers,
}: SideMenuProps) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [menuPosition, setMenuPosition] = React.useState(-MENU_WIDTH);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const insets = useSafeAreaInsets();

  // Track the current position of the menu
  useEffect(() => {
    const id = slideAnim.addListener(({ value }) => {
      setMenuPosition(value);
    });
    return () => slideAnim.removeListener(id);
  }, [slideAnim]);

  const getUserInitials = (name: string) => 
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isVisible,
      onMoveShouldSetPanResponder: (_, gestureState) => 
        isVisible && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -MENU_WIDTH / 3) {
          closeMenu();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      openMenu();
    } else {
      closeMenu();
    }
  }, [isVisible]);

  const openMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      if (!isVisible) return;
      onClose();
    });
  };

  if (!isVisible && !isAnimating) {
    return null;
  }

  const menuBackgroundColor = 
    darkMode && colors.menuBackground ? colors.menuBackground : colors.background;

  return (
    <View
      style={[styles.container, { pointerEvents: isVisible ? "auto" : "none" }]}
    >
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
            width: MENU_WIDTH,
            backgroundColor: menuBackgroundColor,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name="sparkles-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.headerText, { color: colors.text }]}>
              Atomic AI
            </Text>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
              Quick Actions
            </Text>

            <TouchableOpacity style={styles.menuItem} onPress={onNewChat}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.text}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                New Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onOpenGallery}>
              <Ionicons name="images-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          {/* Store Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
              Store
            </Text>

            <TouchableOpacity style={styles.menuItem} onPress={onBuyTokens}>
              <Ionicons name="flash-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Buy Tokens
              </Text>
            </TouchableOpacity>
          </View>

          {/* Adjusts Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
              Settings
            </Text>

            <View style={styles.menuItem}>
              <Ionicons
                name={darkMode ? "sunny-outline" : "moon-outline"}
                size={24}
                color={colors.text}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Text>
              <View style={styles.spacer} />
              <Switch
                value={darkMode}
                onValueChange={onToggleDarkMode}
                trackColor={{
                  false: colors.surface,
                  true: darkMode
                    ? colors.switchTrack || "#181818"
                    : colors.primary,
                }}
                thumbColor={darkMode ? colors.primary : undefined}
              />
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.text}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                About
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onOpenDevelopers}>
              <Ionicons name="code-outline" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Developers
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Profile Section in Footer */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom: insets.bottom + 16,
                borderTopColor: darkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          >
            <View style={styles.profileContainer}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.avatarText}>
                  {getUserInitials(userName)}
                </Text>
              </View>
              <Text style={[styles.userName, { color: colors.text }]}>
                {userName}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  menu: {
    height: "100%",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 24,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SideMenu;
