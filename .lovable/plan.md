

## Diagnosis

I found two distinct root causes:

### Issue 1: 401 "Invalid token" errors
**11 out of 13 edge functions** still use the broken `supabase.auth.getUser(token)` pattern with the service-role client. This fails because Lovable Cloud uses ES256 signing keys, and `getUser()` calls the `/user` endpoint which requires a valid server-side session. The auth logs confirm repeated "Session not found" errors at exactly the timestamps the user reported 401s.

Only `fetch-instagram` and `fetch-facebook` were fixed to use `getClaims()`. The remaining 11 functions are still broken:
- `ai-post-coach`, `ai-caption-generator`, `ai-content-calendar`, `ai-performance-digest`
- `analyze-sentiment`, `calculate-best-times`, `detect-spam`, `detect-trends`
- `fetch-youtube`, `generate-insights`, `debug-instagram-token`

### Issue 2: Facebook showing 6 posts when only 1 was imported
The database contains 6 facebook posts for this user:
- **1 post** from page "Demo1" (ID `1083761361477936`) -- the current/latest sync
- **5 posts** from page "TEST1" (ID `902825082923565`) -- leftover from an earlier sync

The edge function only processes the first page and reports "1 post imported", but it never cleans up stale posts from previously-synced pages. The `social_accounts` unique constraint (`user_id,platform`) means when the page changed from TEST1 to Demo1, the account record was updated but the old TEST1 posts remained orphaned in the database.

---

## Plan

### Fix 1: Update all 11 edge functions to use getClaims auth pattern
Each function will be updated to:
1. Read `SUPABASE_ANON_KEY` from environment
2. Create an `authClient` using the anon key + user's Authorization header
3. Call `authClient.auth.getClaims(token)` to extract `userId` from JWT claims
4. Use a separate service-role client for database operations

Files to update:
- `supabase/functions/ai-post-coach/index.ts`
- `supabase/functions/ai-caption-generator/index.ts`
- `supabase/functions/ai-content-calendar/index.ts`
- `supabase/functions/ai-performance-digest/index.ts`
- `supabase/functions/analyze-sentiment/index.ts`
- `supabase/functions/calculate-best-times/index.ts`
- `supabase/functions/detect-spam/index.ts`
- `supabase/functions/detect-trends/index.ts`
- `supabase/functions/fetch-youtube/index.ts`
- `supabase/functions/generate-insights/index.ts`
- `supabase/functions/debug-instagram-token/index.ts`

### Fix 2: Clean up stale Facebook posts on sync
Update `supabase/functions/fetch-facebook/index.ts` to delete posts from previously-synced pages before importing new ones. After upserting the new posts, delete any posts where `user_id` matches and `platform = 'facebook'` but the `external_post_id` does not start with the current page ID prefix.

### Fix 3: Make InstagramSyncProvider resilient to stale sessions
Update `src/hooks/useInstagramSync.ts` to check if the session is valid before attempting auto-sync, preventing 401 cascades on app load when the user's session has expired.

