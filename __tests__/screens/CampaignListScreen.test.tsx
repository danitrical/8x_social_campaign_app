import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { mockCampaign, mockCampaignUrgent } from '../utils/mockData';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
};

jest.mock('../../src/database/repositories/campaignRepository', () => ({
  getActiveCampaigns: jest.fn().mockResolvedValue([mockCampaign, mockCampaignUrgent]),
}));

import { CampaignListScreen } from '../../src/screens/CampaignListScreen';

describe('CampaignListScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading indicator initially', () => {
    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders campaign list after loading', async () => {
    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByTestId('campaign-list')).toBeTruthy();
    });
  });

  it('renders both campaign cards', async () => {
    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByTestId(`campaign-card-${mockCampaign.id}`)).toBeTruthy();
      expect(getByTestId(`campaign-card-${mockCampaignUrgent.id}`)).toBeTruthy();
    });
  });

  it('shows campaign count in header', async () => {
    const { getByText } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText('2 active campaigns')).toBeTruthy();
    });
  });

  it('navigates to CampaignDetail on card press', async () => {
    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      fireEvent.press(getByTestId(`campaign-card-${mockCampaign.id}`));
    });
    expect(mockNavigate).toHaveBeenCalledWith('CampaignDetail', {
      campaignId: mockCampaign.id,
    });
  });
});

describe('CampaignListScreen — empty state', () => {
  it('shows empty state when no campaigns', async () => {
    const repo = require('../../src/database/repositories/campaignRepository');
    repo.getActiveCampaigns.mockResolvedValue([]);

    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByTestId('empty-campaigns')).toBeTruthy();
    });
  });
});

describe('CampaignListScreen — error state', () => {
  it('shows error state on DB failure', async () => {
    const repo = require('../../src/database/repositories/campaignRepository');
    repo.getActiveCampaigns.mockRejectedValue(new Error('DB error'));

    const { getByTestId } = render(
      <CampaignListScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByTestId('error-state')).toBeTruthy();
    });
  });
});
