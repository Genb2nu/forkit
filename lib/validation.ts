// ============================================================
// ForkIt — Validation Schemas (Zod)
// ============================================================

import { z } from 'zod';

// ---------- Helpers ----------

const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]{1,2}$/u;

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/;
const facebookRegex =
  /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com|fb\.watch)\/.+/;

// ---------- Ingredient Schema ----------

export const IngredientSchema = z.object({
  text: z.string().min(1, 'Ingredient cannot be empty').max(200),
  sort_order: z.number().int().min(1),
});

// ---------- Step Schema ----------

export const StepSchema = z.object({
  step_number: z.number().int().min(1),
  title: z.string().min(1, 'Step title is required').max(100),
  body: z.string().min(1, 'Step instructions are required').max(2000),
});

// ---------- Create Recipe Schema ----------

export const CreateRecipeSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be under 500 characters'),
  emoji: z
    .string()
    .regex(emojiRegex, 'Must be a single emoji'),
  countryCode: z.string().min(2, 'Select a country').max(3),
  countryName: z.string().min(1, 'Country name is required'),
  countryFlag: z.string().min(1, 'Country flag is required'),
  category: z
    .string()
    .min(1, 'Select a category')
    .max(30)
    .default('Miscellaneous'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeMinutes: z
    .number({ message: 'Enter cook time in minutes' })
    .int()
    .min(1, 'Minimum 1 minute')
    .max(1440, 'Maximum 24 hours'),
  servings: z
    .number({ message: 'Enter number of servings' })
    .int()
    .min(1, 'Minimum 1 serving')
    .max(100, 'Maximum 100 servings'),
  tags: z
    .array(z.string().min(3, 'Tag too short').max(30, 'Tag too long'))
    .max(8, 'Maximum 8 tags'),
  videoUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return youtubeRegex.test(val) || facebookRegex.test(val);
      },
      { message: 'Must be a valid YouTube or Facebook video URL' }
    ),
  videoNote: z
    .string()
    .max(200, 'Video note must be under 200 characters')
    .optional(),
  ingredients: z
    .array(IngredientSchema)
    .min(2, 'Add at least 2 ingredients'),
  steps: z
    .array(StepSchema)
    .min(2, 'Add at least 2 steps'),
  imageUrl: z.string().optional(),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;

// ---------- Update Recipe Schema (partial) ----------

export const UpdateRecipeSchema = CreateRecipeSchema.partial();

export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;
