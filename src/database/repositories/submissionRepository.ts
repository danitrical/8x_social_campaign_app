import { getDatabase } from '../schema';
import { Submission, SubmissionStatus } from '../../types';
import 'react-native-get-random-values';

// Simple UUID v4 without external dependency
const generateId = (): string => {
  const chars = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += chars[(Math.random() * 4 + 8) | 0];
    } else {
      uuid += chars[(Math.random() * 16) | 0];
    }
  }
  return uuid;
};

interface SubmissionRow {
  id: string;
  campaign_id: string;
  video_url: string;
  platform: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  notes: string | null;
}

const rowToSubmission = (row: SubmissionRow): Submission => ({
  id: row.id,
  campaignId: row.campaign_id,
  videoUrl: row.video_url,
  platform: row.platform as Submission['platform'],
  status: row.status as SubmissionStatus,
  submittedAt: row.submitted_at,
  updatedAt: row.updated_at,
  notes: row.notes ?? undefined,
});

export const detectPlatform = (url: string): Submission['platform'] => {
  const lower = url.toLowerCase();
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('instagram.com')) return 'instagram';
  return 'other';
};

export const createSubmission = async (
  campaignId: string,
  videoUrl: string
): Promise<Submission> => {
  const db = await getDatabase();
  const id = generateId();
  const now = new Date().toISOString();
  const platform = detectPlatform(videoUrl);

  await db.runAsync(
    `INSERT INTO submissions (id, campaign_id, video_url, platform, status, submitted_at, updated_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [id, campaignId, videoUrl, platform, now, now]
  );

  return {
    id,
    campaignId,
    videoUrl,
    platform,
    status: 'pending',
    submittedAt: now,
    updatedAt: now,
  };
};

export const getSubmissionsByCampaign = async (
  campaignId: string
): Promise<Submission[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SubmissionRow>(
    'SELECT * FROM submissions WHERE campaign_id = ? ORDER BY submitted_at DESC',
    [campaignId]
  );
  return rows.map(rowToSubmission);
};

export const updateSubmissionStatus = async (
  id: string,
  status: SubmissionStatus
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?',
    [status, new Date().toISOString(), id]
  );
};

export const getAllSubmissions = async (): Promise<Submission[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SubmissionRow>(
    'SELECT * FROM submissions ORDER BY submitted_at DESC'
  );
  return rows.map(rowToSubmission);
};
