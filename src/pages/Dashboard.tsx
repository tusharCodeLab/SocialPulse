import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Heart, Eye, FileText, Sparkles, RefreshCw,
  TrendingUp, Loader2, Activity, AlertTriangle, Target,
  Instagram, Youtube, Facebook, MessageCircle, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { PremiumSkeleton } from '@/components/ui/premium-skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDashboardSummaryApi, usePostStatsApi, useAudienceSummaryApi,
  useSentimentStatsApi,
} from '@/hooks/useSocialApi';
import { useAIPerformanceDigest, PerformanceDigest } from '@/hooks/useAIFeatures';
import { usePlatformComparison, useReachTrends } from '@/hooks/useCrossPlatformData';
import { cn } from '@/lib/utils';

/* ── Constants ── */
const SENTIMENT_COLORS = {
  positive: 'hsl(142, 71%, 45%)',
  negative: 'hsl(0, 72%, 51%)',
  neutral: 'hsl(215, 20%, 55%)',
};

const PLATFORM_CONFIG = {
  instagram: { icon: Instagram, color: '#E4405F', label: 'Instagram', border: 'border-l-[#E4405F]' },
  youtube: { icon: Youtube, color: '#FF0000', label: 'YouTube', border: 'border-l-[#FF0000]' },
  facebook: { icon: Facebook, color: '#1877F2', label: 'Facebook', border: 'border-l-[#1877F2]' },
};

/* ── Sub-components ── */

function MetricPill({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border/60" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground leading-none tracking-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function PlatformCard({ platform, metrics }: { platform: 'instagram' | 'youtube' | 'facebook'; metrics: any }) {
  const config = PLATFORM_CONFIG[platform];
  const Icon = config.icon;

  const stats = [
    { label: 'Likes', value: metrics.totalLikes, icon: Heart },
    { label: 'Comments', value: metrics.totalComments, icon: MessageCircle },
    { label: 'Engagement', value: `${metrics.avgEngagementRate}%`, icon: BarChart3 },
    { label: 'Followers', value: metrics.followers, icon: Users },
  ];

  return (
    <div className={cn('rounded-xl border border-border bg-card border-l-4 relative overflow-hidden', config.border)} style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Post count badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
          {metrics.postsCount} posts
        </span>
      </div>

      <div className="p-4">
        {/* Platform header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}15` }}>
            <Icon className="h-4 w-4" style={{ color: config.color }} />
          </div>
          <h3 className="text-sm font-bold text-foreground">{config.label}</h3>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => {
            const SIcon = s.icon;
            const formatted = typeof s.value === 'number'
              ? s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}K` : s.value.toString()
              : s.value;
            return (
              <div key={s.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <SIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight">{formatted}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-[11px]">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.dataKey}</span>
          <span className="font-semibold text-foreground ml-auto">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Main Dashboard ── */

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: summary, isLoading } = useDashboardSummaryApi();
  const { data: sentiment } = useSentimentStatsApi();
  const { data: platformMetrics } = usePlatformComparison();
  const { data: reachTrends } = useReachTrends();
  const aiDigest = useAIPerformanceDigest();
  const [digest, setDigest] = useState<PerformanceDigest | null>(null);

  const handleGenerateDigest = async () => {
    try {
      const result = await aiDigest.mutateAsync();
      if (result.digest) {
        setDigest(result.digest);
      } else {
        toast({ title: 'Not enough data', description: result.message || 'Import your Instagram data first.' });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to generate digest.';
      toast({ title: 'Digest Failed', description: msg, variant: 'destructive' });
    }
  };

  const pieData = sentiment ? [
    { name: 'Positive', value: sentiment.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: sentiment.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: sentiment.negative, color: SENTIMENT_COLORS.negative },
  ] : [];

  const platformMap = (platformMetrics || []).reduce((acc, p) => {
    acc[p.platform] = p;
    return acc;
  }, {} as Record<string, any>);

  // Compute avg engagement across platforms
  const avgEngagement = platformMetrics?.length
    ? (platformMetrics.reduce((s, p) => s + p.avgEngagementRate, 0) / platformMetrics.length).toFixed(1)
    : '0';

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => <PremiumSkeleton key={i} variant="metric" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PremiumSkeleton variant="chart" className="lg:col-span-2" />
          <PremiumSkeleton variant="chart" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, <span className="gradient-text">{user?.email?.split('@')[0] || 'Analyst'}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your cross-platform analytics overview</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Larger sentiment display */}
          {sentiment && sentiment.total > 0 && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-card border border-border/60">
              <div className="w-12 h-12 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={14} outerRadius={22} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Overall Sentiment</p>
                <p className="text-[10px] text-chart-sentiment-positive font-medium">
                  {Math.round((sentiment.positive / sentiment.total) * 100)}% Positive
                </p>
              </div>
            </div>
          )}
          <Button
            variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
            onClick={async () => {
              await queryClient.invalidateQueries();
              toast({ title: 'Data refreshed', description: 'All analytics have been updated.' });
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* ── Metric Pills ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricPill label="Total Followers" value={summary?.totalFollowers.toLocaleString() || '0'} icon={Users} />
        <MetricPill label="Total Engagement" value={summary?.totalEngagement.toLocaleString() || '0'} icon={Heart} />
        <MetricPill label="Total Reach" value={summary?.totalReach >= 1000 ? `${(summary.totalReach / 1000).toFixed(1)}K` : summary?.totalReach?.toString() || '0'} icon={Eye} />
        <MetricPill label="Avg Engagement" value={`${avgEngagement}%`} icon={BarChart3} />
      </motion.div>

      {/* ── Main Grid: Chart + Platform Cards ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Reach Chart — spans 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Combined User Reach</h3>
                <p className="text-[10px] text-muted-foreground">Reach across all platforms over time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(['instagram', 'youtube', 'facebook'] as const).map(p => (
                <div key={p} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATFORM_CONFIG[p].color }} />
                  <span className="text-[10px] text-muted-foreground capitalize">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[350px]">
            {reachTrends && reachTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reachTrends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillInsta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E4405F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E4405F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillYT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillFB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 15%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="instagram" stroke="#E4405F" fill="url(#fillInsta)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="youtube" stroke="#FF0000" fill="url(#fillYT)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="facebook" stroke="#1877F2" fill="url(#fillFB)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No reach data available yet. Import posts to see trends.</p>
              </div>
            )}
          </div>
        </div>

        {/* Platform Cards — spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {(['instagram', 'youtube', 'facebook'] as const).map(p => (
            <PlatformCard
              key={p}
              platform={p}
              metrics={platformMap[p] || { totalReach: 0, totalImpressions: 0, postsCount: 0, avgEngagementRate: 0, followers: 0, totalLikes: 0, totalComments: 0 }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── AI Performance Digest ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 overflow-hidden"
        style={{ boxShadow: '0 4px 30px -8px hsl(173 80% 45% / 0.12)' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-chart-reach/20 border border-primary/30">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">AI Performance Digest</h3>
                <p className="text-[10px] text-muted-foreground">
                  {digest ? digest.headline : 'AI-generated weekly performance summary'}
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleGenerateDigest} disabled={aiDigest.isPending} className="gap-1.5 h-7 text-xs">
              {aiDigest.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {digest ? 'Refresh' : 'Generate'}
            </Button>
          </div>

          {digest ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{digest.summary}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
                      <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="3.5"
                        strokeDasharray={`${(digest.healthScore / 100) * 113} 113`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">{digest.healthScore}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{digest.healthLabel}</p>
                    <p className="text-[9px] text-muted-foreground">Health Score</p>
                  </div>
                </div>
                {digest.highlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-base">{h.emoji}</span>
                    <p className="text-[11px] text-foreground leading-tight line-clamp-2">{h.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 p-2.5 rounded-lg bg-chart-sentiment-positive/5 border border-chart-sentiment-positive/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="h-3 w-3 text-chart-sentiment-positive" />
                    <span className="text-[10px] font-semibold text-chart-sentiment-positive uppercase">Weekly Goal</span>
                  </div>
                  <p className="text-xs text-foreground">{digest.weeklyGoal}</p>
                </div>
                {digest.riskAlert && (
                  <div className="flex-1 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-[10px] font-semibold text-destructive uppercase">Risk Alert</span>
                    </div>
                    <p className="text-xs text-foreground">{digest.riskAlert}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : aiDigest.isPending ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Generating your performance digest...</span>
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
}
