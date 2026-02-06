import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { SocialPlatform } from "./useSocialAccounts";

export type SentimentType = "positive" | "negative" | "neutral";

export interface PostComment {
  id: string;
  post_id: string | null;
  user_id: string;
  author_name: string | null;
  content: string;
  sentiment: SentimentType | null;
  sentiment_score: number | null;
  analyzed_at: string | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  description: string;
  priority: string;
  platform: SocialPlatform | null;
  is_read: boolean;
  created_at: string;
}

export interface BestPostingTime {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  day_of_week: number;
  hour_of_day: number;
  engagement_score: number;
  sample_size: number;
  last_calculated_at: string;
}

export function usePostComments(postId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["post-comments", user?.id, postId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("post_comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (postId) {
        query = query.eq("post_id", postId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PostComment[];
    },
    enabled: !!user,
  });
}

export function useSentimentStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sentiment-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("post_comments")
        .select("sentiment, sentiment_score");

      if (error) throw error;
      
      const comments = data || [];
      const positive = comments.filter(c => c.sentiment === "positive").length;
      const negative = comments.filter(c => c.sentiment === "negative").length;
      const neutral = comments.filter(c => c.sentiment === "neutral").length;
      const total = comments.length;

      const avgScore = comments.length > 0
        ? comments.reduce((sum, c) => sum + Number(c.sentiment_score || 0), 0) / comments.length
        : 0;

      return {
        total,
        positive,
        negative,
        neutral,
        positivePercent: total > 0 ? (positive / total) * 100 : 0,
        negativePercent: total > 0 ? (negative / total) * 100 : 0,
        neutralPercent: total > 0 ? (neutral / total) * 100 : 0,
        avgScore,
      };
    },
    enabled: !!user,
  });
}

export function useAIInsights() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["ai-insights", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as AIInsight[];
    },
    enabled: !!user,
  });
}

export function useMarkInsightRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ai_insights")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-insights"] });
    },
  });
}

export function useBestPostingTimes(platform?: SocialPlatform) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["best-posting-times", user?.id, platform],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("best_posting_times")
        .select("*")
        .order("engagement_score", { ascending: false });

      if (platform) {
        query = query.eq("platform", platform);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BestPostingTime[];
    },
    enabled: !!user,
  });
}

export function useAnalyzeSentiment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (comments: { id: string; content: string }[]) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke("analyze-sentiment", {
        body: { comments },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
      queryClient.invalidateQueries({ queryKey: ["sentiment-stats"] });
    },
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke("generate-insights", {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-insights"] });
    },
  });
}
