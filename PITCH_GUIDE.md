# 🏆 Hackathon Pitch & Team Architecture Guide

*This document is a script and technical guide you can use to confidently explain your project, the architecture, and how your team divided the workload to the Hackathon Judges.*

## 1. The Elevator Pitch (Who says what)

**You (Frontend Developer):** 
"Hello judges! We built **Social Pulse**, an AI-powered social media analytics dashboard designed to help creators and businesses instantly understand their engagement, audience sentiment, and trending topics. Because raw data is hard to parse, our goal was to build a beautiful, high-performance interface that connects directly to state-of-the-art AI to translate metrics into actionable insights."

**Teammate (Backend Developer):**
"To make this work securely and at scale, we completely separated our concerns. While the frontend handles the data visualization, we built a serverless backend using Supabase Edge Functions. These edge functions securely manage our API keys and act as a middleware to stream analysis directly from Google's Gemini AI directly to the dashboard, ensuring low-latency communication and top-tier security."

---

## 2. Technical Architecture & Division of Labor

### 🎨 Tushar's Role: Frontend Architecture & UI/UX
*Explain what you built on the frontend.*

**Key Talking Points for You:**
*   **Tech Stack:** "I built the frontend using **React** with **Vite** for blazing fast HMR and optimized production builds. I used **TypeScript** for type-safety across all our data models."
*   **Data Fetching & State:** "For optimal performance, I implemented **React Query (TanStack Query)** to handle all our data fetching, caching, and loading states seamlessly. This prevents unnecessary re-renders when data updates."
*   **Routing:** "I set up a secure, client-side routing system using **React Router DOM**, which includes protected routes that check the `AuthContext` before allowing users to view the dashboard."
*   **UI & Visualization:** "I designed the interface using **Tailwind CSS** for a highly customized, responsive layout. For the analytics, I integrated **Recharts** to build interactive, animated data visualizations for engagement and demographics. I also built a custom **Light/Dark Mode** switching system using `next-themes` and CSS variables."

### ⚙️ Teammate's Role: Backend & AI Integration
*Explain what your teammate built on the backend.*

**Key Talking Points for Your Teammate:**
*   **Tech Stack:** "I architected our backend using **Supabase** to handle authentication, database storage, and most importantly, our **Deno Edge Functions**."
*   **AI Integration (Gemini API):** "To power our insights, I directly integrated the **Google Gemini API** (`gemini-2.5-flash`). Instead of exposing our API keys on the frontend, I wrote 9 distinct Edge Functions (e.g., `generate-insights`, `detect-spam`, `analyze-sentiment`, `ai-caption-generator`)."
*   **Security & Data Flow:** "When the React frontend needs AI analysis, it sends a securely authenticated request to my Supabase Edge Functions. The edge function constructs the specific prompt, securely injects the `GEMINI_API_KEY` from our environment variables, calls Google's servers, and returns the formatted JSON insights back to the UI."
*   **Edge Performance:** "By using Deno-based Edge Functions deployed globally via Supabase, our AI requests execute closest to the user with minimal cold starts, keeping the analysis pipeline incredibly fast."

---

## 3. Potential Judge Questions & How to Answer Them

**Q: "How did you manage the AI prompts and outputs so effectively?"**
*   **Backend Teammate:** "I designed specific JSON schemas within our Edge Functions that we send to Gemini. By strictly typing the output format in the edge function, we guarantee that the frontend always receives clean, predictable data structures that Tushar can map directly into the UI components without breaking the dashboard."

**Q: "What was the hardest part of building this?"**
*   **Frontend (Tushar):** "Managing complex dashboard state and ensuring the charts remain performant when processing large arrays of social media data. Moving to React Query heavily simplified my state management."
*   **Backend (Teammate):** "Prompt engineering and managing Edge Function CORS policies. Ensuring that the Gemini AI consistently returned valid JSON instead of conversational text required careful system instructions."

**Q: "Why did you choose Supabase over a traditional Node.js server?"**
*   **Both:** "Speed and security. For a hackathon, we didn't want to spend hours configuring Express servers and deployment pipelines. Supabase gave us Auth out-of-the-box, and Edge Functions let us spin up secure, scalable API endpoints for Gemini in minutes."
