import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function AddProfileDialog() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!user) return;

    // Validate token format
    const trimmed = token.trim();
    if (!trimmed || trimmed.length > 500 || !/^[A-Za-z0-9_\-\.]+$/.test(trimmed)) {
      toast({
        title: 'Invalid token',
        description: 'Please enter a valid Instagram access token (alphanumeric, max 500 characters).',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-instagram', {
        body: { token: trimmed },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Profile added!',
        description: `Connected @${data.account?.username || 'unknown'} with ${data.imported?.posts || 0} posts.`,
      });

      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      setToken('');
      setOpen(false);
    } catch (err) {
      toast({
        title: 'Failed to add profile',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Add Instagram Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="token">Instagram Access Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Paste your Meta Graph API token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Get a token from the{' '}
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Meta Graph API Explorer
              </a>
              {' '}with <code className="text-[10px] bg-muted px-1 py-0.5 rounded">pages_show_list</code> and{' '}
              <code className="text-[10px] bg-muted px-1 py-0.5 rounded">instagram_basic</code> permissions.
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={loading || !token.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Profile'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
