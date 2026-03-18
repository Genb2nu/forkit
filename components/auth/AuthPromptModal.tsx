'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useAuthPromptStore } from '@/stores/authPromptStore';

type AuthAction = 'vote' | 'save' | 'follow' | 'submit';

const ACTION_CONTENT: Record<
  AuthAction,
  { emoji: string; title: string; description: string }
> = {
  vote: {
    emoji: '❤️',
    title: 'Vote for this recipe',
    description:
      'Show some love and help it climb the leaderboard.',
  },
  save: {
    emoji: '🔖',
    title: 'Save this recipe',
    description:
      'Save it to your personal cookbook for when you\'re ready to cook.',
  },
  follow: {
    emoji: '👤',
    title: 'Follow this creator',
    description: 'Get their new recipes in your feed first.',
  },
  submit: {
    emoji: '🍴',
    title: 'Share your recipe',
    description:
      'Publish your recipe and start earning votes. Free, takes 2 minutes.',
  },
};

export function AuthPromptModal() {
  const { isOpen, action, onSuccess, closeAuthPrompt } = useAuthPromptStore();
  const content = ACTION_CONTENT[action];

  const handleOAuth = useCallback(
    async (provider: 'google' | 'facebook') => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        },
      });
      if (!error) {
        onSuccess?.();
        closeAuthPrompt();
      }
    },
    [onSuccess, closeAuthPrompt]
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && closeAuthPrompt()}>
      <SheetContent side="bottom" className="bg-bg-surface border-border rounded-t-3xl">
        <SheetHeader className="text-center pb-2">
          <SheetTitle className="text-cream text-xl font-display">
            {content.emoji} {content.title}
          </SheetTitle>
          <SheetDescription className="text-text-2">
            {content.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4 pb-6 pt-2">
          {/* Google OAuth */}
          <Button
            onClick={() => handleOAuth('google')}
            className="w-full bg-linear-to-r from-fire to-ember hover:opacity-90 text-white rounded-full h-12 font-semibold gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            </svg>
            Continue with Google
          </Button>

          {/* Facebook OAuth */}
          <Button
            onClick={() => handleOAuth('facebook')}
            variant="outline"
            className="w-full rounded-full h-12 border-border text-cream hover:bg-bg-muted gap-2"
          >
            Continue with Facebook
          </Button>

          {/* Email link */}
          <Link
            href="/signup"
            onClick={closeAuthPrompt}
            className="text-center text-sm text-fire hover:text-fire/80 transition-colors"
          >
            Continue with email →
          </Link>

          <p className="text-center text-xs text-muted-custom mt-1">
            Already have an account?{' '}
            <Link
              href="/login"
              onClick={closeAuthPrompt}
              className="text-cream hover:text-fire transition-colors"
            >
              Log in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-custom">
            Takes 10 seconds. No credit card.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
