-- Enable Realtime for posts, social_accounts, and post_comments tables
-- This allows the frontend to receive instant updates when data changes

ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;