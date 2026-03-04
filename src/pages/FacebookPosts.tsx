import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, ThumbsUp, MessageCircle, Share2, Facebook } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFacebookPosts } from '@/hooks/useFacebookData';
import { format } from 'date-fns';

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function FacebookPosts() {
  const { data: posts = [] } = useFacebookPosts();
  const hasData = posts.length > 0;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1877F2]/10"><Facebook className="h-6 w-6 text-[#1877F2]" /></div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Facebook Posts Analysis</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Detailed breakdown of all your Facebook Page posts</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 text-xs border-[#1877F2]/30 text-[#1877F2]">
          <Facebook className="h-3 w-3" /> Facebook
        </Badge>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Post Content', 'Type', 'Likes', 'Comments', 'Shares', 'Published'].map(h => (
                  <th key={h} className={cn('py-2.5 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider', h === 'Post Content' ? 'text-left' : 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                posts.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-sm text-foreground max-w-sm truncate">{p.content || 'No text'}</td>
                    <td className="py-3 px-3 text-right"><Badge variant="secondary" className="text-[10px]">{p.post_type || 'post'}</Badge></td>
                    <td className="py-3 px-3 text-sm text-right text-foreground flex items-center justify-end gap-1"><ThumbsUp className="h-3 w-3 text-muted-foreground" />{formatNum(p.likes_count || 0)}</td>
                    <td className="py-3 px-3 text-sm text-right text-foreground">{formatNum(p.comments_count || 0)}</td>
                    <td className="py-3 px-3 text-sm text-right text-foreground">{formatNum(p.shares_count || 0)}</td>
                    <td className="py-3 px-3 text-sm text-right text-muted-foreground">{p.published_at ? format(new Date(p.published_at), 'MMM d, yyyy') : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Facebook className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No Facebook posts found</p>
                    <p className="text-xs text-muted-foreground/60">Go to Settings → Connect Facebook</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
