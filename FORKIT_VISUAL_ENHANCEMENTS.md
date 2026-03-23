# ForkIt — Visual Enhancement Spec
> **Version:** 1.0.0
> **Scope:** `forkit-app.jsx` — Ingredient panel + Cooking steps + Back button + SVG icon system
> **Status:** Ready to implement — prompt in §5

---

## Why This Matters

The current ingredient list is a plain scrollable text list. For experienced cooks, that's fine. But ForkIt's audience includes people who have never seen doubanjiang, don't know what Sichuan peppercorns look like in a shop, and can't tell galangal from ginger. If someone opens a recipe, starts shopping, and gets confused at the supermarket — they won't cook it. They won't come back. The ingredient panel is the single place where ForkIt can turn a confusing experience into a confident one.

The cooking steps have the same problem from the other direction: the steps are readable, but they feel passive. There's no visual signal for *what kind of action* you're doing — boiling vs frying vs chopping all look identical.

These changes address both.

---

## 1. New Ingredient Data Model

Every ingredient string in the current `RECIPES` array is a plain `string`. This needs to become a structured object.

### Old format
```javascript
ingredients: [
  "400g silken tofu, cut into 2cm cubes",
  "2 tbsp doubanjiang (spicy bean paste)",
  ...
]
```

### New format
```javascript
ingredients: [
  {
    id: 0,
    amount: "400g",
    label: "Silken tofu",
    sub: "Cut into 2cm cubes — handle gently",
    category: "protein",        // protein | produce | sauce | spice | liquid | other
    unfamiliar: false,          // show "What does this look like?" button
    tip: "",                    // explanation shown when unfamiliar=true
    visual: "tofu",             // key into INGREDIENT_VISUALS map
    visualColor: "#F5F0E0",     // main SVG fill colour
    visualBg: "#2a261a",        // tile background colour
  },
  {
    id: 1,
    amount: "2 tbsp",
    label: "Doubanjiang",
    sub: "Spicy broad bean paste — the key ingredient",
    category: "sauce",
    unfamiliar: true,
    tip: "A dark red, chunky paste from Sichuan province. Smells sharp and fermented. Sold in Asian supermarkets — look for a red jar labelled '豆瓣酱'. Pixian brand is best.",
    visual: "paste_jar",
    visualColor: "#8B1A1A",
    visualBg: "#2a1212",
  },
]
```

### Category values and what they group
| Category | Examples | Filter icon |
|---|---|---|
| `protein` | Tofu, beef, pork, chicken, eggs, fish | 🥩 |
| `produce` | Garlic, ginger, spring onion, tomato, pepper | 🥬 |
| `sauce` | Doubanjiang, soy sauce, fermented black beans, oyster sauce | 🫙 |
| `spice` | Sichuan peppercorns, cumin, paprika, turmeric | 🌶 |
| `liquid` | Stock, coconut milk, cornstarch slurry, oil, water | 💧 |
| `other` | Toppings, garnish, bread, cheese | 🫓 |

---

## 2. SVG Visual Library

A map of ingredient keys to SVG drawing functions. Each function takes a `color` string and returns an SVG string. All viewBox `"0 0 64 64"`, width/height 100%.

The tile is `64×64px` with a coloured background (`visualBg`). The SVG illustration sits on top.

### Required visuals — 30 common cooking ingredients

| Key | Ingredient | Shape description |
|---|---|---|
| `tofu` | Tofu block | White rectangle with grid cut-lines |
| `pork` | Ground pork | Brown irregular mound with lighter patches |
| `beef_chunk` | Beef chunks | Dark red irregular cubes |
| `chicken` | Chicken pieces | Golden-brown irregular shapes |
| `egg` | Eggs | White oval with yellow yolk hint |
| `garlic` | Garlic | Cream bulb shape with segmented cloves |
| `ginger` | Ginger root | Orange-brown knobby irregular root |
| `spring_onion` | Spring onion | Green stalks with white base |
| `onion` | Onion | Purple-brown layered oval |
| `tomato` | Tomato | Red sphere with green stem cross |
| `bell_pepper` | Bell pepper | Red/green blocky pepper shape |
| `chilli` | Fresh chilli | Long red tapered pod |
| `lemongrass` | Lemongrass | Pale green stalks |
| `kaffir_lime` | Kaffir lime leaves | Dark green double leaf |
| `paste_jar` | Paste in jar | Dark red jar with Chinese character 辣 |
| `fermented_beans` | Fermented black beans | Cluster of dark oval beans |
| `soy_sauce` | Soy sauce | Dark brown bottle silhouette |
| `oyster_sauce` | Oyster sauce | Dark bottle with label |
| `chili_oil` | Chili oil | Red oil in small jar |
| `coconut_milk` | Coconut milk | White can with coconut |
| `fish_sauce` | Fish sauce | Amber bottle |
| `peppercorn` | Sichuan peppercorns | Scattered red-brown round husks |
| `cumin` | Cumin seeds | Small brown elongated seeds |
| `paprika` | Paprika powder | Orange-red powder mound |
| `turmeric` | Turmeric powder | Deep yellow powder mound |
| `stock` | Stock / broth | Warm amber liquid in bowl |
| `cornstarch` | Cornstarch | White powder in small bowl |
| `oil` | Cooking oil | Clear/golden liquid in bowl |
| `flour` | Flour | White powder mound |
| `generic` | Fallback | Simple bowl silhouette |

### SVG drawing rules
- ViewBox always `"0 0 64 64"`, `width="100%"` `height="100%"`
- No `<style>` inside SVGs — use inline `fill` and `stroke` attributes only
- Max 8–10 SVG elements per illustration — keep it simple and readable
- Use `opacity` to add texture/highlights without extra colours
- Solid shapes for recognisability; avoid fine detail that disappears at small size
- All strokes: `rgba(255,255,255,.1)` for highlights, `rgba(0,0,0,.15)` for shadows

### Example implementations (use these as style reference)

```javascript
// Garlic — clustered bulb
const garlic = (color) => `<svg viewBox="0 0 64 64" width="100%" height="100%">
  <ellipse cx="32" cy="36" rx="12" ry="14" fill="${color}"/>
  <ellipse cx="24" cy="33" rx="7" ry="10" fill="${color}" opacity=".85"/>
  <ellipse cx="40" cy="33" rx="7" ry="10" fill="${color}" opacity=".85"/>
  <line x1="32" y1="22" x2="32" y2="16" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="16" x2="29" y2="12" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M24 42 Q32 46 40 42" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>
</svg>`;

// Tofu — grid-cut block
const tofu = (color) => `<svg viewBox="0 0 64 64" width="100%" height="100%">
  <rect x="14" y="18" width="36" height="28" rx="3" fill="${color}" opacity=".9"/>
  <line x1="14" y1="28" x2="50" y2="28" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
  <line x1="14" y1="38" x2="50" y2="38" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
  <line x1="28" y1="18" x2="28" y2="46" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
  <line x1="40" y1="18" x2="40" y2="46" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
  <rect x="14" y="18" width="36" height="28" rx="3" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
</svg>`;

// Paste jar (doubanjiang, fermented pastes)
const paste_jar = (color) => `<svg viewBox="0 0 64 64" width="100%" height="100%">
  <rect x="18" y="24" width="28" height="22" rx="4" fill="#5a1a1a"/>
  <rect x="20" y="22" width="24" height="6" rx="2" fill="#3a1212"/>
  <rect x="24" y="20" width="16" height="4" rx="2" fill="#2a0e0e"/>
  <text x="32" y="40" text-anchor="middle" font-size="9" fill="${color}" font-weight="700" font-family="sans-serif">辣</text>
  <text x="32" y="50" text-anchor="middle" font-size="7" fill="rgba(255,255,255,.3)" font-family="sans-serif">SPICY</text>
</svg>`;

// Scattered peppercorns
const peppercorn = (color) => `<svg viewBox="0 0 64 64" width="100%" height="100%">
  <circle cx="22" cy="30" r="6" fill="${color}"/>
  <circle cx="35" cy="26" r="5" fill="${color}" opacity=".85"/>
  <circle cx="44" cy="34" r="6" fill="${color}"/>
  <circle cx="28" cy="40" r="5" fill="${color}" opacity=".9"/>
  <circle cx="40" cy="22" r="4" fill="${color}" opacity=".7"/>
  <circle cx="22" cy="30" r="3" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
</svg>`;
```

---

## 3. Ingredient Panel — Full UI Spec

### Layout per ingredient row

```
┌──────────────────────────────────────────────────────┐
│ [64×64 visual tile] │ 2 tbsp          [check circle] │
│                     │ Doubanjiang                     │
│                     │ Spicy broad bean paste          │
│                     │ [❓ What does this look like?]  │
└──────────────────────────────────────────────────────┘
```

- **Tile:** `64×64px`, `background: visualBg`, SVG illustration centred
- **Amount:** `11px`, `font-weight:700`, `color: #f97316` (fire orange)
- **Label:** `13px`, `font-weight:600`, `color: #f5f0e8`
- **Sub:** `10px`, `color: #444`, prep instruction in plain language
- **"What does this look like?" button:** Only shown when `unfamiliar: true`. Fire orange pill, `font-size: 9px`. Tap expands a tooltip below the card.
- **Check circle:** Right side, `26×26px`. Empty ring → tapped → green fill with SVG checkmark (animated scale-in)
- **Checked state:** Card background `rgba(34,197,94,.06)`, border `rgba(34,197,94,.22)`, label strikethrough, faded colour

### "What does this look like?" tooltip

Expands below the card as a dark box (`background: #211f16`, `border: 1px solid rgba(249,115,22,.2)`, `border-radius: 10px`, `padding: 10px 12px`). Sliding fade-in animation. Tapping the card does NOT dismiss it — tap the `❓` button again to close.

Tooltip text is `font-size: 11px`, `color: #aaa`, `line-height: 1.6`, `font-family: sans-serif`. Write it in plain, friendly language — no culinary jargon. Describe: what colour it is, what texture/smell, where to buy it, what brand to look for.

### Category filter bar

Horizontal scroll row above the ingredient list. Pills: All / 🥩 Protein / 🥬 Produce / 🫙 Sauces / 🌶 Spices / 💧 Liquids.

- Active pill: `background: rgba(249,115,22,.15)`, `border-color: rgba(249,115,22,.4)`, `color: #f97316`
- Inactive: `background: rgba(255,255,255,.05)`, `color: #555`
- Filtering is client-side only — no API calls
- Category section headers appear between ingredient groups when All is selected: small all-caps labels (`font-size: 9px`, `color: #444`, `letter-spacing: 2px`)

### "Check All Gathered" button

Right-aligned above the list. On tap: checks all ingredients in the current filter view. If all are already checked, it unchecks them all (toggle behaviour).

### Progress display

- Counter top-right: `"3 / 12"` — turns green when all checked
- Thin progress bar below header: `height: 3px`, fire→ember gradient fill, animated width transition

---

## 4. Cooking Steps — Visual Enhancement Spec

### Step card layout (updated)

```
┌──────────────────────────────────────────────────────┐
│ [step num]  [animation]  │ [action badge]            │
│   circle    64×60px      │ Step title                │
│                          │ Step description text...  │
│                          │                    [✓ badge top-right when done] │
└──────────────────────────────────────────────────────┘
```

### Step number circle states
- Default: `background: linear-gradient(135deg, #f97316, #ef4444)`, white number
- Done: `background: #22c55e`, white SVG checkmark (replaces number)
- Animated transition: `all .22s`

### Action badge (new)
Small pill above the step title. Auto-detected from step text keywords:

```javascript
function getStepBadge(text) {
  const t = text.toLowerCase();
  if (/chop|mince|slice|dice|cut/.test(t)) return { label: "✂ Chop / Mince", type: "cut" };
  if (/fry|sauté|sear|wok|high heat/.test(t)) return { label: "🔥 High Heat", type: "fry" };
  if (/stir|simmer|gentle/.test(t)) return { label: "🥄 Stir / Simmer", type: "stir" };
  if (/boil|blanch|poach/.test(t)) return { label: "♨ Boiling", type: "boil" };
  if (/rest|cool|plate|serve/.test(t)) return { label: "✓ Finishing", type: "finish" };
  if (/blend|blitz|process/.test(t)) return { label: "⚡ Blending", type: "blend" };
  return { label: "🍳 Cooking", type: "generic" };
}
```

Badge style: `background: rgba(249,115,22,.1)`, `border: 1px solid rgba(249,115,22,.18)`, `border-radius: 8px`, `padding: 3px 8px`, `font-size: 9px`, `color: #f97316`, `font-weight: 700`, `font-family: sans-serif`

### Cooking animations (shown inside each step card, left column, below step number)
All built with pure CSS animations — no libraries.

**4 animation types:**

#### Type: `boil` (blanching, poaching, simmering in water)
Pot silhouette with wave animation inside and rising steam `<div>` elements.
```css
@keyframes steamRise {
  0%   { transform: translateY(0) scaleX(1); opacity:.5 }
  50%  { transform: translateY(-8px) scaleX(1.5); opacity:.25 }
  100% { transform: translateY(-16px) scaleX(2); opacity:0 }
}
@keyframes wave {
  0%   { transform: translateX(0) }
  100% { transform: translateX(-50%) }
}
```

#### Type: `fry` (high heat, wok, sauté)
Dark wok silhouette with 3 ingredient piece `<div>`s that sizzle (translateY ±2px alternate) and orange splatter dots that float upward and fade out.
```css
@keyframes sizzle { 0%{transform:translateY(0)} 100%{transform:translateY(-2px)} }
@keyframes splat  { 0%{transform:translateY(0);opacity:.8} 100%{transform:translateY(-18px);opacity:0} }
```

#### Type: `stir` (stirring, simmering sauce, building broth)
Pan with bubbles rising through liquid, spoon rotating on `transform-origin: bottom center`.
```css
@keyframes stir       { 0%{transform:rotate(-25deg)} 50%{transform:rotate(25deg)} 100%{transform:rotate(-25deg)} }
@keyframes bubbleRise { 0%{transform:translateY(0);opacity:.8} 100%{transform:translateY(-16px);opacity:0} }
```

#### Type: `cut` (chopping, mincing, slicing)
Cutting board with two vegetable halves that split apart and come back together. Knife element that chops down and retracts with `transform-origin: top center`.
```css
@keyframes knifeChop {
  0%, 35% { transform: translateY(-18px) rotate(-12deg) }
  52%, 65% { transform: translateY(4px) rotate(-12deg) }
  80%, 100%{ transform: translateY(-18px) rotate(-12deg) }
}
@keyframes vegLeft  { 65%{transform:translateX(-7px)} 90%{transform:translateX(0)} }
@keyframes vegRight { 65%{transform:translateX(7px)} 90%{transform:translateX(0)} }
```
Vegetable colour is derived from keywords in the step text:
```javascript
const VEG_COLORS = {
  garlic:"#FFFACD", ginger:"#C68B2A", onion:"#D4813A",
  potato:"#D4A853", tomato:"#E74C3C", pepper:"#E67E22",
  tofu:"#F5F0DC",   default:"#E67E22"
};
```

### "Active next step" highlight
The single next-uncompleted step gets a visual distinction:
- Border: `rgba(249,115,22,.4)` (brighter)
- Background: `rgba(249,115,22,.07)`

Detection: `const isNext = !doneSteps.includes(i) && i === doneSteps.length`

This guides the cook's eye to exactly where they are in the recipe without any text instruction.

### Done badge (top-right corner of step card)
When a step is ticked, a green circle badge with a checkmark `✓` appears at the top-right. Entry animation: scale from 0.4 to 1.0 with a slight overshoot (`cubic-bezier(.34,1.56,.64,1)`).

### Overall progress bar (above steps list)
Shows `n/5 steps` and a wider `7px` bar (vs the `3px` ingredient bar). Turns green gradient when complete. Label changes to `🎉 You cooked it!` at 100%.

### Completion card
Triggered when `doneSteps.length === steps.length`. Appears below the last step with `animation: fadeIn .3s ease`. Contains:
- Large emoji `🍽️`
- "You cooked it!" headline
- Short encouragement line
- 4 share buttons: Instagram, TikTok, X, WhatsApp (WhatsApp is especially important for SEA)

---

## 5. Back Button — SVG Icon

Replace the existing `←` text character with a proper SVG chevron in `RecipeDetail`.

```jsx
// Replace this:
<button onClick={onClose} style={{...}}>←</button>

// With this:
<button onClick={onClose} style={{ background:"rgba(0,0,0,.4)", backdropFilter:"blur(10px)", border:"none", borderRadius:"50%", width:38, height:38, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
</button>
```

The SVG chevron: scales properly on all screens, renders identically across browsers and mobile devices, and can have `strokeWidth` adjusted for emphasis.

---

## 6. All 4 Recipes — Enriched Ingredient Data

Every recipe in `RECIPES` needs its `ingredients` array converted from strings to structured objects.

### Recipe 1: Sichuan Mapo Tofu

```javascript
ingredients: [
  { id:0,  amount:"400g",   label:"Silken tofu",             sub:"Cut into 2cm cubes — handle gently",          category:"protein", unfamiliar:false, tip:"", visual:"tofu",             visualColor:"#F5F0E0", visualBg:"#2a261a" },
  { id:1,  amount:"150g",   label:"Ground pork",             sub:"Optional — skip for vegetarian",              category:"protein", unfamiliar:false, tip:"", visual:"pork",             visualColor:"#C0705A", visualBg:"#2a1a18" },
  { id:2,  amount:"2 tbsp", label:"Doubanjiang",             sub:"Spicy broad bean paste — the key ingredient", category:"sauce",   unfamiliar:true,  tip:"A dark red, chunky paste from Sichuan province. Smells sharp and fermented. Sold in Asian supermarkets — look for a red jar labelled '豆瓣酱'. Pixian brand is best.", visual:"paste_jar", visualColor:"#8B1A1A", visualBg:"#2a1212" },
  { id:3,  amount:"1 tbsp", label:"Fermented black beans",   sub:"Rinse briefly before using",                  category:"sauce",   unfamiliar:true,  tip:"Small, soft, very dark soybeans preserved in salt. Strong umami flavour. Usually sold in a small plastic bag near the sauces aisle at any Asian supermarket.", visual:"fermented_beans", visualColor:"#2a2015", visualBg:"#1a1810" },
  { id:4,  amount:"4 cloves",label:"Garlic",                 sub:"Peeled and minced fine",                      category:"produce", unfamiliar:false, tip:"", visual:"garlic",           visualColor:"#F5F0DA", visualBg:"#221f14" },
  { id:5,  amount:"1 tsp",  label:"Fresh ginger",            sub:"Grated or minced",                            category:"produce", unfamiliar:false, tip:"", visual:"ginger",           visualColor:"#C88C2A", visualBg:"#22190a" },
  { id:6,  amount:"2 tsp",  label:"Sichuan peppercorns",     sub:"Toast dry, then grind — creates the tingle", category:"spice",   unfamiliar:true,  tip:"Not a real pepper — the dried husk of a citrus plant. Looks like tiny red-brown flower buds. Creates a unique mouth-numbing buzz called 'má'. Sold in any Chinese supermarket.", visual:"peppercorn", visualColor:"#9B3D2A", visualBg:"#2a1610" },
  { id:7,  amount:"2 tbsp", label:"Chili oil",               sub:"Adds colour and heat",                        category:"sauce",   unfamiliar:false, tip:"", visual:"chili_oil",        visualColor:"#C0392B", visualBg:"#2a1212" },
  { id:8,  amount:"1 tbsp", label:"Soy sauce",               sub:"Light soy sauce — not dark soy",             category:"sauce",   unfamiliar:false, tip:"", visual:"soy_sauce",        visualColor:"#3d2910", visualBg:"#1a1208" },
  { id:9,  amount:"1 cup",  label:"Chicken or veg stock",    sub:"About 240ml",                                 category:"liquid",  unfamiliar:false, tip:"", visual:"stock",            visualColor:"#D4A853", visualBg:"#221a08" },
  { id:10, amount:"2 tsp",  label:"Cornstarch",              sub:"Mixed with 2 tbsp cold water before adding",  category:"liquid",  unfamiliar:false, tip:"", visual:"cornstarch",       visualColor:"#F0ECC8", visualBg:"#22211a" },
  { id:11, amount:"2 stalks",label:"Spring onion",           sub:"Sliced — separate white and green parts",     category:"produce", unfamiliar:false, tip:"", visual:"spring_onion",     visualColor:"#6ab04c", visualBg:"#162114" },
]
```

### Recipe 2: Rendang Padang

```javascript
ingredients: [
  { id:0,  amount:"1kg",    label:"Beef chuck",              sub:"Cut into large cubes — chuck stays tender on long cook", category:"protein", unfamiliar:false, tip:"", visual:"beef_chunk",   visualColor:"#8B2A2A", visualBg:"#2a1212" },
  { id:1,  amount:"400ml",  label:"Full-fat coconut milk",   sub:"Full-fat only — low-fat won't reduce properly",          category:"liquid",  unfamiliar:false, tip:"", visual:"coconut_milk", visualColor:"#F5F0E0", visualBg:"#2a261a" },
  { id:2,  amount:"3 stalks",label:"Lemongrass",             sub:"Bruised with back of knife — outer leaves removed",      category:"produce", unfamiliar:true,  tip:"A pale green, woody stalk that smells strongly citrusy. Only the lower 10cm is used — smash it first to release the aroma. Sold fresh or frozen in any Asian grocery.", visual:"lemongrass", visualColor:"#C8D888", visualBg:"#1a2014" },
  { id:3,  amount:"4 leaves",label:"Kaffir lime leaves",     sub:"Tear to release aroma — remove before eating",          category:"produce", unfamiliar:true,  tip:"Distinctive double-lobed dark green leaves with an intense floral lime scent. Usually sold fresh in small packets or dried at Asian groceries. The double-leaf shape is unmistakable.", visual:"kaffir_lime", visualColor:"#2d7a2d", visualBg:"#0e1a0e" },
  { id:4,  amount:"1 tsp",  label:"Tamarind paste",          sub:"Dissolve in 1 tbsp warm water before adding",           category:"sauce",   unfamiliar:true,  tip:"A dark brown, sticky paste with a sour fruity flavour. Looks like very thick molasses. Sold in Asian and Indian supermarkets in small jars or blocks. Essential for the sour note in rendang.", visual:"paste_jar", visualColor:"#6B3D10", visualBg:"#1a1008" },
  { id:5,  amount:"8",      label:"Shallots",                sub:"Part of the spice paste — peeled",                      category:"produce", unfamiliar:false, tip:"", visual:"onion",       visualColor:"#C87860", visualBg:"#2a1a16" },
  { id:6,  amount:"5 cloves",label:"Garlic",                 sub:"Part of the spice paste",                               category:"produce", unfamiliar:false, tip:"", visual:"garlic",      visualColor:"#F5F0DA", visualBg:"#221f14" },
  { id:7,  amount:"4",      label:"Red chilies",             sub:"Part of the spice paste — deseed for less heat",        category:"produce", unfamiliar:false, tip:"", visual:"chilli",      visualColor:"#C0392B", visualBg:"#2a1010" },
  { id:8,  amount:"2cm",    label:"Galangal",                sub:"Part of the spice paste — looks like pale ginger",      category:"produce", unfamiliar:true,  tip:"A close relative of ginger but with a more medicinal, piney flavour. Pale yellow-white inside with pink-tinged skin. Much firmer than ginger — you need a strong grater. Sold in Asian supermarkets, sometimes frozen.", visual:"ginger", visualColor:"#D8C8A0", visualBg:"#221e14" },
  { id:9,  amount:"2cm",    label:"Fresh ginger",            sub:"Part of the spice paste",                               category:"produce", unfamiliar:false, tip:"", visual:"ginger",      visualColor:"#C88C2A", visualBg:"#22190a" },
  { id:10, amount:"1 tsp",  label:"Turmeric powder",         sub:"Or 2cm fresh turmeric, grated",                         category:"spice",   unfamiliar:false, tip:"", visual:"turmeric",    visualColor:"#D4A817", visualBg:"#221800" },
]
```

### Recipe 3: Shakshuka

```javascript
ingredients: [
  { id:0,  amount:"4 large",  label:"Eggs",                  sub:"Cracked directly into the sauce wells",               category:"protein", unfamiliar:false, tip:"", visual:"egg",          visualColor:"#F5ECD0", visualBg:"#22201a" },
  { id:1,  amount:"2 cans",   label:"Crushed tomatoes",      sub:"800g total — any brand works",                        category:"sauce",   unfamiliar:false, tip:"", visual:"tomato",       visualColor:"#C0392B", visualBg:"#2a1010" },
  { id:2,  amount:"1",        label:"Red bell pepper",       sub:"Diced — seeds and stem removed",                      category:"produce", unfamiliar:false, tip:"", visual:"bell_pepper",  visualColor:"#E74C3C", visualBg:"#2a1010" },
  { id:3,  amount:"1 medium", label:"Yellow onion",          sub:"Diced roughly",                                       category:"produce", unfamiliar:false, tip:"", visual:"onion",        visualColor:"#D4A030", visualBg:"#221a08" },
  { id:4,  amount:"4 cloves", label:"Garlic",                sub:"Minced fine",                                         category:"produce", unfamiliar:false, tip:"", visual:"garlic",       visualColor:"#F5F0DA", visualBg:"#221f14" },
  { id:5,  amount:"1.5 tsp",  label:"Ground cumin",          sub:"Earthy, smoky — the backbone spice",                  category:"spice",   unfamiliar:false, tip:"", visual:"cumin",        visualColor:"#9B7A2A", visualBg:"#221808" },
  { id:6,  amount:"1 tsp",    label:"Smoked paprika",        sub:"Smoked — not sweet or hot paprika",                   category:"spice",   unfamiliar:false, tip:"", visual:"paprika",      visualColor:"#C0391A", visualBg:"#2a1008" },
  { id:7,  amount:"½ tsp",    label:"Chili flakes",          sub:"Adjust to taste — skip for mild version",             category:"spice",   unfamiliar:false, tip:"", visual:"peppercorn",   visualColor:"#C04020", visualBg:"#2a1008" },
  { id:8,  amount:"½ tsp",    label:"Ground coriander",      sub:"Adds a citrusy, floral note",                         category:"spice",   unfamiliar:false, tip:"", visual:"cumin",        visualColor:"#B8A840", visualBg:"#221e10" },
  { id:9,  amount:"to taste", label:"Salt & black pepper",   sub:"Season in layers as you build the sauce",             category:"spice",   unfamiliar:false, tip:"", visual:"peppercorn",   visualColor:"#888888", visualBg:"#1a1a1a" },
  { id:10, amount:"handful",  label:"Fresh parsley or cilantro", sub:"Torn or roughly chopped",                         category:"produce", unfamiliar:false, tip:"", visual:"spring_onion", visualColor:"#3aaa3a", visualBg:"#0e1a0e" },
  { id:11, amount:"to taste", label:"Feta cheese",           sub:"Crumbled — skip for dairy-free version",              category:"other",   unfamiliar:false, tip:"", visual:"generic",      visualColor:"#F0EEE8", visualBg:"#22201a" },
]
```

### Recipe 4: Okonomiyaki

```javascript
ingredients: [
  { id:0,  amount:"200g",   label:"All-purpose flour",       sub:"Plain flour — not self-raising",                      category:"other",   unfamiliar:false, tip:"", visual:"flour",        visualColor:"#F0ECC8", visualBg:"#22211a" },
  { id:1,  amount:"200ml",  label:"Dashi stock",             sub:"Or water + ½ tsp dashi powder",                       category:"liquid",  unfamiliar:true,  tip:"Japanese soup stock made from dried kelp and bonito flakes. Essential for umami flavour. Sold as powder (Hondashi) or liquid in most Asian supermarkets. In a pinch, use chicken stock.", visual:"stock", visualColor:"#D4C896", visualBg:"#22201a" },
  { id:2,  amount:"2",      label:"Eggs",                    sub:"Whisked into the batter",                             category:"protein", unfamiliar:false, tip:"", visual:"egg",          visualColor:"#F5ECD0", visualBg:"#22201a" },
  { id:3,  amount:"400g",   label:"Green cabbage",           sub:"Finely shredded — the main ingredient",               category:"produce", unfamiliar:false, tip:"", visual:"spring_onion", visualColor:"#6aba4c", visualBg:"#162114" },
  { id:4,  amount:"100g",   label:"Bacon or pork belly",     sub:"Thin slices, laid on top of the pancake",             category:"protein", unfamiliar:false, tip:"", visual:"pork",         visualColor:"#C0705A", visualBg:"#2a1a18" },
  { id:5,  amount:"3 tbsp", label:"Okonomiyaki sauce",       sub:"The sweet-savoury brown drizzle on top",              category:"sauce",   unfamiliar:true,  tip:"A thick, sweet-savoury brown sauce specific to okonomiyaki. Tastes like a mix of Worcestershire and ketchup. Sold in Asian supermarkets (Otafuku brand is most common). Can substitute: 2 parts ketchup + 1 part Worcestershire.", visual:"soy_sauce", visualColor:"#3d2810", visualBg:"#1a1208" },
  { id:6,  amount:"2 tbsp", label:"Japanese mayo",           sub:"Kewpie brand if possible — richer than Western mayo",  category:"sauce",   unfamiliar:false, tip:"", visual:"generic",      visualColor:"#F5F0D8", visualBg:"#22201a" },
  { id:7,  amount:"handful",label:"Bonito flakes",           sub:"They wave from the heat — very dramatic",             category:"other",   unfamiliar:true,  tip:"Ultra-thin shavings of dried, smoked tuna. Light pink and feathery. They visibly 'dance' and wave from the heat of freshly cooked food. Sold in small packets at any Asian grocery.", visual:"generic", visualColor:"#D4A878", visualBg:"#22180e" },
  { id:8,  amount:"1 tsp",  label:"Aonori seaweed flakes",   sub:"Green powder or flakes — adds a sea flavour",         category:"other",   unfamiliar:true,  tip:"Bright green dried seaweed flakes or powder with a mild oceanic flavour. Sold in small packets at Asian supermarkets. Can skip — the dish works without it.", visual:"generic", visualColor:"#2a7a2a", visualBg:"#0e1a0e" },
]
```

---

## 7. Files Modified

Only **`forkit-app.jsx`** changes. No other file touches.

| Section | What changes |
|---|---|
| `RECIPES` array | All `ingredients` arrays converted to structured objects |
| `RECIPES` array | All `steps` arrays stay as strings but gain `stepType` auto-detection |
| New constant | `INGREDIENT_VISUALS` — map of key → SVG function |
| New function | `getIngredientVisual(visual, color)` |
| New function | `getStepBadge(text)` — returns badge label from step text |
| New function | `getStepAnim(stepType, vegColor)` — returns animation JSX |
| `RecipeDetail` component | `checkedIng` type changes from `number[]` to `Set` |
| `RecipeDetail` component | New state: `[openTip, setOpenTip]` |
| `RecipeDetail` component | New state: `[activeFilter, setActiveFilter]` |
| `RecipeDetail` component | Ingredient render section completely replaced |
| `RecipeDetail` component | Steps render section: adds badge + animation column |
| `RecipeDetail` component | Back button: `←` → SVG chevron |
| CSS in `<style>` tag | ~60 lines of new animation keyframes + card styles |

---

*End of ForkIt Visual Enhancement Spec v1.0.0*
