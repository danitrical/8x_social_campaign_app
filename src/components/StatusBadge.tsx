import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubmissionStatus } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface Props {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const scheme = Colors.status[status];
  const isSmall = size === 'sm';

  return (
    <View
      testID={`status-badge-${status}`}
      style={[
        styles.badge,
        { backgroundColor: scheme.bg },
        isSmall && styles.badgeSm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: scheme.dot }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color: scheme.text }, isSmall && styles.labelSm]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
  },
  dotSm: {
    width: 6,
    height: 6,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: Typography.sizes.xs,
  },
});
