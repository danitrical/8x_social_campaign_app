import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { isValidVideoUrl } from '../../src/screens/SubmitVideoScreen';

// Mock the navigation and route
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
  setOptions: jest.fn(),
  goBack: jest.fn(),
};
const mockRoute = {
  params: {
    campaignId: 'camp_test_1',
    campaignTitle: 'Test Campaign',
  },
};

// Mock the submission repository
jest.mock('../../src/database/repositories/submissionRepository', () => ({
  createSubmission: jest.fn().mockResolvedValue({
    id: 'new_sub',
    campaignId: 'camp_test_1',
    videoUrl: 'https://www.tiktok.com/@user/video/123',
    platform: 'tiktok',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  detectPlatform: jest.fn((url: string) => {
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    return 'other';
  }),
}));

// Import screen after mocks
import { SubmitVideoScreen } from '../../src/screens/SubmitVideoScreen';

describe('isValidVideoUrl', () => {
  it('returns false for empty string', () => {
    expect(isValidVideoUrl('')).toBe(false);
  });

  it('returns false for whitespace', () => {
    expect(isValidVideoUrl('   ')).toBe(false);
  });

  it('returns true for a TikTok URL', () => {
    expect(isValidVideoUrl('https://www.tiktok.com/@user/video/12345')).toBe(true);
  });

  it('returns true for a TikTok short URL', () => {
    expect(isValidVideoUrl('https://vm.tiktok.com/abc123')).toBe(true);
  });

  it('returns true for an Instagram Reel URL', () => {
    expect(isValidVideoUrl('https://www.instagram.com/reel/ABC123/')).toBe(true);
  });

  it('returns true for an Instagram post URL', () => {
    expect(isValidVideoUrl('https://www.instagram.com/p/ABC123/')).toBe(true);
  });

  it('returns true for a generic HTTPS URL', () => {
    expect(isValidVideoUrl('https://example.com/video/123')).toBe(true);
  });

  it('returns false for a plain non-URL string', () => {
    expect(isValidVideoUrl('not a url')).toBe(false);
  });

  it('returns false for http-less domain', () => {
    expect(isValidVideoUrl('tiktok.com/video/123')).toBe(false);
  });
});

describe('SubmitVideoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders campaign title', () => {
    const { getByText } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    expect(getByText('Test Campaign')).toBeTruthy();
  });

  it('renders URL input field', () => {
    const { getByTestId } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    expect(getByTestId('video-url-input')).toBeTruthy();
  });

  it('shows submit button', () => {
    const { getByTestId } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('shows error when submitting empty URL', async () => {
    const { getByTestId, getByText } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    fireEvent.press(getByTestId('submit-button'));
    await waitFor(() => {
      expect(getByText(/Please enter a video URL/i)).toBeTruthy();
    });
  });

  it('shows error for invalid URL', async () => {
    const { getByTestId, getByText } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    fireEvent.changeText(getByTestId('video-url-input'), 'not a valid url');
    fireEvent.press(getByTestId('submit-button'));
    await waitFor(() => {
      expect(getByText(/valid TikTok/i)).toBeTruthy();
    });
  });

  it('detects TikTok platform from URL', async () => {
    const { getByTestId, getByText } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    fireEvent.changeText(
      getByTestId('video-url-input'),
      'https://www.tiktok.com/@user/video/12345'
    );
    await waitFor(() => {
      expect(getByTestId('detected-platform')).toBeTruthy();
    });
  });

  it('navigates to SubmissionStatus on successful submit', async () => {
    const { getByTestId } = render(
      <SubmitVideoScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
    fireEvent.changeText(
      getByTestId('video-url-input'),
      'https://www.tiktok.com/@user/video/12345'
    );
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SubmissionStatus', {
        campaignId: 'camp_test_1',
        campaignTitle: 'Test Campaign',
      });
    });
  });
});
