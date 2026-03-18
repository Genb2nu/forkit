'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export function useUser() {
  const { user, isLoading, setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single<Profile>();

        setUser(profile);
      } else {
        clearUser();
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single<Profile>();

        setUser(profile);
      } else {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser, setLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
