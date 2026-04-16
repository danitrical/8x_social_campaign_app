import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { mockSubmissions } from '../utils/mockData';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
  goBack: jest.fn(),
};
const mockRoute = {
  params: {
    campaignId: 'camp_test_1',
    campaignTitle: 'Test Campaign',
  },
};

jest.mock('../../src/database/repositories/submissionRepository', () => ({
  getSubmissionsByCampaign: jest.fn().mockResolvedValue(mockSubmissions),
}));

import { SubmissionStatusScreen } from '../../src/screens/SubmissionStatusScreen';

describe('SubmissionStatusScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders loading state initially', () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders submissions after load', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByTestId('submissions-list')).toBeTruthy();
    });
  });

  it('shows all three submission items', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      mockSubmissions.forEach((sub) => {
        expect(getByTestId(`submission-item-${sub.id}`)).toBeTruthy();
      });
    });
  });

  it('shows status badges for each submission', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByTestId('status-badge-pending')).toBeTruthy();
      expect(getByTestId('status-badge-approved')).toBeTruthy();
      expect(getByTestId('status-badge-rejected')).toBeTruthy();
    });
  });

  it('renders submit another button', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByTestId('submit-another-btn')).toBeTruthy();
    });
  });

  it('navigates to SubmitVideo when submit another is pressed', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      fireEvent.press(getByTestId('submit-another-btn'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('SubmitVideo', {
      campaignId: 'camp_test_1',
      campaignTitle: 'Test Campaign',
    });
  });
});

describe('SubmissionStatusScreen — empty state', () => {
  beforeEach(() => {
    const repo = require('../../src/database/repositories/submissionRepository');
    repo.getSubmissionsByCampaign.mockResolvedValue([]);
  });

  it('shows empty state when no submissions', async () => {
    const { getByTestId } = render(
      <SubmissionStatusScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByTestId('empty-submissions')).toBeTruthy();
    });
  });
});
