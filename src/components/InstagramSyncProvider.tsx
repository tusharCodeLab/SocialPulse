// Provider component that initializes Instagram auto-sync
// Wrap your app with this to enable automatic data synchronization

import { useInstagramSync } from '@/hooks/useInstagramSync';

export function InstagramSyncProvider({ children }: { children: React.ReactNode }) {
  // Initialize the sync hook - this sets up Realtime + polling
  useInstagramSync();
  
  return <>{children}</>;
}
