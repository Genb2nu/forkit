'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useAuthPromptStore } from '@/stores/authPromptStore';
import type { VoteResponse } from '@/types';

export function useVote(recipeId: string, initialVoted = false, initialCount = 0) {
  const { user } = useAuthStore();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);
  const [voted, setVoted] = useState(initialVoted);
  const [voteCount, setVoteCount] = useState<number>(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!user) {
      openAuthPrompt('vote');
      return;
    }

    // Optimistic update
    const newVoted = !voted;
    setVoted(newVoted);
    setVoteCount((c) => (newVoted ? c + 1 : c - 1));
    setIsLoading(true);

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });

      if (res.ok) {
        const data: VoteResponse = await res.json();
        setVoted(data.voted);
        setVoteCount(data.totalVotes);
        toast(data.voted ? '❤️ Voted!' : 'Vote removed');
      } else {
        // Revert on error
        setVoted(!newVoted);
        setVoteCount((c) => (newVoted ? c - 1 : c + 1));
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      // Revert optimistic update on error
      setVoted(!newVoted);
      setVoteCount((c) => (newVoted ? c - 1 : c + 1));
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, voted, recipeId, openAuthPrompt]);

  return {
    toggle,
    voted,
    voteCount,
    isLoading,
  };
}
