import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Campaign } from '../types';
import { DeadlineCountdown } from './DeadlineCountdown';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { resolveLogoSource } from '../constants/assets';

interface Props {
  campaign: Campaign;
  onPress: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<Props> = ({ campaign, onPress }) => {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  return (
    <TouchableOpacity
      testID={`campaign-card-${campaign.id}`}
      style={[styles.card, isLandscape && styles.cardLandscape]}
      onPress={() => onPress(campaign)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.logoContainer, { borderColor: campaign.brandColor + '33' }]}>
          <Image
            source={resolveLogoSource(campaign.brandLogoUrl)}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.brandInfo}>
          <Text style={styles.brandName} numberOfLines={1}>
            {campaign.brandName}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {campaign.category}
          </Text>
        </View>
        <View style={styles.payoutBadge}>
          <Text style={styles.payoutAmount}>${campaign.payoutPerVideo}</Text>
          <Text style={styles.payoutLabel}>per video</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {campaign.title}
      </Text>

      <Text style={styles.brief} numberOfLines={2}>
        {campaign.brief.replace(/\*\*/g, '').replace(/^[#•\-\s]+/gm, '').trim()}
      </Text>

      <View style={styles.footer}>
        <View style={styles.deadlineRow}>
          <Text style={styles.deadlineIcon}>⏱</Text>
          <DeadlineCountdown deadline={campaign.deadline} />
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>View Brief →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...Shadows.md,
  },
  cardLandscape: {
    marginHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  category: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  payoutBadge: {
    alignItems: 'flex-end',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  payoutAmount: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary,
    lineHeight: 22,
  },
  payoutLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  brief: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  deadlineIcon: {
    fontSize: Typography.sizes.sm,
  },
  cta: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  ctaText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});
