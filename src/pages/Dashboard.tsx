import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Heart, Eye, FileText, Sparkles, RefreshCw,
  TrendingUp, MessageCircle, Shield, Brain, Clock, Smile,
  ArrowUp, ArrowDown, Minus, Loader2, Wand2, Hash, Lightbulb,
  Target, Zap, ChevronRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumSkeleton } from '@/components/ui/premium-skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDashboardSummaryApi, usePostStatsApi, useAudienceSummaryApi,
  useSentimentStatsApi, useAIInsightsApi, useBestPostingTimesApi,
} from '@/hooks/useSocialApi';
import { useSpamComments, usePersonalTrends, useAIPostCoach, PostCoaching } from '@/hooks/useAIFeatures';
import { cn } from '@/lib/utils';

const COLORS = {
  positive: 'hsl(142, 71%, 45%)',
  negative: 'hsl(0, 72%, 51%)',
  neutral: 'hsl(215, 20%, 55%)',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MiniStat({ label, value, icon: Icon, className }: { label: string; value: string; icon: any; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/50', className)}>
      <div className="p-1.5 rounded-md bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [coaching, setCoaching] = useState<PostCoaching | null>(null);
  const aiCoach = useAIPostCoach();

  const { data: summary, isLoading } = useDashboardSummaryApi();
  const { data: postStats } = usePostStatsApi();
  const { data: audience } = useAudienceSummaryApi();
  const { data: sentiment } = useSentimentStatsApi();
  const { data: insights } = useAIInsightsApi();
  const { data: bestTimes } = useBestPostingTimesApi();
  const { data: spamComments } = useSpamComments();
  const { data: trends } = usePersonalTrends();

  const handleCoach = async () => {
    try {
      const result = await aiCoach.mutateAsync();
      if (result.coaching) {
        setCoaching(result.coaching);
      } else {
        toast({ title: 'No data', description: result.message || 'No posts to analyze.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to get coaching.', variant: 'destructive' });
    }
  };

  const pieData = sentiment ? [
    { name: 'Positive', value: sentiment.positive, color: COLORS.positive },
    { name: 'Neutral', value: sentiment.neutral, color: COLORS.neutral },
    { name: 'Negative', value: sentiment.negative, color: COLORS.negative },
  ] : [];

  const directionIcon = {
    up: <ArrowUp className="h-3 w-3 text-chart-sentiment-positive" />,
    down: <ArrowDown className="h-3 w-3 text-destructive" />,
    stable: <Minus className="h-3 w-3 text-muted-foreground" />,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[...Array(5)].map((_, i) => <PremiumSkeleton key={i} variant="metric" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PremiumSkeleton variant="chart" />
          <PremiumSkeleton variant="chart" />
          <PremiumSkeleton variant="chart" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, <span className="gradient-text">{user?.email?.split('@')[0] || 'Analyst'}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your Instagram analytics at a glance</p>
        </div>
        <Button
          variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
          onClick={() => { queryClient.invalidateQueries(); toast({ title: 'Refreshing...' }); }}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {/* Top Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
      >
        <MiniStat label="Followers" value={summary?.totalFollowers.toLocaleString() || '0'} icon={Users} />
        <MiniStat label="Engagement" value={summary?.totalEngagement.toLocaleString() || '0'} icon={Heart} />
        <MiniStat label="Reach" value={summary?.totalReach >= 1000 ? `${(summary.totalReach / 1000).toFixed(1)}K` : summary?.totalReach?.toString() || '0'} icon={Eye} />
        <MiniStat label="Posts" value={summary?.totalPosts.toString() || '0'} icon={FileText} />
        <MiniStat label="Positive" value={`${Math.round(summary?.positiveSentimentPercent || 0)}%`} icon={Smile} />
      </motion.div>

      {/* AI Post Coach — Premium Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-5 rounded-xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 overflow-hidden"
        style={{ boxShadow: '0 4px 30px -8px hsl(173 80% 45% / 0.15)' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-chart-reach/20 border border-primary/30">
                <Wand2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">AI Post Coach</h3>
                <p className="text-[10px] text-muted-foreground">Gemini-powered growth analysis</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleCoach}
              disabled={aiCoach.isPending}
              className="gap-1.5 h-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
            >
              {aiCoach.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {coaching ? 'Re-analyze' : 'Analyze Posts'}
            </Button>
          </div>

          {coaching ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Score + Prediction row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
                          strokeDasharray={`${(coaching.overallScore / 100) * 125.6} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">{coaching.overallScore}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{coaching.scoreLabel}</p>
                      <p className="text-[10px] text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-chart-sentiment-positive/5 border border-chart-sentiment-positive/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="h-3 w-3 text-chart-sentiment-positive" />
                      <span className="text-[10px] font-semibold text-chart-sentiment-positive uppercase">Strength</span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2">{coaching.topStrength}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-chart-impressions/5 border border-chart-impressions/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="h-3 w-3 text-chart-impressions" />
                      <span className="text-[10px] font-semibold text-chart-impressions uppercase">Opportunity</span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2">{coaching.biggestOpportunity}</p>
                  </div>
                </div>
                {/* Tips, Hashtags, Ideas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb className="h-3.5 w-3.5 text-chart-impressions" />
                      <span className="text-xs font-semibold text-foreground">Caption Tips</span>
                    </div>
                    <div className="space-y-1.5">
                      {coaching.captionTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-muted-foreground">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Hash className="h-3.5 w-3.5 text-chart-reach" />
                      <span className="text-xs font-semibold text-foreground">Hashtag Ideas</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {coaching.hashtagSuggestions.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-chart-reach/10 text-chart-reach border-chart-reach/20">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Brain className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Content Ideas</span>
                    </div>
                    <div className="space-y-1.5">
                      {coaching.contentIdeas.map((idea, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <ChevronRight className="h-3 w-3 text-chart-reach mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-muted-foreground">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Prediction */}
                <div className="mt-3 p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-chart-reach/5 border border-primary/10">
                  <p className="text-[11px] text-center text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary inline mr-1" />
                    <span className="font-medium text-foreground">Prediction:</span> {coaching.performancePrediction}
                  </p>
                </div>
              </motion.div>
            ) : aiCoach.isPending ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Analyzing your posts with Gemini AI...</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Click "Analyze Posts" to get AI-powered coaching with caption tips, hashtag ideas, and performance predictions.
              </p>
            )}
        </div>
      </motion.div>

      {/* Main Grid — 3 columns on desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Column 1: Posts + Audience */}
        <div className="space-y-4">
          {/* Posts Summary */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Posts</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-muted/30 text-center">
                <p className="text-base font-bold text-foreground">{postStats?.totalLikes.toLocaleString() || '0'}</p>
                <p className="text-[10px] text-muted-foreground">Likes</p>
              </div>
              <div className="p-2 rounded-md bg-muted/30 text-center">
                <p className="text-base font-bold text-foreground">{postStats?.totalComments.toLocaleString() || '0'}</p>
                <p className="text-[10px] text-muted-foreground">Comments</p>
              </div>
              <div className="p-2 rounded-md bg-muted/30 text-center col-span-2">
                <p className="text-base font-bold text-foreground">{(postStats?.avgEngagement || 0).toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground">Avg Engagement Rate</p>
              </div>
            </div>
          </div>

          {/* Audience Summary */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Audience</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                <span className="text-xs text-muted-foreground">Total Followers</span>
                <span className="text-sm font-bold text-foreground">{audience?.totalFollowers.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                <span className="text-xs text-muted-foreground">New This Week</span>
                <span className="text-sm font-bold text-chart-sentiment-positive">+{audience?.newFollowersWeek.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                <span className="text-xs text-muted-foreground">Following</span>
                <span className="text-sm font-bold text-foreground">{audience?.totalFollowing.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Sentiment + Best Times */}
        <div className="space-y-4">
          {/* Sentiment */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Sentiment</h3>
            </div>
            {sentiment && sentiment.total > 0 ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={22} outerRadius={36} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">{sentiment.total}</span>
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No sentiment data yet.</p>
            )}
          </div>

          {/* Best Posting Times */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Best Times</h3>
            </div>
            {bestTimes && bestTimes.length > 0 ? (
              <div className="space-y-1.5">
                {bestTimes.slice(0, 3).map((time, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">#{i + 1}</span>
                      <span className="text-xs text-foreground">{DAYS[time.dayOfWeek]} {time.hourOfDay.toString().padStart(2, '0')}:00</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{time.engagementScore.toFixed(0)} avg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Run AI analysis to see best times.</p>
            )}
          </div>
        </div>

        {/* Column 3: AI Insights + Spam + Trends */}
        <div className="space-y-4">
          {/* AI Insights */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
              {insights && insights.length > 0 && (
                <Badge variant="secondary" className="text-[9px] ml-auto">{insights.length}</Badge>
              )}
            </div>
            {insights && insights.length > 0 ? (
              <div className="space-y-2">
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-2 rounded-md bg-muted/30">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{insight.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{insight.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No insights yet.</p>
            )}
          </div>

          {/* Spam + Trends combined */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-3" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Shield className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-semibold text-foreground">Spam</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{spamComments?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground">detected</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-chart-reach" />
                <span className="text-xs font-semibold text-foreground">Trends</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{trends?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground">patterns</p>
            </div>
          </div>

          {/* Latest Trends */}
          {trends && trends.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Latest Trends</h3>
              </div>
              <div className="space-y-1.5">
                {trends.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                    {directionIcon[t.direction as keyof typeof directionIcon] || directionIcon.stable}
                    <span className="text-xs text-foreground line-clamp-1 flex-1">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
