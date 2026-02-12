

# Multi-Profile Instagram Analytics

## Overview
Add the ability to connect and view multiple Instagram profiles, with a profile switcher in the sidebar and per-profile analytics across all dashboard pages.

## Current Limitation
The app currently uses a single shared `INSTAGRAM_ACCESS_TOKEN` stored as a backend secret. This means all users see the same Instagram account's data. To support multiple profiles, each user would need to provide their own Instagram tokens.

## Architecture

### 1. Profile Management (Settings Page)
- Add a "Add Profile" button that lets users input an Instagram access token (from Meta Graph API Explorer)
- Store tokens in the existing `instagram_tokens` table (already has RLS)
- Each token maps to one Instagram Business account
- Show a list of connected profiles with username, follower count, and sync status
- Allow removing profiles

### 2. Profile Switcher (Sidebar)
- Add a dropdown/selector in the sidebar showing connected Instagram profiles
- Store the active profile ID in a Zustand store (`activeProfileStore`)
- All API queries filter by the selected `social_account_id`

### 3. Per-Profile Data Fetching
- Update the `fetch-instagram` edge function to accept a token from the `instagram_tokens` table (per user) instead of the shared env secret
- Add a `social_account_id` filter to all API queries in `socialApi.ts`
- Update React Query hooks to include the active profile ID in query keys for proper caching

### 4. Updated Pages
- Dashboard, Posts Analysis, Audience Insights, Sentiment -- all filter by active profile
- Add an "All Profiles" option for aggregate views

## Technical Details

### Database Changes
- No new tables needed; use existing `instagram_tokens` and `social_accounts`
- Add a migration to create an index on `social_accounts(user_id, platform)` if not present

### Edge Function Changes (`fetch-instagram`)
- Accept an optional `token_id` in the request body
- Look up the token from `instagram_tokens` table for the authenticated user
- Fall back to the env `INSTAGRAM_ACCESS_TOKEN` if no token_id provided
- Store results linked to the correct `social_account_id`

### New Store (`src/stores/activeProfileStore.ts`)
- `activeProfileId: string | null` -- the selected social account ID
- `setActiveProfile(id)` -- switch profiles
- Persisted to localStorage

### API Layer Changes (`socialApi.ts`)
- Every query that touches `posts`, `post_comments`, `audience_metrics` adds `.eq('social_account_id', activeProfileId)` when a profile is selected
- Query keys include the active profile ID

### UI Components
- `ProfileSwitcher` component in sidebar (avatar + username dropdown)
- `AddProfileDialog` in Settings to input a new token
- Profile list in Settings showing all connected accounts with sync/remove actions

## Prompt for Lovable

Here is a ready-to-use prompt you can send:

---

**Add multi-profile Instagram support with the following:**

1. **Profile Switcher in Sidebar**: Add a dropdown at the top of the sidebar (below the logo) that shows all connected Instagram profiles from the `social_accounts` table. Users can switch between profiles. Store the active profile ID in a new Zustand store (`src/stores/activeProfileStore.ts`) persisted to localStorage.

2. **Add Profile Flow in Settings**: On the Settings page, show a list of all connected Instagram profiles. Add an "Add Profile" button that opens a dialog where users paste an Instagram access token. When submitted, call the `fetch-instagram` edge function with that token to sync the profile data.

3. **Update `fetch-instagram` edge function**: Accept an optional `token` field in the request body. If provided, use that token instead of the env `INSTAGRAM_ACCESS_TOKEN`. Validate the token format (alphanumeric, max 500 chars). Store the token in the `instagram_tokens` table for the user.

4. **Filter all data by active profile**: Update all queries in `src/services/api/socialApi.ts` to filter by `social_account_id` matching the active profile from the store. Update React Query keys in `src/hooks/useSocialApi.ts` to include the active profile ID so data caches separately per profile.

5. **Add "All Profiles" aggregate option**: The profile switcher should have an "All Profiles" option that shows combined data across all connected accounts (no `social_account_id` filter).

---

## Important Considerations
- Each Instagram token requires Meta Graph API Explorer access with `pages_show_list`, `instagram_basic` permissions
- Tokens expire and need manual refresh (no OAuth flow yet)
- Rate limits apply per-token, so multiple profiles help distribute API calls
