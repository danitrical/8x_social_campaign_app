import { getDatabase } from '../schema';
import { Campaign, ExampleVideo } from '../../types';

interface CampaignRow {
  id: string;
  brand_name: string;
  brand_logo_url: string;
  brand_color: string;
  title: string;
  brief: string;
  payout_per_video: number;
  deadline: string;
  is_active: number;
  category: string;
}

interface ExampleVideoRow {
  id: string;
  campaign_id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  description: string;
}

const rowToCampaign = (row: CampaignRow, videos: ExampleVideo[]): Campaign => ({
  id: row.id,
  brandName: row.brand_name,
  brandLogoUrl: row.brand_logo_url,
  brandColor: row.brand_color,
  title: row.title,
  brief: row.brief,
  payoutPerVideo: row.payout_per_video,
  deadline: row.deadline,
  isActive: row.is_active === 1,
  category: row.category,
  exampleVideos: videos,
});

const rowToVideo = (row: ExampleVideoRow): ExampleVideo => ({
  id: row.id,
  campaignId: row.campaign_id,
  title: row.title,
  thumbnailUrl: row.thumbnail_url,
  videoUrl: row.video_url,
  description: row.description,
});

export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CampaignRow>(
    'SELECT * FROM campaigns WHERE is_active = 1 ORDER BY deadline ASC'
  );

  const campaigns: Campaign[] = [];
  for (const row of rows) {
    const videoRows = await db.getAllAsync<ExampleVideoRow>(
      'SELECT * FROM example_videos WHERE campaign_id = ?',
      [row.id]
    );
    campaigns.push(rowToCampaign(row, videoRows.map(rowToVideo)));
  }
  return campaigns;
};

export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CampaignRow>(
    'SELECT * FROM campaigns WHERE id = ?',
    [id]
  );
  if (!row) return null;

  const videoRows = await db.getAllAsync<ExampleVideoRow>(
    'SELECT * FROM example_videos WHERE campaign_id = ?',
    [id]
  );
  return rowToCampaign(row, videoRows.map(rowToVideo));
};
