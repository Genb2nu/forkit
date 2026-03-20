import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateTier } from '@/lib/rewards';
import { sendTierUpgradeEmail } from '@/lib/resend';

// POST /api/votes — toggle vote (auth required)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { recipeId } = body as { recipeId: string };

  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });
  }

  // Fetch recipe to check ownership
  const { data: recipe } = await supabase
    .from('recipes')
    .select('id, author_id, title')
    .eq('id', recipeId)
    .single();

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  if (recipe.author_id === user.id) {
    return NextResponse.json({ error: 'Cannot vote on your own recipe' }, { status: 403 });
  }

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  let voted: boolean;

  if (existingVote) {
    // Remove vote (trigger auto-decrements counts)
    await supabase.from('votes').delete().eq('id', existingVote.id);
    voted = false;
  } else {
    // Add vote (trigger auto-increments counts)
    await supabase.from('votes').insert({
      user_id: user.id,
      recipe_id: recipeId,
    });
    voted = true;
  }

  // Get updated vote count (trigger has already updated it)
  const { data: updatedRecipe } = await supabase
    .from('recipes')
    .select('total_votes, author_id')
    .eq('id', recipeId)
    .single();

  const totalVotes = updatedRecipe?.total_votes ?? 0;

  // Recalculate author total votes and check tier upgrade
  if (voted && updatedRecipe) {
    // Sum all votes for this author
    const { data: authorStats } = await supabase
      .from('recipes')
      .select('total_votes')
      .eq('author_id', updatedRecipe.author_id);

    if (authorStats) {
      const authorTotalVotes = authorStats.reduce(
        (sum: number, r: { total_votes: number }) => sum + r.total_votes,
        0
      );

      // Get current author profile
      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('id, reward_tier, total_votes, display_name, push_token')
        .eq('id', updatedRecipe.author_id)
        .single();

      if (authorProfile) {
        const newTier = calculateTier(authorTotalVotes);
        const tierChanged = newTier !== authorProfile.reward_tier;

        // Update author's total_votes and tier
        await supabase
          .from('profiles')
          .update({
            total_votes: authorTotalVotes,
            reward_tier: newTier,
          })
          .eq('id', authorProfile.id);

        // Create notifications
        // Vote notification
        const { data: voterProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        await supabase.from('notifications').insert({
          user_id: updatedRecipe.author_id,
          type: 'new_vote',
          payload: {
            recipe_id: recipeId,
            recipe_title: recipe.title,
            voter_username: voterProfile?.username ?? 'someone',
          },
        });

        // Send Expo push notification
        if (authorProfile.push_token) {
          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: authorProfile.push_token,
              title: '❤️ New vote!',
              body: `@${voterProfile?.username ?? 'someone'} voted for "${recipe.title}"`,
              data: { screen: 'recipe', recipeId: recipe.id },
              sound: 'default',
            }),
          }).catch(() => {}); // fire and forget
        }

        // Tier upgrade notification + email
        if (tierChanged) {
          await supabase.from('notifications').insert({
            user_id: updatedRecipe.author_id,
            type: 'tier_upgrade',
            payload: { new_tier: newTier },
          });

          // Send tier upgrade email
          const { data: authorUser } = await supabase.auth.admin.getUserById(
            updatedRecipe.author_id
          );
          if (authorUser?.user?.email) {
            sendTierUpgradeEmail(
              authorUser.user.email,
              newTier,
              authorProfile.display_name,
              recipe.title
            ).catch(() => {}); // fire and forget
          }
        }
      }
    }
  }

  return NextResponse.json({ voted, totalVotes });
}
