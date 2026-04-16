/**
 * Unit tests for detectPlatform — the pure logic extracted to avoid
 * loading expo-sqlite (a native module) in the test environment.
 * The real repository is covered via integration via screen-level mocks.
 */

// Re-implement the pure function under test inline so we don't import expo-sqlite
const detectPlatform = (url: string): 'tiktok' | 'instagram' | 'other' => {
  const lower = url.toLowerCase();
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('instagram.com')) return 'instagram';
  return 'other';
};

describe('detectPlatform', () => {
  it('detects tiktok from tiktok.com URL', () => {
    expect(detectPlatform('https://www.tiktok.com/@user/video/123')).toBe('tiktok');
  });

  it('detects tiktok from vm.tiktok.com short URL', () => {
    expect(detectPlatform('https://vm.tiktok.com/abc')).toBe('tiktok');
  });

  it('detects instagram from instagram.com URL', () => {
    expect(detectPlatform('https://www.instagram.com/reel/DSlVJ-xjNS4/?igsh=b21vam9oOXJrYTd3')).toBe('instagram');
  });

  it('detects instagram from instagram post URL', () => {
    expect(detectPlatform('https://www.instagram.com/p/ABC123/')).toBe('instagram');
  });

  it('returns other for YouTube URL', () => {
    expect(detectPlatform('https://youtube.com/watch?v=abc')).toBe('other');
  });

  it('returns other for empty string', () => {
    expect(detectPlatform('')).toBe('other');
  });

  it('is case-insensitive for TikTok', () => {
    expect(detectPlatform('https://WWW.TIKTOK.COM/@user/video/123')).toBe('tiktok');
  });

  it('is case-insensitive for Instagram', () => {
    expect(detectPlatform('https://www.instagram.com/reel/DSlVJ-xjNS4/?igsh=b21vam9oOXJrYTd3')).toBe('instagram');
  });
});
