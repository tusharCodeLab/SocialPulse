import { motion } from 'framer-motion';
import {
  Youtube, TrendingUp, Activity, Lightbulb, BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Badge } from '@/components/ui/badge';

export default function YouTubeTrends() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF0000]/10">
              <Activity className="h-5 w-5 text-[#FF0000]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Trend Intelligence</h1>
            <Badge variant="outline" className="text-xs border-[#FF0000]/30 text-[#FF0000] gap-1">
              <Youtube className="h-3 w-3" /> YouTube
            </Badge>
          </div>
          <p className="text-muted-foreground">AI-detected patterns in your YouTube channel performance.</p>
        </motion.div>
      </div>

      {/* No Trends State */}
      <ChartCard title="No Trends Detected" subtitle="Run the AI analysis to discover patterns" delay={0.1}>
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-sm font-medium text-foreground mb-2">No performance trends yet</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Connect your YouTube channel and accumulate data, then the AI will identify patterns like content performance shifts, audience growth trends, and engagement anomalies.
          </p>
        </div>
      </ChartCard>

      {/* AI Content Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 rounded-xl border border-chart-impressions/20 bg-gradient-to-r from-card via-card to-chart-impressions/5 overflow-hidden"
        style={{ boxShadow: '0 4px 30px -8px hsl(38 92% 50% / 0.12)' }}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-chart-impressions/20 to-primary/20 border border-chart-impressions/30">
              <Lightbulb className="h-5 w-5 text-chart-impressions" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">AI Content Strategy</h3>
              <p className="text-xs text-muted-foreground">Data-driven content ideas based on your YouTube trends</p>
            </div>
          </div>
          <div className="text-center py-6">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Connect YouTube to generate AI-powered content strategies.</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
