# CreatorApp

A React Native mobile application that powers the creator submission flow for brand campaigns. Creators can browse active campaigns, read briefs, watch example videos, submit their content URLs, and track approval status — all offline-first with local SQLite storage.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screens](#screens)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [CI/CD](#cicd)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Asset System](#asset-system)
- [Mock Data](#mock-data)

---

## Overview

CreatorApp is built for content creators who participate in brand campaigns on TikTok and Instagram. The app guides a creator through the full submission lifecycle:

```
Browse Campaigns → Read Brief + Watch Examples → Submit Video URL → Track Status
```

There is no backend — all data is stored locally using SQLite via `expo-sqlite`. The database is seeded with four mock campaigns on first launch and automatically migrated when assets are updated.

---

## Features

- **Campaign List** — Browse active campaigns sorted by deadline urgency, with brand logo, payout per video, category, and deadline countdown
- **Campaign Detail** — Full formatted campaign brief with step-by-step requirements, and 1–2 embedded example videos to replicate
- **Video Submission** — Submit a TikTok or Instagram video URL with live platform detection and URL validation
- **Submission Status** — View all submissions per campaign with pending / approved / rejected status badges, summary counts, and timestamps
- **Offline-first** — No internet connection required; all data persisted in SQLite with WAL mode
- **Responsive** — Portrait and landscape layouts across all screens (breakpoint at 600px width)
- **Auto-migration** — Database rows with old asset URLs are updated to local asset keys on every startup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 54 (New Architecture enabled) |
| Language | TypeScript (strict mode) |
| UI | React Native 0.81 |
| Navigation | React Navigation v7 (Stack) |
| Database | expo-sqlite v16 (WAL mode) |
| Video Playback | expo-av |
| Safe Area | react-native-safe-area-context |
| Testing | Jest 29 + jest-expo + React Native Testing Library |
| CI | GitHub Actions |

---

## Project Structure

```
CreatorApp/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── assets/
│   ├── logos/                      # Brand logo PNGs
│   │   ├── gymshark-logo.png
│   │   ├── ritual-vitamins.png
│   │   ├── mvmt-watches.png
│   │   └── ag1-logo.png
│   └── videos/                     # Local example video files
│       ├── fitness.mp4
│       ├── supplements.mp4
│       ├── watches.mp4
│       └── example_video.mp4
├── src/
│   ├── types/
│   │   └── index.ts                # Campaign, Submission, nav param types
│   ├── constants/
│   │   ├── theme.ts                # Colors, Spacing, Typography, Shadows
│   │   └── assets.ts               # Local asset resolver (logos + videos)
│   ├── database/
│   │   ├── schema.ts               # SQLite init, table creation, migrations
│   │   ├── seed.ts                 # Mock campaign data seeded on first launch
│   │   └── repositories/
│   │       ├── campaignRepository.ts
│   │       └── submissionRepository.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Stack navigator with typed params
│   ├── components/
│   │   ├── CampaignCard.tsx        # Campaign list item card
│   │   ├── DeadlineCountdown.tsx   # Urgency-aware deadline label
│   │   ├── EmptyState.tsx          # Generic empty/error state
│   │   ├── StatusBadge.tsx         # Pending / Approved / Rejected pill
│   │   └── VideoPlayer.tsx         # expo-av player with play/pause overlay
│   └── screens/
│       ├── CampaignListScreen.tsx
│       ├── CampaignDetailScreen.tsx
│       ├── SubmitVideoScreen.tsx
│       └── SubmissionStatusScreen.tsx
├── __tests__/
│   ├── components/                 # Component unit tests
│   ├── database/                   # Repository logic tests
│   ├── screens/                    # Screen integration tests
│   └── utils/
│       └── mockData.ts             # Shared test fixtures
├── __mocks__/
│   └── assets.ts                   # Jest mock for local asset resolver
├── App.tsx                         # Entry point — DB init → seed → render
├── app.json                        # Expo configuration
├── tsconfig.json
└── package.json
```

---

## Screens

### 1. Campaign List
Displays all active campaigns sorted by deadline (soonest first).

- Brand logo, name, and category
- Payout-per-video badge
- Colour-coded deadline countdown (red < 2 days, amber ≤ 3 days, grey otherwise)
- Pull-to-refresh
- 2-column grid in landscape mode
- Empty and error states

### 2. Campaign Detail
Full brief for a selected campaign.

- Brand hero header with stats row (payout, deadline, example count)
- Formatted brief with headings, bullet points, and body text parsed from markdown-style strings
- 1–2 embedded video players using local `.mp4` files
- Sticky bottom bar with **Submit Video** and **My Submissions** actions

### 3. Submit Video
URL entry form for submitting a creator's video.

- Step-by-step pre-submission checklist
- URL input with live validation (must be a valid `https://` URL)
- Automatic platform detection — TikTok, Instagram, or Other
- Example URL quick-fill buttons
- Disabled submit state with inline error messages
- Navigates directly to Submission Status on success

### 4. Submission Status
Lists all submissions made for a campaign.

- Summary row with counts per status (pending / approved / rejected)
- Per-submission card with platform icon, tappable URL, status badge, and timestamp
- Optional reviewer notes display
- Pull-to-refresh
- Empty state with CTA to submit
- Sticky **Submit Another Video** button

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- iOS Simulator (Xcode) or Android Emulator, or the [Expo Go](https://expo.dev/client) app on a physical device

### Install

```bash
git clone <repo-url>
cd CreatorApp
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict between `react-test-renderer` and `react@19`.

### Run

```bash
# Start Expo dev server
npm start

# Open directly on a platform
npm run ios
npm run android
npm run web
```

On first launch the app initialises the SQLite database, seeds it with four mock campaigns, and navigates to the Campaign List screen. Subsequent launches skip seeding (idempotent check) but still run any pending URL migrations.

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file save)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test Summary

| Suite | Tests |
|---|---|
| `StatusBadge` | 5 |
| `DeadlineCountdown` | 7 |
| `CampaignCard` | 6 |
| `EmptyState` | 2 |
| `detectPlatform` (repository logic) | 8 |
| `CampaignListScreen` | 6 |
| `CampaignDetailScreen` | 7 |
| `SubmitVideoScreen` | 15 |
| `SubmissionStatusScreen` | 7 |
| **Total** | **66 passing** |

### What is tested

- Component rendering and prop variants
- User interactions (tap, text input, navigation)
- URL validation logic (`isValidVideoUrl`)
- Platform detection logic (`detectPlatform`)
- Empty states, error states, and loading states
- Navigation calls on user actions

### Mocking strategy

Native modules (`expo-sqlite`, `expo-av`) and local asset `require()` calls are mocked at the module level so tests run in Node without a simulator. Database repositories are mocked per-test-suite using `jest.mock()`.

---

## CI/CD

The GitHub Actions pipeline at `.github/workflows/ci.yml` runs on every push and pull request to `main` or `develop`.

### Pipeline stages

```
Checkout → Install deps → Type Check → Tests + Coverage → Upload Artifacts
```

| Step | Tool | Fails pipeline on |
|---|---|---|
| Install | `npm ci --legacy-peer-deps` | Install error |
| Type check | `tsc --noEmit` | Any TypeScript error |
| Tests | `jest --ci` | Any failing test |
| Coverage upload | `actions/upload-artifact` | Never (always runs) |
| JUnit upload | `actions/upload-artifact` | Never (always runs) |

Coverage reports and JUnit XML results are uploaded as artifacts retained for 14 days, downloadable from the Actions run page.

---

## Architecture

### Data flow

```
App.tsx
  └── initializeDatabase()     — creates tables, runs URL migrations
  └── seedDatabase()           — inserts mock campaigns once
  └── <AppNavigator>
        └── CampaignListScreen
              └── getActiveCampaigns()        — reads campaigns + example_videos
              └── CampaignDetailScreen
                    └── getCampaignById()     — reads single campaign
                    └── SubmitVideoScreen
                          └── createSubmission()  — inserts to submissions table
                          └── SubmissionStatusScreen
                                └── getSubmissionsByCampaign()
```

### Key design decisions

**SQLite as the source of truth** — `expo-sqlite` v16 with WAL journaling mode gives fast concurrent reads. All reads go through typed repository functions that map snake_case DB rows to camelCase TypeScript interfaces.

**`local:` asset key protocol** — Brand logos and example videos are stored in SQLite as string keys (e.g. `local:gymshark`, `local:video:fitness`) rather than file paths. `src/constants/assets.ts` resolves these to `require()` calls at runtime. This keeps the DB schema simple and makes the asset registry the single source of truth for asset mapping.

**Auto-migration on startup** — `schema.ts` runs `UPDATE` statements on every launch to rewrite any legacy URLs (CDN links, old placeholder images) to their `local:` equivalents. These are idempotent `LIKE`-based matches so they have no effect once migrated.

**Responsive layout** — Every screen reads `useWindowDimensions()` and switches layout at 600px width. Lists switch from 1 to 2 columns; paddings expand; video player height is constrained to 16:9 up to a max of 220px.

---

## Database Schema

```sql
CREATE TABLE campaigns (
  id               TEXT PRIMARY KEY,
  brand_name       TEXT NOT NULL,
  brand_logo_url   TEXT NOT NULL,   -- "local:gymshark" or remote URI
  brand_color      TEXT NOT NULL,   -- hex color for UI accents
  title            TEXT NOT NULL,
  brief            TEXT NOT NULL,   -- markdown-style formatted string
  payout_per_video REAL NOT NULL,
  deadline         TEXT NOT NULL,   -- ISO 8601 date string
  is_active        INTEGER NOT NULL DEFAULT 1,
  category         TEXT NOT NULL
);

CREATE TABLE example_videos (
  id            TEXT PRIMARY KEY,
  campaign_id   TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  video_url     TEXT NOT NULL,      -- "local:video:fitness" or remote URI
  description   TEXT NOT NULL
);

CREATE TABLE submissions (
  id           TEXT PRIMARY KEY,
  campaign_id  TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  video_url    TEXT NOT NULL,
  platform     TEXT NOT NULL CHECK(platform IN ('tiktok', 'instagram', 'other')),
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK(status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL,   -- ISO 8601
  updated_at   TEXT NOT NULL,   -- ISO 8601
  notes        TEXT
);
```

---

## Asset System

All local assets are referenced through `src/constants/assets.ts` which provides two resolver functions:

```ts
resolveLogoSource(brandLogoUrl: string): ImageSource
resolveVideoSource(videoUrl: string):    VideoSource
```

Both functions accept either a `local:` key or a remote URI and return the appropriate source object for React Native's `<Image>` or `expo-av`'s `<Video>` components.

| Key | File |
|---|---|
| `local:gymshark` | `assets/logos/gymshark-logo.png` |
| `local:ritual` | `assets/logos/ritual-vitamins.png` |
| `local:mvmt` | `assets/logos/mvmt-watches.png` |
| `local:ag1` | `assets/logos/ag1-logo.png` |
| `local:video:fitness` | `assets/videos/fitness.mp4` |
| `local:video:supplements` | `assets/videos/supplements.mp4` |
| `local:video:watches` | `assets/videos/watches.mp4` |
| `local:video:example` | `assets/videos/example_video.mp4` |

---

## Mock Data

Four campaigns are seeded on first launch:

| Brand | Category | Payout | Deadline | Example Videos |
|---|---|---|---|---|
| Gymshark | Fitness & Sports | $350 | 12 days | 2 × `fitness.mp4` |
| Ritual Vitamins | Health & Wellness | $280 | 7 days | 1 × `supplements.mp4` |
| MVMT Watches | Fashion & Accessories | $200 | 20 days | `watches.mp4` + `example_video.mp4` |
| Athletic Greens (AG1) | Nutrition & Fitness | $420 | 5 days | 1 × `supplements.mp4` |
