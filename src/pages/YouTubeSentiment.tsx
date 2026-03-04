import { motion } from 'framer-motion';
import {
  Youtube, Smile, Frown, Meh, MessageCircle, Sparkles, Shield,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';

const emptyState = (
  <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
    <Youtube className="h-8 w-8 text-muted-foreground/40" />
    <p className="text-sm text-muted-foreground">Connect your YouTube channel to analyze comment sentiment</p>
    <p className="text-xs text-muted-foreground/60">Go to Settings → Connect YouTube</p>
  </div>
);

export default function YouTubeSentiment() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF0000]/10">
              <MessageCircle className="h-5 w-5 text-[#FF0000]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sentiment Analysis</h1>
            <Badge variant="outline" className="text-xs border-[#FF0000]/30 text-[#FF0000] gap-1">
              <Youtube className="h-3 w-3" /> YouTube
            </Badge>
          </div>
          <p className="text-muted-foreground">AI-powered analysis of YouTube comment reactions and feedback.</p>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Positive" value="0%" icon={Smile} delay={0.1} />
        <MetricCard title="Neutral" value="0%" icon={Meh} delay={0.15} />
        <MetricCard title="Negative" value="0%" icon={Frown} delay={0.2} />
        <MetricCard title="Total Comments" value="0" icon={MessageCircle} delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Sentiment Trend" subtitle="Daily sentiment distribution (14 days)" delay={0.3}>
          <div className="h-[300px]">{emptyState}</div>
        </ChartCard>
        <ChartCard title="Overall Distribution" subtitle="Comment sentiment breakdown" delay={0.35}>
          <div className="h-[300px]">{emptyState}</div>
        </ChartCard>
      </div>

      {/* Spam & Recent Comments */}
      <ChartCard title="AI Spam Comment Filter" subtitle="Detect bot, promotional, and phishing comments" delay={0.4}>
        <div className="text-center py-8">
          <Shield className="h-8 w-8 mx-auto mb-2 text-chart-sentiment-positive/50" />
          <p className="text-sm font-medium text-foreground">No spam detected</p>
          <p className="text-xs text-muted-foreground mt-1">Connect YouTube to scan comments for spam.</p>
        </div>
      </ChartCard>

      <div className="mt-6">
        <ChartCard title="Recent Comments" subtitle="Latest analyzed feedback" delay={0.45}>
          <div className="py-12 text-center">
            <MessageCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No comments data</p>
            <p className="text-xs text-muted-foreground mt-1">Import comments by connecting YouTube in Settings.</p>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
