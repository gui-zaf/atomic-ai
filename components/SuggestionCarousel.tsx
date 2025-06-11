import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeader, { color: colors.subtext }]}>
        Suggestions
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        // Enhanced props to prevent conflicts with other gesture handlers
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        decelerationRate="fast"
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        // Better gesture isolation
        disableIntervalMomentum={true}
        pagingEnabled={false}
        snapToAlignment="start"
        removeClippedSubviews={false}
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
    zIndex: 20,
    elevation: 20,
    position: 'relative',
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
    elevation: 2,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SuggestionCarousel; 