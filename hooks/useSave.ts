'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useAuthPromptStore } from '@/stores/authPromptStore';

export function useSave(recipeId: string, initialSaved = false) {
  const { user } = useAuthStore();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!user) {
      openAuthPrompt('save');
      return;
    }

    // Optimistic update
    const newSaved = !saved;
    setSaved(newSaved);
    setIsLoading(true);

    try {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
        toast(data.saved ? '🔖 Saved to cookbook' : 'Removed from saved');
      } else {
        setSaved(!newSaved);
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      setSaved(!newSaved);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, saved, recipeId, openAuthPrompt]);

  return {
    toggle,
    saved,
    isLoading,
  };
}
