import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { SocialPlatform } from "./useSocialAccounts";

export interface AudienceMetric {
  id: string;
  user_id: string;
  social_account_id: string | null;
  platform: SocialPlatform;
  date: string;
  followers_count: number;
  following_count: number;
  new_followers: number;
  lost_followers: number;
  engagement_rate: number;
  created_at: string;
}

export interface CreateAudienceMetricInput {
  social_account_id?: string;
  platform: SocialPlatform;
  date: string;
  followers_count: number;
  following_count?: number;
  new_followers?: number;
  lost_followers?: number;
  engagement_rate?: number;
}

export function useAudienceMetrics(platform?: SocialPlatform, days = 30) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["audience-metrics", user?.id, platform, days],
    queryFn: async () => {
      if (!user) return [];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      let query = supabase
        .from("audience_metrics")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (platform) {
        query = query.eq("platform", platform);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AudienceMetric[];
    },
    enabled: !!user,
  });
}

export function useCreateAudienceMetric() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateAudienceMetricInput) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("audience_metrics")
        .insert({
          user_id: user.id,
          social_account_id: input.social_account_id || null,
          platform: input.platform,
          date: input.date,
          followers_count: input.followers_count,
          following_count: input.following_count || 0,
          new_followers: input.new_followers || 0,
          lost_followers: input.lost_followers || 0,
          engagement_rate: input.engagement_rate || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AudienceMetric;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audience-metrics"] });
    },
  });
}

export function useAudienceGrowth() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["audience-growth", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("audience_metrics")
        .select("*")
        .order("date", { ascending: false })
        .limit(60);

      if (error) throw error;
      
      const metrics = data || [];
      
      // Get latest and previous month totals
      const now = new Date();
      const thisMonth = metrics.filter(m => {
        const d = new Date(m.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      
      const lastMonth = metrics.filter(m => {
        const d = new Date(m.date);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
        return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
      });

      const totalFollowersThisMonth = thisMonth.reduce((sum, m) => Math.max(sum, m.followers_count || 0), 0);
      const totalFollowersLastMonth = lastMonth.reduce((sum, m) => Math.max(sum, m.followers_count || 0), 0);
      const growthRate = totalFollowersLastMonth > 0 
        ? ((totalFollowersThisMonth - totalFollowersLastMonth) / totalFollowersLastMonth) * 100 
        : 0;

      return {
        currentFollowers: totalFollowersThisMonth,
        previousFollowers: totalFollowersLastMonth,
        growthRate,
        newFollowers: thisMonth.reduce((sum, m) => sum + (m.new_followers || 0), 0),
        lostFollowers: thisMonth.reduce((sum, m) => sum + (m.lost_followers || 0), 0),
      };
    },
    enabled: !!user,
  });
}
