import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
  darkMode?: boolean;
  onToggleDarkMode?: (value: boolean) => void;
}

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

const SideMenu = ({ 
  isVisible, 
  onClose, 
  userName = 'Guilherme Ferraz',
  darkMode = false,
  onToggleDarkMode = () => {},
}: SideMenuProps) => {
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

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => isVisible,
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

  // Completely unmount when not visible and not animating
  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { pointerEvents: isVisible ? 'auto' : 'none' }
    ]}>
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.menu,
          { transform: [{ translateX: slideAnim }], width: MENU_WIDTH },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
            <Text style={styles.headerText}>Atomic AI</Text>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>New Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="images-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* Store Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="flash-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>Buy Tokens</Text>
            </TouchableOpacity>
          </View>

          {/* Adjusts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.menuItem}>
              <Ionicons name="moon-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
              <View style={styles.spacer} />
              <Switch
                value={darkMode}
                onValueChange={onToggleDarkMode}
                trackColor={{ false: colors.surface, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="code-outline" size={24} color={colors.text} />
              <Text style={styles.menuItemText}>Developers</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Profile Section in Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getUserInitials(userName)}</Text>
              </View>
              <Text style={styles.userName}>{userName}</Text>
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
    backgroundColor: 'black',
  },
  menu: {
    height: '100%',
    backgroundColor: colors.background,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 24,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default SideMenu; 