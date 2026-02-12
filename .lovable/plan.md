

# Run AI Sentiment Analysis Locally with Google Gemini (Free)

## What Needs to Change

Your project currently uses **Lovable AI Gateway** (a Lovable-only service) to power two AI features:
1. **Sentiment Analysis** -- classifies Instagram comments as positive/negative/neutral
2. **Insights Generation** -- generates actionable social media advice

The Lovable AI Gateway won't work outside Lovable Cloud. We'll replace it with **Google Gemini API**, which is free to use.

## Step-by-Step Setup for You

### 1. Get Your Free Google Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/apikeys)
- Sign in with your Google account
- Click "Create API Key"
- Copy the key -- this is your `GOOGLE_GEMINI_API_KEY`

### 2. Store the Key Locally
When running Supabase edge functions locally, you'll create a file called `supabase/.env.local` with:
```
GOOGLE_GEMINI_API_KEY=your_key_here
```

## Technical Changes (Code Modifications)

### File 1: `supabase/functions/analyze-sentiment/index.ts`
- Replace `AI_GATEWAY_URL` from `https://ai.gateway.lovable.dev/v1/chat/completions` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Replace `LOVABLE_API_KEY` with `GOOGLE_GEMINI_API_KEY`
- Update the fetch call to use Google's API format (slightly different request/response structure)
- The prompt and logic remain identical

### File 2: `supabase/functions/generate-insights/index.ts`
- Same changes as above -- swap the AI gateway URL and API key
- Update request/response format to match Google Gemini's API

### What Stays the Same
- All frontend code (React pages, hooks, components) -- no changes needed
- Database schema and queries -- unchanged
- The prompts sent to the AI -- identical
- The Instagram sync function -- unchanged

## How It Works After the Change

```text
User clicks "Analyze Comments"
        |
Frontend calls edge function
        |
Edge function reads GOOGLE_GEMINI_API_KEY
        |
Calls Google Gemini API directly (free)
        |
Parses response, updates database
        |
Frontend shows sentiment results
```

## Running Locally

After the code changes, you'll run locally with:
```bash
# Start Supabase locally
npx supabase start

# Serve edge functions
npx supabase functions serve --env-file supabase/.env.local

# Start frontend
npm run dev
```

## For Your Hackathon PPT

You can mention:
- **AI Model**: Google Gemini 2.0 Flash (free tier)
- **Integration**: Serverless edge functions calling Gemini API
- **Use Case**: Real-time sentiment classification of social media comments
- **Cost**: Zero (free API tier)

