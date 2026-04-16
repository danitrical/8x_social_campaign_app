import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Campaign, RootStackParamList } from '../types';
import { CampaignCard } from '../components/CampaignCard';
import { EmptyState } from '../components/EmptyState';
import { getActiveCampaigns } from '../database/repositories/campaignRepository';
import { Colors, Spacing, Typography } from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CampaignList'>;
};

export const CampaignListScreen: React.FC<Props> = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const numColumns = isLandscape ? 2 : 1;

  const loadCampaigns = useCallback(async () => {
    try {
      setError(null);
      const data = await getActiveCampaigns();
      setCampaigns(data);
    } catch (e) {
      setError('Failed to load campaigns. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCampaignPress = useCallback(
    (campaign: Campaign) => {
      navigation.navigate('CampaignDetail', { campaignId: campaign.id });
    },
    [navigation]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} testID="loading-indicator" />
        <Text style={styles.loadingText}>Loading campaigns...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          message={error}
          testID="error-state"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <FlatList
        testID="campaign-list"
        data={campaigns}
        keyExtractor={(item) => item.id}
        key={numColumns}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={isLandscape ? styles.columnItem : undefined}>
            <CampaignCard campaign={item} onPress={handleCampaignPress} />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerTitle}>🎯 Open Campaigns</Text>
            <Text style={styles.headerSubtitle}>
              {campaigns.length} active {campaigns.length === 1 ? 'campaign' : 'campaigns'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No Active Campaigns"
            message="Check back soon — new campaigns are added regularly."
            testID="empty-campaigns"
          />
        }
        contentContainerStyle={campaigns.length === 0 ? styles.emptyContainer : styles.listContent}
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
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.text.secondary,
    fontSize: Typography.sizes.base,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  columnItem: {
    flex: 1,
  },
});
