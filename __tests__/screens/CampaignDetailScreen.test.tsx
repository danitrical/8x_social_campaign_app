import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { mockCampaign } from '../utils/mockData';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
  replace: jest.fn(),
};
const mockRoute = {
  params: { campaignId: mockCampaign.id },
};

jest.mock('../../src/database/repositories/campaignRepository', () => ({
  getCampaignById: jest.fn().mockResolvedValue(mockCampaign),
}));

// Mock expo-av Video component
jest.mock('expo-av', () => ({
  Video: 'Video',
  ResizeMode: { COVER: 'cover' },
}));

import { CampaignDetailScreen } from '../../src/screens/CampaignDetailScreen';

describe('CampaignDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading indicator initially', () => {
    const { getByTestId } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders campaign after loading', async () => {
    const { getByTestId } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByTestId('campaign-detail-scroll')).toBeTruthy();
    });
  });

  it('displays brand name', async () => {
    const { getByText } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByText(mockCampaign.brandName)).toBeTruthy();
    });
  });

  it('displays campaign title', async () => {
    const { getByText } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByText(mockCampaign.title)).toBeTruthy();
    });
  });

  it('shows payout amount', async () => {
    const { getAllByText } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      const payoutTexts = getAllByText(`$${mockCampaign.payoutPerVideo}`);
      expect(payoutTexts.length).toBeGreaterThan(0);
    });
  });

  it('navigates to SubmitVideo when submit button pressed', async () => {
    const { getByTestId } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      fireEvent.press(getByTestId('submit-video-btn'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('SubmitVideo', {
      campaignId: mockCampaign.id,
      campaignTitle: mockCampaign.title,
    });
  });

  it('navigates to SubmissionStatus when my submissions pressed', async () => {
    const { getByTestId } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      fireEvent.press(getByTestId('view-submissions-btn'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('SubmissionStatus', {
      campaignId: mockCampaign.id,
      campaignTitle: mockCampaign.title,
    });
  });
});

describe('CampaignDetailScreen — not found', () => {
  it('shows not found message when campaign is null', async () => {
    const repo = require('../../src/database/repositories/campaignRepository');
    repo.getCampaignById.mockResolvedValue(null);

    const { getByText } = render(
      <CampaignDetailScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    await waitFor(() => {
      expect(getByText('Campaign not found')).toBeTruthy();
    });
  });
});
