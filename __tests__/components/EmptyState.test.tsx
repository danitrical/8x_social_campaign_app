import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../../src/components/EmptyState';

describe('EmptyState', () => {
  it('renders icon, title, and message', () => {
    const { getByText, getByTestId } = render(
      <EmptyState icon="📭" title="No Campaigns" message="Check back soon." />
    );
    expect(getByText('📭')).toBeTruthy();
    expect(getByText('No Campaigns')).toBeTruthy();
    expect(getByText('Check back soon.')).toBeTruthy();
    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('renders with custom testID', () => {
    const { getByTestId } = render(
      <EmptyState icon="📤" title="None" message="Submit one." testID="empty-submissions" />
    );
    expect(getByTestId('empty-submissions')).toBeTruthy();
  });
});
