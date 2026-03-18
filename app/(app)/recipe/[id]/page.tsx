import { cache } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RecipeDetail } from '@/components/recipe/RecipeDetail';
import type { Recipe, Ingredient, RecipeStep, Tag } from '@/types';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Cached recipe fetcher — React.cache deduplicates across
 * generateMetadata and RecipePage within the same request.
 * Runs recipe + tags queries in parallel.
 */
const getRecipe = cache(async (id: string) => {
  const supabase = await createClient();

  // Run recipe + tags queries in parallel instead of sequentially
  const [recipeResult, tagsResult] = await Promise.all([
    supabase
      .from('recipes')
      .select(
        '*, author:profiles!recipes_author_id_fkey(*), ingredients(*), steps:recipe_steps(*)'
      )
      .eq('id', id)
      .single(),
    supabase
      .from('recipe_tags')
      .select('tags(id, name)')
      .eq('recipe_id', id),
  ]);

  if (recipeResult.error || !recipeResult.data) return null;

  const recipe = recipeResult.data;

  const tags =
    tagsResult.data?.flatMap(
      (rt: {
        tags:
          | { id: string; name: string }[]
          | { id: string; name: string }
          | null;
      }) => {
        if (!rt.tags) return [];
        return Array.isArray(rt.tags) ? rt.tags : [rt.tags];
      }
    ) ?? [];

  // Sort
  if (recipe.ingredients) {
    recipe.ingredients.sort(
      (a: Ingredient, b: Ingredient) => a.sort_order - b.sort_order
    );
  }
  if (recipe.steps) {
    recipe.steps.sort(
      (a: RecipeStep, b: RecipeStep) => a.step_number - b.step_number
    );
  }

  return { ...recipe, tags } as Recipe & { tags: Tag[] };
});

export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return { title: 'Recipe Not Found — ForkIt' };
  }

  return {
    title: `${recipe.emoji} ${recipe.title} — ForkIt`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.emoji} ${recipe.title} — ForkIt`,
      description: recipe.description,
      images: [`/api/og/recipe/${id}`],
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  // Create one client for auth, run recipe (cache hit) + auth in parallel
  const supabase = await createClient();
  const [recipe, { data: { user: authUser } }] = await Promise.all([
    getRecipe(id),
    supabase.auth.getUser(),
  ]);

  if (!recipe) notFound();

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Recipe',
            name: recipe.title,
            description: recipe.description,
            image: recipe.image_url,
            author: {
              '@type': 'Person',
              name: recipe.author?.display_name ?? 'ForkIt',
            },
            recipeIngredient: (recipe.ingredients ?? []).map(
              (i: Ingredient) => i.text
            ),
            recipeInstructions: (recipe.steps ?? []).map((s: RecipeStep) => ({
              '@type': 'HowToStep',
              name: s.title,
              text: s.body,
            })),
            cookTime: `PT${recipe.time_minutes}M`,
            recipeYield: String(recipe.servings),
          }),
        }}
      />

      <RecipeDetail recipe={recipe} currentUserId={authUser?.id} />
    </>
  );
}
