// ============================================================
// ForkIt — Step Animation Detector
// Detects cooking action from step title/body and returns
// animation type + relevant food emojis for micro-animations.
// ============================================================

export type CookingAction =
  | 'cut'
  | 'saute'
  | 'boil'
  | 'stir'
  | 'plate'
  | 'peel'
  | 'marinate'
  | 'bake'
  | 'grill'
  | 'blend'
  | 'rest'
  | 'generic';

export interface StepAnimationData {
  action: CookingAction;
  /** Primary emoji for the action tool/vessel */
  tool: string;
  /** Food emojis involved (from step text) */
  foods: string[];
  /** Estimated time from step body, if found */
  timerMinutes: string | null;
}

// Action keyword patterns (checked against title + body)
const ACTION_PATTERNS: [RegExp, CookingAction][] = [
  [/\b(cut|chop|dice|slice|mince|julienne|trim|debone|fillet)\b/i, 'cut'],
  [/\b(peel|skin|pare|shuck|hull)\b/i, 'peel'],
  [/\b(saut[eé]|sear|fry|pan[- ]?fry|stir[- ]?fry|deep[- ]?fry|brown|toast)\b/i, 'saute'],
  [/\b(boil|simmer|blanch|poach|steam|braise|stew|reduce)\b/i, 'boil'],
  [/\b(stir|mix|fold|whisk|beat|toss|combine|incorporate)\b/i, 'stir'],
  [/\b(marinat|brine|soak|infuse|rub|season|coat)\b/i, 'marinate'],
  [/\b(bake|roast|broil|oven)\b/i, 'bake'],
  [/\b(grill|barbecue|bbq|char|smoke)\b/i, 'grill'],
  [/\b(blend|pur[eé]e|process|liquidize|emulsify)\b/i, 'blend'],
  [/\b(plate|serve|garnish|arrange|drizzle|top with|transfer to)\b/i, 'plate'],
  [/\b(rest|cool|chill|refrigerat|set aside|let sit|room temp)\b/i, 'rest'],
];

// Food keywords → emojis (for showing in animation)
const FOOD_EMOJI_MAP: [RegExp, string][] = [
  [/chicken/i, '🍗'],
  [/pork|bacon/i, '🥩'],
  [/beef|steak|lamb/i, '🥩'],
  [/shrimp|prawn/i, '🦐'],
  [/fish|salmon|tuna/i, '🐟'],
  [/egg/i, '🥚'],
  [/potato/i, '🥔'],
  [/tomato/i, '🍅'],
  [/carrot/i, '🥕'],
  [/onion|shallot/i, '🧅'],
  [/garlic/i, '🧄'],
  [/ginger/i, '🫚'],
  [/chili|chilli|pepper/i, '🌶️'],
  [/broccoli/i, '🥦'],
  [/mushroom/i, '🍄'],
  [/rice/i, '🍚'],
  [/noodle|pasta/i, '🍜'],
  [/lemon|lime|calamansi/i, '🍋'],
  [/coconut/i, '🥥'],
  [/corn/i, '🌽'],
  [/lettuce|cabbage|spinach/i, '🥬'],
  [/eggplant/i, '🍆'],
  [/avocado/i, '🥑'],
  [/bread/i, '🍞'],
  [/cheese/i, '🧀'],
  [/butter/i, '🧈'],
  [/soy sauce|vinegar|sauce/i, '🫗'],
  [/bay lea/i, '🌿'],
  [/herb|basil|cilantro|parsley/i, '🌿'],
  [/peppercorn/i, '⚫'],
  [/water/i, '💧'],
  [/oil/i, '🫒'],
  [/sugar/i, '🍬'],
  [/salt/i, '🧂'],
];

// Tool emoji per action
const ACTION_TOOLS: Record<CookingAction, string> = {
  cut: '🔪',
  peel: '🔪',
  saute: '🍳',
  boil: '🫕',
  stir: '🥄',
  marinate: '🥣',
  bake: '♨️',
  grill: '🔥',
  blend: '🫙',
  plate: '🍽️',
  rest: '⏳',
  generic: '👨‍🍳',
};

// Timer regex — extracts "X min", "X-Y minutes", "X hours" etc.
const TIMER_REGEX =
  /(\d+\s*[-–]\s*\d+|\d+)\s*(min(?:ute)?s?|hrs?|hours?)\b/i;

/**
 * Detect the cooking action type from step title + body.
 */
export function detectStepAnimation(title: string, body: string): StepAnimationData {
  const text = `${title} ${body}`;

  // Detect action
  let action: CookingAction = 'generic';
  for (const [pattern, act] of ACTION_PATTERNS) {
    if (pattern.test(text)) {
      action = act;
      break;
    }
  }

  // Detect food emojis mentioned
  const foods: string[] = [];
  const seen = new Set<string>();
  for (const [pattern, emoji] of FOOD_EMOJI_MAP) {
    if (pattern.test(text) && !seen.has(emoji)) {
      seen.add(emoji);
      foods.push(emoji);
      if (foods.length >= 3) break; // max 3 food emojis
    }
  }

  // Detect timer
  let timerMinutes: string | null = null;
  const timerMatch = text.match(TIMER_REGEX);
  if (timerMatch) {
    const num = timerMatch[1];
    const unit = timerMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      timerMinutes = `${num} hr`;
    } else {
      timerMinutes = `${num} min`;
    }
  }

  return {
    action,
    tool: ACTION_TOOLS[action],
    foods,
    timerMinutes,
  };
}
