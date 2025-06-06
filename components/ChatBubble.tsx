import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, Share } from 'react-native';
import { colors } from '../theme/theme';
import { ImageViewer } from './ImageViewer';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  image?: string;
  isLiked: boolean;
  onToggleLike: () => void;
}

export const ChatBubble = ({ message, isUser, image, isLiked, onToggleLike }: ChatBubbleProps) => {
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const imageSource = image ? require('../assets/carousel/sample-01.jpeg') : null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing image!',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDownload = async () => {
    // Implementar download aqui
  };

  return (
    <>
      <View style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer
      ]}>
        <Animated.View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          }
        ]}>
          {image && (
            <>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setImageViewerVisible(true)}
              >
                <Image 
                  source={imageSource}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View style={styles.actionBar}>
                <View style={styles.leftActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={onToggleLike}
                  >
                    <Ionicons 
                      name={isLiked ? "heart" : "heart-outline"} 
                      size={22} 
                      color={isLiked ? colors.error : (isUser ? '#FFF' : colors.text)} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.lastLeftButton]}
                    onPress={handleDownload}
                  >
                    <Ionicons 
                      name="download-outline" 
                      size={22} 
                      color={isUser ? '#FFF' : colors.text} 
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={handleShare}
                >
                  <Ionicons 
                    name="share-outline" 
                    size={22} 
                    color={isUser ? '#FFF' : colors.text} 
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          <Text style={[
            styles.text,
            isUser ? styles.userText : styles.aiText
          ]}>
            {message}
          </Text>
        </Animated.View>
      </View>

      {imageSource && (
        <ImageViewer
          isVisible={isImageViewerVisible}
          onClose={() => setImageViewerVisible(false)}
          imageSource={imageSource}
          message={message}
          isLiked={isLiked}
          onToggleLike={onToggleLike}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.text,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -4,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  lastLeftButton: {
    marginRight: 0,
  },
  shareButton: {
    marginRight: 0,
  },
}); 