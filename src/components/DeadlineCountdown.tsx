import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/theme';

interface Props {
  deadline: string;
  style?: object;
}

export const getDeadlineInfo = (deadline: string): { label: string; isUrgent: boolean; isWarning: boolean } => {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs < 0) {
    return { label: 'Expired', isUrgent: true, isWarning: false };
  }

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    return { label: 'Due today', isUrgent: true, isWarning: false };
  }
  if (diffDays < 2) {
    return { label: '1 day left', isUrgent: true, isWarning: false };
  }
  const daysInt = Math.ceil(diffDays);
  if (daysInt <= 3) {
    return { label: `${daysInt} days left`, isUrgent: false, isWarning: true };
  }
  return { label: `${daysInt} days left`, isUrgent: false, isWarning: false };
};

export const DeadlineCountdown: React.FC<Props> = ({ deadline, style }) => {
  const { label, isUrgent, isWarning } = getDeadlineInfo(deadline);

  const color = isUrgent
    ? Colors.deadline.urgent
    : isWarning
    ? Colors.deadline.warning
    : Colors.deadline.normal;

  return (
    <Text testID="deadline-countdown" style={[styles.text, { color }, style]}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
