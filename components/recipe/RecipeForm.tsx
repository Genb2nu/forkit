'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CreateRecipeSchema, type CreateRecipeInput } from '@/lib/validation';
import { detectVideoType, buildEmbedUrl } from '@/lib/video';
import { createClient } from '@/lib/supabase/client';
import type { Recipe, Country } from '@/types';

// ---------- Types ----------

interface RecipeFormProps {
  mode: 'create' | 'edit';
  initialData?: Recipe;
  onSuccess?: (recipeId: string) => void;
}

// ---------- Country Selector ----------

function CountrySelect({
  value,
  onChange,
  error,
}: {
  value: { code: string; name: string; flag: string };
  onChange: (country: { code: string; name: string; flag: string }) => void;
  error?: string;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('countries')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setCountries(data);
      });
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-xs font-mono text-text-2 mb-1.5">
        Country / Cuisine *
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream hover:bg-white/8 transition-colors"
      >
        {value.code ? (
          <span>
            {value.flag} {value.name}
          </span>
        ) : (
          <span className="text-text-2">Select a country…</span>
        )}
        <svg
          className={`w-4 h-4 text-text-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-bg-surface border border-white/10 shadow-xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-white/7">
            <input
              type="text"
              placeholder="Search countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-cream placeholder:text-text-2 outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-44">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange({ code: c.code, name: c.name, flag: c.flag });
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/8 transition-colors flex items-center gap-2 ${
                  value.code === c.code ? 'bg-fire/10 text-fire' : 'text-cream'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                {c.recipe_count > 0 && (
                  <span className="ml-auto text-xs text-text-2">
                    {c.recipe_count} recipes
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="p-4 text-sm text-text-2 text-center">No countries found</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-ember">{error}</p>}
    </div>
  );
}

// ---------- Tag Input ----------

function TagInput({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (!tag || tag.length < 3) return;
    if (value.length >= 8) {
      toast.error('Maximum 8 tags');
      return;
    }
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      toast.error('Tag already added');
      return;
    }
    onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-mono text-text-2 mb-1.5">
        Tags (max 8)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type a tag + Enter"
          maxLength={30}
          className="flex-1 rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-text-2 hover:text-cream hover:bg-white/8 transition-colors"
        >
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-fire/15 text-fire px-3 py-1 text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:text-ember transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-ember">{error}</p>}
    </div>
  );
}

// ---------- Main RecipeForm ----------

export function RecipeForm({ mode, initialData, onSuccess }: RecipeFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPlatform, setVideoPlatform] = useState<string | null>(
    initialData?.video_url ? detectVideoType(initialData.video_url) : null
  );

  // RHF setup
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateRecipeInput>({
    resolver: zodResolver(CreateRecipeSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          emoji: initialData.emoji,
          countryCode: initialData.country_code,
          countryName: initialData.country_name,
          countryFlag: initialData.country_flag,
          difficulty: initialData.difficulty,
          timeMinutes: initialData.time_minutes,
          servings: initialData.servings,
          tags: initialData.tags?.map((t) => t.name) ?? [],
          videoUrl: initialData.video_url ?? '',
          videoNote: initialData.video_note ?? '',
          ingredients: initialData.ingredients?.map((ig) => ({
            text: ig.text,
            sort_order: ig.sort_order,
          })) ?? [
            { text: '', sort_order: 1 },
            { text: '', sort_order: 2 },
          ],
          steps: initialData.steps?.map((s) => ({
            step_number: s.step_number,
            title: s.title,
            body: s.body,
          })) ?? [
            { step_number: 1, title: '', body: '' },
            { step_number: 2, title: '', body: '' },
          ],
          imageUrl: initialData.image_url ?? '',
        }
      : {
          title: '',
          description: '',
          emoji: '🍴',
          countryCode: '',
          countryName: '',
          countryFlag: '',
          difficulty: 'medium',
          timeMinutes: 30,
          servings: 2,
          tags: [],
          videoUrl: '',
          videoNote: '',
          ingredients: [
            { text: '', sort_order: 1 },
            { text: '', sort_order: 2 },
          ],
          steps: [
            { step_number: 1, title: '', body: '' },
            { step_number: 2, title: '', body: '' },
          ],
          imageUrl: '',
        },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    move: moveIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: 'steps' });

  const videoUrl = watch('videoUrl');

  // Warn before navigating away if form is dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Auto-detect video platform on change
  useEffect(() => {
    if (videoUrl && videoUrl.trim()) {
      setVideoPlatform(detectVideoType(videoUrl));
    } else {
      setVideoPlatform(null);
    }
  }, [videoUrl]);

  // Image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Ingredient reorder
  const moveIngredientUp = (index: number) => {
    if (index === 0) return;
    moveIngredient(index, index - 1);
    ingredientFields.forEach((_, i) => {
      setValue(`ingredients.${i}.sort_order`, i + 1);
    });
  };
  const moveIngredientDown = (index: number) => {
    if (index === ingredientFields.length - 1) return;
    moveIngredient(index, index + 1);
    ingredientFields.forEach((_, i) => {
      setValue(`ingredients.${i}.sort_order`, i + 1);
    });
  };

  // Remove step and renumber
  const handleRemoveStep = (index: number) => {
    removeStep(index);
    setTimeout(() => {
      stepFields.forEach((_, i) => {
        if (i >= index) {
          setValue(`steps.${i}.step_number`, i + 1);
        }
      });
    }, 0);
  };

  // Upload image
  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!imageFile) return initialData?.image_url ?? null;

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? 'Image upload failed');
        return initialData?.image_url ?? null;
      }
      const { url } = await res.json();
      return url;
    } catch {
      toast.error('Image upload failed — submitting without image');
      return initialData?.image_url ?? null;
    }
  }, [imageFile, initialData?.image_url]);

  // Form submit
  const onSubmit = async (data: CreateRecipeInput) => {
    setIsSubmitting(true);
    try {
      // Step 1: Upload image if there's a new file
      const imageUrl = await uploadImage();

      const payload = {
        ...data,
        imageUrl: imageUrl ?? undefined,
        videoUrl: data.videoUrl?.trim() || undefined,
        videoNote: data.videoNote?.trim() || undefined,
      };

      const url =
        mode === 'edit' && initialData
          ? `/api/recipes/${initialData.id}`
          : '/api/recipes';

      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? 'Failed to save recipe');
        return;
      }

      const result = await res.json();
      const recipeId = result.id ?? initialData?.id;

      if (mode === 'create') {
        toast.success('🚀 Your recipe is live!');
      } else {
        toast.success('💾 Changes saved');
      }

      onSuccess?.(recipeId);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Render ----------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-32">
      {/* ============ SECTION 1 — BASICS ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">01</span> Basics
        </h2>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Recipe Name *
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Spicy Thai Basil Chicken"
              className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-ember">{errors.title.message}</p>
            )}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Emoji *
            </label>
            <input
              {...register('emoji')}
              placeholder="e.g. 🍳"
              className="w-20 rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-center text-2xl outline-none focus:border-fire/50 transition-colors"
            />
            {errors.emoji && (
              <p className="mt-1 text-xs text-ember">{errors.emoji.message}</p>
            )}
          </div>

          {/* Country */}
          <Controller
            name="countryCode"
            control={control}
            render={() => (
              <CountrySelect
                value={{
                  code: watch('countryCode'),
                  name: watch('countryName'),
                  flag: watch('countryFlag'),
                }}
                onChange={({ code, name, flag }) => {
                  setValue('countryCode', code, { shouldValidate: true });
                  setValue('countryName', name);
                  setValue('countryFlag', flag);
                }}
                error={errors.countryCode?.message}
              />
            )}
          />

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Difficulty *
            </label>
            <div className="flex gap-3">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <label
                  key={d}
                  className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-all ${
                    watch('difficulty') === d
                      ? 'border-fire bg-fire/15 text-fire'
                      : 'border-white/7 bg-white/5 text-text-2 hover:bg-white/8'
                  }`}
                >
                  <input
                    type="radio"
                    value={d}
                    {...register('difficulty')}
                    className="sr-only"
                  />
                  {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                </label>
              ))}
            </div>
          </div>

          {/* Time + Servings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-text-2 mb-1.5">
                Cook Time (min) *
              </label>
              <input
                type="number"
                {...register('timeMinutes', { valueAsNumber: true })}
                min={1}
                max={1440}
                className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream outline-none focus:border-fire/50 transition-colors"
              />
              {errors.timeMinutes && (
                <p className="mt-1 text-xs text-ember">{errors.timeMinutes.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono text-text-2 mb-1.5">
                Servings *
              </label>
              <input
                type="number"
                {...register('servings', { valueAsNumber: true })}
                min={1}
                max={100}
                className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream outline-none focus:border-fire/50 transition-colors"
              />
              {errors.servings && (
                <p className="mt-1 text-xs text-ember">{errors.servings.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2 — DESCRIPTION & TAGS ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">02</span> Description & Tags
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe your recipe — what makes it special? (20-500 chars)"
              className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-ember">{errors.description.message}</p>
            )}
          </div>

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                error={errors.tags?.message}
              />
            )}
          />
        </div>
      </section>

      {/* ============ SECTION 3 — COVER IMAGE ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">03</span> Cover Image
        </h2>

        <div className="flex flex-col items-center gap-4">
          {imagePreview ? (
            <div className="relative w-full max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Recipe cover preview"
                className="w-full aspect-4/3 object-cover rounded-2xl border border-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setValue('imageUrl', '');
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-cream flex items-center justify-center hover:bg-ember/80 transition-colors"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="w-full max-w-sm aspect-4/3 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-fire/30 transition-colors group">
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                📸
              </span>
              <span className="text-sm text-text-2">
                Click to upload (JPEG, PNG, WebP · max 5MB)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </section>

      {/* ============ SECTION 4 — INGREDIENTS ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">04</span> Ingredients
        </h2>

        <div className="space-y-2">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <span className="text-xs text-text-2 font-mono w-6 text-center">
                {index + 1}
              </span>
              <input
                {...register(`ingredients.${index}.text`)}
                placeholder="e.g. 2 tbsp soy sauce"
                className="flex-1 rounded-xl bg-white/5 border border-white/7 px-4 py-2.5 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors"
              />
              <input type="hidden" {...register(`ingredients.${index}.sort_order`, { valueAsNumber: true })} />

              {/* Up / Down arrows */}
              <button
                type="button"
                onClick={() => moveIngredientUp(index)}
                disabled={index === 0}
                className="w-8 h-8 rounded-lg bg-white/5 text-text-2 text-xs flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors"
                aria-label="Move ingredient up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveIngredientDown(index)}
                disabled={index === ingredientFields.length - 1}
                className="w-8 h-8 rounded-lg bg-white/5 text-text-2 text-xs flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors"
                aria-label="Move ingredient down"
              >
                ▼
              </button>

              {/* Remove */}
              <button
                type="button"
                onClick={() => {
                  if (ingredientFields.length <= 2) {
                    toast.error('Minimum 2 ingredients');
                    return;
                  }
                  removeIngredient(index);
                  setTimeout(() => {
                    ingredientFields.forEach((_, i) => {
                      setValue(`ingredients.${i}.sort_order`, i + 1);
                    });
                  }, 0);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 text-ember/60 text-xs flex items-center justify-center hover:bg-ember/15 hover:text-ember transition-colors"
                aria-label="Remove ingredient"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            appendIngredient({
              text: '',
              sort_order: ingredientFields.length + 1,
            })
          }
          className="mt-3 rounded-xl bg-white/5 border border-white/7 px-4 py-2.5 text-sm text-fire hover:bg-fire/10 transition-colors"
        >
          + Add Ingredient
        </button>

        {errors.ingredients?.message && (
          <p className="mt-2 text-xs text-ember">{errors.ingredients.message}</p>
        )}
      </section>

      {/* ============ SECTION 5 — STEPS ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">05</span> Steps
        </h2>

        <div className="space-y-4">
          {stepFields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-2xl bg-white/3 border border-white/7 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-fire font-medium">
                  Step {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (stepFields.length <= 2) {
                      toast.error('Minimum 2 steps');
                      return;
                    }
                    handleRemoveStep(index);
                  }}
                  className="w-7 h-7 rounded-lg bg-white/5 text-ember/60 text-xs flex items-center justify-center hover:bg-ember/15 hover:text-ember transition-colors"
                  aria-label={`Remove step ${index + 1}`}
                >
                  ✕
                </button>
              </div>

              <input type="hidden" {...register(`steps.${index}.step_number`, { valueAsNumber: true })} />

              <input
                {...register(`steps.${index}.title`)}
                placeholder="Step title (e.g. Prep the sauce)"
                className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-2.5 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors mb-2"
              />
              {errors.steps?.[index]?.title && (
                <p className="mb-2 text-xs text-ember">
                  {errors.steps[index].title?.message}
                </p>
              )}

              <textarea
                {...register(`steps.${index}.body`)}
                rows={3}
                placeholder="Detailed instructions for this step…"
                className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-2.5 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors resize-none"
              />
              {errors.steps?.[index]?.body && (
                <p className="mt-1 text-xs text-ember">
                  {errors.steps[index].body?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            appendStep({
              step_number: stepFields.length + 1,
              title: '',
              body: '',
            })
          }
          className="mt-3 rounded-xl bg-white/5 border border-white/7 px-4 py-2.5 text-sm text-fire hover:bg-fire/10 transition-colors"
        >
          + Add Step
        </button>

        {errors.steps?.message && (
          <p className="mt-2 text-xs text-ember">{errors.steps.message}</p>
        )}
      </section>

      {/* ============ SECTION 6 — VIDEO ============ */}
      <section>
        <h2 className="text-lg font-display font-bold text-cream mb-4 flex items-center gap-2">
          <span className="text-fire">06</span> Video{' '}
          <span className="text-xs text-text-2 font-sans font-normal">(optional)</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Video URL
            </label>
            <div className="relative">
              <input
                {...register('videoUrl')}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors font-mono"
              />
              {videoPlatform && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-cream">
                  {videoPlatform === 'youtube' ? '▶️ YouTube' : '👤 Facebook'}
                </span>
              )}
            </div>
            {errors.videoUrl?.message && (
              <p className="mt-1 text-xs text-ember">{errors.videoUrl.message}</p>
            )}
          </div>

          {/* Live embed preview */}
          {videoUrl && videoPlatform && (
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src={buildEmbedUrl(videoUrl)}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-text-2 mb-1.5">
              Video Note
            </label>
            <input
              {...register('videoNote')}
              placeholder="e.g. Skip to 2:30 for the secret technique"
              maxLength={200}
              className="w-full rounded-xl bg-white/5 border border-white/7 px-4 py-3 text-sm text-cream placeholder:text-text-2 outline-none focus:border-fire/50 transition-colors"
            />
            {errors.videoNote && (
              <p className="mt-1 text-xs text-ember">{errors.videoNote.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ============ SUBMIT ============ */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-bg-base/90 backdrop-blur-xl border-t border-white/7 z-40">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-lg mx-auto block rounded-full bg-linear-to-r from-fire to-ember py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-fire/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {mode === 'edit' ? 'Saving…' : 'Submitting…'}
            </span>
          ) : mode === 'edit' ? (
            '✅ Save Changes'
          ) : (
            '🚀 Submit Recipe'
          )}
        </button>
      </div>
    </form>
  );
}
