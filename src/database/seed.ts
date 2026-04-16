import { Campaign } from '../types';
import { getDatabase } from './schema';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_001',
    brandName: 'Gymshark',
    brandLogoUrl: 'local:gymshark',
    brandColor: '#000000',
    title: 'Summer Lift Challenge',
    category: 'Fitness & Sports',
    brief: `We want authentic gym content showing your fitness journey with Gymshark gear.\n\n**What we need:**\n• Film a workout clip (45–60 sec) wearing Gymshark leggings or a hoodie\n• Show off your lifting form — deadlift, squat, or bench are ideal\n• End with a fit-check moment facing the camera\n• Upbeat trending audio is encouraged\n\n**Do NOT:**\n• Use any competitor branding\n• Add heavy filters that alter the clothing colors\n• Film in a dark or cluttered space\n\n**Caption must include:** #GymsharkLift #PartnerPost\n\nWe're looking for real, sweaty, high-energy gym content. Less polished is more authentic here!`,
    payoutPerVideo: 350,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    exampleVideos: [
      {
        id: 'ev_001a',
        campaignId: 'camp_001',
        title: 'Morning Deadlift Routine',
        thumbnailUrl: 'https://placehold.co/320x180/1a1a1a/FFFFFF?text=Deadlift+Example',
        videoUrl: 'local:video:fitness',
        description: 'Shows proper deadlift form with Gymshark attire, fit-check at the end.',
      },
      {
        id: 'ev_001b',
        campaignId: 'camp_001',
        title: 'Leg Day Fit Check',
        thumbnailUrl: 'https://placehold.co/320x180/1a1a1a/FFFFFF?text=Leg+Day+Example',
        videoUrl: 'local:video:fitness',
        description: 'Leg day vlog-style with mirror transitions and trending audio.',
      },
    ],
  },
  {
    id: 'camp_002',
    brandName: 'Ritual Vitamins',
    brandLogoUrl: 'local:ritual',
    brandColor: '#FFB6C1',
    title: 'Daily Ritual Morning Routine',
    category: 'Health & Wellness',
    brief: `Ritual wants lifestyle content around morning routines that feature our Essential for Women vitamin.\n\n**Format:** Morning routine "get ready with me" style (60–90 sec)\n\n**Must include:**\n• Showing the Ritual pill bottle (provided via DM after approval)\n• Taking the vitamin on screen\n• 2–3 other morning habits (journaling, skincare, coffee, etc.)\n• Natural lighting preferred\n\n**Talking points (natural, not scripted):**\n• Why you prioritize supplements\n• How the routine sets your day up right\n\n**Caption:** "Morning routine ft. @Ritual ✨ #RitualVitamins #Ad"\n\n**Tone:** Calm, aesthetic, self-care vibes. Think Pinterest morning energy.`,
    payoutPerVideo: 280,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    exampleVideos: [
      {
        id: 'ev_002a',
        campaignId: 'camp_002',
        title: 'Aesthetic Morning Routine',
        thumbnailUrl: 'https://placehold.co/320x180/FFB6C1/000000?text=Morning+Routine',
        videoUrl: 'local:video:supplements',
        description: 'Soft morning light, journaling, vitamins, coffee — perfect pacing example.',
      },
    ],
  },
  {
    id: 'camp_003',
    brandName: 'MVMT Watches',
    brandLogoUrl: 'local:mvmt',
    brandColor: '#C0A060',
    title: 'Everyday Style Drop',
    category: 'Fashion & Accessories',
    brief: `MVMT wants short, punchy fashion content showing our Signature Series watches in everyday settings.\n\n**Video length:** 15–30 seconds\n\n**Scenes we love:**\n• Coffee shop / café setting\n• Street-style walking shot\n• Desk / work-from-home close-up\n• Outfit fit-check with watch as the focal accessory\n\n**Must-have shots:**\n• Close-up of the watch face on wrist (at least 3 seconds)\n• Full-body or torso shot showing the full outfit\n\n**Audio:** Trending lo-fi or fashion-forward sound\n\n**Caption:** "Effortless every day. @MVMTWatches #MVMTStyle #Ad"\n\n**Note:** You'll receive the watch as gifted product. Do not disclose specific retail price.`,
    payoutPerVideo: 200,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    exampleVideos: [
      {
        id: 'ev_003a',
        campaignId: 'camp_003',
        title: 'Coffee Shop Style',
        thumbnailUrl: 'https://placehold.co/320x180/C0A060/FFFFFF?text=Cafe+Style',
        videoUrl: 'local:video:watches',
        description: 'Aesthetic café shoot — watch wrist shot, outfit reveal, trending audio.',
      },
      {
        id: 'ev_003b',
        campaignId: 'camp_003',
        title: 'Street Style Walk',
        thumbnailUrl: 'https://placehold.co/320x180/C0A060/FFFFFF?text=Street+Style',
        videoUrl: 'local:video:example',
        description: 'Walking shot on a busy street — shows watch and outfit in motion.',
      },
    ],
  },
  {
    id: 'camp_004',
    brandName: 'Athletic Greens (AG1)',
    brandLogoUrl: 'local:ag1',
    brandColor: '#4A7C59',
    title: 'AG1 Athletic Performance',
    category: 'Nutrition & Fitness',
    brief: `AG1 is looking for performance-focused content from athletes and active creators.\n\n**Video format:** 45–60 seconds\n\n**Hook ideas:**\n• "POV: you swapped your morning coffee for this..."\n• "What I take before every workout"\n• Day-in-the-life featuring AG1 as part of your athletic prep\n\n**Required product shots:**\n• Scooping AG1 powder into a shaker\n• The iconic green drink being mixed\n• Drinking the shake (reaction shot encouraged!)\n\n**Key messages to hit naturally:**\n• 75 vitamins, minerals & whole-food sourced ingredients\n• Tastes surprisingly good\n• Part of your athletic ritual\n\n**Caption must include:** #AG1Partner #DrinkAG1\n\n**Tone:** High-performance, science-y but approachable. No over-the-top claims.`,
    payoutPerVideo: 420,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    exampleVideos: [
      {
        id: 'ev_004a',
        campaignId: 'camp_004',
        title: 'Pre-Workout Morning Ritual',
        thumbnailUrl: 'https://placehold.co/320x180/4A7C59/FFFFFF?text=AG1+Morning',
        videoUrl: 'local:video:supplements',
        description: 'Morning prep featuring AG1 scoop, mix, drink — energetic cuts.',
      },
    ],
  },
];

const isSeeded = async (): Promise<boolean> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM campaigns'
  );
  return (result?.count ?? 0) > 0;
};

export const seedDatabase = async (): Promise<void> => {
  if (await isSeeded()) return;

  const database = await getDatabase();

  for (const campaign of MOCK_CAMPAIGNS) {
    await database.runAsync(
      `INSERT INTO campaigns (id, brand_name, brand_logo_url, brand_color, title, brief, payout_per_video, deadline, is_active, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaign.id,
        campaign.brandName,
        campaign.brandLogoUrl,
        campaign.brandColor,
        campaign.title,
        campaign.brief,
        campaign.payoutPerVideo,
        campaign.deadline,
        campaign.isActive ? 1 : 0,
        campaign.category,
      ]
    );

    for (const video of campaign.exampleVideos) {
      await database.runAsync(
        `INSERT INTO example_videos (id, campaign_id, title, thumbnail_url, video_url, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [video.id, video.campaignId, video.title, video.thumbnailUrl, video.videoUrl, video.description]
      );
    }
  }
};
