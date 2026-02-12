import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveProfileState {
  activeProfileId: string | null; // null means "All Profiles"
  setActiveProfile: (id: string | null) => void;
}

export const useActiveProfileStore = create<ActiveProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfile: (id) => set({ activeProfileId: id }),
    }),
    {
      name: 'active-profile',
    }
  )
);
