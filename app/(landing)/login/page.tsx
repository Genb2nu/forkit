'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base" />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/discover';
  const errorParam = searchParams.get('error');
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Welcome back!');
    router.push(next);
    router.refresh();
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setIsOAuthLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      toast.error(error.message);
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-cream flex items-center justify-center pt-16">
      <div className="w-full max-w-md px-5 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display font-bold text-3xl text-cream">
              Fork<span className="text-fire">🔥</span>It
            </span>
          </Link>
          <h1 className="font-display font-bold text-3xl">Welcome back</h1>
          <p className="text-text-2 text-sm mt-2">
            Log in to save recipes, vote, and manage your creations.
          </p>
        </div>

        {/* Error from URL param */}
        {errorParam && (
          <div className="mb-6 p-3 rounded-xl bg-ember/10 border border-ember/20 text-sm text-ember text-center">
            {errorParam === 'auth_callback_error'
              ? 'Authentication failed. Please try again.'
              : errorParam === 'verification_failed'
                ? 'Email verification failed. Please try again.'
                : 'An error occurred. Please try again.'}
          </div>
        )}

        {/* OAuth buttons */}
        <div className="space-y-3 mb-8">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={!!isOAuthLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isOAuthLoading === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('facebook')}
            disabled={!!isOAuthLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166FE5] transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {isOAuthLoading === 'facebook' ? 'Redirecting…' : 'Continue with Facebook'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-custom uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm text-text-2 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl bg-bg-muted border border-border text-cream placeholder:text-muted-custom focus:outline-none focus:ring-1 focus:ring-fire/50 text-sm"
            />
            {errors.email && (
              <p className="text-ember text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-text-2 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl bg-bg-muted border border-border text-cream placeholder:text-muted-custom focus:outline-none focus:ring-1 focus:ring-fire/50 text-sm"
            />
            {errors.password && (
              <p className="text-ember text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-linear-to-r from-fire to-ember text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-text-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-fire hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-muted-custom">
            Or just{' '}
            <Link href="/discover" className="text-fire hover:underline">
              browse free without an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
