// ============================================================
// ForkIt — Manual Curated Seed: Philippines, Indonesia, Singapore
// Run with: npx tsx scripts/seed-ph-id-sg.ts
// ============================================================

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- Types ----
interface RecipeSeed {
  title: string;
  description: string;
  emoji: string;
  country_code: string;
  country_name: string;
  country_flag: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_minutes: number;
  servings: number;
  ingredients: string[];
  steps: { title: string; body: string }[];
}

// ---- Data ----
const RECIPES: RecipeSeed[] = [
  // ════════════════════════════════════════════════════════════
  // 🇵🇭 PHILIPPINES
  // ════════════════════════════════════════════════════════════
  {
    title: 'Chicken Adobo',
    description:
      "The Philippines' most beloved dish — chicken braised in a bold mix of soy sauce, vinegar, crushed garlic, bay leaves, and black peppercorns until the sauce reduces to a glossy, savoury-tangy glaze. Every Filipino family has their own version.",
    emoji: '🍗',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'easy', time_minutes: 50, servings: 4,
    ingredients: [
      '1 kg chicken thighs and drumsticks',
      '⅓ cup soy sauce',
      '⅓ cup white cane vinegar (sukang maasim)',
      '1 whole head garlic, crushed',
      '3 dried bay leaves',
      '1 tsp whole black peppercorns',
      '2 tbsp cooking oil',
      '1 cup water',
    ],
    steps: [
      { title: 'Marinate the chicken', body: 'Combine chicken pieces with soy sauce, vinegar, crushed garlic, bay leaves, and peppercorns in a large bowl. Marinate for at least 30 minutes, or overnight in the fridge for deeper flavour.' },
      { title: 'Sear the chicken', body: 'Heat oil in a heavy-bottomed pan over medium-high heat. Remove chicken from marinade (reserve the liquid) and sear until golden brown on all sides, about 3 minutes per side.' },
      { title: 'Braise in the sauce', body: 'Pour the reserved marinade and water into the pan. Bring to a boil, then reduce heat to low. Cover and simmer for 30 minutes until chicken is cooked through and tender.' },
      { title: 'Reduce the glaze', body: 'Remove the lid and increase heat to medium. Let the sauce reduce until thick and glossy, basting the chicken occasionally. Taste and adjust with more vinegar if needed.' },
      { title: 'Serve', body: 'Plate the chicken over steamed white rice and spoon the reduced sauce on top. Serve with the braised garlic cloves on the side.' },
    ],
  },
  {
    title: 'Sinigang na Baboy',
    description:
      "A comforting sour soup that's the ultimate Filipino rainy-day food. Pork ribs are simmered in a tart tamarind broth with radish, eggplant, string beans, and water spinach. The sourness is addictive — you'll want seconds.",
    emoji: '🍲',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'medium', time_minutes: 90, servings: 6,
    ingredients: [
      '1 kg pork ribs, cut into serving pieces',
      '1 packet tamarind soup base (sinigang mix)',
      '2 medium tomatoes, quartered',
      '1 large onion, quartered',
      '1 medium daikon radish (labanos), sliced into rounds',
      '1 Asian eggplant, sliced diagonally',
      '1 bunch kangkong (water spinach)',
      '10 pieces string beans (sitaw), cut into 5 cm lengths',
      '2 green chillies (siling haba)',
      'Fish sauce (patis) to taste',
    ],
    steps: [
      { title: 'Boil the pork', body: 'In a large pot, add pork ribs and enough water to cover. Bring to a boil and skim off the scum. Add onion and tomatoes, then simmer for 45 minutes until pork is tender.' },
      { title: 'Add the sour base', body: 'Stir in the tamarind soup base (or fresh tamarind water if using). Adjust sourness to your liking — start with half and add more gradually.' },
      { title: 'Cook the vegetables', body: 'Add radish and string beans first (they take longer). Simmer for 5 minutes, then add eggplant and green chillies. Cook another 3 minutes.' },
      { title: 'Finish with greens', body: "Add kangkong (water spinach) last — it wilts in about 30 seconds. Season with fish sauce to taste. Do not overcook the greens." },
      { title: 'Serve hot', body: 'Ladle into deep bowls and serve immediately with steamed rice. The broth is the star — make sure everyone gets plenty of it.' },
    ],
  },
  {
    title: 'Kare-Kare',
    description:
      'A rich Filipino stew of oxtail and tripe in a thick, golden peanut sauce with banana blossom, eggplant, and string beans. Always served with a side of bagoong (fermented shrimp paste) — the salty kick that makes it unforgettable.',
    emoji: '🥘',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'hard', time_minutes: 120, servings: 6,
    ingredients: [
      '1 kg oxtail, cut into 5 cm pieces',
      '250g beef tripe, cleaned and sliced',
      '½ cup ground roasted peanuts or peanut butter',
      '¼ cup toasted rice flour (for thickening)',
      '2 tbsp annatto seeds soaked in ½ cup water (for colour)',
      '1 banana blossom, sliced and soaked in lemon water',
      '2 Asian eggplants, sliced',
      '1 bunch string beans (sitaw), cut into 5 cm lengths',
      '1 onion, diced',
      'Bagoong (shrimp paste) for serving',
    ],
    steps: [
      { title: 'Boil the meat', body: 'Place oxtail and tripe in a large pot with water to cover. Bring to a boil, skim the scum, then simmer for 2 hours until very tender. Reserve the broth.' },
      { title: 'Make the peanut sauce', body: 'In a separate pan, sauté onion and garlic. Add annatto water for colour. Stir in ground peanuts and toasted rice flour. Gradually add 3–4 cups of the reserved broth, stirring constantly until smooth and thick.' },
      { title: 'Combine meat and sauce', body: 'Add the tender oxtail and tripe to the peanut sauce. Simmer together for 10 minutes so the meat absorbs the flavour.' },
      { title: 'Cook the vegetables', body: 'Blanch string beans, eggplant, and banana blossom separately in salted water until just tender. Arrange around the stew when serving.' },
      { title: 'Serve with bagoong', body: 'Ladle into a large serving bowl, arrange vegetables around the edge, and serve with a generous side of sautéed bagoong (shrimp paste) and steamed rice.' },
    ],
  },
  {
    title: 'Lechon Kawali',
    description:
      "Crispy deep-fried pork belly — the home version of the Philippines' famous whole roast pig. Boiled until tender, dried until the skin crackles, then deep-fried to golden perfection. Served with a tangy liver sauce or spiced vinegar dip.",
    emoji: '🐖',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'medium', time_minutes: 90, servings: 4,
    ingredients: [
      '1 kg pork belly, skin on',
      '3 dried bay leaves',
      '1 tbsp whole black peppercorns',
      '1 tbsp salt',
      '1 whole head garlic, halved',
      'Oil for deep frying',
      'Lechon sauce (liver sauce) or spiced vinegar for dipping',
    ],
    steps: [
      { title: 'Boil the pork belly', body: 'Place pork belly in a pot with bay leaves, peppercorns, salt, garlic, and enough water to cover. Bring to a boil, then simmer for 45–60 minutes until fork-tender. Do not overcook or it will fall apart.' },
      { title: 'Dry thoroughly', body: 'Remove the pork from the broth and pat completely dry with paper towels. Place uncovered in the fridge for at least 1 hour — the drier the skin, the crispier the result.' },
      { title: 'Deep fry', body: 'Heat oil to 180°C (350°F) in a deep pan or wok. Carefully lower the pork belly skin-side down. Fry for 10–12 minutes, turning occasionally, until the skin is blistered and deeply golden. Use a splatter guard — it will pop.' },
      { title: 'Rest and chop', body: 'Let the pork rest on a wire rack for 5 minutes, then chop into bite-sized pieces with a sharp cleaver.' },
      { title: 'Serve', body: 'Arrange on a platter and serve immediately with lechon sauce (liver-based dip) or a bowl of spiced vinegar with soy sauce, onion, and chilli.' },
    ],
  },
  {
    title: 'Pancit Canton',
    description:
      'The birthday noodle dish of the Philippines — stir-fried wheat noodles tossed with pork, shrimp, and colourful vegetables in a savoury soy-oyster sauce. Long noodles symbolise long life, making this a celebration essential.',
    emoji: '🍜',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'easy', time_minutes: 25, servings: 4,
    ingredients: [
      '250g dried canton (wheat) noodles',
      '150g pork belly, thinly sliced',
      '150g shrimp, peeled and deveined',
      '2 cups shredded cabbage',
      '1 carrot, julienned',
      '3 tbsp soy sauce',
      '2 tbsp oyster sauce',
      '3 cloves garlic, minced',
      '2 tbsp cooking oil',
      'Calamansi halves for serving',
    ],
    steps: [
      { title: 'Prepare the noodles', body: 'Cook canton noodles in boiling water for 1 minute less than packet instructions. Drain and toss with a little oil to prevent sticking. Set aside.' },
      { title: 'Cook the protein', body: 'Heat oil in a large wok over high heat. Sear pork slices until browned, then add shrimp and cook until pink. Remove and set aside.' },
      { title: 'Stir-fry the vegetables', body: 'In the same wok, sauté garlic until fragrant. Add carrots and stir-fry for 2 minutes, then add cabbage and cook for 1 more minute. Vegetables should stay crisp.' },
      { title: 'Toss everything together', body: 'Return protein to the wok. Add noodles, soy sauce, and oyster sauce. Toss vigorously over high heat for 2 minutes until the noodles are evenly coated and slightly charred.' },
      { title: 'Serve', body: 'Transfer to a large platter, squeeze calamansi over the top, and serve immediately. Best eaten family-style, straight from the plate.' },
    ],
  },
  {
    title: 'Lumpia Shanghai',
    description:
      'Crispy deep-fried pork and shrimp spring rolls — the Filipino party appetiser that vanishes from the table in minutes. Thin, shattering wrappers around a savoury filling, served with a sweet chilli dipping sauce.',
    emoji: '🥟',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'medium', time_minutes: 45, servings: 6,
    ingredients: [
      '500g ground pork',
      '100g raw shrimp, peeled and finely chopped',
      '1 small carrot, finely grated',
      '1 small onion, finely diced',
      '3 cloves garlic, minced',
      '1 egg, beaten',
      '1 tbsp soy sauce',
      '1 pack spring roll (lumpia) wrappers',
      'Oil for deep frying',
      'Sweet chilli sauce for dipping',
    ],
    steps: [
      { title: 'Mix the filling', body: 'Combine ground pork, chopped shrimp, carrot, onion, garlic, egg, and soy sauce in a bowl. Mix thoroughly with your hands until everything is well combined. Season with pepper.' },
      { title: 'Wrap the lumpia', body: "Place a tablespoon of filling along the edge of a lumpia wrapper. Roll tightly, tucking in the sides like a small cigar. Seal the edge with a dab of beaten egg. Keep them thin — about finger-width." },
      { title: 'Deep fry', body: "Heat oil to 170°C (340°F). Fry lumpia in batches, turning occasionally, for 4–5 minutes until golden brown and crispy. Don't overcrowd the pan or the oil temperature will drop." },
      { title: 'Drain and serve', body: "Cut each roll in half diagonally and arrange on a platter with sweet chilli dipping sauce. Serve hot — these don't wait well." },
    ],
  },
  {
    title: 'Arroz Caldo',
    description:
      "Filipino chicken rice porridge — the ultimate comfort food when you're under the weather or just craving warmth. Ginger-infused, silky congee topped with fried garlic, boiled egg, spring onions, and a squeeze of calamansi.",
    emoji: '🥣',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'easy', time_minutes: 45, servings: 4,
    ingredients: [
      '500g chicken thighs, bone-in',
      '1 cup jasmine rice, rinsed',
      '5 cm piece ginger, sliced into matchsticks',
      '4 cloves garlic (2 minced, 2 sliced for frying)',
      '1 onion, diced',
      '6 cups chicken stock or water',
      '2 tbsp fish sauce (patis)',
      '½ tsp turmeric or safflower',
      'Toppings: boiled egg, fried garlic, green onions, calamansi',
    ],
    steps: [
      { title: 'Sauté aromatics', body: 'In a large pot, heat oil and sauté onion, minced garlic, and ginger until fragrant, about 2 minutes. Add chicken pieces and sear on both sides.' },
      { title: 'Cook the rice porridge', body: 'Add rice, stock, turmeric, and fish sauce. Bring to a boil, then reduce to a simmer. Cook for 30 minutes, stirring occasionally to prevent sticking, until the rice breaks down into a thick porridge.' },
      { title: 'Shred the chicken', body: 'Remove chicken, shred the meat off the bone, and return to the pot. Discard bones. Stir through and adjust seasoning — it should be savoury and gingery.' },
      { title: 'Fry the garlic topping', body: 'In a small pan, fry sliced garlic in oil over low heat until golden and crispy. Remove immediately — it burns fast.' },
      { title: 'Serve', body: 'Ladle into bowls and top with fried garlic, sliced boiled egg, chopped spring onions, and a squeeze of calamansi. Serve piping hot.' },
    ],
  },
  {
    title: 'Tinola',
    description:
      'A light, ginger-forward chicken soup with green papaya wedges and chilli leaves (or moringa). Clean, nourishing, and deeply flavoured from a simple base of sautéed ginger, onion, and garlic. A staple Filipino home-cooked meal.',
    emoji: '🍲',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'easy', time_minutes: 40, servings: 4,
    ingredients: [
      '1 kg chicken, cut into serving pieces',
      '1 medium green papaya, peeled and cut into wedges',
      '2 cups chilli leaves or moringa (malunggay) leaves',
      '5 cm piece ginger, cut into strips',
      '1 onion, sliced',
      '3 cloves garlic, crushed',
      '2 tbsp fish sauce (patis)',
      '6 cups water',
    ],
    steps: [
      { title: 'Sauté aromatics', body: 'Heat oil in a pot over medium heat. Sauté ginger, onion, and garlic until the ginger is fragrant and the onion is soft, about 2 minutes.' },
      { title: 'Cook the chicken', body: 'Add chicken pieces and cook, stirring occasionally, until the meat turns white on the outside. Pour in water and fish sauce. Bring to a boil, then simmer for 20 minutes.' },
      { title: 'Add green papaya', body: 'Add papaya wedges and cook for 8–10 minutes until the papaya is tender but not mushy. It should hold its shape.' },
      { title: 'Finish with greens', body: 'Turn off the heat, add chilli leaves or moringa, and cover for 1 minute. The residual heat will wilt the leaves. Season with more fish sauce if needed.' },
      { title: 'Serve', body: 'Ladle into bowls — each serving should get chicken, papaya, greens, and plenty of the ginger broth. Serve with steamed rice.' },
    ],
  },
  {
    title: 'Bistek Tagalog',
    description:
      'Filipino beef steak — thin-sliced sirloin marinated in soy sauce and calamansi juice, pan-fried until caramelised, and topped with golden onion rings. Simple, punchy, and deeply savoury. A weeknight staple across Filipino households.',
    emoji: '🥩',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'medium', time_minutes: 35, servings: 4,
    ingredients: [
      '500g beef sirloin, thinly sliced',
      '3 large onions, sliced into rings',
      '¼ cup soy sauce',
      '3 tbsp calamansi juice (or lemon juice)',
      '4 cloves garlic, minced',
      '½ tsp freshly ground black pepper',
      '2 tbsp cooking oil',
    ],
    steps: [
      { title: 'Marinate the beef', body: 'Combine beef slices with soy sauce, calamansi juice, garlic, and black pepper. Toss to coat and marinate for at least 30 minutes. Reserve the marinade when draining.' },
      { title: 'Caramelise the onion rings', body: 'Heat oil in a wide pan over medium heat. Fry onion rings until soft and golden brown, about 5 minutes. Remove and set aside — these go on top at the end.' },
      { title: 'Pan-fry the beef', body: 'In the same pan over high heat, sear the marinated beef slices in a single layer. Cook 2 minutes per side until nicely browned. Work in batches to avoid steaming.' },
      { title: 'Deglaze and simmer', body: 'Pour the reserved marinade into the pan with all the beef. Simmer for 3–4 minutes until the sauce thickens slightly and coats the meat.' },
      { title: 'Serve', body: 'Arrange beef on a plate, pour the reduced sauce over, and pile the caramelised onion rings on top. Serve immediately with steamed rice.' },
    ],
  },
  {
    title: 'Halo-Halo',
    description:
      'The ultimate Filipino shaved ice dessert — "mix-mix" in Tagalog. Layers of sweetened beans, jellies, and fruits are piled with finely shaved ice, drizzled with evaporated milk, then crowned with leche flan and ube (purple yam) ice cream. A riot of colour, texture, and sweetness.',
    emoji: '🍧',
    country_code: 'PH', country_name: 'Filipino', country_flag: '🇵🇭',
    difficulty: 'easy', time_minutes: 20, servings: 4,
    ingredients: [
      'Finely shaved ice',
      '¼ cup sweetened red mung beans',
      '¼ cup sweetened kidney beans (red)',
      '¼ cup nata de coco',
      '¼ cup kaong (sugar palm fruit)',
      '¼ cup macapuno (coconut sport) strings',
      '4 slices leche flan',
      '4 scoops ube (purple yam) ice cream',
      'Evaporated milk for drizzling',
    ],
    steps: [
      { title: 'Layer the base', body: 'In each tall glass, spoon 2 tablespoons each of sweetened beans, nata de coco, kaong, and macapuno strings. These form the sweet, chewy base.' },
      { title: 'Pile the shaved ice', body: 'Pack finely shaved ice on top of the bean layer, mounding it high above the rim of the glass. The finer the ice, the better the texture.' },
      { title: 'Add toppings', body: 'Place a slice of leche flan on the ice and a generous scoop of ube ice cream. The purple and gold on white is the iconic look.' },
      { title: 'Drizzle and serve', body: 'Pour evaporated milk generously over the ice. Serve immediately with a long spoon. Mix everything together before eating — that\'s the whole point of "halo-halo".' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 🇮🇩 INDONESIA
  // ════════════════════════════════════════════════════════════
  {
    title: 'Nasi Goreng',
    description:
      "Indonesia's national dish and the king of fried rice. Day-old rice is wok-fried with kecap manis (sweet soy sauce), shrimp paste, chilli, and garlic, then topped with a fried egg, crispy shallots, and prawn crackers. Sweet, smoky, and utterly addictive.",
    emoji: '🍳',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'easy', time_minutes: 20, servings: 2,
    ingredients: [
      '3 cups day-old cooked rice (cold)',
      '3 tbsp kecap manis (sweet soy sauce)',
      '2 eggs',
      '3 shallots, thinly sliced',
      '3 cloves garlic, minced',
      '2 red chillies, sliced (or 1 tsp sambal)',
      '½ tsp terasi (shrimp paste)',
      '150g chicken breast or prawns, diced',
      'Crispy fried shallots and cucumber slices for topping',
    ],
    steps: [
      { title: 'Prepare the wok', body: 'Heat a wok or large frying pan over high heat until smoking. Add oil and swirl to coat. The wok must be very hot for proper wok hei (charred flavour).' },
      { title: 'Fry aromatics and protein', body: 'Add shallots, garlic, chilli, and shrimp paste. Stir-fry for 30 seconds until fragrant. Add diced chicken or prawns and cook until just done.' },
      { title: 'Add rice and kecap manis', body: 'Break up the cold rice and add it to the wok. Pour in kecap manis and toss vigorously for 2–3 minutes, pressing the rice against the wok to get colour and char.' },
      { title: 'Fry the egg', body: "Push rice to one side, crack an egg into the cleared space, and fry until the white is set but the yolk is still runny. Alternatively, fry eggs separately sunny-side up." },
      { title: 'Plate and serve', body: 'Mound the fried rice on a plate, top with the fried egg, scatter crispy shallots, and serve with cucumber slices, prawn crackers, and sambal on the side.' },
    ],
  },
  {
    title: 'Beef Rendang',
    description:
      "Widely regarded as one of the world's most delicious dishes. Beef chunks are slow-cooked in a rich coconut milk curry packed with lemongrass, galangal, chilli, and turmeric until the sauce reduces completely and the meat becomes dark, dry, and intensely flavoured. A Minangkabau masterpiece from West Sumatra.",
    emoji: '🥩',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'hard', time_minutes: 120, servings: 6,
    ingredients: [
      '1 kg beef chuck, cut into 4 cm cubes',
      '400ml coconut milk',
      '200ml coconut cream',
      '2 stalks lemongrass, bruised',
      '4 cm piece galangal, sliced',
      '4 kaffir lime leaves',
      '2 turmeric leaves (or 1 tsp ground turmeric)',
      '3 tbsp kerisik (toasted grated coconut)',
      'Spice paste: 10 dried chillies, 8 shallots, 5 garlic cloves, 3 cm ginger, 3 cm turmeric — blended',
    ],
    steps: [
      { title: 'Cook the spice paste', body: 'Blend all spice paste ingredients into a smooth paste. In a large heavy-bottomed pot or wok, cook the paste over medium heat for 8–10 minutes, stirring constantly, until fragrant and the oil separates.' },
      { title: 'Simmer in coconut milk', body: 'Add coconut milk, coconut cream, lemongrass, galangal, and kaffir lime leaves. Bring to a gentle boil. Add the beef cubes and stir to coat. Reduce heat and simmer uncovered.' },
      { title: 'Slow cook until dry', body: 'Cook for 2–3 hours, stirring every 15 minutes to prevent sticking. The liquid will gradually reduce. As it thickens, stir more frequently. The rendang is ready when the sauce has been completely absorbed and the meat is dark and coated in a thick, dry spice paste.' },
      { title: 'Toast the rendang', body: 'In the final stage, reduce heat to low and stir in kerisik (toasted coconut). Keep stirring until the meat is richly caramelised and almost dry. The colour should be deep brown.' },
      { title: 'Serve', body: 'Serve warm with steamed rice, ketupat (compressed rice cakes), or lemang (glutinous rice in bamboo). Rendang tastes even better the next day as the flavours intensify.' },
    ],
  },
  {
    title: 'Gado-Gado',
    description:
      "Indonesia's famous salad — blanched vegetables, fried tofu, tempeh, and boiled egg drizzled with a rich, spicy peanut sauce dressing. Crunchy, creamy, sweet, and savoury all at once. The peanut sauce is the soul of this dish.",
    emoji: '🥗',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'easy', time_minutes: 30, servings: 4,
    ingredients: [
      '200g cabbage, shredded and blanched',
      '200g beansprouts, blanched',
      '150g long beans, cut and blanched',
      '200g firm tofu, fried and cubed',
      '100g tempeh, fried and sliced',
      '4 boiled eggs, halved',
      'Peanut sauce: 200g roasted peanuts, 3 cloves garlic, 4 red chillies, 2 tbsp kecap manis, 1 tbsp tamarind paste, 200ml warm water',
      'Fried shallots and prawn crackers for topping',
    ],
    steps: [
      { title: 'Blanch the vegetables', body: 'Bring a large pot of salted water to a boil. Blanch cabbage, beansprouts, and long beans separately for 1–2 minutes each until just tender-crisp. Drain and arrange on a platter.' },
      { title: 'Fry the tofu and tempeh', body: 'Deep-fry tofu and tempeh slices in hot oil until golden and crispy. Drain on paper towels, then cut into bite-sized pieces.' },
      { title: 'Make the peanut sauce', body: 'Pound or blend peanuts, garlic, and chillies into a rough paste. Mix with kecap manis, tamarind paste, and warm water. Stir until smooth — the sauce should be thick but pourable. Adjust sweetness and spice to taste.' },
      { title: 'Assemble and serve', body: 'Arrange blanched vegetables, fried tofu, tempeh, and boiled egg halves on a plate. Pour the peanut sauce generously over everything. Top with fried shallots and serve with prawn crackers.' },
    ],
  },
  {
    title: 'Sate Ayam',
    description:
      "Indonesia's iconic street food — tender chunks of chicken marinated in turmeric and spices, threaded onto bamboo skewers, grilled over charcoal, and served with a rich, creamy peanut dipping sauce and lontong (compressed rice cake).",
    emoji: '🍢',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'medium', time_minutes: 40, servings: 4,
    ingredients: [
      '600g chicken thigh, cut into 2 cm cubes',
      '1 tsp ground turmeric',
      '1 tsp ground coriander',
      '1 tbsp kecap manis',
      '1 stalk lemongrass, finely sliced',
      '2 cloves garlic, minced',
      'Peanut sauce: 150g roasted peanuts, 2 red chillies, 2 shallots, 1 tbsp kecap manis, 100ml warm water',
      '20 bamboo skewers, soaked in water',
    ],
    steps: [
      { title: 'Marinate the chicken', body: 'Combine chicken cubes with turmeric, coriander, kecap manis, lemongrass, and garlic. Mix well and marinate for at least 30 minutes, or up to overnight in the fridge.' },
      { title: 'Thread onto skewers', body: 'Thread 4–5 pieces of chicken onto each soaked bamboo skewer, pressing them together tightly. This helps them cook evenly and stay juicy.' },
      { title: 'Make the peanut sauce', body: 'Pound or blend peanuts, chillies, and shallots into a chunky paste. Mix with kecap manis and warm water until you get a thick, creamy dipping sauce.' },
      { title: 'Grill the satay', body: 'Grill skewers over high heat on a charcoal grill, BBQ, or grill pan for 3–4 minutes per side, basting with a little oil. The edges should be nicely charred.' },
      { title: 'Serve', body: 'Arrange skewers on a plate with a bowl of peanut sauce, sliced cucumber, red onion, and lontong (compressed rice cake) on the side.' },
    ],
  },
  {
    title: 'Mie Goreng',
    description:
      "Indonesian stir-fried noodles — egg noodles wok-tossed with kecap manis, garlic, chilli, cabbage, and a fried egg on top. Sweet, savoury, smoky, and ready in under 20 minutes. The street food version of instant noodles, but a hundred times better.",
    emoji: '🍜',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'easy', time_minutes: 20, servings: 2,
    ingredients: [
      '200g fresh egg noodles (or instant mie goreng noodles)',
      '2 tbsp kecap manis',
      '1 tbsp soy sauce',
      '2 eggs',
      '2 cups shredded cabbage or bok choy',
      '3 shallots, thinly sliced',
      '3 cloves garlic, minced',
      '1 red chilli, sliced',
      'Fried shallots, lime wedge, and sambal for serving',
    ],
    steps: [
      { title: 'Cook the noodles', body: 'Boil noodles according to packet instructions until just al dente. Drain and set aside. If using instant noodles, discard the seasoning packet.' },
      { title: 'Stir-fry aromatics', body: 'Heat oil in a wok over high heat. Fry shallots, garlic, and chilli for 30 seconds until fragrant. Add cabbage and stir-fry for 1 minute.' },
      { title: 'Toss the noodles', body: "Add noodles, kecap manis, and soy sauce to the wok. Toss vigorously over high heat for 2 minutes. Push to one side, crack an egg into the space, scramble, then fold through the noodles." },
      { title: 'Serve', body: 'Plate the noodles, top with a fried egg, fried shallots, and a wedge of lime. Serve with sambal on the side for extra heat.' },
    ],
  },
  {
    title: 'Bakso Sapi',
    description:
      "Indonesia's beloved beef meatball soup — springy, bouncy meatballs made with beef and tapioca starch, served in a clear, savoury broth with egg noodles, fried shallots, and a kick of sambal and kecap manis on the side.",
    emoji: '🍲',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'medium', time_minutes: 60, servings: 4,
    ingredients: [
      '500g ground beef (lean)',
      '100g tapioca starch',
      '4 cloves garlic, minced',
      '1 egg white',
      '1 tsp salt',
      '½ tsp white pepper',
      '1.5 litres beef broth',
      '200g egg noodles',
      'Fried shallots, celery leaves, sambal, and kecap manis for serving',
    ],
    steps: [
      { title: 'Make the meatball mixture', body: 'Blend ground beef, garlic, egg white, salt, and white pepper in a food processor until very smooth and paste-like. Add tapioca starch and pulse until a springy dough forms.' },
      { title: 'Form meatballs', body: 'With wet hands, form the mixture into golf ball-sized spheres. You should get about 16–20 meatballs. Keep hands wet to prevent sticking.' },
      { title: 'Boil the meatballs', body: 'Bring a pot of water to a gentle simmer (not a rolling boil). Drop meatballs in and cook for 8–10 minutes until they float to the surface and feel firm. Remove with a slotted spoon.' },
      { title: 'Prepare the broth', body: 'Heat beef broth in a separate pot. Season with a little soy sauce and white pepper. Cook egg noodles according to packet instructions and divide among serving bowls.' },
      { title: 'Assemble and serve', body: 'Place meatballs over the noodles, ladle hot broth over everything, and top with fried shallots and celery leaves. Serve with sambal and kecap manis on the side.' },
    ],
  },
  {
    title: 'Soto Ayam',
    description:
      "A golden, turmeric-spiced chicken soup that's Indonesia's answer to chicken noodle soup. Fragrant broth infused with lemongrass, galangal, and kaffir lime leaves, served over vermicelli with shredded chicken, boiled egg, and crispy fried shallots.",
    emoji: '🍲',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'medium', time_minutes: 60, servings: 4,
    ingredients: [
      '500g chicken thighs, bone-in',
      '1 litre water',
      '1 stalk lemongrass, bruised',
      '3 cm piece galangal, sliced',
      '3 kaffir lime leaves',
      '1 tsp ground turmeric',
      'Spice paste: 5 shallots, 4 garlic cloves, 3 cm ginger, 3 candlenuts — blended',
      '100g rice vermicelli, cooked',
      '4 boiled eggs, halved',
      'Fried shallots, celery, lime wedges, and sambal for serving',
    ],
    steps: [
      { title: 'Poach the chicken', body: 'Place chicken thighs in a pot with water, lemongrass, galangal, and kaffir lime leaves. Bring to a boil, then simmer for 25 minutes until chicken is cooked through. Remove chicken and shred the meat.' },
      { title: 'Build the broth', body: 'Strain the poaching liquid. In the same pot, sauté the blended spice paste with a little oil until fragrant, about 3 minutes. Add turmeric and stir. Pour in the strained broth and simmer for 15 minutes.' },
      { title: 'Season the broth', body: 'Season with salt and a splash of kecap manis. The broth should be golden, fragrant, and well-seasoned. Taste and adjust.' },
      { title: 'Assemble bowls', body: 'Divide vermicelli noodles among serving bowls. Top with shredded chicken and halved boiled eggs. Ladle the hot broth over everything.' },
      { title: 'Garnish and serve', body: 'Top each bowl with fried shallots, chopped celery, and a lime wedge. Serve with sambal on the side for those who want extra heat.' },
    ],
  },
  {
    title: 'Opor Ayam',
    description:
      'A fragrant, creamy coconut milk chicken curry traditionally served during Lebaran (Eid al-Fitr). Chicken pieces are braised gently in a mild, aromatic coconut gravy spiced with coriander, cumin, lemongrass, and galangal. Rich but never heavy.',
    emoji: '🍛',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'medium', time_minutes: 60, servings: 4,
    ingredients: [
      '1 kg chicken, cut into serving pieces',
      '400ml coconut milk',
      '200ml coconut cream',
      '2 stalks lemongrass, bruised',
      '3 cm piece galangal, sliced',
      '3 bay leaves (salam leaves if available)',
      '3 kaffir lime leaves',
      'Spice paste: 8 shallots, 4 garlic cloves, 3 candlenuts, 2 tsp coriander, 1 tsp cumin — blended',
    ],
    steps: [
      { title: 'Cook the spice paste', body: 'Heat a little oil in a large pot over medium heat. Sauté the blended spice paste for 5 minutes until fragrant and the raw smell disappears. Add lemongrass, galangal, bay leaves, and kaffir lime leaves.' },
      { title: 'Add coconut milk and chicken', body: 'Pour in coconut milk and bring to a gentle simmer. Add chicken pieces and stir to coat. Simmer uncovered for 30 minutes, stirring occasionally, until the chicken is cooked through.' },
      { title: 'Enrich with coconut cream', body: 'Stir in coconut cream and continue simmering for another 10 minutes. The sauce should be creamy, thick, and rich. Do not let it boil vigorously or the coconut milk may split.' },
      { title: 'Season and serve', body: 'Season with salt and a pinch of sugar to balance the flavours. Serve warm with ketupat (compressed rice cake) or steamed rice.' },
    ],
  },
  {
    title: 'Tempe Orek',
    description:
      'Sweet, sticky, and slightly spicy fried tempeh — a beloved Indonesian side dish. Thin slices of tempeh are fried until golden, then tossed in a caramelised glaze of kecap manis, palm sugar, chilli, and tamarind. Cheap, addictive, and packed with protein.',
    emoji: '🫘',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'easy', time_minutes: 15, servings: 4,
    ingredients: [
      '300g tempeh, sliced into thin strips',
      '3 tbsp kecap manis',
      '1 tbsp palm sugar (gula jawa) or brown sugar',
      '1 tbsp tamarind paste mixed with 2 tbsp water',
      '3 red chillies, sliced diagonally',
      '4 cloves garlic, thinly sliced',
      '3 shallots, thinly sliced',
      '2 bay leaves',
      'Oil for frying',
    ],
    steps: [
      { title: 'Fry the tempeh', body: 'Shallow-fry tempeh strips in hot oil until golden and crispy on both sides, about 2 minutes per side. Remove and drain on paper towels.' },
      { title: 'Make the sweet glaze', body: 'In the same pan, remove most of the oil. Sauté shallots, garlic, chilli, and bay leaves until fragrant. Add kecap manis, palm sugar, and tamarind water. Stir until the sugar dissolves and the sauce thickens.' },
      { title: 'Toss the tempeh', body: 'Add the fried tempeh back to the pan. Toss to coat every piece in the sticky glaze. Cook for another minute until the glaze clings to the tempeh and turns dark and glossy.' },
      { title: 'Serve', body: 'Transfer to a plate and serve as a side dish with steamed rice. This keeps well for a day or two and tastes even better as the flavours soak in.' },
    ],
  },
  {
    title: 'Es Cendol',
    description:
      'A refreshing Indonesian cold dessert — green pandan-flavoured rice jelly worms swimming in sweet coconut milk with dark palm sugar syrup poured over shaved ice. The combination of creamy, sweet, and herbaceous is pure tropical bliss.',
    emoji: '🍧',
    country_code: 'ID', country_name: 'Indonesian', country_flag: '🇮🇩',
    difficulty: 'easy', time_minutes: 25, servings: 4,
    ingredients: [
      '100g rice flour',
      '1 tsp pandan paste (or juice from 5 pandan leaves)',
      '400ml coconut milk',
      '150g palm sugar (gula melaka), chopped',
      '100ml water (for palm sugar syrup)',
      'Pinch of salt',
      'Shaved ice',
    ],
    steps: [
      { title: 'Make the cendol jelly', body: 'Mix rice flour with 400ml water and pandan paste. Cook over medium heat, stirring constantly, until the mixture thickens into a paste. Press through a cendol mould or colander into a bowl of ice water. The jelly will form short, worm-like droplets. Drain.' },
      { title: 'Prepare the palm sugar syrup', body: 'Dissolve chopped palm sugar in 100ml water over low heat. Stir until the sugar melts and the syrup is smooth and dark. Strain and let cool.' },
      { title: 'Season the coconut milk', body: 'Mix coconut milk with a pinch of salt. This should be slightly salty to contrast the sweetness of the palm sugar. Chill in the fridge.' },
      { title: 'Assemble and serve', body: 'Fill tall glasses with shaved ice. Add a generous spoon of cendol jelly, pour coconut milk over the ice, and drizzle palm sugar syrup on top. Serve immediately with a spoon and straw.' },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 🇸🇬 SINGAPORE
  // ════════════════════════════════════════════════════════════
  {
    title: 'Hainanese Chicken Rice',
    description:
      "Singapore's unofficial national dish. Silky poached chicken served atop fragrant rice cooked in chicken fat and stock, accompanied by three sauces: fiery chilli, ginger-scallion, and dark sweet soy. Deceptively simple — every component demands precision.",
    emoji: '🍗',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 75, servings: 4,
    ingredients: [
      '1 whole chicken (about 1.5 kg)',
      '2 cups jasmine rice, rinsed',
      '3 cm piece ginger, sliced',
      '3 cloves garlic, minced',
      '2 pandan leaves, knotted',
      '1 tbsp sesame oil',
      'Chicken fat (from cavity) for frying rice',
      'Chilli sauce: 8 red chillies, 4 garlic cloves, 2 tbsp lime juice, 2 tbsp chicken broth, salt',
      'Ginger sauce: 5 cm ginger, 2 spring onions, 2 tbsp oil, salt',
      'Dark soy sauce (kecap manis) for drizzling',
    ],
    steps: [
      { title: 'Poach the chicken', body: 'Rub the chicken with salt and stuff the cavity with ginger and spring onion. Bring a large pot of water to a boil, lower the chicken in breast-side down, and immediately reduce to the gentlest simmer. Poach for 35–40 minutes.' },
      { title: 'Ice bath the chicken', body: 'Remove chicken and plunge into an ice bath for 5 minutes. This stops the cooking and gives the skin its characteristic silky, gelatinous texture. Reserve the poaching liquid as stock.' },
      { title: 'Cook the chicken rice', body: 'Render chicken fat in a pot. Sauté garlic in the fat until fragrant, add rinsed rice, and stir to coat. Add chicken stock (from poaching), pandan leaves, and a pinch of salt. Cook until fluffy and fragrant.' },
      { title: 'Prepare the three sauces', body: 'Chilli sauce: blend red chillies, garlic, lime juice, and chicken broth. Ginger sauce: pound ginger and spring onion, heat oil until smoking, pour over the ginger mix. Dark soy: serve kecap manis in a small bowl.' },
      { title: 'Chop and serve', body: 'Chop the chicken into neat pieces through the bone. Mound rice on a plate, arrange chicken alongside, and serve with the three sauces, cucumber slices, and a bowl of the remaining chicken broth with spring onions.' },
    ],
  },
  {
    title: 'Singapore Chilli Crab',
    description:
      "Singapore's most famous seafood dish — whole mud crab wok-fried in a sweet, savoury, and mildly spicy tomato-egg sauce. Not as fiery as the name suggests — it's more about the rich, tangy gravy. Mandatory to mop up with fried mantou buns.",
    emoji: '🦀',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'hard', time_minutes: 45, servings: 2,
    ingredients: [
      '1 whole mud crab (about 1 kg), cleaned and quartered',
      '4 tbsp chilli sauce (sambal or sriracha base)',
      '3 tbsp tomato ketchup',
      '2 eggs, lightly beaten',
      '4 cloves garlic, minced',
      '3 cm piece ginger, minced',
      '2 tbsp sugar',
      '1 tbsp rice vinegar',
      '1 tbsp cornstarch mixed with 3 tbsp water',
      'Fried mantou buns for serving',
    ],
    steps: [
      { title: 'Prepare the crab', body: 'Clean the crab, remove the top shell and gills. Crack the claws with the back of a cleaver to let the sauce penetrate. Quarter the body. Pat dry.' },
      { title: 'Make the chilli sauce', body: 'In a wok, heat oil and sauté garlic and ginger until fragrant. Add chilli sauce, tomato ketchup, sugar, rice vinegar, and 100ml water. Stir to combine and bring to a simmer.' },
      { title: 'Cook the crab', body: 'Add the crab pieces to the sauce. Toss to coat, then cover and cook for 8–10 minutes, stirring occasionally, until the crab shells turn bright red and the meat is cooked through.' },
      { title: 'Add egg ribbons', body: 'Stir in the cornstarch slurry to thicken the sauce. Drizzle beaten egg in a slow stream while stirring gently — this creates the signature silky egg ribbons in the sauce.' },
      { title: 'Serve', body: 'Transfer to a large platter and pour all the sauce over the crab. Serve immediately with deep-fried mantou buns for soaking up the gravy. Have plenty of napkins ready.' },
    ],
  },
  {
    title: 'Laksa',
    description:
      "A rich, spicy coconut curry noodle soup — Singapore's ultimate hawker comfort bowl. Thick rice noodles swimming in a creamy laksa broth made from coconut milk, dried shrimp paste, chilli, and lemongrass, loaded with prawns, fishcake, tofu puffs, and bean sprouts.",
    emoji: '🍜',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 50, servings: 4,
    ingredients: [
      '4 tbsp laksa paste (store-bought or homemade)',
      '400ml coconut milk',
      '500ml prawn or chicken stock',
      '300g thick rice noodles (laksa noodles)',
      '200g prawns, peeled',
      '100g fishcake, sliced',
      '6 tofu puffs (tau pok), halved',
      '1 cup beansprouts',
      'Laksa leaves (daun kesum), sambal, and lime for garnish',
    ],
    steps: [
      { title: 'Cook the laksa base', body: 'Heat oil in a large pot. Fry laksa paste over medium heat for 3–4 minutes until very fragrant and the oil turns red. The paste should sizzle and darken slightly.' },
      { title: 'Build the broth', body: 'Pour in stock and coconut milk. Stir well and bring to a gentle simmer. Cook for 15 minutes to let the flavours meld. Season with salt and sugar to balance.' },
      { title: 'Cook the toppings', body: 'Add prawns, fishcake slices, and tofu puffs to the broth. Simmer for 3–4 minutes until the prawns are pink and curled. Blanch beansprouts separately in boiling water.' },
      { title: 'Assemble bowls', body: 'Divide cooked laksa noodles among deep bowls. Ladle the coconut broth over the noodles, making sure each bowl gets prawns, fishcake, and tofu puffs. Top with beansprouts.' },
      { title: 'Garnish and serve', body: 'Scatter torn laksa leaves over each bowl, add a squeeze of lime, and serve with sambal on the side. The broth should be rich, creamy, and have a deep orange-red colour.' },
    ],
  },
  {
    title: 'Char Kway Teow',
    description:
      'The smoky, charred king of Singapore hawker stalls. Flat rice noodles wok-fried at extreme heat with dark soy sauce, egg, Chinese sausage, beansprouts, chives, and cockles. The magic is "wok hei" — the breath of the wok.',
    emoji: '🍜',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 15, servings: 2,
    ingredients: [
      '400g fresh flat rice noodles (kway teow)',
      '1 Chinese sausage (lap cheong), sliced diagonally',
      '2 eggs',
      '2 cups beansprouts',
      '1 bunch garlic chives, cut into 5 cm lengths',
      '2 tbsp dark soy sauce',
      '1 tbsp light soy sauce',
      '1 tbsp fish sauce',
      '100g blood cockles (optional, or substitute with prawns)',
      '2 tbsp lard or oil',
    ],
    steps: [
      { title: 'Prepare ingredients', body: "Have everything within arm's reach — this dish cooks in under 5 minutes. Loosen the flat rice noodles gently with your hands. Slice the Chinese sausage. Wash beansprouts and chives." },
      { title: 'Heat the wok', body: 'Heat a wok over the highest flame possible until smoking. Add lard or oil and swirl. Fry the Chinese sausage for 30 seconds, then push to one side.' },
      { title: 'Fry the noodles', body: 'Add rice noodles and spread them across the wok. Let them sit without moving for 30 seconds to char, then toss. Add dark soy, light soy, and fish sauce. Crack eggs directly onto the noodles and toss to combine.' },
      { title: 'Add final ingredients', body: 'Toss in beansprouts, garlic chives, and cockles (or prawns). Stir-fry for 30 seconds — the beansprouts should stay crunchy. Do not overcook.' },
      { title: 'Serve immediately', body: "Slide onto a plate and serve at once. Char kway teow waits for no one — it's best eaten straight from the wok with a cold drink on the side." },
    ],
  },
  {
    title: 'Hokkien Mee',
    description:
      'A beloved Singapore hawker dish — thick yellow egg noodles and thin rice vermicelli wok-fried with prawns, pork, and egg, then braised in a rich prawn stock until the noodles absorb all the umami. Finished with a squeeze of lime and served with sambal on the side.',
    emoji: '🍝',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 40, servings: 2,
    ingredients: [
      '200g thick yellow egg noodles',
      '100g thin rice vermicelli (bee hoon)',
      '200g prawns, shell on (shells reserved for stock)',
      '100g pork belly, thinly sliced',
      '2 eggs',
      '4 cloves garlic, minced',
      '300ml prawn stock (made from prawn shells and heads)',
      '2 tbsp dark soy sauce',
      'Sambal, lime wedges, and fried pork lard for serving',
    ],
    steps: [
      { title: 'Make the prawn stock', body: 'Fry prawn shells and heads in oil until red and fragrant. Add 500ml water and simmer for 20 minutes. Strain and discard shells — this stock is the secret to authentic Hokkien mee.' },
      { title: 'Fry the protein', body: 'Heat lard or oil in a wok over high heat. Fry pork belly slices until crispy, then add peeled prawns and cook until pink. Push to one side.' },
      { title: 'Cook noodles and egg', body: 'Add garlic and fry for 10 seconds. Add both types of noodles and toss with dark soy sauce. Crack eggs over the noodles and stir to combine.' },
      { title: 'Braise in stock', body: 'Pour prawn stock over the noodles, cover, and let the noodles absorb the liquid over medium heat for 4–5 minutes. Remove the lid and toss until the noodles are coated in a thick, rich sauce.' },
      { title: 'Serve', body: 'Slide onto a plate. Serve with lime wedges, sambal chilli, and crispy pork lard on the side. Squeeze the lime over everything before eating.' },
    ],
  },
  {
    title: 'Kaya Toast Set',
    description:
      "Singapore's quintessential breakfast. Crisp, charcoal-toasted bread spread with kaya (coconut jam) and a slab of cold butter, paired with wobbly soft-boiled eggs seasoned with dark soy sauce and white pepper. Wash it down with a strong kopi.",
    emoji: '🍞',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'easy', time_minutes: 15, servings: 2,
    ingredients: [
      '4 slices white bread (thick-cut Pullman style)',
      '4 tbsp kaya (coconut jam)',
      '4 slices cold butter',
      '4 eggs (for soft-boiling)',
      'Dark soy sauce for eggs',
      'White pepper for eggs',
      'Kopi (Singaporean coffee) or teh to serve',
    ],
    steps: [
      { title: 'Toast the bread', body: 'Toast bread slices until golden and crisp — traditionally over a charcoal grill for that smoky edge, but a regular toaster works fine. The bread should be crispy on the outside.' },
      { title: 'Spread kaya and butter', body: 'While the toast is hot, spread a thick layer of kaya on one slice and place a slab of cold butter on top. Sandwich with the other slice. The contrast of warm toast and cold butter is essential.' },
      { title: 'Soft-boil the eggs', body: 'Bring water to a boil, turn off the heat, and gently lower eggs into the water. Cover and let sit for exactly 6.5 minutes. The whites should be barely set, the yolks completely runny.' },
      { title: 'Season the eggs', body: 'Crack eggs into a small bowl or saucer. Add a splash of dark soy sauce and a few shakes of white pepper. Do not stir — dip the toast into the egg.' },
      { title: 'Serve the set', body: 'Serve the kaya toast alongside the soft-boiled eggs and a cup of strong kopi (traditional Singaporean coffee with sweetened condensed milk). This is a complete breakfast.' },
    ],
  },
  {
    title: 'Bak Kut Teh',
    description:
      "Teochew-style pork rib soup — a peppery, garlicky clear broth with fall-off-the-bone pork ribs. Singapore's take is lighter, whiter, and relies on a heavy dose of white pepper and whole garlic bulbs for its punch. Best with a side of you tiao (fried dough sticks) for dipping.",
    emoji: '🍖',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 90, servings: 4,
    ingredients: [
      '1 kg pork ribs, cut into individual ribs',
      '2 whole heads garlic, unpeeled, halved crosswise',
      '2 tbsp white peppercorns, cracked',
      '2 tbsp dark soy sauce',
      '1 tbsp light soy sauce',
      '1 star anise',
      '1 small piece cinnamon bark',
      '1 piece dang gui (angelica root, optional)',
      'You tiao (fried dough sticks) for serving',
      'Steamed rice and braised peanuts for serving',
    ],
    steps: [
      { title: 'Blanch the ribs', body: 'Bring a pot of water to a boil. Add pork ribs and blanch for 3 minutes to remove impurities. Drain and rinse under cold water. This gives you a clean, clear broth.' },
      { title: 'Build the broth', body: 'In a clean pot or clay pot, add blanched ribs, garlic heads, cracked white pepper, star anise, cinnamon, and dang gui. Cover with 2 litres of water. Bring to a boil, then reduce to a gentle simmer.' },
      { title: 'Simmer until tender', body: 'Simmer uncovered for 1 to 1.5 hours until the pork is fall-off-the-bone tender. Skim any foam that rises. The broth should be clear and peppery.' },
      { title: 'Season', body: 'Add dark soy sauce for colour and light soy sauce for saltiness. Taste and add more white pepper if you want more heat. The broth should be intensely peppery and garlicky.' },
      { title: 'Serve', body: "Ladle ribs and broth into clay pots or deep bowls. Serve with you tiao (fried dough sticks) for dipping, steamed rice, braised peanuts, and a pot of Chinese tea." },
    ],
  },
  {
    title: 'Roti Prata',
    description:
      "Singapore's favourite late-night supper — flaky, buttery, crispy flatbread stretched tissue-thin and folded into layers before being pan-fried on a hot griddle. Served with a bowl of curry (fish or chicken) for dipping.",
    emoji: '🫓',
    country_code: 'SG', country_name: 'Singaporean', country_flag: '🇸🇬',
    difficulty: 'medium', time_minutes: 60, servings: 4,
    ingredients: [
      '3 cups plain flour',
      '1 tsp salt',
      '1 tbsp condensed milk',
      '1 egg',
      '¾ cup water',
      '4 tbsp ghee (plus extra for frying)',
      'Curry sauce (fish or chicken) for dipping',
    ],
    steps: [
      { title: 'Make the dough', body: 'Mix flour and salt. Add condensed milk, egg, and water. Knead for 10 minutes until smooth and elastic. The dough should be soft and slightly sticky. Divide into 6 balls.' },
      { title: 'Rest the dough', body: 'Coat each ball generously with ghee and place in a covered container. Rest for at least 2 hours (or overnight in the fridge). This relaxes the gluten and makes the dough stretchy.' },
      { title: 'Stretch and fold', body: 'On a well-oiled surface, flatten a dough ball and stretch it with your hands as thin as possible — you should almost be able to see through it. Fold the edges inward to form a square parcel with multiple layers.' },
      { title: 'Pan-fry', body: 'Heat a flat griddle or heavy pan. Add a little ghee and fry the prata for 2 minutes per side until golden, flaky, and crispy. Press down gently with a spatula. Clap the prata between your palms to separate the layers.' },
      { title: 'Serve', body: 'Serve hot off the griddle with a bowl of warm curry for dipping. Plain prata is the classic, but you can also add egg, banana, or cheese as fillings before folding.' },
    ],
  },
];

// ---- Country definitions ----
const COUNTRIES = [
  { code: 'PH', name: 'Filipino',    flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesian',  flag: '🇮🇩' },
  { code: 'SG', name: 'Singaporean', flag: '🇸🇬' },
];

// ---- Main ----
async function main() {
  console.log('🌏 ForkIt — Seeding PH, ID, SG recipes\n');

  // 1. Upsert countries
  console.log('📍 Upserting countries...');
  for (const c of COUNTRIES) {
    const { error } = await supabase
      .from('countries')
      .upsert({ code: c.code, name: c.name, flag: c.flag }, { onConflict: 'code' });
    if (error) {
      console.error(`  ❌ Country ${c.code}:`, error.message);
    } else {
      console.log(`  ✅ ${c.flag} ${c.name} (${c.code})`);
    }
  }

  // 2. Check for existing titles to avoid duplicates
  const { data: existing } = await supabase
    .from('recipes')
    .select('title')
    .in('country_code', ['PH', 'ID', 'SG']);
  const existingTitles = new Set((existing ?? []).map((r) => r.title));

  // 3. Insert each recipe
  let inserted = 0;
  let skipped = 0;

  for (const recipe of RECIPES) {
    if (existingTitles.has(recipe.title)) {
      console.log(`  ⏭️  Skipping (already exists): ${recipe.title}`);
      skipped++;
      continue;
    }

    // Insert recipe
    const { data: recipeRow, error: recipeErr } = await supabase
      .from('recipes')
      .insert({
        title: recipe.title,
        description: recipe.description,
        emoji: recipe.emoji,
        country_code: recipe.country_code,
        country_name: recipe.country_name,
        country_flag: recipe.country_flag,
        difficulty: recipe.difficulty,
        time_minutes: recipe.time_minutes,
        servings: recipe.servings,
        published: true,
        source: 'curated',
        author_id: SYSTEM_USER_ID,
      })
      .select('id')
      .single();

    if (recipeErr || !recipeRow) {
      console.error(`  ❌ Recipe "${recipe.title}":`, recipeErr?.message);
      continue;
    }

    const recipeId = recipeRow.id;

    // Insert ingredients
    const ingredientRows = recipe.ingredients.map((text, i) => ({
      recipe_id: recipeId,
      text,
      sort_order: i + 1,
    }));
    const { error: ingErr } = await supabase.from('ingredients').insert(ingredientRows);
    if (ingErr) console.error(`    ❌ Ingredients for "${recipe.title}":`, ingErr.message);

    // Insert steps
    const stepRows = recipe.steps.map((s, i) => ({
      recipe_id: recipeId,
      step_number: i + 1,
      title: s.title,
      body: s.body,
    }));
    const { error: stepErr } = await supabase.from('recipe_steps').insert(stepRows);
    if (stepErr) console.error(`    ❌ Steps for "${recipe.title}":`, stepErr.message);

    // Increment country recipe_count
    const { error: countErr } = await supabase.rpc('increment_country_count', {
      country_code: recipe.country_code,
    });
    if (countErr) console.error(`    ❌ Count for ${recipe.country_code}:`, countErr.message);

    console.log(`  ✅ ${recipe.country_flag} ${recipe.title}`);
    inserted++;
  }

  console.log(`\n✨ Done! ${inserted} inserted, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
