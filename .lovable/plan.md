

## YouTube Sub-Pages & Sidebar Expansion

### Current State
YouTube has only one sub-item ("YouTube Analytics") in the sidebar, while Instagram has four (Posts Analysis, Audience Insights, Sentiment, Trend Intelligence). The user wants parity.

### Changes

**1. Sidebar (`AppSidebar.tsx`)**
Update the YouTube `platformGroups` entry to include 5 sub-items:

```text
YouTube (collapsible)
  ├─ YouTube Overview      → /youtube-analytics
  ├─ Video Analysis        → /youtube-posts
  ├─ Audience Insights     → /youtube-audience
  ├─ Sentiment             → /youtube-sentiment
  └─ Trend Intelligence    → /youtube-trends
```

**2. New Pages (4 files)**
Create dedicated YouTube pages mirroring the Instagram page structure but with YouTube-specific metrics and YouTube red branding:

- **`src/pages/YouTubePostsAnalysis.tsx`** — Video performance table/cards (views, likes, comments, watch time per video). Mirrors Instagram's Posts Analysis.
- **`src/pages/YouTubeAudience.tsx`** — Demographics (age/gender), top countries, traffic sources, subscriber growth. Mirrors Instagram's Audience Insights.
- **`src/pages/YouTubeSentiment.tsx`** — Comment sentiment breakdown (positive/negative/neutral), sentiment trend chart, top comments. Mirrors Instagram's Sentiment.
- **`src/pages/YouTubeTrends.tsx`** — Trending topics from comments, content performance trends, best upload times. Mirrors Instagram's Trend Intelligence.

Each page uses the same `DashboardLayout`, premium card styling, and empty-state pattern as the existing `YouTubeAnalytics.tsx`.

**3. Routes (`App.tsx`)**
Add 4 new protected routes: `/youtube-posts`, `/youtube-audience`, `/youtube-sentiment`, `/youtube-trends`.

**4. Rename existing page**
Rename the current `YouTubeAnalytics` page header to "YouTube Overview" since it now serves as the overview/dashboard for the YouTube platform.

