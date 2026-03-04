import { motion } from 'framer-motion';
import {
  Youtube, Users, UserPlus, TrendingUp, Globe, Percent,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';

const emptyState = (
  <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
    <Youtube className="h-8 w-8 text-muted-foreground/40" />
    <p className="text-sm text-muted-foreground">Connect your YouTube channel to see audience data</p>
    <p className="text-xs text-muted-foreground/60">Go to Settings → Connect YouTube</p>
  </div>
);

export default function YouTubeAudience() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF0000]/10">
              <Users className="h-5 w-5 text-[#FF0000]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Audience Insights</h1>
            <Badge variant="outline" className="text-xs border-[#FF0000]/30 text-[#FF0000] gap-1">
              <Youtube className="h-3 w-3" /> YouTube
            </Badge>
          </div>
          <p className="text-muted-foreground">Track your subscriber growth, demographics, and traffic sources.</p>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Subscribers" value="0" icon={Users} delay={0.1} />
        <MetricCard title="New This Week" value="+0" icon={UserPlus} delay={0.15} />
        <MetricCard title="Growth Rate" value="0%" icon={Percent} delay={0.2} />
        <MetricCard title="Avg Views/Video" value="0" icon={TrendingUp} delay={0.25} />
      </div>

      {/* Subscriber Growth Chart */}
      <ChartCard title="Subscriber Growth" subtitle="Subscriber count over the last 30 days" delay={0.3}>
        <div className="h-[300px]">{emptyState}</div>
      </ChartCard>

      {/* Demographics & Traffic */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Age & Gender" subtitle="Viewer demographics" delay={0.35}>
          <div className="h-[250px]">{emptyState}</div>
        </ChartCard>
        <ChartCard title="Top Countries" subtitle="Where your viewers are from" delay={0.4}>
          <div className="h-[250px]">{emptyState}</div>
        </ChartCard>
        <ChartCard title="Traffic Sources" subtitle="How viewers find your content" delay={0.45}>
          <div className="h-[250px]">{emptyState}</div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
