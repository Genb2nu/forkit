import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notifications — fetch user notifications (auth required)
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50);

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications', detail: error.message },
      { status: 500 }
    );
  }

  // Count unread
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false);

  return NextResponse.json({
    notifications: data ?? [],
    unreadCount: unreadCount ?? 0,
  });
}

// PATCH /api/notifications — mark all notifications as read (auth required)
export async function PATCH() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to mark as read', detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
