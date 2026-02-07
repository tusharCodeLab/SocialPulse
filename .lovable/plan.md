
# Plan: Audit and Fix Non-Functional Buttons

## Overview
After reviewing the codebase, I identified several buttons and features that are either **non-functional**, **misleading**, or **unnecessary**. This plan outlines which buttons to fix, which to remove, and which to keep.

## Current Button Audit

### Dashboard Page (`/dashboard`)
| Button | Status | Action |
|--------|--------|--------|
| Refresh button | Non-functional (no action) | **Fix** - Add actual data refresh |
| Generate Insights | Works (calls edge function) | Keep |
| Live Analytics badge | Misleading (not actually live) | **Remove** |

### Settings Page (`/settings`)
| Button/Feature | Status | Action |
|--------|--------|--------|
| Demo Mode toggle | Works but demo mode was removed | **Remove** |
| CSV Upload | Non-functional (simulates only) | **Remove** |
| Platform cards (Twitter, Facebook, LinkedIn, TikTok) | Show "Coming soon" but not implemented | **Simplify** |
| Instagram connect | Works | Keep |
| Export buttons (4 of them) | Non-functional (no actual export) | **Remove** |
| Notification switches | Non-functional (no backend) | **Remove** |

### Reports Page (`/reports`)
| Button | Status | Action |
|--------|--------|--------|
| Generate report buttons (4) | Non-functional (only console.log) | **Remove or Fix** |
| Schedule New button | Non-functional | **Remove** |
| Edit scheduled report buttons | Non-functional | **Remove** |
| Create Custom Report | Non-functional | **Remove** |
| Time Period/Format selects | Non-functional | **Remove** |

### Sentiment Page (`/sentiment`)
| Button | Status | Action |
|--------|--------|--------|
| Analyze Comments | Works (calls generate-insights) | Keep |

### Posts Analysis Page (`/posts`)
| Button | Status | Action |
|--------|--------|--------|
| Platform filter dropdown | Works | Keep |

### Sidebar (`AppSidebar`)
| Button | Status | Action |
|--------|--------|--------|
| Navigation links | All work | Keep |
| Sign Out | Works | Keep |
| Collapse toggle | Works | Keep |
| AI-Powered badge | Decorative | Keep (branding) |

---

## Detailed Changes

### 1. Dashboard Page
- **Fix Refresh button**: Add `queryClient.invalidateQueries()` to actually refresh data
- **Remove "Live Analytics" badge**: Misleading since data doesn't auto-refresh

### 2. Settings Page - Major Cleanup
Remove the following non-functional sections:
- **Demo Mode card** - Demo data was removed, this toggle is now meaningless
- **CSV Upload card** - Only simulates upload, doesn't process anything
- **Data Export card** - All 4 export buttons don't actually export
- **Notifications card** - Switches aren't connected to any backend

Keep:
- **Connected Platforms card** - But simplify to only show Instagram (the only working integration)

### 3. Reports Page - Major Redesign
The entire Reports page is non-functional. Options:
- **Option A**: Remove the page entirely from navigation
- **Option B**: Convert to a "Coming Soon" placeholder
- **Recommendation**: Keep page but clearly mark all features as "Coming Soon" with a cleaner UI

### 4. Component Cleanup
- Remove unused imports (`Download`, `Upload`, `FileUp`, etc.) after removing features
- Clean up the settings store (remove demoMode-related code)

---

## Technical Implementation

### Files to Modify

1. **`src/pages/Dashboard.tsx`**
   - Make Refresh button functional with `queryClient.invalidateQueries()`
   - Remove "Live Analytics" badge

2. **`src/pages/Settings.tsx`**
   - Remove Demo Mode card
   - Remove CSV Upload card  
   - Remove Data Export card
   - Remove Notifications card
   - Simplify Connected Platforms to focus on Instagram only

3. **`src/pages/Reports.tsx`**
   - Redesign as "Coming Soon" feature page
   - Remove fake scheduled reports
   - Remove all non-functional buttons

4. **`src/stores/settingsStore.ts`**
   - Remove `demoMode` state (no longer needed)

5. **`src/components/navigation/AppSidebar.tsx`**
   - Keep as-is (all buttons work)

---

## Summary of Removals

| Removed Feature | Reason |
|-----------------|--------|
| Demo Mode toggle | Demo data removed, toggle meaningless |
| CSV Upload | Only simulated, no real processing |
| 4 Export buttons | No actual export functionality |
| 4 Notification toggles | Not connected to backend |
| 4 Report Generate buttons | Only console.log |
| Schedule New button | Non-functional |
| 3 Edit report buttons | Non-functional |
| Create Custom Report | Non-functional |
| Time Period/Format selects | Non-functional |
| Live Analytics badge | Misleading |

**Total buttons/features removed**: ~20 non-functional elements

---

## Result
After this cleanup, every visible button will either:
1. Perform a real action, OR
2. Be clearly labeled as "Coming Soon"

This creates a more honest, professional user experience where users aren't frustrated by clicking buttons that do nothing.
