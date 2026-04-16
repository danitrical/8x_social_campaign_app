import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Submission, RootStackParamList } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { getSubmissionsByCampaign } from '../database/repositories/submissionRepository';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SubmissionStatus'>;
  route: RouteProp<RootStackParamList, 'SubmissionStatus'>;
};

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '🎵',
  instagram: '📷',
  other: '🔗',
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface StatusSummary {
  pending: number;
  approved: number;
  rejected: number;
}

const getStatusSummary = (submissions: Submission[]): StatusSummary =>
  submissions.reduce(
    (acc, s) => ({ ...acc, [s.status]: acc[s.status as keyof StatusSummary] + 1 }),
    { pending: 0, approved: 0, rejected: 0 }
  );

export const SubmissionStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const { campaignId, campaignTitle } = route.params;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const loadSubmissions = useCallback(async () => {
    try {
      const data = await getSubmissionsByCampaign(campaignId);
      setSubmissions(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadSubmissions();
    if (campaignTitle) {
      navigation.setOptions({ title: `${campaignTitle} — Status` });
    }
  }, [loadSubmissions, campaignTitle, navigation]);

  const handleOpenUrl = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadSubmissions();
  }, [loadSubmissions]);

  const summary = getStatusSummary(submissions);

  const renderItem = ({ item }: { item: Submission }) => (
    <View
      testID={`submission-item-${item.id}`}
      style={[styles.card, isLandscape && styles.cardLandscape]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.platformRow}>
          <Text style={styles.platformIcon}>
            {PLATFORM_ICONS[item.platform] ?? '🔗'}
          </Text>
          <Text style={styles.platformLabel}>
            {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <TouchableOpacity
        testID={`submission-url-${item.id}`}
        onPress={() => handleOpenUrl(item.videoUrl)}
        activeOpacity={0.7}
      >
        <Text style={styles.url} numberOfLines={2}>
          {item.videoUrl}
        </Text>
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <Text style={styles.dateLabel}>Submitted</Text>
        <Text style={styles.date}>{formatDate(item.submittedAt)}</Text>
      </View>

      {item.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Reviewer note:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} testID="loading-indicator" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        testID="submissions-list"
        data={submissions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          submissions.length > 0 ? (
            <View style={[styles.summaryRow, isLandscape && styles.summaryRowLandscape]}>
              {[
                { key: 'pending', label: 'Pending', color: Colors.status.pending.dot },
                { key: 'approved', label: 'Approved', color: Colors.status.approved.dot },
                { key: 'rejected', label: 'Rejected', color: Colors.status.rejected.dot },
              ].map(({ key, label, color }) => (
                <View key={key} style={styles.summaryBox}>
                  <Text style={[styles.summaryCount, { color }]}>
                    {summary[key as keyof StatusSummary]}
                  </Text>
                  <Text style={styles.summaryLabel}>{label}</Text>
                </View>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="📤"
            title="No Submissions Yet"
            message="Submit a video for this campaign and track its status here."
            testID="empty-submissions"
          />
        }
        contentContainerStyle={
          submissions.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.submitBar}>
        <TouchableOpacity
          testID="submit-another-btn"
          style={styles.submitButton}
          onPress={() =>
            navigation.navigate('SubmitVideo', {
              campaignId,
              campaignTitle: campaignTitle ?? '',
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>+ Submit Another Video</Text>
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
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  summaryRowLandscape: {
    marginHorizontal: Spacing.xl,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs + 2,
    ...Shadows.sm,
  },
  cardLandscape: {
    marginHorizontal: Spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  platformIcon: {
    fontSize: 16,
  },
  platformLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  url: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dateLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
  date: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  notesBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  notesLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  notesText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    lineHeight: 18,
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
  submitButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
