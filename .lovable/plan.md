

## Professional Content Suggestions in Content Studio

### Problem
The "Trending Topics" section currently shows raw trend data from `personal_trends`. The user wants professional, actionable content suggestions for future posts -- ideas they can act on, not just data points.

### Approach
Replace the current trending topics grid with an AI-powered "Content Suggestions" section that calls the existing `ai-content-ideas` edge function. This function already generates strategic content ideas with format recommendations, priority levels, estimated impact, and best posting days.

### Plan

#### 1. Add Content Suggestions UI to Step 1 (`InstagramContentStudio.tsx`)
- Add a new "Content Suggestions" section below (or replacing) the trending topics grid
- Add a "Get AI Suggestions" button that calls `ai-content-ideas`
- Display returned ideas as professional cards with:
  - Title and description
  - Recommended format (Reel, Carousel, etc.) as a badge
  - Priority level (High/Medium/Low) with color-coded indicator
  - "Based on" field showing which trend drives the idea
  - Estimated impact summary
  - Best day to post
  - Overall strategy summary at the top
- Clicking a suggestion card feeds its title into `generateForTopic()` to proceed to Step 2

#### 2. State & Query Changes
- Add state for `contentIdeas` and `loadingIdeas`
- Add a query or manual fetch to `ai-content-ideas` edge function
- Keep the existing trending topics section as a secondary option below
- Keep the custom topic input at top as-is

#### 3. Card Design
Each suggestion card will have:
- Priority badge (color-coded: green for High, amber for Medium, gray for Low)
- Format badge (Reel, Carousel, etc.)
- Best day chip
- Title (bold), description, estimated impact text
- "Based on" as subtle attribution
- Click action to generate posts from that idea

#### 4. Strategy Banner
Display the AI's overall `strategy` recommendation as a highlighted banner above the suggestion cards.

### Files Modified
- `src/pages/InstagramContentStudio.tsx` -- add content suggestions section with AI call and professional card layout

