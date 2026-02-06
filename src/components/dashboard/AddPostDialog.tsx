import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePost } from "@/hooks/usePosts";
import { useToast } from "@/hooks/use-toast";
import { SocialPlatform } from "@/hooks/useSocialAccounts";

export function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("post");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
  const [likesCount, setLikesCount] = useState("");
  const [commentsCount, setCommentsCount] = useState("");
  const [sharesCount, setSharesCount] = useState("");
  const [reach, setReach] = useState("");
  const [impressions, setImpressions] = useState("");

  const createPost = useCreatePost();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPost.mutateAsync({
        platform,
        content,
        post_type: postType,
        published_at: new Date(publishedAt).toISOString(),
        likes_count: parseInt(likesCount) || 0,
        comments_count: parseInt(commentsCount) || 0,
        shares_count: parseInt(sharesCount) || 0,
        reach: parseInt(reach) || 0,
        impressions: parseInt(impressions) || 0,
      });

      toast({
        title: "Post added!",
        description: "Your post data has been saved successfully.",
      });

      // Reset form
      setContent("");
      setLikesCount("");
      setCommentsCount("");
      setSharesCount("");
      setReach("");
      setImpressions("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Post Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Post Analytics</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as SocialPlatform)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="reel">Reel/Video</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content/Caption</Label>
            <Textarea
              placeholder="Enter post content or caption..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Published Date</Label>
            <Input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Likes</Label>
              <Input
                type="number"
                placeholder="0"
                value={likesCount}
                onChange={(e) => setLikesCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Comments</Label>
              <Input
                type="number"
                placeholder="0"
                value={commentsCount}
                onChange={(e) => setCommentsCount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shares</Label>
              <Input
                type="number"
                placeholder="0"
                value={sharesCount}
                onChange={(e) => setSharesCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reach</Label>
              <Input
                type="number"
                placeholder="0"
                value={reach}
                onChange={(e) => setReach(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Impressions</Label>
            <Input
              type="number"
              placeholder="0"
              value={impressions}
              onChange={(e) => setImpressions(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Add Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
