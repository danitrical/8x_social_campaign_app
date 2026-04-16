import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { createSubmission, detectPlatform } from '../database/repositories/submissionRepository';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SubmitVideo'>;
  route: RouteProp<RootStackParamList, 'SubmitVideo'>;
};

export const isValidVideoUrl = (url: string): boolean => {
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Must start with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) return false;
  // Must have a valid domain structure
  return /^https?:\/\/.+\..+/i.test(trimmed);
};

const getPlatformIcon = (url: string): string => {
  const platform = detectPlatform(url);
  if (platform === 'tiktok') return '🎵';
  if (platform === 'instagram') return '📷';
  return '🔗';
};

const getPlatformLabel = (url: string): string => {
  const platform = detectPlatform(url);
  if (platform === 'tiktok') return 'TikTok';
  if (platform === 'instagram') return 'Instagram';
  return 'Other Platform';
};

export const SubmitVideoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { campaignId, campaignTitle } = route.params;
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const validateUrl = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setUrlError('Please enter a video URL');
      return false;
    }
    if (!isValidVideoUrl(value)) {
      setUrlError('Please enter a valid TikTok, Instagram, or video URL');
      return false;
    }
    setUrlError(null);
    return true;
  }, []);

  const handleUrlChange = useCallback(
    (value: string) => {
      setUrl(value);
      if (urlError) validateUrl(value);
    },
    [urlError, validateUrl]
  );

  const handleSubmit = useCallback(async () => {
    if (!validateUrl(url)) return;

    setSubmitting(true);
    try {
      await createSubmission(campaignId, url.trim());
      navigation.replace('SubmissionStatus', {
        campaignId,
        campaignTitle,
      });
    } catch (e) {
      Alert.alert('Submission Failed', 'Could not submit your video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [url, campaignId, campaignTitle, navigation, validateUrl]);

  const detectedPlatform = url.trim() ? getPlatformLabel(url) : null;
  const platformIcon = url.trim() ? getPlatformIcon(url) : null;
  const isValid = isValidVideoUrl(url);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={88}
      >
        <ScrollView
          testID="submit-video-scroll"
          contentContainerStyle={[
            styles.scrollContent,
            isLandscape && styles.scrollContentLandscape,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campaign Info */}
          <View style={styles.campaignBanner}>
            <Text style={styles.campaignLabel}>Submitting for</Text>
            <Text style={styles.campaignTitle} numberOfLines={2}>
              {campaignTitle}
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>📝 Before you submit</Text>
            {[
              'Make sure your video follows the campaign brief',
              'Post it publicly on TikTok or Instagram',
              'Copy the direct link to your video post',
              'Paste the URL below',
            ].map((step, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* URL Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Video URL *</Text>
            <View
              style={[
                styles.inputWrapper,
                urlError ? styles.inputWrapperError : null,
                isValid && url ? styles.inputWrapperValid : null,
              ]}
            >
              <TextInput
                testID="video-url-input"
                style={styles.input}
                value={url}
                onChangeText={handleUrlChange}
                onBlur={() => url && validateUrl(url)}
                placeholder="https://www.tiktok.com/@username/video/..."
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                multiline={false}
              />
            </View>

            {urlError ? (
              <Text testID="url-error" style={styles.errorText}>
                ⚠️ {urlError}
              </Text>
            ) : detectedPlatform && isValid ? (
              <View style={styles.detectedPlatform} testID="detected-platform">
                <Text style={styles.detectedText}>
                  {platformIcon} Detected: {detectedPlatform}
                </Text>
              </View>
            ) : null}

            <Text style={styles.inputHint}>
              Accepted: TikTok video URLs, Instagram Reel/Post URLs
            </Text>
          </View>

          {/* Platform Quick Examples */}
          <View style={styles.examplesBox}>
            <Text style={styles.examplesTitle}>Example URLs</Text>
            {[
              { icon: '🎵', label: 'TikTok', url: 'https://www.tiktok.com/t/ZP8gfD8SK/' },
              { icon: '📷', label: 'Instagram Reel', url: 'https://www.instagram.com/reel/DSlVJ-xjNS4/?igsh=b21vam9oOXJrYTd3' },
            ].map((ex) => (
              <TouchableOpacity
                key={ex.label}
                testID={`example-url-${ex.label}`}
                style={styles.exampleRow}
                onPress={() => {
                  setUrl(ex.url);
                  setUrlError(null);
                }}
              >
                <Text style={styles.exampleIcon}>{ex.icon}</Text>
                <View style={styles.exampleInfo}>
                  <Text style={styles.exampleLabel}>{ex.label}</Text>
                  <Text style={styles.exampleUrl} numberOfLines={1}>
                    {ex.url}
                  </Text>
                </View>
                <Text style={styles.exampleTap}>Tap to use</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitBar}>
          <TouchableOpacity
            testID="submit-button"
            style={[styles.submitButton, (!isValid || submitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.text.inverse} testID="submit-loading" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isValid ? '🚀 Submit Video' : 'Enter a URL to Submit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  scrollContentLandscape: {
    paddingHorizontal: Spacing.xl,
  },
  campaignBanner: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  campaignLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  campaignTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  instructionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  instructionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumber: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  inputWrapperValid: {
    borderColor: Colors.success,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    minHeight: 50,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
  detectedPlatform: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detectedText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.medium,
  },
  inputHint: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  examplesBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  examplesTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  exampleIcon: {
    fontSize: 20,
  },
  exampleInfo: {
    flex: 1,
  },
  exampleLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  exampleUrl: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
  exampleTap: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  submitBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.text.tertiary,
  },
  submitButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
