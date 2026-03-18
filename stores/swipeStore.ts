import { create } from 'zustand';

interface SwipeState {
  seenIds: Set<string>;
  savedIds: string[];
  addSeen: (id: string) => void;
  addSaved: (id: string) => void;
  reset: () => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  seenIds: new Set<string>(),
  savedIds: [],
  addSeen: (id) =>
    set((state) => ({
      seenIds: new Set(state.seenIds).add(id),
    })),
  addSaved: (id) =>
    set((state) => ({
      savedIds: state.savedIds.includes(id)
        ? state.savedIds
        : [...state.savedIds, id],
    })),
  reset: () => set({ seenIds: new Set<string>(), savedIds: [] }),
}));
