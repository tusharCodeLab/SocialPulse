import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { SocialPlatform } from "./useSocialAccounts";

export interface Post {
  id: string;
  user_id: string;
  social_account_id: string | null;
  platform: SocialPlatform;
  external_post_id: string | null;
  content: string | null;
  post_type: string;
  media_url: string | null;
  published_at: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  platform: SocialPlatform;
  social_account_id?: string;
  content?: string;
  post_type?: string;
  media_url?: string;
  published_at?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  reach?: number;
  impressions?: number;
}

export interface UpdatePostInput {
  id: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  reach?: number;
  impressions?: number;
  engagement_rate?: number;
}

export function usePosts(platform?: SocialPlatform) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["posts", user?.id, platform],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (platform) {
        query = query.eq("platform", platform);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Post[];
    },
    enabled: !!user,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      if (!user) throw new Error("User not authenticated");

      // Calculate engagement rate
      const totalEngagement = (input.likes_count || 0) + (input.comments_count || 0) + (input.shares_count || 0);
      const reach = input.reach || 1;
      const engagementRate = (totalEngagement / reach) * 100;

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          platform: input.platform,
          social_account_id: input.social_account_id || null,
          content: input.content || null,
          post_type: input.post_type || "post",
          media_url: input.media_url || null,
          published_at: input.published_at || new Date().toISOString(),
          likes_count: input.likes_count || 0,
          comments_count: input.comments_count || 0,
          shares_count: input.shares_count || 0,
          reach: input.reach || 0,
          impressions: input.impressions || 0,
          engagement_rate: engagementRate,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePostInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function usePostStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["post-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("posts")
        .select("likes_count, comments_count, shares_count, reach, impressions, engagement_rate, platform");

      if (error) throw error;
      
      const posts = data || [];
      const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
      const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0);
      const totalShares = posts.reduce((sum, p) => sum + (p.shares_count || 0), 0);
      const totalReach = posts.reduce((sum, p) => sum + (p.reach || 0), 0);
      const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const avgEngagement = posts.length > 0 
        ? posts.reduce((sum, p) => sum + Number(p.engagement_rate || 0), 0) / posts.length 
        : 0;

      return {
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        totalShares,
        totalReach,
        totalImpressions,
        avgEngagement,
        byPlatform: {
          instagram: posts.filter(p => p.platform === "instagram").length,
          twitter: posts.filter(p => p.platform === "twitter").length,
          facebook: posts.filter(p => p.platform === "facebook").length,
          linkedin: posts.filter(p => p.platform === "linkedin").length,
        }
      };
    },
    enabled: !!user,
  });
}
