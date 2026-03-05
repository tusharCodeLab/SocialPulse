

## Redesign Dashboard with Cross-Platform Reach Chart + Platform Cards

### What changes

The Dashboard page gets redesigned to match the reference layout: a large "Combined User Reach" area chart as the centerpiece with platform-specific summary cards stacked on the right. The separate Cross-Platform Analytics page and route get removed.

### Layout (reference-inspired)

```text
┌─────────────────────────────────────────────────────────┐
│ Welcome, {user}                    Overall Sentiment 🍩 │
│ Your social media analytics...                          │
├─────────────────────────────────────────────────────────┤
│ [Followers] [Engagement] [Reach] [Posts] [Positive%]    │
├─────────────────────────────────────────────────────────┤
│                                │ Instagram Reach Overview│
│  Combined User Reach           │  Likes | Comments      │
│  (Area chart with 3 lines)     │  Engagement | Views    │
│  Instagram / YouTube / FB      ├────────────────────────┤
│                                │ YouTube Channel Stats   │
│  Last 30 Days                  │  Subscribers | Views    │
│                                │  Retention              │
│                                ├────────────────────────┤
│                                │ Facebook Page Growth    │
│                                │  Page Likes | Reach     │
│                                │  Link Clicks            │
├────────────────────────────────┴────────────────────────┤
│ AI Performance Digest (existing, kept as-is)            │
└─────────────────────────────────────────────────────────┘
```

### Implementation

**1. Update `src/pages/Dashboard.tsx`**
- Import the cross-platform hooks (`usePlatformComparison`, `useReachTrends`) from `useCrossPlatformData.ts`
- Replace the current 3-column grid (Posts/Sentiment/AI columns) with a 2-column layout:
  - **Left (~65%)**: "Combined User Reach" AreaChart using Recharts with 3 filled lines (Instagram pink, YouTube red, Facebook blue), time range label, and legend
  - **Right (~35%)**: Stack of 3 platform summary cards, each showing key metrics (reach, likes, comments, engagement, followers) with platform brand colors and icons
- Keep the top metrics row and AI Performance Digest as they are
- Move sentiment donut to the header row (top-right, compact) like the reference
- Remove the old 3-column grid (Posts/Audience/Sentiment/Best Times/AI Insights/Spam/Trends columns) — these are all accessible from their dedicated platform sub-pages

**2. Remove Cross-Platform page**
- Remove route from `src/App.tsx` (line 56)
- Remove import (line 25)
- Remove nav item from `src/components/navigation/AppSidebar.tsx` (line 43)
- Keep `src/hooks/useCrossPlatformData.ts` (Dashboard will use these hooks)
- Delete `src/pages/CrossPlatformAnalytics.tsx`

**3. Keep `src/hooks/useCrossPlatformData.ts`** — the Dashboard will import and use these hooks directly for the combined reach chart and platform cards.

### What stays
- Welcome header, top metrics row, AI Performance Digest — all kept
- Sentiment donut moves to header area (compact, like reference)

### What gets removed from Dashboard
- The old 3-column grid with Posts/Audience/Sentiment/Best Times/AI Insights/Spam/Trends cards — all this data is available on dedicated sub-pages, no need to duplicate on the main dashboard

