import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { Users, TrendingUp, UserPlus, Loader2, Percent } from 'lucide-react';

import { EnhancedMetricCard } from '@/components/dashboard/EnhancedMetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { 
  useAudienceGrowthApi, 
  useAudienceSummaryApi,
} from '@/hooks/useSocialApi';

const COLORS = {
  primary: 'hsl(173, 80%, 45%)',
};

export default function AudienceInsights() {
  const { data: growth, isLoading: loadingGrowth } = useAudienceGrowthApi(30, 'instagram');
  const { data: summary, isLoading: loadingSummary } = useAudienceSummaryApi();

  const isLoading = loadingGrowth || loadingSummary;

  const growthData = growth?.map(g => ({
    date: new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    followers: g.followersCount,
    newFollowers: g.newFollowers,
    netChange: g.netChange,
  })).slice(-14) || [];

  const growthRateDisplay = summary?.growthRate 
    ? `${summary.growthRate > 0 ? '+' : ''}${summary.growthRate.toFixed(1)}%`
    : '0%';

  return (
    <>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Audience Insights</h1>
          <p className="text-muted-foreground">
            Track your follower growth and engagement patterns.
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <EnhancedMetricCard label="Total Followers" value={summary?.totalFollowers.toLocaleString() || '0'} icon={Users} delay={0.1} color="hsl(var(--primary))" sparkData={growthData.map(g => g.followers)} />
            <EnhancedMetricCard label="New This Week" value={`+${summary?.newFollowersWeek.toLocaleString() || '0'}`} icon={UserPlus} delay={0.15} color="hsl(142,71%,45%)" change={summary?.newFollowersWeek} />
            <EnhancedMetricCard label="Following" value={summary?.totalFollowing.toLocaleString() || '0'} icon={TrendingUp} delay={0.2} color="hsl(262,83%,58%)" />
            <EnhancedMetricCard label="Growth Rate" value={growthRateDisplay} icon={Percent} delay={0.25} color="hsl(38,92%,50%)" change={summary?.growthRate} />
          </div>

          {/* Follower Growth Chart */}
          <ChartCard title="Follower Growth" subtitle="Follower count over the last 14 data points" delay={0.3}>
            <div className="h-[300px]">
              {growthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 15%)" />
                    <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 47%, 10%)', border: '1px solid hsl(222, 30%, 15%)', borderRadius: '8px', color: 'hsl(210, 40%, 98%)' }} />
                    <Area type="monotone" dataKey="followers" stroke={COLORS.primary} fill="url(#colorFollowers)" strokeWidth={2} name="Followers" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No audience growth data yet.</p>
                  <p className="text-xs text-muted-foreground">Data appears after syncing your Instagram account in Settings.</p>
                </div>
              )}
            </div>
          </ChartCard>
        </>
      )}
    </>
  );
}
