

## Rebuild Home Page to Match PDF Design

### Key Differences Between Current and PDF

1. **Branding**: "SocialPulse" → "InsightFlow"
2. **Navigation**: Add "Features", "How It Works", "Pricing" anchor links + "Get Started" button
3. **Hero**: Add "See How It Works" button, change stats to show "6+" platforms
4. **Dashboard Mockup**: Show real values (48.2K, 3.4%, 124K, 78) with subtitles instead of blurred placeholders. Add "Engagement Trend" bar chart and "Emotion Breakdown" panel (Joy 72%, Curious 46%, Frustrated 18%, Sarcasm 10%)
5. **Features Section**: Add "WHAT YOU GET" label, update descriptions to match PDF (e.g., "up to 72 hours before they peak")
6. **How It Works**: Add "HOW IT WORKS" label, update descriptions to match PDF (longer text with details about live streams, real-time processing)
7. **Why Creators Choose**: Redesign from simple badges to 3 large cards: "100% Free", "AI Insights", "1 Dashboard" with descriptions. Add "WHY CREATORS CHOOSE INSIGHTFLOW" heading with subtitle "Intelligence your current tool simply doesn't have."
8. **Pricing Section (NEW)**: 3-tier pricing table — Starter ($49/mo), Growth ($199/mo, "Most Popular"), Enterprise ($999/mo) with feature lists and CTA buttons
9. **CTA Section**: Add "Learn More" button alongside "Get Started Free", style with gradient green background
10. **Footer**: Update to "InsightFlow" with links (Features, Pricing, Privacy, Contact) + "© 2026 InsightFlow - Team Delta - ADPIT"

### Files to Modify

**`src/pages/Home.tsx`** — Full rewrite to match the PDF layout:
- Replace all "SocialPulse" with "InsightFlow"
- Navbar: anchor links to `#features`, `#how-it-works`, `#pricing` sections
- Hero: two buttons, updated stat values (6+ platforms)
- Dashboard mockup: real metric values, engagement trend bars, emotion breakdown with colored progress bars
- Features: section label + updated copy
- How It Works: section label + expanded descriptions
- Why section: 3 prominent cards layout
- New Pricing section with 3-tier grid, "Most Popular" badge on Growth tier, feature checkmarks, and tier-specific CTA buttons
- CTA: gradient teal/green background card with two buttons
- Footer: InsightFlow branding, nav links row, Team Delta credit

No other files need changes — this is entirely contained in `Home.tsx`.

