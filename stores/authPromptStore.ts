import { create } from 'zustand';

type AuthPromptAction = 'vote' | 'save' | 'follow' | 'submit';

interface AuthPromptState {
  isOpen: boolean;
  action: AuthPromptAction;
  onSuccess?: () => void;
  openAuthPrompt: (action: AuthPromptAction, onSuccess?: () => void) => void;
  closeAuthPrompt: () => void;
}

export const useAuthPromptStore = create<AuthPromptState>((set) => ({
  isOpen: false,
  action: 'vote',
  onSuccess: undefined,
  openAuthPrompt: (action, onSuccess) =>
    set({ isOpen: true, action, onSuccess }),
  closeAuthPrompt: () =>
    set({ isOpen: false, onSuccess: undefined }),
}));
