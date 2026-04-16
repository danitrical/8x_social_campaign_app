import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CampaignCard } from '../../src/components/CampaignCard';
import { mockCampaign } from '../utils/mockData';

describe('CampaignCard', () => {
  it('renders brand name', () => {
    const { getByText } = render(
      <CampaignCard campaign={mockCampaign} onPress={jest.fn()} />
    );
    expect(getByText(mockCampaign.brandName)).toBeTruthy();
  });

  it('renders campaign title', () => {
    const { getByText } = render(
      <CampaignCard campaign={mockCampaign} onPress={jest.fn()} />
    );
    expect(getByText(mockCampaign.title)).toBeTruthy();
  });

  it('renders payout amount', () => {
    const { getByText } = render(
      <CampaignCard campaign={mockCampaign} onPress={jest.fn()} />
    );
    expect(getByText(`$${mockCampaign.payoutPerVideo}`)).toBeTruthy();
  });

  it('renders category', () => {
    const { getByText } = render(
      <CampaignCard campaign={mockCampaign} onPress={jest.fn()} />
    );
    expect(getByText(mockCampaign.category)).toBeTruthy();
  });

  it('calls onPress with campaign when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CampaignCard campaign={mockCampaign} onPress={onPress} />
    );
    fireEvent.press(getByTestId(`campaign-card-${mockCampaign.id}`));
    expect(onPress).toHaveBeenCalledWith(mockCampaign);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows View Brief CTA', () => {
    const { getByText } = render(
      <CampaignCard campaign={mockCampaign} onPress={jest.fn()} />
    );
    expect(getByText('View Brief →')).toBeTruthy();
  });
});
