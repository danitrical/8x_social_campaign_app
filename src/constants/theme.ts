export const Colors = {
  primary: '#6C63FF',
  primaryLight: '#EEF0FF',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F3F5',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  status: {
    pending: {
      bg: '#FEF3C7',
      text: '#92400E',
      dot: '#F59E0B',
    },
    approved: {
      bg: '#D1FAE5',
      text: '#065F46',
      dot: '#10B981',
    },
    rejected: {
      bg: '#FEE2E2',
      text: '#991B1B',
      dot: '#EF4444',
    },
  },
  deadline: {
    urgent: '#EF4444',
    warning: '#F59E0B',
    normal: '#6B7280',
  },
  error: '#EF4444',
  success: '#10B981',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
