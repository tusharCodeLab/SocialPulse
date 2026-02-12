import { motion } from 'framer-motion';
import {
  TrendingUp, Loader2, ArrowUp, ArrowDown, Minus, Activity,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePersonalTrends, useDetectTrends } from '@/hooks/useAIFeatures';

const directionIcon = {
  up: <ArrowUp className="h-4 w-4 text-chart-sentiment-positive" />,
  down: <ArrowDown className="h-4 w-4 text-destructive" />,
  stable: <Minus className="h-4 w-4 text-muted-foreground" />,
};

const trendTypeColors: Record<string, string> = {
  content: 'bg-primary/20 text-primary',
  engagement: 'bg-chart-sentiment-positive/20 text-chart-sentiment-positive',
  audience: 'bg-chart-reach/20 text-chart-reach',
  hashtag: 'bg-chart-impressions/20 text-chart-impressions',
};

export default function Trends() {
  const { toast } = useToast();
  const { data: trends, isLoading: loadingTrends } = usePersonalTrends();
  const detectTrends = useDetectTrends();

  const handleDetectTrends = async () => {
    try {
      await detectTrends.mutateAsync();
      toast({ title: 'Success', description: 'Trends detected successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to detect trends', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Trend Intelligence</h1>
              <p className="text-muted-foreground">AI-detected patterns and trends in your Instagram performance.</p>
            </div>
          </div>
          <Button onClick={handleDetectTrends} disabled={detectTrends.isPending}>
            {detectTrends.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
            Detect Trends
          </Button>
        </motion.div>
      </div>

      {loadingTrends ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trends && trends.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trends.map((trend, i) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <ChartCard title={trend.title} subtitle={`Detected ${new Date(trend.detected_at).toLocaleDateString()}`} delay={0}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {directionIcon[trend.direction as keyof typeof directionIcon] || directionIcon.stable}
                      <span className="text-sm font-medium text-foreground capitalize">{trend.direction} trend</span>
                    </div>
                    <Badge className={`text-xs ${trendTypeColors[trend.trend_type] || 'bg-muted text-muted-foreground'}`}>
                      {trend.trend_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{trend.description}</p>
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      Confidence: <span className="font-medium text-foreground">{(Number(trend.confidence_score) * 100).toFixed(0)}%</span>
                    </span>
                    {trend.platform && (
                      <span className="text-xs text-muted-foreground">
                        Platform: <span className="font-medium text-foreground capitalize">{trend.platform}</span>
                      </span>
                    )}
                  </div>
                </div>
              </ChartCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <ChartCard title="No Trends Detected" subtitle="Run the AI analysis to discover patterns" delay={0.1}>
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-2">
              Click "Detect Trends" to analyze your account for performance patterns.
            </p>
            <p className="text-xs text-muted-foreground">
              The AI will examine your posts, engagement, and audience data to find actionable trends.
            </p>
          </div>
        </ChartCard>
      )}
    </DashboardLayout>
  );
}
