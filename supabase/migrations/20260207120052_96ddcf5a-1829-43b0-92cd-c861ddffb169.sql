-- Drop the partial unique index and create a regular unique constraint
DROP INDEX IF EXISTS idx_post_comments_external_id;

-- Create a proper unique constraint for upsert to work
ALTER TABLE public.post_comments 
ADD CONSTRAINT uq_post_comments_external_id 
UNIQUE (user_id, external_comment_id);