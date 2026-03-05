

## Plan: Professional Dashboard Redesign

The current dashboard has 4 metric pills, a reach chart, 3 platform cards, and an AI digest section. It feels sparse with large empty areas. Here is the plan to make it dense, feature-rich, and professional.

### New Dashboard Sections (top to bottom)

**1. Enhanced Header with Status Indicators**
- Greeting with animated gradient text
- Live status badges showing connected platforms count, last sync time
- Sentiment donut (existing) + refresh button

**2. Metric Cards Row (upgraded from pills)**
- 4 cards: Total Followers, Total Engagement, Total Reach, Avg Engagement Rate
- Each card gets a sparkline mini-chart (tiny area chart showing 7-day trend using post data)
- Change indicator showing percentage up/down vs prior period
- Subtle glow-on-hover effect

**3. Main Analytics Grid (2 rows)**

*Row 1 - 3-column layout:*
- **Combined Reach Chart** (col-span-2): Keep existing area chart but add period selector tabs (7d / 14d / 30d / All)
- **Engagement Breakdown** (col-span-1): Radial bar chart or stacked bar showing likes vs comments vs shares per platform

*Row 2 - 3-column layout:*
- **Top Performing Posts** (col-span-2): Horizontal ranked list of top 5 posts across all platforms with thumbnail, platform badge, engagement rate, reach, and a mini bar showing relative performance. Uses existing `useTopContentByReach` hook.
- **Sentiment Overview** (col-span-1): Larger donut chart with legend, total analyzed count, and sentiment distribution bars underneath

**4. Platform Comparison Strip**
- 3 platform cards in a row (existing but enhanced)
- Add a mini sparkline per card showing follower trend
- Add a "vs last period" change badge

**5. Quick Actions & AI Section**
- **AI Performance Digest** (existing, keep as-is)
- **Quick Actions Row**: 3 action cards side-by-side
  - "Generate Content Ideas" (triggers AI content ideas)
  - "Analyze Sentiment" (triggers bulk sentiment analysis)
  - "Detect Trends" (triggers trend detection)
  - Each shows a brief result preview after running

**6. Recent Activity Feed**
- Latest 5 AI insights from `useCrossPlatformInsights` hook
- Each insight shown as a compact card with icon, text, timestamp, and read/unread status

### Data Sources (all existing hooks, no new backend needed)
- `useDashboardSummaryApi` - top metrics
- `usePlatformComparison` - platform cards
- `useReachTrends` - reach chart
- `useSentimentStatsApi` - sentiment donut
- `useTopContentByReach` - top posts (already exists but unused on dashboard)
- `useCrossPlatformInsights` - AI insights feed
- `usePostsApi` - for sparkline data
- `useAIPerformanceDigest` - digest section
- `useAIContentIdeas`, `useDetectTrends`, `useAnalyzeSentimentApi` - quick actions

### Design Details
- Staggered framer-motion entrance animations (increasing delay per section)
- Glass-morphism cards with `bg-card border border-border/60` and `boxShadow: var(--shadow-card)`
- Glow hover effects on interactive cards
- Consistent icon + title + subtitle headers per section
- Recharts for all visualizations (AreaChart, PieChart, BarChart, RadialBarChart)
- Premium skeleton loading states for each section

### File Changes
- **`src/pages/Dashboard.tsx`**: Full rewrite with all new sections. Extract sub-components inline (TopPostsTable, SentimentPanel, QuickActionsRow, ActivityFeed, EnhancedMetricCard, EngagementBreakdown)

No database changes or new hooks needed -- all data sources already exist.

