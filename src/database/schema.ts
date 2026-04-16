import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('creator_app.db');
  return db;
};

export const initializeDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY NOT NULL,
      brand_name TEXT NOT NULL,
      brand_logo_url TEXT NOT NULL,
      brand_color TEXT NOT NULL,
      title TEXT NOT NULL,
      brief TEXT NOT NULL,
      payout_per_video REAL NOT NULL,
      deadline TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS example_videos (
      id TEXT PRIMARY KEY NOT NULL,
      campaign_id TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      video_url TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY NOT NULL,
      campaign_id TEXT NOT NULL,
      video_url TEXT NOT NULL,
      platform TEXT NOT NULL CHECK(platform IN ('tiktok', 'instagram', 'other')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      submitted_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );
  `);

  // Migrate old URLs to local: keys on every startup (idempotent)
  await migrateLogoUrls(database);
  await migrateVideoUrls(database);
};

const LOGO_MIGRATIONS: Array<{ match: string; replacement: string }> = [
  { match: 'placehold.co/80x80/000000', replacement: 'local:gymshark' },
  { match: 'placehold.co/80x80/FFC0CB', replacement: 'local:ritual' },
  { match: 'placehold.co/80x80/C0A060', replacement: 'local:mvmt' },
  { match: 'placehold.co/80x80/4A7C59', replacement: 'local:ag1' },
];

const VIDEO_MIGRATIONS: Array<{ match: string; replacement: string }> = [
  // Gymshark fitness videos
  { match: 'instagram.com/reel/DSlVJ', replacement: 'local:video:fitness' },
  { match: 'ForBiggerEscapes.mp4',    replacement: 'local:video:fitness' },
  // Ritual morning routine
  { match: 'instagram.com/p/DW6sEYw', replacement: 'local:video:supplements' },
  // MVMT watches
  { match: 'BigBuckBunny.mp4',        replacement: 'local:video:watches' },
  { match: 'SubaruOutback',           replacement: 'local:video:example' },
  // AG1 supplements
  { match: 'ForBiggerFun.mp4',        replacement: 'local:video:supplements' },
  // Catch-all for any remaining CDN videos
  { match: 'ForBiggerBlazes.mp4',     replacement: 'local:video:fitness' },
  { match: 'ElephantsDream.mp4',      replacement: 'local:video:supplements' },
];

const migrateLogoUrls = async (database: SQLite.SQLiteDatabase): Promise<void> => {
  for (const { match, replacement } of LOGO_MIGRATIONS) {
    await database.runAsync(
      `UPDATE campaigns SET brand_logo_url = ? WHERE brand_logo_url LIKE ?`,
      [replacement, `%${match}%`]
    );
  }
};

const migrateVideoUrls = async (database: SQLite.SQLiteDatabase): Promise<void> => {
  for (const { match, replacement } of VIDEO_MIGRATIONS) {
    await database.runAsync(
      `UPDATE example_videos SET video_url = ? WHERE video_url LIKE ?`,
      [replacement, `%${match}%`]
    );
  }
};

export const resetDatabase = async (): Promise<void> => {
  const database = await getDatabase();
  await database.execAsync(`
    DROP TABLE IF EXISTS submissions;
    DROP TABLE IF EXISTS example_videos;
    DROP TABLE IF EXISTS campaigns;
  `);
  db = null;
};
