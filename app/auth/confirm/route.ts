import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Email verification handler
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'email' | 'signup' | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type === 'email' ? 'email' : 'signup',
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/discover`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
