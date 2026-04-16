import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { ExampleVideo } from '../types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { resolveVideoSource } from '../constants/assets';

interface Props {
  video: ExampleVideo;
}

export const VideoPlayer: React.FC<Props> = ({ video }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { width } = useWindowDimensions();

  const videoHeight = Math.min(width * 0.5625, 220); // 16:9 ratio, max 220

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      setIsLoading(true);
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  return (
    <View testID={`video-player-${video.id}`} style={[styles.container, Shadows.sm]}>
      <View style={[styles.videoWrapper, { height: videoHeight }]}>
        {hasError ? (
          <View style={[styles.errorState, { height: videoHeight }]}>
            <Text style={styles.errorIcon}>🎬</Text>
            <Text style={styles.errorText}>Preview unavailable</Text>
          </View>
        ) : (
          <>
            <Video
              ref={videoRef}
              source={resolveVideoSource(video.videoUrl)}
              resizeMode={ResizeMode.COVER}
              style={StyleSheet.absoluteFill}
              onPlaybackStatusUpdate={handleStatus}
              onError={handleError}
              shouldPlay={false}
              isLooping
            />
            <TouchableOpacity
              style={styles.overlay}
              onPress={handlePlayPause}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.text.inverse} />
              ) : (
                <View style={[styles.playButton, isPlaying && styles.playButtonActive]}>
                  <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {video.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: Colors.text.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  playIcon: {
    fontSize: 20,
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  info: {
    padding: Spacing.sm + 4,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});
