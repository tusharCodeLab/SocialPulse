

## Plan: Add AI-Powered "Best Time to Post" Page Under Instagram

Add a new sub-option under the Instagram section in the sidebar that uses generative AI to analyze the user's posting history and recommend optimal posting times.

### Changes

**1. New page: `src/pages/InstagramBestTime.tsx`**
- Professional page with a "Generate Best Times" button that calls an edge function
- Displays AI-generated recommendations as a visual schedule (day/hour heatmap or ranked list)
- Shows reasoning from AI (why these times work), confidence scores, and sample sizes
- Loading/empty states for users with insufficient data

**2. New edge function: `supabase/functions/ai-best-times/index.ts`**
- Fetches user's Instagram posts from the `posts` table (platform = 'instagram')
- Calculates engagement patterns by day/hour from historical data
- Sends the aggregated data to Lovable AI (gemini-3-flash-preview) to generate human-readable insights and strategic recommendations
- Returns both the raw best times and AI-generated explanations
- Handles auth, CORS, rate limits (429/402)

**3. Update `src/components/navigation/AppSidebar.tsx`**
- Add `{ to: '/instagram-best-time', icon: Clock, label: 'Best Time to Post' }` to the Instagram platform group items

**4. Update `src/App.tsx`**
- Add route: `<Route path="/instagram-best-time" element={<InstagramBestTime />} />`

**5. Update `supabase/config.toml`** (via convention)
- Add `[functions.ai-best-times]` with `verify_jwt = false`

### AI Integration
- Uses Lovable AI gateway with `google/gemini-3-flash-preview`
- Prompt includes aggregated engagement data per day/hour slot
- AI returns natural-language recommendations with strategic reasoning (e.g., "Tuesday 6PM — your audience is most active after work hours")

