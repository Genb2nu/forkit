-- ============================================================
-- ForkIt — Seed Data
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- System curator account (UUID must match seed-from-mealdb.ts)
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'curated@forkit.app',
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, display_name, bio, reward_tier) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'forkit_curated',
  'ForkIt Curated',
  'Hand-picked recipes from great cuisines around the world, curated by the ForkIt team.',
  'legend'
) ON CONFLICT DO NOTHING;

-- 26 countries (TheMealDB areas)
INSERT INTO countries (code, name, flag) VALUES
  ('US', 'American',    '🇺🇸'),
  ('GB', 'British',     '🇬🇧'),
  ('CA', 'Canadian',    '🇨🇦'),
  ('CN', 'Chinese',     '🇨🇳'),
  ('HR', 'Croatian',    '🇭🇷'),
  ('NL', 'Dutch',       '🇳🇱'),
  ('EG', 'Egyptian',    '🇪🇬'),
  ('FR', 'French',      '🇫🇷'),
  ('GR', 'Greek',       '🇬🇷'),
  ('IN', 'Indian',      '🇮🇳'),
  ('IE', 'Irish',       '🇮🇪'),
  ('IT', 'Italian',     '🇮🇹'),
  ('JM', 'Jamaican',    '🇯🇲'),
  ('JP', 'Japanese',    '🇯🇵'),
  ('KE', 'Kenyan',      '🇰🇪'),
  ('MY', 'Malaysian',   '🇲🇾'),
  ('MX', 'Mexican',     '🇲🇽'),
  ('MA', 'Moroccan',    '🇲🇦'),
  ('PL', 'Polish',      '🇵🇱'),
  ('PT', 'Portuguese',  '🇵🇹'),
  ('RU', 'Russian',     '🇷🇺'),
  ('ES', 'Spanish',     '🇪🇸'),
  ('TH', 'Thai',        '🇹🇭'),
  ('TN', 'Tunisian',    '🇹🇳'),
  ('TR', 'Turkish',     '🇹🇷'),
  ('VN', 'Vietnamese',  '🇻🇳')
ON CONFLICT DO NOTHING;

-- Sample tags
INSERT INTO tags (name) VALUES
  ('Spicy'),
  ('Vegetarian'),
  ('Quick'),
  ('Street Food'),
  ('Comfort'),
  ('Breakfast'),
  ('One-Pan'),
  ('Weekend'),
  ('Crowd-Pleaser'),
  ('Slow-Cooked'),
  ('Bold'),
  ('Customizable'),
  ('Dessert'),
  ('Seafood'),
  ('Noodles')
ON CONFLICT DO NOTHING;
