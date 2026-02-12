import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';

interface ProfileSwitcherProps {
  collapsed: boolean;
}

export function ProfileSwitcher({ collapsed }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { activeProfileId, setActiveProfile } = useActiveProfileStore();
  const { data: accounts, isLoading } = useSocialAccounts();

  const instagramAccounts = (accounts || []).filter(a => a.platform === 'instagram');
  const activeAccount = instagramAccounts.find(a => a.id === activeProfileId);

  if (isLoading || instagramAccounts.length === 0) return null;

  const displayName = activeAccount
    ? activeAccount.account_handle || activeAccount.account_name
    : 'All Profiles';

  return (
    <div className="relative px-3 py-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
          'bg-muted/40 hover:bg-muted/60 border border-border/50',
          'transition-all duration-200',
          collapsed && 'justify-center px-2'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
          {activeAccount ? (
            <Instagram className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Users className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground">
                {activeAccount ? 'Single profile' : `${instagramAccounts.length} profiles`}
              </p>
            </div>
            <ChevronDown className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform',
              open && 'rotate-180'
            )} />
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className={cn(
              'absolute left-3 right-3 mt-1 z-50 rounded-xl border border-border bg-popover shadow-lg overflow-hidden',
              collapsed && 'left-0 right-auto w-48 ml-2'
            )}
          >
            {/* All Profiles option */}
            <button
              onClick={() => { setActiveProfile(null); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors',
                !activeProfileId && 'bg-primary/10 text-primary'
              )}
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">All Profiles</p>
                <p className="text-[10px] text-muted-foreground">{instagramAccounts.length} accounts</p>
              </div>
            </button>

            <div className="border-t border-border" />

            {instagramAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => { setActiveProfile(account.id); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors',
                  activeProfileId === account.id && 'bg-primary/10 text-primary'
                )}
              >
                {account.profile_image_url ? (
                  <img src={account.profile_image_url} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />
                ) : (
                  <Instagram className="h-4 w-4 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{account.account_handle || account.account_name}</p>
                  <p className="text-[10px] text-muted-foreground">{account.followers_count?.toLocaleString()} followers</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
