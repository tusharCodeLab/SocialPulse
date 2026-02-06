// Modular API Layer - Easy to swap with real Meta Graph API
// Replace the mock implementations with real API calls when ready

import { 
  SocialAccount, 
  Post, 
  Comment, 
  AudienceDemographics,
  AudienceGrowth,
  EngagementAnalytics,
  SentimentAnalytics,
  BestPostingTime,
  AIInsight,
  TrendingTopic,
  APIResponse,
  SocialPlatform,
} from './types';
import {
  mockAccounts,
  mockPosts,
  mockComments,
  mockDemographics,
  mockAudienceGrowth,
  mockEngagementAnalytics,
  mockSentimentAnalytics,
  mockBestPostingTimes,
  mockAIInsights,
  mockTrendingTopics,
  mockDashboardSummary,
} from './mockData';

// Simulated network delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_DELAY = 300; // Adjust for testing

// ============================================================================
// Configuration - Replace these with your actual API endpoints
// ============================================================================
const API_CONFIG = {
  // Meta Graph API base URL
  META_GRAPH_API: 'https://graph.facebook.com/v18.0',
  // Instagram Basic Display API
  INSTAGRAM_API: 'https://graph.instagram.com',
  // Your backend API for processing
  BACKEND_API: import.meta.env.VITE_SUPABASE_URL,
};

// ============================================================================
// Social Accounts API
// ============================================================================
export const accountsApi = {
  /**
   * Get all connected social accounts
   * Replace with: GET /me/accounts (Meta Graph API)
   */
  async getAll(): Promise<APIResponse<SocialAccount[]>> {
    await delay(API_DELAY);
    // TODO: Replace with real API call
    // const response = await fetch(`${API_CONFIG.META_GRAPH_API}/me/accounts?access_token=${token}`);
    return {
      data: mockAccounts,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get a specific account by ID
   * Replace with: GET /{account-id} (Meta Graph API)
   */
  async getById(accountId: string): Promise<APIResponse<SocialAccount | null>> {
    await delay(API_DELAY);
    const account = mockAccounts.find(a => a.id === accountId) || null;
    return {
      data: account,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Connect a new social account (OAuth flow)
   * This would redirect to Meta OAuth in production
   */
  async connect(platform: SocialPlatform): Promise<APIResponse<{ authUrl: string }>> {
    await delay(API_DELAY);
    // TODO: Generate real OAuth URL
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=instagram_basic,pages_show_list`;
    return {
      data: { authUrl },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Disconnect a social account
   */
  async disconnect(accountId: string): Promise<APIResponse<{ success: boolean }>> {
    await delay(API_DELAY);
    return {
      data: { success: true },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// Posts/Media API
// ============================================================================
export const postsApi = {
  /**
   * Get all posts for connected accounts
   * Replace with: GET /{account-id}/media (Instagram Graph API)
   */
  async getAll(options?: { 
    platform?: SocialPlatform; 
    limit?: number;
    after?: string;
  }): Promise<APIResponse<Post[]>> {
    await delay(API_DELAY);
    let posts = [...mockPosts];
    
    if (options?.platform) {
      posts = posts.filter(p => p.platform === options.platform);
    }
    
    const limit = options?.limit || 25;
    posts = posts.slice(0, limit);
    
    return {
      data: posts,
      pagination: {
        total: mockPosts.length,
        page: 1,
        perPage: limit,
        hasMore: mockPosts.length > limit,
      },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get a specific post by ID
   * Replace with: GET /{media-id} (Instagram Graph API)
   */
  async getById(postId: string): Promise<APIResponse<Post | null>> {
    await delay(API_DELAY);
    const post = mockPosts.find(p => p.id === postId) || null;
    return {
      data: post,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get post statistics summary
   */
  async getStats(): Promise<APIResponse<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalReach: number;
    avgEngagement: number;
  }>> {
    await delay(API_DELAY);
    const stats = {
      totalPosts: mockPosts.length,
      totalLikes: mockPosts.reduce((sum, p) => sum + p.metrics.likes, 0),
      totalComments: mockPosts.reduce((sum, p) => sum + p.metrics.comments, 0),
      totalShares: mockPosts.reduce((sum, p) => sum + p.metrics.shares, 0),
      totalReach: mockPosts.reduce((sum, p) => sum + p.metrics.reach, 0),
      avgEngagement: mockPosts.reduce((sum, p) => sum + p.metrics.engagementRate, 0) / mockPosts.length,
    };
    return {
      data: stats,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// Comments API
// ============================================================================
export const commentsApi = {
  /**
   * Get comments for a specific post
   * Replace with: GET /{media-id}/comments (Instagram Graph API)
   */
  async getByPostId(postId: string): Promise<APIResponse<Comment[]>> {
    await delay(API_DELAY);
    const comments = mockComments.filter(c => c.postId === postId);
    return {
      data: comments,
      pagination: {
        total: comments.length,
        page: 1,
        perPage: 50,
        hasMore: false,
      },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get all comments across all posts
   */
  async getAll(): Promise<APIResponse<Comment[]>> {
    await delay(API_DELAY);
    return {
      data: mockComments,
      pagination: {
        total: mockComments.length,
        page: 1,
        perPage: 100,
        hasMore: false,
      },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get sentiment statistics
   */
  async getSentimentStats(): Promise<APIResponse<{
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    avgScore: number;
  }>> {
    await delay(API_DELAY);
    const total = mockComments.length;
    const positive = mockComments.filter(c => c.sentiment === 'positive').length;
    const negative = mockComments.filter(c => c.sentiment === 'negative').length;
    const neutral = mockComments.filter(c => c.sentiment === 'neutral').length;
    const avgScore = mockComments.reduce((sum, c) => sum + (c.sentimentScore || 0.5), 0) / total;
    
    return {
      data: {
        total,
        positive,
        negative,
        neutral,
        positivePercent: (positive / total) * 100,
        negativePercent: (negative / total) * 100,
        neutralPercent: (neutral / total) * 100,
        avgScore,
      },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// Audience/Demographics API
// ============================================================================
export const audienceApi = {
  /**
   * Get audience demographics
   * Replace with: GET /{account-id}/insights (Instagram Graph API)
   */
  async getDemographics(accountId?: string): Promise<APIResponse<AudienceDemographics>> {
    await delay(API_DELAY);
    return {
      data: mockDemographics,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get audience growth over time
   * Replace with: GET /{account-id}/insights?metric=follower_count (Instagram Graph API)
   */
  async getGrowth(days: number = 30): Promise<APIResponse<AudienceGrowth[]>> {
    await delay(API_DELAY);
    const growth = mockAudienceGrowth.slice(-days);
    return {
      data: growth,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get current audience summary
   */
  async getSummary(): Promise<APIResponse<{
    totalFollowers: number;
    totalFollowing: number;
    growthRate: number;
    newFollowersToday: number;
    newFollowersWeek: number;
  }>> {
    await delay(API_DELAY);
    const lastDay = mockAudienceGrowth[mockAudienceGrowth.length - 1];
    const lastWeek = mockAudienceGrowth.slice(-7);
    const weeklyNew = lastWeek.reduce((sum, d) => sum + d.newFollowers, 0);
    const previousMonth = mockAudienceGrowth[0].followersCount;
    const growthRate = ((lastDay.followersCount - previousMonth) / previousMonth) * 100;
    
    return {
      data: {
        totalFollowers: lastDay.followersCount,
        totalFollowing: lastDay.followingCount,
        growthRate,
        newFollowersToday: lastDay.newFollowers,
        newFollowersWeek: weeklyNew,
      },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// Analytics API
// ============================================================================
export const analyticsApi = {
  /**
   * Get engagement analytics over time
   */
  async getEngagement(days: number = 30): Promise<APIResponse<EngagementAnalytics[]>> {
    await delay(API_DELAY);
    return {
      data: mockEngagementAnalytics.slice(-days),
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get sentiment analytics over time
   */
  async getSentiment(days: number = 14): Promise<APIResponse<SentimentAnalytics[]>> {
    await delay(API_DELAY);
    return {
      data: mockSentimentAnalytics.slice(-days),
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get best posting times
   */
  async getBestPostingTimes(platform?: SocialPlatform): Promise<APIResponse<BestPostingTime[]>> {
    await delay(API_DELAY);
    return {
      data: mockBestPostingTimes,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<APIResponse<typeof mockDashboardSummary>> {
    await delay(API_DELAY);
    return {
      data: mockDashboardSummary,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// AI Insights API
// ============================================================================
export const insightsApi = {
  /**
   * Get AI-generated insights
   */
  async getAll(): Promise<APIResponse<AIInsight[]>> {
    await delay(API_DELAY);
    return {
      data: mockAIInsights,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Mark an insight as read
   */
  async markAsRead(insightId: string): Promise<APIResponse<{ success: boolean }>> {
    await delay(API_DELAY);
    return {
      data: { success: true },
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Generate new AI insights (calls backend)
   */
  async generate(): Promise<APIResponse<AIInsight[]>> {
    await delay(API_DELAY * 3); // Longer delay for "AI processing"
    // In production, this would call your Supabase edge function
    return {
      data: mockAIInsights,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },

  /**
   * Get trending topics
   */
  async getTrendingTopics(): Promise<APIResponse<TrendingTopic[]>> {
    await delay(API_DELAY);
    return {
      data: mockTrendingTopics,
      meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    };
  },
};

// ============================================================================
// Export unified API object
// ============================================================================
export const socialApi = {
  accounts: accountsApi,
  posts: postsApi,
  comments: commentsApi,
  audience: audienceApi,
  analytics: analyticsApi,
  insights: insightsApi,
};

export default socialApi;
