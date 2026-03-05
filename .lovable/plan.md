

## Plan: Upgrade All Pages to Professional Level

The Dashboard was already redesigned with enhanced metric cards, sparklines, engagement breakdowns, and AI quick actions. The remaining pages are functional but basic -- they use simple `MetricCard` components, single charts, and flat layouts. This plan upgrades every non-Dashboard page to match the Dashboard's professional density and polish.

### Scope: 15 Pages to Upgrade

**Instagram (4 pages):** InstagramOverview, PostsAnalysis, AudienceInsights (Sentiment & Trends already decent)
**Facebook (5 pages):** FacebookAnalytics, FacebookPosts, FacebookAudience, FacebookSentiment, FacebookTrends
**YouTube (5 pages):** YouTubeAnalytics, YouTubePostsAnalysis, YouTubeAudience, YouTubeSentiment, YouTubeTrends
**Other (1 page):** ContentCalendar

### Upgrades Per Page Category

**1. All Overview Pages (InstagramOverview, FacebookAnalytics, YouTubeAnalytics)**
- Replace basic `MetricTile` with `EnhancedMetricCard` (sparklines + change indicators)
- Add timeframe selector to all charts (7d/14d/30d/All)
- Add an engagement breakdown chart (likes vs comments vs shares) using `EngagementBreakdown` component pattern
- Add a "Top 5 Posts" summary strip below charts using `TopPostsTable` inline
- Add a mini sentiment donut if comments exist

**2. All Posts Analysis Pages (PostsAnalysis, FacebookPosts, YouTubePostsAnalysis)**
- Upgrade metric cards to `EnhancedMetricCard` with sparklines
- Add post type distribution (pie/donut chart showing image vs video vs carousel breakdown)
- Add engagement rate trend line chart alongside the bar chart
- Add media thumbnails to the top posts table (already done for YouTube, apply to Instagram/Facebook)
- Add a "Performance Score" summary banner at the top showing overall content health

**3. All Audience Pages (AudienceInsights, FacebookAudience, YouTubeAudience)**
- Upgrade to `EnhancedMetricCard` with sparkline follower trends
- Add a "Growth Velocity" mini chart showing daily new followers
- Add follower milestone indicators (e.g., "92% to 10K")
- Enhance the best-time-to-post heatmap with smoother gradients and hour labels
- Add an audience engagement quality score

**4. All Sentiment Pages (Sentiment, FacebookSentiment, YouTubeSentiment)**
- Add sentiment trend sparklines to each metric card
- Add a "Sentiment Health Score" banner (weighted positive/negative ratio)
- Upgrade comment list with avatars, platform badges, and reply counts
- Add word cloud or top keywords section from analyzed comments
- Enhance the pie chart with animated transitions and larger center stat

**5. All Trends Pages (Trends, FacebookTrends, YouTubeTrends)**
- Add a trends summary dashboard strip (total trends, improving count, declining count, avg confidence)
- Add trend timeline visualization showing when trends were detected
- Enhance content ideas grid with visual priority indicators and estimated ROI badges
- Add a "Trend Velocity" indicator showing how fast metrics are changing

**6. Content Calendar**
- Add week/month view toggle with smooth transitions
- Add drag-to-reschedule visual feedback
- Add platform-colored event dots
- Add an AI "fill gaps" button that suggests content for empty days
- Add posting frequency heatmap showing content density per day

### Design Consistency Applied Everywhere
- All pages use `EnhancedMetricCard` instead of basic `MetricCard`
- Staggered framer-motion entrance animations (0.05s increments)
- Glass-morphism card styling (`bg-card border border-border/60`, `boxShadow: var(--shadow-card)`)
- Platform brand colors consistently applied (Instagram #E4405F, Facebook #1877F2, YouTube #FF0000)
- Gradient accent banners for AI-powered sections
- Premium skeleton loading states during data fetch
- Timeframe selectors on all time-series charts

### Implementation Approach
This is a large scope. I will batch the work:
1. **Batch 1**: All 3 Overview pages (Instagram, Facebook, YouTube)
2. **Batch 2**: All 3 Posts Analysis pages
3. **Batch 3**: All 3 Audience pages
4. **Batch 4**: All 3 Sentiment pages
5. **Batch 5**: All 3 Trends pages
6. **Batch 6**: Content Calendar

### Files Changed
- `src/pages/InstagramOverview.tsx` -- full upgrade
- `src/pages/FacebookAnalytics.tsx` -- full upgrade
- `src/pages/YouTubeAnalytics.tsx` -- full upgrade
- `src/pages/PostsAnalysis.tsx` -- enhanced metrics + post type chart + thumbnails
- `src/pages/FacebookPosts.tsx` -- same pattern
- `src/pages/YouTubePostsAnalysis.tsx` -- same pattern
- `src/pages/AudienceInsights.tsx` -- enhanced cards + growth velocity + milestones
- `src/pages/FacebookAudience.tsx` -- same pattern
- `src/pages/YouTubeAudience.tsx` -- same pattern
- `src/pages/Sentiment.tsx` -- health score + enhanced comments
- `src/pages/FacebookSentiment.tsx` -- same pattern
- `src/pages/YouTubeSentiment.tsx` -- same pattern
- `src/pages/Trends.tsx` -- summary strip + timeline
- `src/pages/FacebookTrends.tsx` -- same pattern
- `src/pages/YouTubeTrends.tsx` -- same pattern
- `src/pages/ContentCalendar.tsx` -- view toggle + frequency heatmap

No database changes needed. All data sources already exist.

