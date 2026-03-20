import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ username: string }>;
}

// POST /api/follows/[username] — follow a user (auth required)
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the target profile
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('id, username, push_token')
    .eq('username', username)
    .single();

  if (!targetProfile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Prevent self-follow
  if (targetProfile.id === user.id) {
    return NextResponse.json(
      { error: 'Cannot follow yourself' },
      { status: 400 }
    );
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetProfile.id)
    .maybeSingle();

  let following: boolean;

  if (existingFollow) {
    // Unfollow
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetProfile.id);
    following = false;
  } else {
    // Follow
    await supabase.from('follows').insert({
      follower_id: user.id,
      following_id: targetProfile.id,
    });
    following = true;

    // Create notification for the followed user
    const { data: followerProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    await supabase.from('notifications').insert({
      user_id: targetProfile.id,
      type: 'new_follower',
      payload: {
        follower_username: followerProfile?.username ?? 'someone',
      },
    });

    // Send Expo push notification
    if (targetProfile.push_token) {
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetProfile.push_token,
          title: '👤 New follower!',
          body: `@${followerProfile?.username ?? 'someone'} started following you`,
          data: { screen: 'profile', username: followerProfile?.username },
          sound: 'default',
        }),
      }).catch(() => {}); // fire and forget
    }
  }

  // Get updated follower count
  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', targetProfile.id);

  return NextResponse.json({
    following,
    followerCount: followerCount ?? 0,
  });
}

// DELETE /api/follows/[username] — unfollow a user (auth required)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!targetProfile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetProfile.id);

  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', targetProfile.id);

  return NextResponse.json({
    following: false,
    followerCount: followerCount ?? 0,
  });
}
