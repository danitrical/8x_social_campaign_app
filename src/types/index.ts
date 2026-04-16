export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ExampleVideo {
  id: string;
  campaignId: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
}

export interface Campaign {
  id: string;
  brandName: string;
  brandLogoUrl: string;
  brandColor: string;
  title: string;
  brief: string;
  payoutPerVideo: number;
  deadline: string; // ISO date string
  isActive: boolean;
  category: string;
  exampleVideos: ExampleVideo[];
}

export interface Submission {
  id: string;
  campaignId: string;
  videoUrl: string;
  platform: 'tiktok' | 'instagram' | 'other';
  status: SubmissionStatus;
  submittedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  notes?: string;
}

export type RootStackParamList = {
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
  SubmitVideo: { campaignId: string; campaignTitle: string };
  SubmissionStatus: { campaignId: string; campaignTitle: string };
};
