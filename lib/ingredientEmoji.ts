// ============================================================
// ForkIt — Ingredient Emoji Mapper & Parser
// Maps ingredient text to visual emoji icons and parses
// quantity, name, and prep instructions for beginner-friendly display.
// ============================================================

/** Parsed ingredient with visual metadata */
export interface ParsedIngredient {
  emoji: string;
  name: string;
  quantity: string;
  prep: string;
}

// Keyword → emoji mapping (longest match first within each entry)
const INGREDIENT_EMOJI_MAP: [RegExp, string][] = [
  // Proteins
  [/chicken breast/i, '🍗'],
  [/chicken thigh/i, '🍗'],
  [/chicken wing/i, '🍗'],
  [/chicken leg/i, '🍗'],
  [/chicken/i, '🍗'],
  [/pork belly/i, '🥩'],
  [/pork chop/i, '🥩'],
  [/pork/i, '🥩'],
  [/beef steak/i, '🥩'],
  [/beef/i, '🥩'],
  [/lamb/i, '🥩'],
  [/steak/i, '🥩'],
  [/meat/i, '🥩'],
  [/bacon/i, '🥓'],
  [/shrimp/i, '🦐'],
  [/prawn/i, '🦐'],
  [/crab/i, '🦀'],
  [/lobster/i, '🦞'],
  [/fish sauce/i, '🫗'],
  [/fish/i, '🐟'],
  [/salmon/i, '🐟'],
  [/tuna/i, '🐟'],
  [/tilapia/i, '🐟'],
  [/squid/i, '🦑'],
  [/mussel/i, '🦪'],
  [/oyster/i, '🦪'],
  [/egg/i, '🥚'],
  [/tofu/i, '🧈'],

  // Vegetables
  [/potato/i, '🥔'],
  [/sweet potato/i, '🍠'],
  [/tomato/i, '🍅'],
  [/carrot/i, '🥕'],
  [/onion/i, '🧅'],
  [/shallot/i, '🧅'],
  [/scallion/i, '🧅'],
  [/spring onion/i, '🧅'],
  [/green onion/i, '🧅'],
  [/leek/i, '🧅'],
  [/garlic/i, '🧄'],
  [/ginger/i, '🫚'],
  [/galangal/i, '🫚'],
  [/chili|chilli|chile/i, '🌶️'],
  [/jalape[nñ]o/i, '🌶️'],
  [/habanero/i, '🌶️'],
  [/pepper.*bell|bell pepper/i, '🫑'],
  [/capsicum/i, '🫑'],
  [/broccoli/i, '🥦'],
  [/lettuce/i, '🥬'],
  [/cabbage/i, '🥬'],
  [/bok choy/i, '🥬'],
  [/spinach/i, '🥬'],
  [/kangkong/i, '🥬'],
  [/kale/i, '🥬'],
  [/corn/i, '🌽'],
  [/mushroom/i, '🍄'],
  [/eggplant|aubergine/i, '🍆'],
  [/cucumber/i, '🥒'],
  [/zucchini|courgette/i, '🥒'],
  [/avocado/i, '🥑'],
  [/pea/i, '🫛'],
  [/bean/i, '🫘'],
  [/lentil/i, '🫘'],
  [/celery/i, '🥬'],
  [/pumpkin/i, '🎃'],
  [/squash/i, '🎃'],
  [/radish/i, '🥕'],
  [/beet/i, '🥕'],
  [/asparagus/i, '🌿'],

  // Fruits
  [/lemon/i, '🍋'],
  [/calamansi|calamondin/i, '🍋'],
  [/lime/i, '🍋'],
  [/orange/i, '🍊'],
  [/apple/i, '🍎'],
  [/banana/i, '🍌'],
  [/mango/i, '🥭'],
  [/pineapple/i, '🍍'],
  [/coconut milk|coconut cream/i, '🥥'],
  [/coconut/i, '🥥'],
  [/grape/i, '🍇'],
  [/strawberry|strawberries/i, '🍓'],
  [/blueberr/i, '🫐'],
  [/peach/i, '🍑'],
  [/cherry|cherries/i, '🍒'],
  [/watermelon/i, '🍉'],
  [/melon/i, '🍈'],
  [/pear/i, '🍐'],
  [/kiwi/i, '🥝'],
  [/papaya/i, '🥭'],
  [/tamarind/i, '🟤'],
  [/date/i, '🟤'],

  // Grains & Starches
  [/rice noodle/i, '🍜'],
  [/noodle/i, '🍜'],
  [/pasta/i, '🍝'],
  [/spaghetti/i, '🍝'],
  [/macaroni/i, '🍝'],
  [/rice/i, '🍚'],
  [/bread/i, '🍞'],
  [/flour/i, '🌾'],
  [/cornstarch/i, '🌾'],
  [/oat/i, '🌾'],
  [/wheat/i, '🌾'],

  // Dairy
  [/butter/i, '🧈'],
  [/cheese/i, '🧀'],
  [/parmesan/i, '🧀'],
  [/mozzarella/i, '🧀'],
  [/cream/i, '🥛'],
  [/milk/i, '🥛'],
  [/yogurt|yoghurt/i, '🥛'],

  // Sauces & Liquids
  [/soy sauce/i, '🫗'],
  [/oyster sauce/i, '🫗'],
  [/worcestershire/i, '🫗'],
  [/teriyaki/i, '🫗'],
  [/hoisin/i, '🫗'],
  [/sriracha/i, '🌶️'],
  [/hot sauce/i, '🌶️'],
  [/ketchup/i, '🫗'],
  [/mayo|mayonnaise/i, '🫗'],
  [/vinegar/i, '🍶'],
  [/wine/i, '🍷'],
  [/beer/i, '🍺'],
  [/broth|stock/i, '🥣'],
  [/coconut milk/i, '🥥'],
  [/tomato sauce|tomato paste/i, '🍅'],
  [/sesame oil/i, '🫗'],
  [/olive oil/i, '🫒'],
  [/cooking oil|vegetable oil|canola/i, '🫒'],
  [/oil/i, '🫒'],

  // Herbs & Spices
  [/bay leaf|bay leaves/i, '🌿'],
  [/basil/i, '🌿'],
  [/cilantro|coriander/i, '🌿'],
  [/parsley/i, '🌿'],
  [/thyme/i, '🌿'],
  [/rosemary/i, '🌿'],
  [/oregano/i, '🌿'],
  [/mint/i, '🌿'],
  [/dill/i, '🌿'],
  [/lemongrass/i, '🌿'],
  [/pandan/i, '🌿'],
  [/curry leaf|curry leaves/i, '🌿'],
  [/peppercorn/i, '⚫'],
  [/black pepper|pepper/i, '⚫'],
  [/cumin/i, '🟤'],
  [/turmeric/i, '🟡'],
  [/paprika/i, '🟤'],
  [/cinnamon/i, '🟤'],
  [/clove/i, '🟤'],
  [/nutmeg/i, '🟤'],
  [/star anise/i, '⭐'],
  [/cardamom/i, '🟢'],
  [/saffron/i, '🟡'],
  [/curry powder|curry paste/i, '🟡'],
  [/chili powder|chili flake/i, '🌶️'],

  // Basics
  [/salt/i, '🧂'],
  [/sugar/i, '🍬'],
  [/brown sugar/i, '🍬'],
  [/honey/i, '🍯'],
  [/water/i, '💧'],
  [/ice/i, '🧊'],

  // Nuts & Seeds
  [/peanut/i, '🥜'],
  [/almond/i, '🥜'],
  [/cashew/i, '🥜'],
  [/walnut/i, '🥜'],
  [/sesame/i, '🥜'],
  [/sunflower/i, '🌻'],

  // Other
  [/chocolate/i, '🍫'],
  [/cocoa/i, '🍫'],
  [/vanilla/i, '🍦'],
  [/gelatin/i, '🟡'],
  [/baking powder|baking soda/i, '🧂'],
  [/yeast/i, '🧂'],
];

/**
 * Match ingredient text to an emoji icon.
 */
export function getIngredientEmoji(text: string): string {
  const lower = text.toLowerCase();
  for (const [pattern, emoji] of INGREDIENT_EMOJI_MAP) {
    if (pattern.test(lower)) return emoji;
  }
  return '🥄'; // fallback
}

// Regex to capture leading quantity: number(s) + unit word(s)
const QTY_REGEX =
  /^([\d½¼¾⅓⅔⅛⅜⅝⅞]+(?:\s*[-–/]\s*[\d½¼¾⅓⅔⅛⅜⅝⅞]+)?)\s*(kg|g|lb|lbs|oz|ml|l|tsp|tbsp|tablespoon|teaspoon|cup|cups|clove|cloves|piece|pieces|pcs?|bunch|bunches|can|cans|slice|slices|head|heads|stalk|stalks|sprig|sprigs|pinch|pinches|dash|dashes|handful|handfuls|large|medium|small|whole)s?\b\.?\s*/i;

// Prep keyword patterns
const PREP_PATTERNS =
  /\b(minced|chopped|diced|sliced|crushed|grated|peeled|julienned|cubed|shredded|torn|halved|quartered|deseeded|deveined|trimmed|cleaned|washed|rinsed|drained|melted|softened|room temperature|to taste|for garnish|for serving|optional|finely|roughly|thinly|coarsely|freshly)\b/gi;

/**
 * Parse raw ingredient text into structured parts.
 *
 * E.g. "1 kg chicken thighs, bone-in, cut into serving pieces"
 * → { emoji: '🍗', name: 'Chicken thighs', quantity: '1 kg', prep: 'Bone-in, cut into serving pieces' }
 */
export function parseIngredient(text: string): ParsedIngredient {
  const emoji = getIngredientEmoji(text);
  let remaining = text.trim();
  let quantity = '';

  // Extract quantity
  const qtyMatch = remaining.match(QTY_REGEX);
  if (qtyMatch) {
    quantity = qtyMatch[0].trim();
    remaining = remaining.slice(qtyMatch[0].length).trim();
  }

  // Split on comma or dash for prep instructions
  let name = remaining;
  let prep = '';

  const commaIdx = remaining.indexOf(',');
  if (commaIdx > 0) {
    name = remaining.slice(0, commaIdx).trim();
    prep = remaining.slice(commaIdx + 1).trim();
  } else {
    // Check for prep keywords in the text
    const prepMatches = remaining.match(PREP_PATTERNS);
    if (prepMatches && prepMatches.length > 0) {
      // Find first prep keyword position
      const firstPrepIdx = remaining.search(PREP_PATTERNS);
      if (firstPrepIdx > 2) {
        name = remaining.slice(0, firstPrepIdx).trim();
        prep = remaining.slice(firstPrepIdx).trim();
      }
    }
  }

  // Capitalize first letter of name
  if (name.length > 0) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  // Capitalize first letter of prep
  if (prep.length > 0) {
    prep = prep.charAt(0).toUpperCase() + prep.slice(1);
  }

  return { emoji, name, quantity, prep };
}
