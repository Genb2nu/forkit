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


-- ============================================================
-- ForkIt — Manual Curated Recipes: PH, ID, SG
-- Countries not covered by TheMealDB
-- ============================================================

-- Add new countries
INSERT INTO countries (code, name, flag) VALUES
  ('PH', 'Filipino',     '🇵🇭'),
  ('ID', 'Indonesian',   '🇮🇩'),
  ('SG', 'Singaporean',  '🇸🇬')
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- 🇵🇭 PHILIPPINES
-- ════════════════════════════════════════════════════════════

-- 🇵🇭 Philippines: Chicken Adobo
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Chicken Adobo',
    'The Philippines'' most beloved dish — chicken braised in a bold mix of soy sauce, vinegar, crushed garlic, bay leaves, and black peppercorns until the sauce reduces to a glossy, savoury-tangy glaze. Every Filipino family has their own version.',
    '🍗', NULL,
    'PH', 'Filipino', '🇵🇭',
    'easy', 50, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg chicken thighs and drumsticks', 1),
    (rid, '⅓ cup soy sauce', 2),
    (rid, '⅓ cup white cane vinegar (sukang maasim)', 3),
    (rid, '1 whole head garlic, crushed', 4),
    (rid, '3 dried bay leaves', 5),
    (rid, '1 tsp whole black peppercorns', 6),
    (rid, '2 tbsp cooking oil', 7),
    (rid, '1 cup water', 8);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Marinate the chicken', 'Combine chicken pieces with soy sauce, vinegar, crushed garlic, bay leaves, and peppercorns in a large bowl. Marinate for at least 30 minutes, or overnight in the fridge for deeper flavour.'),
    (rid, 2, 'Sear the chicken', 'Heat oil in a heavy-bottomed pan over medium-high heat. Remove chicken from marinade (reserve the liquid) and sear until golden brown on all sides, about 3 minutes per side.'),
    (rid, 3, 'Braise in the sauce', 'Pour the reserved marinade and water into the pan. Bring to a boil, then reduce heat to low. Cover and simmer for 30 minutes until chicken is cooked through and tender.'),
    (rid, 4, 'Reduce the glaze', 'Remove the lid and increase heat to medium. Let the sauce reduce until thick and glossy, basting the chicken occasionally. Taste and adjust with more vinegar if needed.'),
    (rid, 5, 'Serve', 'Plate the chicken over steamed white rice and spoon the reduced sauce on top. Serve with the braised garlic cloves on the side.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Sinigang na Baboy
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Sinigang na Baboy',
    'A comforting sour soup that''s the ultimate Filipino rainy-day food. Pork ribs are simmered in a tart tamarind broth with radish, eggplant, string beans, and water spinach. The sourness is addictive — you''ll want seconds.',
    '🍲', NULL,
    'PH', 'Filipino', '🇵🇭',
    'medium', 90, 6,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg pork ribs, cut into serving pieces', 1),
    (rid, '1 packet tamarind soup base (sinigang mix)', 2),
    (rid, '2 medium tomatoes, quartered', 3),
    (rid, '1 large onion, quartered', 4),
    (rid, '1 medium daikon radish (labanos), sliced into rounds', 5),
    (rid, '1 Asian eggplant, sliced diagonally', 6),
    (rid, '1 bunch kangkong (water spinach)', 7),
    (rid, '10 pieces string beans (sitaw), cut into 5 cm lengths', 8),
    (rid, '2 green chillies (siling haba)', 9),
    (rid, 'Fish sauce (patis) to taste', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Boil the pork', 'In a large pot, add pork ribs and enough water to cover. Bring to a boil and skim off the scum. Add onion and tomatoes, then simmer for 45 minutes until pork is tender.'),
    (rid, 2, 'Add the sour base', 'Stir in the tamarind soup base (or fresh tamarind water if using). Adjust sourness to your liking — start with half and add more gradually.'),
    (rid, 3, 'Cook the vegetables', 'Add radish and string beans first (they take longer). Simmer for 5 minutes, then add eggplant and green chillies. Cook another 3 minutes.'),
    (rid, 4, 'Finish with greens', 'Add kangkong (water spinach) last — it wilts in about 30 seconds. Season with fish sauce to taste. Do not overcook the greens.'),
    (rid, 5, 'Serve hot', 'Ladle into deep bowls and serve immediately with steamed rice. The broth is the star — make sure everyone gets plenty of it.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Kare-Kare
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Kare-Kare',
    'A rich Filipino stew of oxtail and tripe in a thick, golden peanut sauce with banana blossom, eggplant, and string beans. Always served with a side of bagoong (fermented shrimp paste) — the salty kick that makes it unforgettable.',
    '🥘', NULL,
    'PH', 'Filipino', '🇵🇭',
    'hard', 120, 6,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg oxtail, cut into 5 cm pieces', 1),
    (rid, '250g beef tripe, cleaned and sliced', 2),
    (rid, '½ cup ground roasted peanuts or peanut butter', 3),
    (rid, '¼ cup toasted rice flour (for thickening)', 4),
    (rid, '2 tbsp annatto seeds soaked in ½ cup water (for colour)', 5),
    (rid, '1 banana blossom, sliced and soaked in lemon water', 6),
    (rid, '2 Asian eggplants, sliced', 7),
    (rid, '1 bunch string beans (sitaw), cut into 5 cm lengths', 8),
    (rid, '1 onion, diced', 9),
    (rid, 'Bagoong (shrimp paste) for serving', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Boil the meat', 'Place oxtail and tripe in a large pot with water to cover. Bring to a boil, skim the scum, then simmer for 2 hours until very tender. Reserve the broth.'),
    (rid, 2, 'Make the peanut sauce', 'In a separate pan, sauté onion and garlic. Add annatto water for colour. Stir in ground peanuts and toasted rice flour. Gradually add 3–4 cups of the reserved broth, stirring constantly until smooth and thick.'),
    (rid, 3, 'Combine meat and sauce', 'Add the tender oxtail and tripe to the peanut sauce. Simmer together for 10 minutes so the meat absorbs the flavour.'),
    (rid, 4, 'Cook the vegetables', 'Blanch string beans, eggplant, and banana blossom separately in salted water until just tender. Arrange around the stew when serving.'),
    (rid, 5, 'Serve with bagoong', 'Ladle into a large serving bowl, arrange vegetables around the edge, and serve with a generous side of sautéed bagoong (shrimp paste) and steamed rice.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Lechon Kawali
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Lechon Kawali',
    'Crispy deep-fried pork belly — the home version of the Philippines'' famous whole roast pig. Boiled until tender, dried until the skin crackles, then deep-fried to golden perfection. Served with a tangy liver sauce or spiced vinegar dip.',
    '🐖', NULL,
    'PH', 'Filipino', '🇵🇭',
    'medium', 90, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg pork belly, skin on', 1),
    (rid, '3 dried bay leaves', 2),
    (rid, '1 tbsp whole black peppercorns', 3),
    (rid, '1 tbsp salt', 4),
    (rid, '1 whole head garlic, halved', 5),
    (rid, 'Oil for deep frying', 6),
    (rid, 'Lechon sauce (liver sauce) or spiced vinegar for dipping', 7);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Boil the pork belly', 'Place pork belly in a pot with bay leaves, peppercorns, salt, garlic, and enough water to cover. Bring to a boil, then simmer for 45–60 minutes until fork-tender. Do not overcook or it will fall apart.'),
    (rid, 2, 'Dry thoroughly', 'Remove the pork from the broth and pat completely dry with paper towels. Place uncovered in the fridge for at least 1 hour — the drier the skin, the crispier the result.'),
    (rid, 3, 'Deep fry', 'Heat oil to 180°C (350°F) in a deep pan or wok. Carefully lower the pork belly skin-side down. Fry for 10–12 minutes, turning occasionally, until the skin is blistered and deeply golden. Use a splatter guard — it will pop.'),
    (rid, 4, 'Rest and chop', 'Let the pork rest on a wire rack for 5 minutes, then chop into bite-sized pieces with a sharp cleaver.'),
    (rid, 5, 'Serve', 'Arrange on a platter and serve immediately with lechon sauce (liver-based dip) or a bowl of spiced vinegar with soy sauce, onion, and chilli.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Pancit Canton
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Pancit Canton',
    'The birthday noodle dish of the Philippines — stir-fried wheat noodles tossed with pork, shrimp, and colourful vegetables in a savoury soy-oyster sauce. Long noodles symbolise long life, making this a celebration essential.',
    '🍜', NULL,
    'PH', 'Filipino', '🇵🇭',
    'easy', 25, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '250g dried canton (wheat) noodles', 1),
    (rid, '150g pork belly, thinly sliced', 2),
    (rid, '150g shrimp, peeled and deveined', 3),
    (rid, '2 cups shredded cabbage', 4),
    (rid, '1 carrot, julienned', 5),
    (rid, '3 tbsp soy sauce', 6),
    (rid, '2 tbsp oyster sauce', 7),
    (rid, '3 cloves garlic, minced', 8),
    (rid, '2 tbsp cooking oil', 9),
    (rid, 'Calamansi halves for serving', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Prepare the noodles', 'Cook canton noodles in boiling water for 1 minute less than packet instructions. Drain and toss with a little oil to prevent sticking. Set aside.'),
    (rid, 2, 'Cook the protein', 'Heat oil in a large wok over high heat. Sear pork slices until browned, then add shrimp and cook until pink. Remove and set aside.'),
    (rid, 3, 'Stir-fry the vegetables', 'In the same wok, sauté garlic until fragrant. Add carrots and stir-fry for 2 minutes, then add cabbage and cook for 1 more minute. Vegetables should stay crisp.'),
    (rid, 4, 'Toss everything together', 'Return protein to the wok. Add noodles, soy sauce, and oyster sauce. Toss vigorously over high heat for 2 minutes until the noodles are evenly coated and slightly charred.'),
    (rid, 5, 'Serve', 'Transfer to a large platter, squeeze calamansi over the top, and serve immediately. Best eaten family-style, straight from the plate.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Lumpia Shanghai
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Lumpia Shanghai',
    'Crispy deep-fried pork and shrimp spring rolls — the Filipino party appetiser that vanishes from the table in minutes. Thin, shattering wrappers around a savoury filling, served with a sweet chilli dipping sauce.',
    '🥟', NULL,
    'PH', 'Filipino', '🇵🇭',
    'medium', 45, 6,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '500g ground pork', 1),
    (rid, '100g raw shrimp, peeled and finely chopped', 2),
    (rid, '1 small carrot, finely grated', 3),
    (rid, '1 small onion, finely diced', 4),
    (rid, '3 cloves garlic, minced', 5),
    (rid, '1 egg, beaten', 6),
    (rid, '1 tbsp soy sauce', 7),
    (rid, '1 pack spring roll (lumpia) wrappers', 8),
    (rid, 'Oil for deep frying', 9),
    (rid, 'Sweet chilli sauce for dipping', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Mix the filling', 'Combine ground pork, chopped shrimp, carrot, onion, garlic, egg, and soy sauce in a bowl. Mix thoroughly with your hands until everything is well combined. Season with pepper.'),
    (rid, 2, 'Wrap the lumpia', 'Place a tablespoon of filling along the edge of a lumpia wrapper. Roll tightly, tucking in the sides like a small cigar. Seal the edge with a dab of beaten egg. Keep them thin — about finger-width.'),
    (rid, 3, 'Deep fry', 'Heat oil to 170°C (340°F). Fry lumpia in batches, turning occasionally, for 4–5 minutes until golden brown and crispy. Don''t overcrowd the pan or the oil temperature will drop.'),
    (rid, 4, 'Drain and serve', 'Drain on paper towels. Cut each roll in half diagonally and arrange on a platter with sweet chilli dipping sauce. Serve hot — these don''t wait well.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Arroz Caldo
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Arroz Caldo',
    'Filipino chicken rice porridge — the ultimate comfort food when you''re under the weather or just craving warmth. Ginger-infused, silky congee topped with fried garlic, boiled egg, spring onions, and a squeeze of calamansi.',
    '🥣', NULL,
    'PH', 'Filipino', '🇵🇭',
    'easy', 45, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '500g chicken thighs, bone-in', 1),
    (rid, '1 cup jasmine rice, rinsed', 2),
    (rid, '5 cm piece ginger, sliced into matchsticks', 3),
    (rid, '4 cloves garlic (2 minced, 2 sliced for frying)', 4),
    (rid, '1 onion, diced', 5),
    (rid, '6 cups chicken stock or water', 6),
    (rid, '2 tbsp fish sauce (patis)', 7),
    (rid, '½ tsp turmeric or safflower', 8),
    (rid, 'Toppings: boiled egg, fried garlic, green onions, calamansi', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Sauté aromatics', 'In a large pot, heat oil and sauté onion, minced garlic, and ginger until fragrant, about 2 minutes. Add chicken pieces and sear on both sides.'),
    (rid, 2, 'Cook the rice porridge', 'Add rice, stock, turmeric, and fish sauce. Bring to a boil, then reduce to a simmer. Cook for 30 minutes, stirring occasionally to prevent sticking, until the rice breaks down into a thick porridge.'),
    (rid, 3, 'Shred the chicken', 'Remove chicken, shred the meat off the bone, and return to the pot. Discard bones. Stir through and adjust seasoning — it should be savoury and gingery.'),
    (rid, 4, 'Fry the garlic topping', 'In a small pan, fry sliced garlic in oil over low heat until golden and crispy. Remove immediately — it burns fast.'),
    (rid, 5, 'Serve', 'Ladle into bowls and top with fried garlic, sliced boiled egg, chopped spring onions, and a squeeze of calamansi. Serve piping hot.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Tinola
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Tinola',
    'A light, ginger-forward chicken soup with green papaya wedges and chilli leaves (or moringa). Clean, nourishing, and deeply flavoured from a simple base of sautéed ginger, onion, and garlic. A staple Filipino home-cooked meal.',
    '🍲', NULL,
    'PH', 'Filipino', '🇵🇭',
    'easy', 40, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg chicken, cut into serving pieces', 1),
    (rid, '1 medium green papaya, peeled and cut into wedges', 2),
    (rid, '2 cups chilli leaves or moringa (malunggay) leaves', 3),
    (rid, '5 cm piece ginger, cut into strips', 4),
    (rid, '1 onion, sliced', 5),
    (rid, '3 cloves garlic, crushed', 6),
    (rid, '2 tbsp fish sauce (patis)', 7),
    (rid, '6 cups water', 8);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Sauté aromatics', 'Heat oil in a pot over medium heat. Sauté ginger, onion, and garlic until the ginger is fragrant and the onion is soft, about 2 minutes.'),
    (rid, 2, 'Cook the chicken', 'Add chicken pieces and cook, stirring occasionally, until the meat turns white on the outside. Pour in water and fish sauce. Bring to a boil, then simmer for 20 minutes.'),
    (rid, 3, 'Add green papaya', 'Add papaya wedges and cook for 8–10 minutes until the papaya is tender but not mushy. It should hold its shape.'),
    (rid, 4, 'Finish with greens', 'Turn off the heat, add chilli leaves or moringa, and cover for 1 minute. The residual heat will wilt the leaves. Season with more fish sauce if needed.'),
    (rid, 5, 'Serve', 'Ladle into bowls — each serving should get chicken, papaya, greens, and plenty of the ginger broth. Serve with steamed rice.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Bistek Tagalog
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Bistek Tagalog',
    'Filipino beef steak — thin-sliced sirloin marinated in soy sauce and calamansi juice, pan-fried until caramelised, and topped with golden onion rings. Simple, punchy, and deeply savoury. A weeknight staple across Filipino households.',
    '🥩', NULL,
    'PH', 'Filipino', '🇵🇭',
    'medium', 35, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '500g beef sirloin, thinly sliced', 1),
    (rid, '3 large onions, sliced into rings', 2),
    (rid, '¼ cup soy sauce', 3),
    (rid, '3 tbsp calamansi juice (or lemon juice)', 4),
    (rid, '4 cloves garlic, minced', 5),
    (rid, '½ tsp freshly ground black pepper', 6),
    (rid, '2 tbsp cooking oil', 7);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Marinate the beef', 'Combine beef slices with soy sauce, calamansi juice, garlic, and black pepper. Toss to coat and marinate for at least 30 minutes. Reserve the marinade when draining.'),
    (rid, 2, 'Caramelise the onion rings', 'Heat oil in a wide pan over medium heat. Fry onion rings until soft and golden brown, about 5 minutes. Remove and set aside — these go on top at the end.'),
    (rid, 3, 'Pan-fry the beef', 'In the same pan over high heat, sear the marinated beef slices in a single layer. Cook 2 minutes per side until nicely browned. Work in batches to avoid steaming.'),
    (rid, 4, 'Deglaze and simmer', 'Pour the reserved marinade into the pan with all the beef. Simmer for 3–4 minutes until the sauce thickens slightly and coats the meat.'),
    (rid, 5, 'Serve', 'Arrange beef on a plate, pour the reduced sauce over, and pile the caramelised onion rings on top. Serve immediately with steamed rice.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;

-- 🇵🇭 Philippines: Halo-Halo
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Halo-Halo',
    'The ultimate Filipino shaved ice dessert — "mix-mix" in Tagalog. Layers of sweetened beans, jellies, and fruits are piled with finely shaved ice, drizzled with evaporated milk, then crowned with leche flan and ube (purple yam) ice cream. A riot of colour, texture, and sweetness.',
    '🍧', NULL,
    'PH', 'Filipino', '🇵🇭',
    'easy', 20, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, 'Finely shaved ice', 1),
    (rid, '¼ cup sweetened red mung beans', 2),
    (rid, '¼ cup sweetened kidney beans (red)', 3),
    (rid, '¼ cup nata de coco', 4),
    (rid, '¼ cup kaong (sugar palm fruit)', 5),
    (rid, '¼ cup macapuno (coconut sport) strings', 6),
    (rid, '4 slices leche flan', 7),
    (rid, '4 scoops ube (purple yam) ice cream', 8),
    (rid, 'Evaporated milk for drizzling', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Layer the base', 'In each tall glass, spoon 2 tablespoons each of sweetened beans, nata de coco, kaong, and macapuno strings. These form the sweet, chewy base.'),
    (rid, 2, 'Pile the shaved ice', 'Pack finely shaved ice on top of the bean layer, mounding it high above the rim of the glass. The finer the ice, the better the texture.'),
    (rid, 3, 'Add toppings', 'Place a slice of leche flan on the ice and a generous scoop of ube ice cream. The purple and gold on white is the iconic look.'),
    (rid, 4, 'Drizzle and serve', 'Pour evaporated milk generously over the ice. Serve immediately with a long spoon. Mix everything together before eating — that''s the whole point of "halo-halo".');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'PH';
END $$;


-- ════════════════════════════════════════════════════════════
-- 🇮🇩 INDONESIA
-- ════════════════════════════════════════════════════════════

-- 🇮🇩 Indonesia: Nasi Goreng
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Nasi Goreng',
    'Indonesia''s national dish and the king of fried rice. Day-old rice is wok-fried with kecap manis (sweet soy sauce), shrimp paste, chilli, and garlic, then topped with a fried egg, crispy shallots, and prawn crackers. Sweet, smoky, and utterly addictive.',
    '🍳', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'easy', 20, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '3 cups day-old cooked rice (cold)', 1),
    (rid, '3 tbsp kecap manis (sweet soy sauce)', 2),
    (rid, '2 eggs', 3),
    (rid, '3 shallots, thinly sliced', 4),
    (rid, '3 cloves garlic, minced', 5),
    (rid, '2 red chillies, sliced (or 1 tsp sambal)', 6),
    (rid, '½ tsp terasi (shrimp paste)', 7),
    (rid, '150g chicken breast or prawns, diced', 8),
    (rid, 'Crispy fried shallots and cucumber slices for topping', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Prepare the wok', 'Heat a wok or large frying pan over high heat until smoking. Add oil and swirl to coat. The wok must be very hot for proper wok hei (charred flavour).'),
    (rid, 2, 'Fry aromatics and protein', 'Add shallots, garlic, chilli, and shrimp paste. Stir-fry for 30 seconds until fragrant. Add diced chicken or prawns and cook until just done.'),
    (rid, 3, 'Add rice and kecap manis', 'Break up the cold rice and add it to the wok. Pour in kecap manis and toss vigorously for 2–3 minutes, pressing the rice against the wok to get colour and char.'),
    (rid, 4, 'Fry the egg', 'Push rice to one side, crack an egg into the cleared space, and fry until the white is set but the yolk is still runny. Alternatively, fry eggs separately sunny-side up.'),
    (rid, 5, 'Plate and serve', 'Mound the fried rice on a plate, top with the fried egg, scatter crispy shallots, and serve with cucumber slices, prawn crackers, and sambal on the side.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Beef Rendang
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Beef Rendang',
    'Widely regarded as one of the world''s most delicious dishes. Beef chunks are slow-cooked in a rich coconut milk curry packed with lemongrass, galangal, chilli, and turmeric until the sauce reduces completely and the meat becomes dark, dry, and intensely flavoured. A Minangkabau masterpiece from West Sumatra.',
    '🥩', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'hard', 120, 6,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg beef chuck, cut into 4 cm cubes', 1),
    (rid, '400ml coconut milk', 2),
    (rid, '200ml coconut cream', 3),
    (rid, '2 stalks lemongrass, bruised', 4),
    (rid, '4 cm piece galangal, sliced', 5),
    (rid, '4 kaffir lime leaves', 6),
    (rid, '2 turmeric leaves (or 1 tsp ground turmeric)', 7),
    (rid, '3 tbsp kerisik (toasted grated coconut)', 8),
    (rid, 'Spice paste: 10 dried chillies, 8 shallots, 5 garlic cloves, 3 cm ginger, 3 cm turmeric — blended', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Cook the spice paste', 'Blend all spice paste ingredients into a smooth paste. In a large heavy-bottomed pot or wok, cook the paste over medium heat for 8–10 minutes, stirring constantly, until fragrant and the oil separates.'),
    (rid, 2, 'Simmer in coconut milk', 'Add coconut milk, coconut cream, lemongrass, galangal, and kaffir lime leaves. Bring to a gentle boil. Add the beef cubes and stir to coat. Reduce heat and simmer uncovered.'),
    (rid, 3, 'Slow cook until dry', 'Cook for 2–3 hours, stirring every 15 minutes to prevent sticking. The liquid will gradually reduce. As it thickens, stir more frequently. The rendang is ready when the sauce has been completely absorbed and the meat is dark and coated in a thick, dry spice paste.'),
    (rid, 4, 'Toast the rendang', 'In the final stage, reduce heat to low and stir in kerisik (toasted coconut). Keep stirring until the meat is richly caramelised and almost dry. The colour should be deep brown.'),
    (rid, 5, 'Serve', 'Serve warm with steamed rice, ketupat (compressed rice cakes), or lemang (glutinous rice in bamboo). Rendang tastes even better the next day as the flavours intensify.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Gado-Gado
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Gado-Gado',
    'Indonesia''s famous salad — blanched vegetables, fried tofu, tempeh, and boiled egg drizzled with a rich, spicy peanut sauce dressing. Crunchy, creamy, sweet, and savoury all at once. The peanut sauce is the soul of this dish.',
    '🥗', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'easy', 30, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '200g cabbage, shredded and blanched', 1),
    (rid, '200g beansprouts, blanched', 2),
    (rid, '150g long beans, cut and blanched', 3),
    (rid, '200g firm tofu, fried and cubed', 4),
    (rid, '100g tempeh, fried and sliced', 5),
    (rid, '4 boiled eggs, halved', 6),
    (rid, 'Peanut sauce: 200g roasted peanuts, 3 cloves garlic, 4 red chillies, 2 tbsp kecap manis, 1 tbsp tamarind paste, 200ml warm water', 7),
    (rid, 'Fried shallots and prawn crackers for topping', 8);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Blanch the vegetables', 'Bring a large pot of salted water to a boil. Blanch cabbage, beansprouts, and long beans separately for 1–2 minutes each until just tender-crisp. Drain and arrange on a platter.'),
    (rid, 2, 'Fry the tofu and tempeh', 'Deep-fry tofu and tempeh slices in hot oil until golden and crispy. Drain on paper towels, then cut into bite-sized pieces.'),
    (rid, 3, 'Make the peanut sauce', 'Pound or blend peanuts, garlic, and chillies into a rough paste. Mix with kecap manis, tamarind paste, and warm water. Stir until smooth — the sauce should be thick but pourable. Adjust sweetness and spice to taste.'),
    (rid, 4, 'Assemble and serve', 'Arrange blanched vegetables, fried tofu, tempeh, and boiled egg halves on a plate. Pour the peanut sauce generously over everything. Top with fried shallots and serve with prawn crackers.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Sate Ayam
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Sate Ayam',
    'Indonesia''s iconic street food — tender chunks of chicken marinated in turmeric and spices, threaded onto bamboo skewers, grilled over charcoal, and served with a rich, creamy peanut dipping sauce and lontong (compressed rice cake).',
    '🍢', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'medium', 40, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '600g chicken thigh, cut into 2 cm cubes', 1),
    (rid, '1 tsp ground turmeric', 2),
    (rid, '1 tsp ground coriander', 3),
    (rid, '1 tbsp kecap manis', 4),
    (rid, '1 stalk lemongrass, finely sliced', 5),
    (rid, '2 cloves garlic, minced', 6),
    (rid, 'Peanut sauce: 150g roasted peanuts, 2 red chillies, 2 shallots, 1 tbsp kecap manis, 100ml warm water', 7),
    (rid, '20 bamboo skewers, soaked in water', 8);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Marinate the chicken', 'Combine chicken cubes with turmeric, coriander, kecap manis, lemongrass, and garlic. Mix well and marinate for at least 30 minutes, or up to overnight in the fridge.'),
    (rid, 2, 'Thread onto skewers', 'Thread 4–5 pieces of chicken onto each soaked bamboo skewer, pressing them together tightly. This helps them cook evenly and stay juicy.'),
    (rid, 3, 'Make the peanut sauce', 'Pound or blend peanuts, chillies, and shallots into a chunky paste. Mix with kecap manis and warm water until you get a thick, creamy dipping sauce.'),
    (rid, 4, 'Grill the satay', 'Grill skewers over high heat on a charcoal grill, BBQ, or grill pan for 3–4 minutes per side, basting with a little oil. The edges should be nicely charred.'),
    (rid, 5, 'Serve', 'Arrange skewers on a plate with a bowl of peanut sauce, sliced cucumber, red onion, and lontong (compressed rice cake) on the side.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Mie Goreng
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Mie Goreng',
    'Indonesian stir-fried noodles — egg noodles wok-tossed with kecap manis, garlic, chilli, cabbage, and a fried egg on top. Sweet, savoury, smoky, and ready in under 20 minutes. The street food version of instant noodles, but a hundred times better.',
    '🍜', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'easy', 20, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '200g fresh egg noodles (or instant mie goreng noodles)', 1),
    (rid, '2 tbsp kecap manis', 2),
    (rid, '1 tbsp soy sauce', 3),
    (rid, '2 eggs', 4),
    (rid, '2 cups shredded cabbage or bok choy', 5),
    (rid, '3 shallots, thinly sliced', 6),
    (rid, '3 cloves garlic, minced', 7),
    (rid, '1 red chilli, sliced', 8),
    (rid, 'Fried shallots, lime wedge, and sambal for serving', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Cook the noodles', 'Boil noodles according to packet instructions until just al dente. Drain and set aside. If using instant noodles, discard the seasoning packet and use the sauce ingredients listed here instead.'),
    (rid, 2, 'Stir-fry aromatics', 'Heat oil in a wok over high heat. Fry shallots, garlic, and chilli for 30 seconds until fragrant. Add cabbage and stir-fry for 1 minute.'),
    (rid, 3, 'Toss the noodles', 'Add noodles, kecap manis, and soy sauce to the wok. Toss vigorously over high heat for 2 minutes. Push to one side, crack an egg into the space, scramble, then fold through the noodles.'),
    (rid, 4, 'Serve', 'Plate the noodles, top with a fried egg, fried shallots, and a wedge of lime. Serve with sambal on the side for extra heat.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Bakso Sapi
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Bakso Sapi',
    'Indonesia''s beloved beef meatball soup — springy, bouncy meatballs made with beef and tapioca starch, served in a clear, savoury broth with egg noodles, fried shallots, and a kick of sambal and kecap manis on the side. You''ll hear "Baksooo!" from the street vendors everywhere.',
    '🍲', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'medium', 60, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '500g ground beef (lean)', 1),
    (rid, '100g tapioca starch', 2),
    (rid, '4 cloves garlic, minced', 3),
    (rid, '1 egg white', 4),
    (rid, '1 tsp salt', 5),
    (rid, '½ tsp white pepper', 6),
    (rid, '1.5 litres beef broth', 7),
    (rid, '200g egg noodles', 8),
    (rid, 'Fried shallots, celery leaves, sambal, and kecap manis for serving', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Make the meatball mixture', 'Blend ground beef, garlic, egg white, salt, and white pepper in a food processor until very smooth and paste-like. Add tapioca starch and pulse until a springy dough forms. The texture should be bouncy, not crumbly.'),
    (rid, 2, 'Form meatballs', 'With wet hands, form the mixture into golf ball-sized spheres. You should get about 16–20 meatballs. Keep hands wet to prevent sticking.'),
    (rid, 3, 'Boil the meatballs', 'Bring a pot of water to a gentle simmer (not a rolling boil). Drop meatballs in and cook for 8–10 minutes until they float to the surface and feel firm. Remove with a slotted spoon.'),
    (rid, 4, 'Prepare the broth', 'Heat beef broth in a separate pot. Season with a little soy sauce and white pepper. Cook egg noodles according to packet instructions and divide among serving bowls.'),
    (rid, 5, 'Assemble and serve', 'Place meatballs over the noodles, ladle hot broth over everything, and top with fried shallots and celery leaves. Serve with sambal and kecap manis on the side.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Soto Ayam
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Soto Ayam',
    'A golden, turmeric-spiced chicken soup that''s Indonesia''s answer to chicken noodle soup. Fragrant broth infused with lemongrass, galangal, and kaffir lime leaves, served over vermicelli with shredded chicken, boiled egg, and crispy fried shallots. Soul-warming comfort food.',
    '🍲', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'medium', 60, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '500g chicken thighs, bone-in', 1),
    (rid, '1 litre water', 2),
    (rid, '1 stalk lemongrass, bruised', 3),
    (rid, '3 cm piece galangal, sliced', 4),
    (rid, '3 kaffir lime leaves', 5),
    (rid, '1 tsp ground turmeric', 6),
    (rid, 'Spice paste: 5 shallots, 4 garlic cloves, 3 cm ginger, 3 candlenuts — blended', 7),
    (rid, '100g rice vermicelli, cooked', 8),
    (rid, '4 boiled eggs, halved', 9),
    (rid, 'Fried shallots, celery, lime wedges, and sambal for serving', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Poach the chicken', 'Place chicken thighs in a pot with water, lemongrass, galangal, and kaffir lime leaves. Bring to a boil, then simmer for 25 minutes until chicken is cooked through. Remove chicken and shred the meat.'),
    (rid, 2, 'Build the broth', 'Strain the poaching liquid. In the same pot, sauté the blended spice paste with a little oil until fragrant, about 3 minutes. Add turmeric and stir. Pour in the strained broth and simmer for 15 minutes.'),
    (rid, 3, 'Season the broth', 'Season with salt and a splash of kecap manis. The broth should be golden, fragrant, and well-seasoned. Taste and adjust.'),
    (rid, 4, 'Assemble bowls', 'Divide vermicelli noodles among serving bowls. Top with shredded chicken and halved boiled eggs. Ladle the hot broth over everything.'),
    (rid, 5, 'Garnish and serve', 'Top each bowl with fried shallots, chopped celery, and a lime wedge. Serve with sambal on the side for those who want extra heat.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Opor Ayam
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Opor Ayam',
    'A fragrant, creamy coconut milk chicken curry traditionally served during Lebaran (Eid al-Fitr). Chicken pieces are braised gently in a mild, aromatic coconut gravy spiced with coriander, cumin, lemongrass, and galangal. Rich but never heavy.',
    '🍛', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'medium', 60, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg chicken, cut into serving pieces', 1),
    (rid, '400ml coconut milk', 2),
    (rid, '200ml coconut cream', 3),
    (rid, '2 stalks lemongrass, bruised', 4),
    (rid, '3 cm piece galangal, sliced', 5),
    (rid, '3 bay leaves (salam leaves if available)', 6),
    (rid, '3 kaffir lime leaves', 7),
    (rid, 'Spice paste: 8 shallots, 4 garlic cloves, 3 candlenuts, 2 tsp coriander, 1 tsp cumin — blended', 8);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Cook the spice paste', 'Heat a little oil in a large pot over medium heat. Sauté the blended spice paste for 5 minutes until fragrant and the raw smell disappears. Add lemongrass, galangal, bay leaves, and kaffir lime leaves.'),
    (rid, 2, 'Add coconut milk and chicken', 'Pour in coconut milk and bring to a gentle simmer. Add chicken pieces and stir to coat. Simmer uncovered for 30 minutes, stirring occasionally, until the chicken is cooked through.'),
    (rid, 3, 'Enrich with coconut cream', 'Stir in coconut cream and continue simmering for another 10 minutes. The sauce should be creamy, thick, and rich. Do not let it boil vigorously or the coconut milk may split.'),
    (rid, 4, 'Season and serve', 'Season with salt and a pinch of sugar to balance the flavours. Serve warm with ketupat (compressed rice cake) or steamed rice. This is the centrepiece of any Lebaran feast.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Tempe Orek
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Tempe Orek',
    'Sweet, sticky, and slightly spicy fried tempeh — a beloved Indonesian side dish. Thin slices of tempeh are fried until golden, then tossed in a caramelised glaze of kecap manis, palm sugar, chilli, and tamarind. Cheap, addictive, and packed with protein.',
    '🫘', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'easy', 15, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '300g tempeh, sliced into thin strips', 1),
    (rid, '3 tbsp kecap manis', 2),
    (rid, '1 tbsp palm sugar (gula jawa) or brown sugar', 3),
    (rid, '1 tbsp tamarind paste mixed with 2 tbsp water', 4),
    (rid, '3 red chillies, sliced diagonally', 5),
    (rid, '4 cloves garlic, thinly sliced', 6),
    (rid, '3 shallots, thinly sliced', 7),
    (rid, '2 bay leaves', 8),
    (rid, 'Oil for frying', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Fry the tempeh', 'Shallow-fry tempeh strips in hot oil until golden and crispy on both sides, about 2 minutes per side. Remove and drain on paper towels.'),
    (rid, 2, 'Make the sweet glaze', 'In the same pan, remove most of the oil. Sauté shallots, garlic, chilli, and bay leaves until fragrant. Add kecap manis, palm sugar, and tamarind water. Stir until the sugar dissolves and the sauce thickens.'),
    (rid, 3, 'Toss the tempeh', 'Add the fried tempeh back to the pan. Toss to coat every piece in the sticky glaze. Cook for another minute until the glaze clings to the tempeh and turns dark and glossy.'),
    (rid, 4, 'Serve', 'Transfer to a plate and serve as a side dish with steamed rice. This keeps well for a day or two and tastes even better as the flavours soak in.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;

-- 🇮🇩 Indonesia: Es Cendol
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Es Cendol',
    'A refreshing Indonesian cold dessert — green pandan-flavoured rice jelly worms swimming in sweet coconut milk with dark palm sugar syrup poured over shaved ice. The combination of creamy, sweet, and herbaceous is pure tropical bliss.',
    '🍧', NULL,
    'ID', 'Indonesian', '🇮🇩',
    'easy', 25, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '100g rice flour', 1),
    (rid, '1 tsp pandan paste (or juice from 5 pandan leaves)', 2),
    (rid, '400ml coconut milk', 3),
    (rid, '150g palm sugar (gula melaka), chopped', 4),
    (rid, '100ml water (for palm sugar syrup)', 5),
    (rid, 'Pinch of salt', 6),
    (rid, 'Shaved ice', 7);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Make the cendol jelly', 'Mix rice flour with 400ml water and pandan paste. Cook over medium heat, stirring constantly, until the mixture thickens into a paste. Press through a cendol mould or colander into a bowl of ice water. The jelly will form short, worm-like droplets. Drain.'),
    (rid, 2, 'Prepare the palm sugar syrup', 'Dissolve chopped palm sugar in 100ml water over low heat. Stir until the sugar melts and the syrup is smooth and dark. Strain and let cool.'),
    (rid, 3, 'Season the coconut milk', 'Mix coconut milk with a pinch of salt. This should be slightly salty to contrast the sweetness of the palm sugar. Chill in the fridge.'),
    (rid, 4, 'Assemble and serve', 'Fill tall glasses with shaved ice. Add a generous spoon of cendol jelly, pour coconut milk over the ice, and drizzle palm sugar syrup on top. Serve immediately with a spoon and straw.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'ID';
END $$;


-- ════════════════════════════════════════════════════════════
-- 🇸🇬 SINGAPORE
-- ════════════════════════════════════════════════════════════

-- 🇸🇬 Singapore: Hainanese Chicken Rice
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Hainanese Chicken Rice',
    'Singapore''s unofficial national dish. Silky poached chicken served atop fragrant rice cooked in chicken fat and stock, accompanied by three sauces: fiery chilli, ginger-scallion, and dark sweet soy. Deceptively simple — every component demands precision.',
    '🍗', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 75, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 whole chicken (about 1.5 kg)', 1),
    (rid, '2 cups jasmine rice, rinsed', 2),
    (rid, '3 cm piece ginger, sliced', 3),
    (rid, '3 cloves garlic, minced', 4),
    (rid, '2 pandan leaves, knotted', 5),
    (rid, '1 tbsp sesame oil', 6),
    (rid, 'Chicken fat (from cavity) for frying rice', 7),
    (rid, 'Chilli sauce: 8 red chillies, 4 garlic cloves, 2 tbsp lime juice, 2 tbsp chicken broth, salt', 8),
    (rid, 'Ginger sauce: 5 cm ginger, 2 spring onions, 2 tbsp oil, salt', 9),
    (rid, 'Dark soy sauce (kecap manis) for drizzling', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Poach the chicken', 'Rub the chicken with salt and stuff the cavity with ginger and spring onion. Bring a large pot of water to a boil, lower the chicken in breast-side down, and immediately reduce to the gentlest simmer. Poach for 35–40 minutes. The key is barely simmering water — never a rolling boil.'),
    (rid, 2, 'Ice bath the chicken', 'Remove chicken and plunge into an ice bath for 5 minutes. This stops the cooking and gives the skin its characteristic silky, gelatinous texture. Reserve the poaching liquid — this is your stock.'),
    (rid, 3, 'Cook the chicken rice', 'Render chicken fat in a pot. Sauté garlic in the fat until fragrant, add rinsed rice, and stir to coat. Add chicken stock (from poaching), pandan leaves, and a pinch of salt. Cook in a rice cooker or on the stove until fluffy and fragrant.'),
    (rid, 4, 'Prepare the three sauces', 'Chilli sauce: blend red chillies, garlic, lime juice, and chicken broth. Ginger sauce: pound ginger and spring onion, heat oil until smoking, pour over the ginger mix. Dark soy: serve kecap manis in a small bowl.'),
    (rid, 5, 'Chop and serve', 'Chop the chicken into neat pieces through the bone. Mound rice on a plate, arrange chicken alongside, and serve with the three sauces, cucumber slices, and a bowl of the remaining chicken broth with spring onions.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Chilli Crab
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Singapore Chilli Crab',
    'Singapore''s most famous seafood dish — whole mud crab wok-fried in a sweet, savoury, and mildly spicy tomato-egg sauce. Not as fiery as the name suggests — it''s more about the rich, tangy gravy. Mandatory to mop up with fried mantou buns.',
    '🦀', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'hard', 45, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 whole mud crab (about 1 kg), cleaned and quartered', 1),
    (rid, '4 tbsp chilli sauce (sambal or sriracha base)', 2),
    (rid, '3 tbsp tomato ketchup', 3),
    (rid, '2 eggs, lightly beaten', 4),
    (rid, '4 cloves garlic, minced', 5),
    (rid, '3 cm piece ginger, minced', 6),
    (rid, '2 tbsp sugar', 7),
    (rid, '1 tbsp rice vinegar', 8),
    (rid, '1 tbsp cornstarch mixed with 3 tbsp water', 9),
    (rid, 'Fried mantou buns for serving', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Prepare the crab', 'Clean the crab, remove the top shell and gills. Crack the claws with the back of a cleaver to let the sauce penetrate. Quarter the body. Pat dry.'),
    (rid, 2, 'Make the chilli sauce', 'In a wok, heat oil and sauté garlic and ginger until fragrant. Add chilli sauce, tomato ketchup, sugar, rice vinegar, and 100ml water. Stir to combine and bring to a simmer.'),
    (rid, 3, 'Cook the crab', 'Add the crab pieces to the sauce. Toss to coat, then cover and cook for 8–10 minutes, stirring occasionally, until the crab shells turn bright red and the meat is cooked through.'),
    (rid, 4, 'Add egg ribbons', 'Stir in the cornstarch slurry to thicken the sauce. Drizzle beaten egg in a slow stream while stirring gently — this creates the signature silky egg ribbons in the sauce.'),
    (rid, 5, 'Serve', 'Transfer to a large platter and pour all the sauce over the crab. Serve immediately with deep-fried mantou buns for soaking up the gravy. Have plenty of napkins ready.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Laksa
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Laksa',
    'A rich, spicy coconut curry noodle soup — Singapore''s ultimate hawker comfort bowl. Thick rice noodles swimming in a creamy laksa broth made from coconut milk, dried shrimp paste, chilli, and lemongrass, loaded with prawns, fishcake, tofu puffs, and bean sprouts.',
    '🍜', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 50, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '4 tbsp laksa paste (store-bought or homemade)', 1),
    (rid, '400ml coconut milk', 2),
    (rid, '500ml prawn or chicken stock', 3),
    (rid, '300g thick rice noodles (laksa noodles)', 4),
    (rid, '200g prawns, peeled', 5),
    (rid, '100g fishcake, sliced', 6),
    (rid, '6 tofu puffs (tau pok), halved', 7),
    (rid, '1 cup beansprouts', 8),
    (rid, 'Laksa leaves (daun kesum), sambal, and lime for garnish', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Cook the laksa base', 'Heat oil in a large pot. Fry laksa paste over medium heat for 3–4 minutes until very fragrant and the oil turns red. The paste should sizzle and darken slightly.'),
    (rid, 2, 'Build the broth', 'Pour in stock and coconut milk. Stir well and bring to a gentle simmer. Cook for 15 minutes to let the flavours meld. Season with salt and sugar to balance.'),
    (rid, 3, 'Cook the toppings', 'Add prawns, fishcake slices, and tofu puffs to the broth. Simmer for 3–4 minutes until the prawns are pink and curled. Blanch beansprouts separately in boiling water.'),
    (rid, 4, 'Assemble bowls', 'Divide cooked laksa noodles among deep bowls. Ladle the coconut broth over the noodles, making sure each bowl gets prawns, fishcake, and tofu puffs. Top with beansprouts.'),
    (rid, 5, 'Garnish and serve', 'Scatter torn laksa leaves over each bowl, add a squeeze of lime, and serve with sambal on the side. The broth should be rich, creamy, and have a deep orange-red colour.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Char Kway Teow
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Char Kway Teow',
    'The smoky, charred king of Singapore hawker stalls. Flat rice noodles wok-fried at extreme heat with dark soy sauce, egg, Chinese sausage, beansprouts, chives, and cockles. The magic is "wok hei" — the breath of the wok — that no home stove can fully replicate, but you can get close.',
    '🍜', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 15, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '400g fresh flat rice noodles (kway teow)', 1),
    (rid, '1 Chinese sausage (lap cheong), sliced diagonally', 2),
    (rid, '2 eggs', 3),
    (rid, '2 cups beansprouts', 4),
    (rid, '1 bunch garlic chives, cut into 5 cm lengths', 5),
    (rid, '2 tbsp dark soy sauce', 6),
    (rid, '1 tbsp light soy sauce', 7),
    (rid, '1 tbsp fish sauce', 8),
    (rid, '100g blood cockles (optional, or substitute with prawns)', 9),
    (rid, '2 tbsp lard or oil', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Prepare ingredients', 'Have everything within arm''s reach — this dish cooks in under 5 minutes. Loosen the flat rice noodles gently with your hands. Slice the Chinese sausage. Wash beansprouts and chives.'),
    (rid, 2, 'Heat the wok', 'Heat a wok over the highest flame possible until smoking. Add lard or oil and swirl. The wok must be screaming hot for proper wok hei. Fry the Chinese sausage for 30 seconds, then push to one side.'),
    (rid, 3, 'Fry the noodles', 'Add rice noodles and spread them across the wok. Let them sit without moving for 30 seconds to char, then toss. Add dark soy, light soy, and fish sauce. Crack eggs directly onto the noodles and toss to combine.'),
    (rid, 4, 'Add final ingredients', 'Toss in beansprouts, garlic chives, and cockles (or prawns). Stir-fry for 30 seconds — the beansprouts should stay crunchy. Do not overcook.'),
    (rid, 5, 'Serve immediately', 'Slide onto a plate and serve at once. Char kway teow waits for no one — it''s best eaten straight from the wok with a cold drink on the side.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Hokkien Mee
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Hokkien Mee',
    'A beloved Singapore hawker dish — thick yellow egg noodles and thin rice vermicelli wok-fried with prawns, pork, and egg, then braised in a rich prawn stock until the noodles absorb all the umami. Finished with a squeeze of lime and served with sambal on the side.',
    '🍝', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 40, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '200g thick yellow egg noodles', 1),
    (rid, '100g thin rice vermicelli (bee hoon)', 2),
    (rid, '200g prawns, shell on (shells reserved for stock)', 3),
    (rid, '100g pork belly, thinly sliced', 4),
    (rid, '2 eggs', 5),
    (rid, '4 cloves garlic, minced', 6),
    (rid, '300ml prawn stock (made from prawn shells and heads)', 7),
    (rid, '2 tbsp dark soy sauce', 8),
    (rid, 'Sambal, lime wedges, and fried pork lard for serving', 9);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Make the prawn stock', 'Fry prawn shells and heads in oil until red and fragrant. Add 500ml water and simmer for 20 minutes. Strain and discard shells — this stock is the secret to authentic Hokkien mee.'),
    (rid, 2, 'Fry the protein', 'Heat lard or oil in a wok over high heat. Fry pork belly slices until crispy, then add peeled prawns and cook until pink. Push to one side.'),
    (rid, 3, 'Cook noodles and egg', 'Add garlic and fry for 10 seconds. Add both types of noodles and toss with dark soy sauce. Crack eggs over the noodles and stir to combine.'),
    (rid, 4, 'Braise in stock', 'Pour prawn stock over the noodles, cover, and let the noodles absorb the liquid over medium heat for 4–5 minutes. Remove the lid and toss until the noodles are coated in a thick, rich sauce.'),
    (rid, 5, 'Serve', 'Slide onto a plate. Serve with lime wedges, sambal chilli, and crispy pork lard on the side. Squeeze the lime over everything before eating.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Kaya Toast Set
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Kaya Toast Set',
    'Singapore''s quintessential breakfast. Crisp, charcoal-toasted bread spread with kaya (coconut jam) and a slab of cold butter, paired with wobbly soft-boiled eggs seasoned with dark soy sauce and white pepper. Wash it down with a strong kopi. Simple, iconic, and deeply comforting.',
    '🍞', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'easy', 15, 2,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '4 slices white bread (thick-cut Pullman style)', 1),
    (rid, '4 tbsp kaya (coconut jam)', 2),
    (rid, '4 slices cold butter', 3),
    (rid, '4 eggs (for soft-boiling)', 4),
    (rid, 'Dark soy sauce for eggs', 5),
    (rid, 'White pepper for eggs', 6),
    (rid, 'Kopi (Singaporean coffee) or teh to serve', 7);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Toast the bread', 'Toast bread slices until golden and crisp — traditionally over a charcoal grill for that smoky edge, but a regular toaster works fine. The bread should be crispy on the outside.'),
    (rid, 2, 'Spread kaya and butter', 'While the toast is hot, spread a thick layer of kaya on one slice and place a slab of cold butter on top. Sandwich with the other slice. The contrast of warm toast and cold butter is essential.'),
    (rid, 3, 'Soft-boil the eggs', 'Bring water to a boil, turn off the heat, and gently lower eggs into the water. Cover and let sit for exactly 6.5 minutes. The whites should be barely set, the yolks completely runny.'),
    (rid, 4, 'Season the eggs', 'Crack eggs into a small bowl or saucer. Add a splash of dark soy sauce and a few shakes of white pepper. Do not stir — dip the toast into the egg.'),
    (rid, 5, 'Serve the set', 'Serve the kaya toast alongside the soft-boiled eggs and a cup of strong kopi (traditional Singaporean coffee with sweetened condensed milk). This is a complete breakfast.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Bak Kut Teh
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Bak Kut Teh',
    'Teochew-style pork rib soup — a peppery, garlicky clear broth with fall-off-the-bone pork ribs. Unlike the Malaysian herbal version, Singapore''s take is lighter, whiter, and relies on a heavy dose of white pepper and whole garlic bulbs for its punch. Best with a side of you tiao (fried dough sticks) for dipping.',
    '🍖', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 90, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '1 kg pork ribs, cut into individual ribs', 1),
    (rid, '2 whole heads garlic, unpeeled, halved crosswise', 2),
    (rid, '2 tbsp white peppercorns, cracked', 3),
    (rid, '2 tbsp dark soy sauce', 4),
    (rid, '1 tbsp light soy sauce', 5),
    (rid, '1 star anise', 6),
    (rid, '1 small piece cinnamon bark', 7),
    (rid, '1 piece dang gui (angelica root, optional)', 8),
    (rid, 'You tiao (fried dough sticks) for serving', 9),
    (rid, 'Steamed rice and braised peanuts for serving', 10);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Blanch the ribs', 'Bring a pot of water to a boil. Add pork ribs and blanch for 3 minutes to remove impurities. Drain and rinse under cold water. This gives you a clean, clear broth.'),
    (rid, 2, 'Build the broth', 'In a clean pot or clay pot, add blanched ribs, garlic heads, cracked white pepper, star anise, cinnamon, and dang gui. Cover with 2 litres of water. Bring to a boil, then reduce to a gentle simmer.'),
    (rid, 3, 'Simmer until tender', 'Simmer uncovered for 1 to 1.5 hours until the pork is fall-off-the-bone tender. Skim any foam that rises. The broth should be clear and peppery.'),
    (rid, 4, 'Season', 'Add dark soy sauce for colour and light soy sauce for saltiness. Taste and add more white pepper if you want more heat. The broth should be intensely peppery and garlicky.'),
    (rid, 5, 'Serve', 'Ladle ribs and broth into clay pots or deep bowls. Serve with you tiao (fried dough sticks) for dipping, steamed rice, braised peanuts, and a pot of Chinese tea.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;

-- 🇸🇬 Singapore: Roti Prata
DO $$
DECLARE rid uuid;
BEGIN
  INSERT INTO recipes (title, description, emoji, image_url, country_code, country_name, country_flag, difficulty, time_minutes, servings, video_url, video_type, source, author_id)
  VALUES (
    'Roti Prata',
    'Singapore''s favourite late-night supper — flaky, buttery, crispy flatbread stretched tissue-thin and folded into layers before being pan-fried on a hot griddle. Served with a bowl of curry (fish or chicken) for dipping. The flip-and-stretch technique is half the fun.',
    '🫓', NULL,
    'SG', 'Singaporean', '🇸🇬',
    'medium', 60, 4,
    NULL, NULL,
    'curated', '00000000-0000-0000-0000-000000000001'
  ) RETURNING id INTO rid;

  INSERT INTO ingredients (recipe_id, text, sort_order) VALUES
    (rid, '3 cups plain flour', 1),
    (rid, '1 tsp salt', 2),
    (rid, '1 tbsp condensed milk', 3),
    (rid, '1 egg', 4),
    (rid, '¾ cup water', 5),
    (rid, '4 tbsp ghee (plus extra for frying)', 6),
    (rid, 'Curry sauce (fish or chicken) for dipping', 7);

  INSERT INTO recipe_steps (recipe_id, step_number, title, body) VALUES
    (rid, 1, 'Make the dough', 'Mix flour and salt. Add condensed milk, egg, and water. Knead for 10 minutes until smooth and elastic. The dough should be soft and slightly sticky. Divide into 6 balls.'),
    (rid, 2, 'Rest the dough', 'Coat each ball generously with ghee and place in a covered container. Rest for at least 2 hours (or overnight in the fridge). This relaxes the gluten and makes the dough stretchy.'),
    (rid, 3, 'Stretch and fold', 'On a well-oiled surface, flatten a dough ball and stretch it with your hands as thin as possible — you should almost be able to see through it. Fold the edges inward to form a square parcel with multiple layers.'),
    (rid, 4, 'Pan-fry', 'Heat a flat griddle or heavy pan. Add a little ghee and fry the prata for 2 minutes per side until golden, flaky, and crispy. Press down gently with a spatula. Clap the prata between your palms to separate the layers.'),
    (rid, 5, 'Serve', 'Serve hot off the griddle with a bowl of warm curry for dipping. Plain prata is the classic, but you can also add egg, banana, or cheese as fillings before folding.');

  UPDATE countries SET recipe_count = recipe_count + 1 WHERE code = 'SG';
END $$;
