

## Plan: Replace Instagram "Trend Intelligence" with "Content Studio"

Remove the Trend Intelligence sub-item from Instagram's sidebar and replace it with a new multi-step **Content Studio** feature — a guided workflow: Trending Topics → A/B Post Creation → Schedule (Best Time Calendar).

### Flow

```text
Step 1: Trending Topics Grid
  → User picks a topic
Step 2: A/B Post Versions
  → AI generates Version A & B (title, caption, hashtags, script)
  → User selects one
Step 3: Schedule Post
  → Calendar picker with AI-recommended best times
  → Save to content_calendar table
```

### Changes

**1. New page: `src/pages/InstagramContentStudio.tsx`**
- Multi-step wizard with state management (step 1/2/3)
- **Step 1 — Trending Topics**: Calls `detect-trends` edge function (filtered to Instagram) to fetch trending topics. Displays as clickable cards with topic name, growth %, and sentiment badge.
- **Step 2 — A/B Post Creation**: On topic selection, calls a new edge function `ai-content-studio` that generates two post versions (A & B). Each version includes: title, caption, hashtags[], script/body text. Displayed side-by-side as selectable cards with visual diff highlights.
- **Step 3 — Schedule**: Shows a calendar date picker + AI-recommended time slots (from `best_posting_times` table). User picks date/time, saves to `content_calendar` table. Success confirmation with link to Content Calendar.

**2. New edge function: `supabase/functions/ai-content-studio/index.ts`**
- Accepts `{ topic, platform }` in body
- Uses `google/gemini-3-flash-preview` via Lovable AI gateway
- Prompt: generate 2 post versions (A/B) for the given trending topic on Instagram
- Returns `{ versions: [{ id: 'A', title, caption, hashtags[], script }, { id: 'B', ... }] }`
- Auth, CORS, error handling following existing edge function patterns

**3. Update `src/components/navigation/AppSidebar.tsx`**
- Replace `{ to: '/trends', icon: Activity, label: 'Trend Intelligence' }` with `{ to: '/instagram-content-studio', icon: Sparkles, label: 'Content Studio' }` in Instagram items

**4. Update `src/App.tsx`**
- Add route: `/instagram-content-studio` → `<InstagramContentStudio />`
- Keep `/trends` route (used by YouTube/Facebook still)

**5. Update `supabase/config.toml`**
- Register `[functions.ai-content-studio]` with `verify_jwt = false`

### No database changes needed
- Trending topics come from existing `personal_trends` table + `detect-trends` function
- Best times from existing `best_posting_times` table
- Scheduled posts save to existing `content_calendar` table

