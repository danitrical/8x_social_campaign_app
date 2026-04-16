import { Campaign, Submission, ExampleVideo } from '../../src/types';

export const mockExampleVideo: ExampleVideo = {
  id: 'ev_test_1',
  campaignId: 'camp_test_1',
  title: 'Test Example Video',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  videoUrl: 'https://example.com/video.mp4',
  description: 'A test example video for unit tests.',
};

export const mockCampaign: Campaign = {
  id: 'camp_test_1',
  brandName: 'TestBrand',
  brandLogoUrl: 'local:gymshark',
  brandColor: '#6C63FF',
  title: 'Test Campaign Title',
  brief:
    '**What we need:**\n• Film a 60-second video\n• Show the product clearly\n• Use trending audio',
  payoutPerVideo: 250,
  deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  category: 'Fashion',
  exampleVideos: [mockExampleVideo],
};

export const mockCampaignUrgent: Campaign = {
  ...mockCampaign,
  id: 'camp_test_2',
  title: 'Urgent Campaign',
  deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockCampaignExpired: Campaign = {
  ...mockCampaign,
  id: 'camp_test_3',
  title: 'Expired Campaign',
  deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockSubmission: Submission = {
  id: 'sub_test_1',
  campaignId: 'camp_test_1',
  videoUrl: 'https://www.tiktok.com/@testuser/video/12345',
  platform: 'tiktok',
  status: 'pending',
  submittedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSubmissions: Submission[] = [
  mockSubmission,
  {
    ...mockSubmission,
    id: 'sub_test_2',
    videoUrl: 'https://www.instagram.com/reel/ABC123',
    platform: 'instagram',
    status: 'approved',
  },
  {
    ...mockSubmission,
    id: 'sub_test_3',
    videoUrl: 'https://www.tiktok.com/@user/video/99999',
    platform: 'tiktok',
    status: 'rejected',
    notes: 'Does not follow brand guidelines.',
  },
];
