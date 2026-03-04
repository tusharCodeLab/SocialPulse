import { motion } from 'framer-motion';
import {
  Youtube, Eye, ThumbsUp, MessageCircle, Clock, PlayCircle,
  Film, Video, Radio, FileText,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';

const emptyState = (
  <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
    <Youtube className="h-8 w-8 text-muted-foreground/40" />
    <p className="text-sm text-muted-foreground">Connect your YouTube channel to see video data</p>
    <p className="text-xs text-muted-foreground/60">Go to Settings → Connect YouTube</p>
  </div>
);

export default function YouTubePostsAnalysis() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF0000]/10">
              <Film className="h-5 w-5 text-[#FF0000]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Video Analysis</h1>
            <Badge variant="outline" className="text-xs border-[#FF0000]/30 text-[#FF0000] gap-1">
              <Youtube className="h-3 w-3" /> YouTube
            </Badge>
          </div>
          <p className="text-muted-foreground">Track and analyze the performance of your YouTube videos.</p>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Videos" value="0" icon={Film} delay={0.1} />
        <MetricCard title="Total Views" value="0" icon={Eye} delay={0.15} />
        <MetricCard title="Total Likes" value="0" icon={ThumbsUp} delay={0.2} />
        <MetricCard title="Avg Watch Time" value="0:00" icon={Clock} delay={0.25} />
      </div>

      {/* Engagement Trend */}
      <ChartCard title="Video Engagement Trend" subtitle="Likes, comments, and shares over time" delay={0.3}>
        <div className="h-[300px]">{emptyState}</div>
      </ChartCard>

      {/* Top Videos Table */}
      <div className="mt-6">
        <ChartCard title="Top Performing Videos" subtitle="Ranked by engagement rate" delay={0.35}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Video', 'Views', 'Likes', 'Comments', 'Watch Time', 'Eng. Rate'].map(h => (
                    <th key={h} className={`py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${h === 'Video' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-12 text-center">{emptyState}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Content Type Breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Content Type Performance" subtitle="Videos vs Shorts vs Live" delay={0.4}>
          <div className="h-[250px]">{emptyState}</div>
        </ChartCard>
        <ChartCard title="Upload Frequency" subtitle="Videos published per week" delay={0.45}>
          <div className="h-[250px]">{emptyState}</div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
