import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SuggestionCarouselProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const suggestions = [
  { id: '1', text: 'Cat in space', icon: 'planet', description: 'A cosmic feline floating among stars and galaxies, with a playful expression.' },
  { id: '2', text: 'Sunset beach', icon: 'sunny', description: 'A serene beach at sunset with golden sands and colorful sky reflecting on gentle waves.' },
  { id: '3', text: 'Fantasy castle', icon: 'home', description: 'A magnificent castle with tall towers and magical elements, surrounded by a mystical landscape.' },
  { id: '4', text: 'Cyberpunk city', icon: 'flash', description: 'A futuristic neon-lit cityscape with towering skyscrapers and flying vehicles in a rainy night.' },
  { id: '5', text: 'Cute animals', icon: 'paw', description: 'Adorable animals in a cheerful meadow, playing together under a bright sunny sky.' },
  { id: '6', text: 'Colorful landscape', icon: 'color-palette', description: 'A vibrant landscape with rolling hills, flowing rivers, and a rainbow in the clear blue sky.' },
  { id: '7', text: 'Sci-fi portrait', icon: 'person', description: 'A detailed portrait with futuristic elements, cybernetic enhancements, and glowing details.' },
  { id: '8', text: 'Abstract art', icon: 'color-wand', description: 'A mesmerizing abstract composition with swirling shapes, bold colors, and dynamic patterns.' }
];

const { width } = Dimensions.get('window');

const SuggestionCarousel = ({ onSelectSuggestion }: SuggestionCarouselProps) => {
  const { colors } = useTheme();
  const isScrolling = useRef(false);
  
  // Create a pan responder to handle all touch interactions in the carousel
  const panResponder = useRef(
    PanResponder.create({
      // Claim responder when touch starts
      onStartShouldSetPanResponder: () => true,
      
      // Claim responder during movement
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // If horizontal movement is detected, claim the responder
        if (Math.abs(gestureState.dx) > 5) {
          isScrolling.current = true;
          return true;
        }
        return false;
      },
      
      // Track when scrolling ends
      onPanResponderRelease: () => {
        // Add small delay before resetting scroll state
        setTimeout(() => {
          isScrolling.current = false;
        }, 50);
      },
      
      // Handle termination (in case of interruption)
      onPanResponderTerminate: () => {
        isScrolling.current = false;
      },
      
      // Don't block native components like ScrollView
      onShouldBlockNativeResponder: () => false,
    })
  ).current;
  
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={[styles.sectionHeader, { color: colors.subtext }]}>
        Suggestions
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        // These props help prevent conflicts with side menu gestures
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[
              styles.suggestionBox,
              { backgroundColor: colors.surface }
            ]}
            onPress={() => onSelectSuggestion(suggestion.description)}
          >
            <Ionicons name={suggestion.icon as any} size={20} color={colors.primary} />
            <Text
              style={[styles.suggestionText, { color: colors.text }]}
              numberOfLines={1}
            >
              {suggestion.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 18,
    maxWidth: width * 0.5,
    minWidth: width * 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SuggestionCarousel; 