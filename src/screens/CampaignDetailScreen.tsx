import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Campaign, RootStackParamList } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { DeadlineCountdown } from '../components/DeadlineCountdown';
import { getCampaignById } from '../database/repositories/campaignRepository';
import { resolveLogoSource } from '../constants/assets';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CampaignDetail'>;
  route: RouteProp<RootStackParamList, 'CampaignDetail'>;
};

const formatBrief = (brief: string): Array<{ type: 'heading' | 'bullet' | 'text'; content: string }> => {
  const lines = brief.split('\n').filter((l) => l.trim());
  return lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return { type: 'heading', content: trimmed.replace(/\*\*/g, '') };
    }
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      return { type: 'bullet', content: trimmed.replace(/^[•\-]\s*/, '') };
    }
    return { type: 'text', content: trimmed };
  });
};

export const CampaignDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { campaignId } = route.params;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  useEffect(() => {
    getCampaignById(campaignId)
      .then((data) => {
        setCampaign(data);
        if (data) {
          navigation.setOptions({ title: data.brandName });
        }
      })
      .finally(() => setLoading(false));
  }, [campaignId, navigation]);

  const handleSubmit = useCallback(() => {
    if (!campaign) return;
    navigation.navigate('SubmitVideo', {
      campaignId: campaign.id,
      campaignTitle: campaign.title,
    });
  }, [campaign, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} testID="loading-indicator" />
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFound}>Campaign not found</Text>
      </SafeAreaView>
    );
  }

  const briefParts = formatBrief(campaign.brief);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        testID="campaign-detail-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isLandscape && styles.scrollContentLandscape,
        ]}
      >
        {/* Hero Header */}
        <View style={[styles.hero, { backgroundColor: campaign.brandColor + '15' }]}>
          <View style={styles.heroInner}>
            <View style={[styles.logoWrap, { borderColor: campaign.brandColor + '44' }]}>
              <Image
                source={resolveLogoSource(campaign.brandLogoUrl)}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.brandName}>{campaign.brandName}</Text>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.category}>{campaign.category}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${campaign.payoutPerVideo}</Text>
              <Text style={styles.statLabel}>Payout / video</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <DeadlineCountdown deadline={campaign.deadline} style={styles.statValue} />
              <Text style={styles.statLabel}>Deadline</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{campaign.exampleVideos.length}</Text>
              <Text style={styles.statLabel}>Examples</Text>
            </View>
          </View>
        </View>

        {/* Brief Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Campaign Brief</Text>
          <View style={styles.briefCard}>
            {briefParts.map((part, idx) => {
              if (part.type === 'heading') {
                return (
                  <Text key={idx} style={styles.briefHeading}>
                    {part.content}
                  </Text>
                );
              }
              if (part.type === 'bullet') {
                return (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{part.content}</Text>
                  </View>
                );
              }
              return (
                <Text key={idx} style={styles.briefText}>
                  {part.content}
                </Text>
              );
            })}
          </View>
        </View>

        {/* Example Videos */}
        {campaign.exampleVideos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎬 Example Videos</Text>
            <Text style={styles.sectionSubtitle}>
              Watch these to understand the style and format expected.
            </Text>
            {campaign.exampleVideos.map((video) => (
              <VideoPlayer key={video.id} video={video} />
            ))}
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Sticky Submit Button */}
      <View style={styles.submitBar}>
        <TouchableOpacity
          testID="submit-video-btn"
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>Submit Your Video</Text>
          <Text style={styles.submitButtonSub}>Earn ${campaign.payoutPerVideo}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="view-submissions-btn"
          style={styles.statusButton}
          onPress={() =>
            navigation.navigate('SubmissionStatus', {
              campaignId: campaign.id,
              campaignTitle: campaign.title,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.statusButtonText}>My Submissions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  scrollContentLandscape: {
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  campaignTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.text.primary,
    lineHeight: 26,
  },
  category: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  briefCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  briefHeading: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  briefText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  bulletDot: {
    fontSize: Typography.sizes.base,
    color: Colors.primary,
    marginRight: Spacing.sm,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  bottomPad: {
    height: Spacing.xl,
  },
  submitBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  submitButtonSub: {
    color: Colors.text.inverse + 'CC',
    fontSize: Typography.sizes.xs,
    marginTop: 1,
  },
  statusButton: {
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
