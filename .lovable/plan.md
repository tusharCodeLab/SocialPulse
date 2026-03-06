

## Remove Generate Button & Ensure Real Timestamps

### Changes

#### 1. `src/components/dashboard/ActivityFeed.tsx`
- Remove the `onGenerateInsights` and `isGenerating` props entirely
- Remove the "Generate" button from the header (lines 138-148)
- Remove the "Generate Insights" button from the empty state (lines 263-273)
- Keep the empty state but without the generate button — just show "No insights yet"
- Timestamps already use `formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })` which correctly shows real relative time (e.g. "27 days ago"). This is accurate based on the `created_at` dates stored in the database.

#### 2. `src/pages/Dashboard.tsx`
- Remove the `handleGenerateInsights` function and `isGenerating` state
- Remove the `onGenerateInsights` and `isGenerating` props passed to `ActivityFeed`

### Result
Clean activity feed showing only real insights with accurate relative timestamps, no generate functionality.

