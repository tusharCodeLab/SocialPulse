import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Lightbulb, AlertTriangle, TrendingUp, Zap, Clock, CheckCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { InstagramIcon, YouTubeIcon, FacebookIcon } from '@/components/icons/PlatformIcons';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  title: string;
  description: string;
  insight_type: string;
  priority: string | null;
  is_read: boolean | null;
  created_at: string | null;
  platform: string | null;
}

interface ActivityFeedProps {
  insights: Insight[];
  onGenerateInsights?: () => void;
  isGenerating?: boolean;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  trend: { icon: TrendingUp, color: 'hsl(var(--chart-engagement))', label: 'Trend' },
  tip: { icon: Lightbulb, color: 'hsl(var(--chart-impressions))', label: 'Tip' },
  alert: { icon: AlertTriangle, color: 'hsl(var(--destructive))', label: 'Alert' },
  opportunity: { icon: Zap, color: 'hsl(var(--chart-reach))', label: 'Opportunity' },
  performance: { icon: TrendingUp, color: 'hsl(var(--chart-engagement))', label: 'Performance' },
  engagement: { icon: Zap, color: 'hsl(var(--chart-reach))', label: 'Engagement' },
  timing: { icon: Clock, color: 'hsl(var(--chart-impressions))', label: 'Timing' },
  content: { icon: Lightbulb, color: 'hsl(var(--primary))', label: 'Content' },
  audience: { icon: TrendingUp, color: 'hsl(var(--chart-engagement))', label: 'Audience' },
};

const PRIORITY_COLORS: Record<string, string> = {
  high: 'border-l-destructive',
  medium: 'border-l-[hsl(38,92%,50%)]',
  low: 'border-l-[hsl(142,71%,45%)]',
};

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E4405F',
  youtube: '#FF0000',
  facebook: '#1877F2',
};

function groupByDate(insights: Insight[]) {
  const groups: { label: string; items: Insight[] }[] = [];
  const today: Insight[] = [];
  const yesterday: Insight[] = [];
  const earlier: Insight[] = [];

  for (const insight of insights) {
    const date = insight.created_at ? new Date(insight.created_at) : null;
    if (date && isToday(date)) today.push(insight);
    else if (date && isYesterday(date)) yesterday.push(insight);
    else earlier.push(insight);
  }

  if (today.length) groups.push({ label: 'Today', items: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });
  if (earlier.length) groups.push({ label: 'Earlier', items: earlier });

  return groups;
}

export function ActivityFeed({ insights, onGenerateInsights, isGenerating }: ActivityFeedProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const unreadCount = insights.filter(i => !i.is_read).length;
  const displayInsights = expanded ? insights : insights.slice(0, 5);
  const groups = groupByDate(displayInsights);

  const markAsRead = async (id: string) => {
    await supabase.from('ai_insights').update({ is_read: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['cross-platform-insights'] });
  };

  const markAllRead = async () => {
    if (!user?.id || markingAll) return;
    setMarkingAll(true);
    await supabase.from('ai_insights').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    queryClient.invalidateQueries({ queryKey: ['cross-platform-insights'] });
    setMarkingAll(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header with gradient */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-r from-chart-reach/5 via-transparent to-primary/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-chart-reach/10 border border-chart-reach/20">
            <Bell className="h-4 w-4 text-chart-reach" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
            <p className="text-[10px] text-muted-foreground">Latest AI insights & alerts</p>
          </div>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                {unreadCount} new
              </span>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost" size="sm"
                className="h-7 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                onClick={markAllRead}
                disabled={markingAll}
              >
                <CheckCheck className="h-3 w-3" />
                {markingAll ? 'Marking...' : 'Mark all read'}
              </Button>
            )}
            {onGenerateInsights && (
              <Button
                variant="outline" size="sm"
                className="h-7 px-2.5 text-[10px] gap-1"
                onClick={onGenerateInsights}
                disabled={isGenerating}
              >
                <Sparkles className={cn("h-3 w-3", isGenerating && "animate-spin")} />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {insights.length > 0 ? (
          <>
            <div className="space-y-0.5">
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">{group.label}</span>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>
                  <AnimatePresence mode="popLayout">
                    {group.items.map((insight) => {
                      const config = TYPE_CONFIG[insight.insight_type] || TYPE_CONFIG.tip;
                      const IIcon = config.icon;
                      const PlatformIcon = insight.platform ? PLATFORM_ICONS[insight.platform] : null;
                      const platformColor = insight.platform ? PLATFORM_COLORS[insight.platform] : null;
                      const priorityBorder = PRIORITY_COLORS[insight.priority || 'medium'] || PRIORITY_COLORS.medium;
                      const isHovered = hoveredId === insight.id;

                      return (
                        <motion.div
                          key={insight.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-lg border-l-2 cursor-pointer transition-all duration-200',
                            priorityBorder,
                            !insight.is_read ? 'bg-primary/[0.03]' : 'bg-transparent',
                            'hover:bg-muted/40'
                          )}
                          onClick={() => !insight.is_read && markAsRead(insight.id)}
                          onMouseEnter={() => setHoveredId(insight.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <div className="p-1.5 rounded-md mt-0.5 flex-shrink-0" style={{ backgroundColor: `${config.color}15` }}>
                            <IIcon className="h-3 w-3" style={{ color: config.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[11px] font-semibold text-foreground truncate">{insight.title}</p>
                              {!insight.is_read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                              )}
                            </div>
                            <p className={cn(
                              'text-[10px] text-muted-foreground transition-all duration-200',
                              isHovered ? 'line-clamp-none' : 'line-clamp-1'
                            )}>
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {PlatformIcon && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${platformColor}12` }}>
                                  <PlatformIcon className="h-2.5 w-2.5" />
                                  <span className="text-[8px] font-medium capitalize" style={{ color: platformColor || undefined }}>
                                    {insight.platform}
                                  </span>
                                </div>
                              )}
                              {insight.priority && (
                                <span className={cn(
                                  'text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-md',
                                  insight.priority === 'high' && 'bg-destructive/10 text-destructive',
                                  insight.priority === 'medium' && 'bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)]',
                                  insight.priority === 'low' && 'bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)]',
                                )}>
                                  {insight.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          {insight.created_at && (
                            <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground/60 flex-shrink-0 mt-1">
                              <Clock className="h-2.5 w-2.5" />
                              {formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Show more / less */}
            {insights.length > 5 && (
              <Button
                variant="ghost" size="sm"
                className="w-full mt-2 h-8 text-[10px] gap-1 text-muted-foreground"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expanded ? 'Show less' : `Show ${insights.length - 5} more`}
              </Button>
            )}
          </>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto">
              <Sparkles className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">No insights yet</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Generate AI-powered insights from your analytics data</p>
            </div>
            {onGenerateInsights && (
              <Button
                variant="outline" size="sm"
                className="h-8 px-4 text-xs gap-1.5"
                onClick={onGenerateInsights}
                disabled={isGenerating}
              >
                <Sparkles className={cn("h-3.5 w-3.5", isGenerating && "animate-spin")} />
                {isGenerating ? 'Generating...' : 'Generate Insights'}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
