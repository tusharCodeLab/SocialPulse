

## Fix: Remove Fake YouTube Data, Keep Only Real API Data

### Problem Found
In `YouTubeAnalytics.tsx` (line 101), there is a **fabricated "Watch Time (est.)"** metric calculated as `totalViews * 0.05`. This is not real data -- it's a made-up estimation. The YouTube Data API v3 (public key-based) does not provide watch time data; that requires the YouTube Analytics API with full OAuth 2.0, which this project does not implement.

All other YouTube data across all pages (`YouTubePostsAnalysis`, `YouTubeSentiment`, `YouTubeTrends`, `YouTubeAudience`, Dashboard) is correctly sourced from the database, which is populated by the `fetch-youtube` edge function using the real YouTube Data API v3.

### What to Change

**`src/pages/YouTubeAnalytics.tsx`** (line 101):
- **Remove** the "Watch Time (est.)" metric tile entirely since it shows fake data
- Adjust the grid from 6 columns to 5 columns to accommodate the removal
- All remaining metrics (Total Views, Subscribers, Likes, Comments, Videos) are real API data

### What Stays (already correct)
- `useYouTubeVideos()` -- queries real `posts` table data imported via YouTube API
- `useYouTubeComments()` -- queries real `post_comments` table data imported via YouTube API  
- `useYouTubeAccount()` -- queries real `social_accounts` table (subscribers, channel name)
- `useYouTubeAudienceMetrics()` -- queries real `audience_metrics` table snapshots
- Dashboard platform comparison cards and reach trends -- all query real database data
- All chart data derived from these hooks is real

This is a single-line removal. No other YouTube pages have fake data.

