-- Create enum for social platforms
CREATE TYPE public.social_platform AS ENUM ('instagram', 'twitter', 'facebook', 'linkedin');

-- Create enum for sentiment values
CREATE TYPE public.sentiment_type AS ENUM ('positive', 'negative', 'neutral');

-- Social accounts table - stores connected social media accounts
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform social_platform NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  profile_image_url TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform, account_handle)
);

-- Posts table - stores social media posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  external_post_id TEXT,
  content TEXT,
  post_type TEXT DEFAULT 'post',
  media_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comments table - stores comments for sentiment analysis
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT,
  content TEXT NOT NULL,
  sentiment sentiment_type,
  sentiment_score DECIMAL(3,2),
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audience metrics table - tracks follower growth over time
CREATE TABLE public.audience_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  date DATE NOT NULL,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  new_followers INTEGER DEFAULT 0,
  lost_followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(social_account_id, date)
);

-- AI insights table - stores AI-generated insights
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  platform social_platform,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Best posting times table - stores optimal posting time analysis
CREATE TABLE public.best_posting_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform social_platform NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  hour_of_day INTEGER NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  engagement_score DECIMAL(5,2) DEFAULT 0,
  sample_size INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform, day_of_week, hour_of_day)
);

-- Enable RLS on all tables
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.best_posting_times ENABLE ROW LEVEL SECURITY;

-- RLS policies for social_accounts
CREATE POLICY "Users can view their own social accounts"
  ON public.social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social accounts"
  ON public.social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts"
  ON public.social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts"
  ON public.social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for posts
CREATE POLICY "Users can view their own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for post_comments
CREATE POLICY "Users can view their own post comments"
  ON public.post_comments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own post comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own post comments"
  ON public.post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own post comments"
  ON public.post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for audience_metrics
CREATE POLICY "Users can view their own audience metrics"
  ON public.audience_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audience metrics"
  ON public.audience_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audience metrics"
  ON public.audience_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audience metrics"
  ON public.audience_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for ai_insights
CREATE POLICY "Users can view their own AI insights"
  ON public.ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI insights"
  ON public.ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights"
  ON public.ai_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI insights"
  ON public.ai_insights FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for best_posting_times
CREATE POLICY "Users can view their own best posting times"
  ON public.best_posting_times FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own best posting times"
  ON public.best_posting_times FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own best posting times"
  ON public.best_posting_times FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own best posting times"
  ON public.best_posting_times FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_platform ON public.posts(platform);
CREATE INDEX idx_posts_published_at ON public.posts(published_at);
CREATE INDEX idx_audience_metrics_user_id ON public.audience_metrics(user_id);
CREATE INDEX idx_audience_metrics_date ON public.audience_metrics(date);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);