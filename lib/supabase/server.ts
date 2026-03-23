import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Agent, fetch as undiciFetch } from 'undici';

// Use undici directly (bypasses Next.js's patched global fetch) so we can
// attach a custom agent that skips TLS cert verification in corporate proxies.
const insecureAgent = new Agent({ connect: { rejectUnauthorized: false } });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insecureFetch = (input: any, init?: any) =>
  undiciFetch(input, { ...init, dispatcher: insecureAgent }) as unknown as Promise<Response>;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: insecureFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
