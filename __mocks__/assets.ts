// Jest mock for src/constants/assets.ts
// Avoids require() of PNG/MP4 files which Jest can't process natively.

export type ImageSource = { uri: string } | number;
export type VideoSource = { uri: string } | number;

export const resolveLogoSource = (brandLogoUrl: string): ImageSource => {
  if (brandLogoUrl.startsWith('local:')) {
    return 1; // numeric asset reference, as Metro would return
  }
  return { uri: brandLogoUrl };
};

export const resolveVideoSource = (videoUrl: string): VideoSource => {
  if (videoUrl.startsWith('local:video:')) {
    return 2; // numeric asset reference
  }
  return { uri: videoUrl };
};
