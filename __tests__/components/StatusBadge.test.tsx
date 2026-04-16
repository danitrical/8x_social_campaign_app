import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge } from '../../src/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders pending status correctly', () => {
    const { getByTestId, getByText } = render(<StatusBadge status="pending" />);
    expect(getByTestId('status-badge-pending')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
  });

  it('renders approved status correctly', () => {
    const { getByTestId, getByText } = render(<StatusBadge status="approved" />);
    expect(getByTestId('status-badge-approved')).toBeTruthy();
    expect(getByText('Approved')).toBeTruthy();
  });

  it('renders rejected status correctly', () => {
    const { getByTestId, getByText } = render(<StatusBadge status="rejected" />);
    expect(getByTestId('status-badge-rejected')).toBeTruthy();
    expect(getByText('Rejected')).toBeTruthy();
  });

  it('applies sm size variant', () => {
    const { getByTestId } = render(<StatusBadge status="pending" size="sm" />);
    expect(getByTestId('status-badge-pending')).toBeTruthy();
  });

  it('applies md size variant by default', () => {
    const { getByTestId } = render(<StatusBadge status="approved" />);
    expect(getByTestId('status-badge-approved')).toBeTruthy();
  });
});
