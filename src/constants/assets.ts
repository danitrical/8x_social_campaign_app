// Maps strings stored in SQLite to local require() assets.
// Keys starting with "local:" are resolved here; everything else is treated as a remote URI.

const LOCAL_LOGOS: Record<string, ReturnType<typeof require>> = {
  'local:gymshark': require('../../assets/logos/gymshark-logo.png'),
  'local:ritual': require('../../assets/logos/ritual-vitamins.png'),
  'local:mvmt': require('../../assets/logos/mvmt-watches.png'),
  'local:ag1': require('../../assets/logos/ag1-logo.png'),
};

const LOCAL_VIDEOS: Record<string, ReturnType<typeof require>> = {
  'local:video:fitness': require('../../assets/videos/fitness.mp4'),
  'local:video:supplements': require('../../assets/videos/supplements.mp4'),
  'local:video:watches': require('../../assets/videos/watches.mp4'),
  'local:video:example': require('../../assets/videos/example_video.mp4'),
};

export type ImageSource = { uri: string } | ReturnType<typeof require>;
export type VideoSource = { uri: string } | ReturnType<typeof require>;

export const resolveLogoSource = (brandLogoUrl: string): ImageSource => {
  if (brandLogoUrl.startsWith('local:')) {
    return LOCAL_LOGOS[brandLogoUrl] ?? { uri: '' };
  }
  return { uri: brandLogoUrl };
};

export const resolveVideoSource = (videoUrl: string): VideoSource => {
  if (videoUrl.startsWith('local:video:')) {
    return LOCAL_VIDEOS[videoUrl] ?? { uri: '' };
  }
  return { uri: videoUrl };
};
