import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Loader2,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { PlatformBadge } from '@/components/dashboard/PlatformBadge';
import { AddPostDialog } from '@/components/dashboard/AddPostDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePosts, useDeletePost } from '@/hooks/usePosts';
import { SocialPlatform } from '@/hooks/useSocialAccounts';
import { postsData as demoPostsData, engagementData as demoEngagementData } from '@/lib/demoData';
import { useToast } from '@/hooks/use-toast';

const COLORS = {
  engagement: 'hsl(173, 80%, 45%)',
  reach: 'hsl(262, 83%, 58%)',
  impressions: 'hsl(38, 92%, 50%)',
};

export default function PostsAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { data: posts, isLoading } = usePosts();
  const deletePost = useDeletePost();
  const { toast } = useToast();

  const hasRealData = (posts?.length || 0) > 0;

  // Transform real posts to match expected format
  const postsData = hasRealData
    ? posts!.map((p) => ({
        id: p.id,
        platform: p.platform,
        content: p.content || 'No caption',
        date: new Date(p.published_at || p.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        reach: p.reach,
        likes: p.likes_count,
        comments: p.comments_count,
        shares: p.shares_count,
        engagement: Number(p.engagement_rate) || 0,
        sentiment: 'neutral' as const,
        sentimentScore: 0.5,
      }))
    : demoPostsData;

  const filteredPosts = postsData
    .filter((post) => {
      if (platformFilter !== 'all' && post.platform !== platformFilter) return false;
      if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'engagement') return b.engagement - a.engagement;
      if (sortBy === 'reach') return b.reach - a.reach;
      return 0;
    });

  const topPerformingData = [...postsData]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5)
    .map((post) => ({
      name: post.content.substring(0, 20) + '...',
      engagement: post.engagement,
      reach: post.reach / 1000,
    }));

  const engagementData = hasRealData
    ? posts!.slice(0, 7).reverse().map((p) => ({
        date: new Date(p.published_at || p.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        likes: p.likes_count,
        shares: p.shares_count,
      }))
    : demoEngagementData;

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutateAsync(id);
      toast({
        title: "Post deleted",
        description: "The post has been removed from your analytics.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Posts Analysis</h1>
            <p className="text-muted-foreground">
              Analyze the performance of your social media posts across all platforms.
            </p>
          </div>
          <AddPostDialog />
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Over Time */}
            <ChartCard
              title="Performance Trend"
              subtitle="Engagement metrics over time"
              delay={0.1}
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 15%)" />
                    <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 10%)',
                        border: '1px solid hsl(222, 30%, 15%)',
                        borderRadius: '8px',
                        color: 'hsl(210, 40%, 98%)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke={COLORS.engagement}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="shares"
                      stroke={COLORS.reach}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Top Performing Posts */}
            <ChartCard
              title="Top Performing Posts"
              subtitle="Engagement rate comparison"
              delay={0.15}
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformingData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 15%)" />
                    <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 10%)',
                        border: '1px solid hsl(222, 30%, 15%)',
                        borderRadius: '8px',
                        color: 'hsl(210, 40%, 98%)',
                      }}
                    />
                    <Bar dataKey="engagement" fill={COLORS.engagement} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="reach">Reach</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Posts Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="chart-container overflow-hidden"
          >
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No posts found. Add your first post to start tracking analytics.</p>
                <AddPostDialog />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Post</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Platform</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" /> Reach
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Heart className="h-4 w-4" /> Likes
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <MessageCircle className="h-4 w-4" /> Comments
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-4 w-4" /> Eng. Rate
                        </div>
                      </th>
                      {hasRealData && (
                        <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, index) => (
                      <motion.tr
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <p className="text-sm text-foreground max-w-xs truncate">{post.content}</p>
                        </td>
                        <td className="py-4 px-4">
                          <PlatformBadge platform={post.platform} />
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{post.date}</td>
                        <td className="py-4 px-4 text-center text-sm font-medium text-foreground">
                          {post.reach.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-medium text-foreground">
                          {post.likes.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-medium text-foreground">
                          {post.comments.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-sm font-bold text-primary">{post.engagement.toFixed(1)}%</span>
                        </td>
                        {hasRealData && (
                          <td className="py-4 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              disabled={deletePost.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
}
