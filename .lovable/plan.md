

## Plan: Replace Schedule Step with AI Publishing Strategy

Replace Step 3's manual scheduling with an AI-generated "Publishing Strategy" that recommends when to post, optimal days, audience insights, and engagement predictions — no scheduling action, purely advisory.

### Changes

**1. Update edge function `supabase/functions/ai-content-studio/index.ts`**
- Add a second mode: when called with `{ action: 'publishing-strategy', post: { title, caption, hashtags } }`, use `google/gemini-3-flash-preview` to generate a publishing strategy including:
  - Top 3 recommended dates/times with reasoning
  - Best day of week analysis
  - Predicted engagement range
  - Audience activity insights
  - Content timing tips (e.g., "Post before lunch for maximum reach")
  - Platform-specific recommendations

**2. Rewrite Step 3 in `src/pages/InstagramContentStudio.tsx`**
- Remove: calendar picker, time selector, schedule button, `handleSchedule` function, `scheduledDate`/`scheduledHour`/`saving` state
- Add: On entering Step 3, auto-call the edge function with `action: 'publishing-strategy'`
- Display AI response as professional cards:
  - **"Best Times to Post"** — ranked list with day, time, and AI reasoning per slot
  - **"Engagement Forecast"** — predicted likes/comments range based on topic + timing
  - **"Audience Insights"** — when your followers are most active
  - **"Pro Tips"** — actionable content timing advice
- Also show the selected post preview (title, caption, hashtags) alongside
- Add "Copy Caption" and "Copy Hashtags" quick-action buttons for convenience
- Add "Start Over" button to reset the wizard

**3. No database changes needed** — this is purely advisory, no writes to `content_calendar`

