# ForkIt — Visual Enhancements Implementation Prompt
> **Attach before using:** `forkit-app.jsx` + `FORKIT_VISUAL_ENHANCEMENTS.md`
> **Output:** Updated `forkit-app.jsx` — single file, all changes applied

---

## MASTER PROMPT
> Paste this once at the start of your Claude Code session with both files attached.

```
I have attached two files:
1. forkit-app.jsx — the current ForkIt prototype React app
2. FORKIT_VISUAL_ENHANCEMENTS.md — the full spec for what needs to change

Read BOTH files fully before writing any code.

SUMMARY OF WHAT WE ARE BUILDING:
ForkIt is a recipe discovery app. We are upgrading the RecipeDetail component to:
1. Replace the plain text ← back button with a proper SVG chevron icon
2. Convert all recipe ingredient arrays from plain strings to structured objects with category, visual, and "What is this?" tooltip data
3. Build a SVG visual library (INGREDIENT_VISUALS) so every ingredient shows a small illustration of what it looks like
4. Add a category filter bar (Protein / Produce / Sauces / Spices / Liquids) above the ingredient list
5. Add "What does this look like?" expandable tips for unfamiliar ingredients (doubanjiang, Sichuan peppercorns, kaffir lime, etc.)
6. Upgrade the step cards to show: an action badge (🔥 High Heat, ♨ Blanching, etc.) + a CSS cooking animation (boil/fry/stir/cut) + "active next step" highlight + green done badge
7. Improve the cooking completion card with a WhatsApp share button

CRITICAL RULES:
- Output the COMPLETE updated forkit-app.jsx — not just the changed sections
- Do NOT remove any existing feature (edit mode, video embed, leaderboard, explore, create tabs, swipe deck, etc.)
- The ingredient data model change must be backward-compatible — all existing ingredient display logic must be updated to handle the new object format
- All CSS animations must be pure CSS keyframes — no external animation libraries
- SVG illustrations must be inline SVG strings — no external images, no emoji in the visual tiles
- The "What does this look like?" tooltip must not close when the ingredient card itself is tapped — only close when the button is tapped again
- checkedIng state must change from number[] to Set for correct toggle behaviour
- Keep the existing edit mode (draft ingredients editing) working after the data model change
- The app must still work as a single self-contained JSX file with no imports except { useState, useRef, useEffect } from "react"

Confirm you have read both files. Then tell me:
1. The 7 changes in your own words
2. How you will handle the backward-compatibility of the ingredient data model change in edit mode
3. That you are ready to write the full updated file

Do NOT write any code yet.
```

---

## PHASE 1 PROMPT — Data Model + SVG Library
> Paste after the master prompt is confirmed. Builds the foundation.

```
Start Phase 1: the data foundation. Write only the top section of forkit-app.jsx up to (but not including) the RecipeDetail component.

STEP 1 — INGREDIENT_VISUALS map
Create a constant object INGREDIENT_VISUALS at the top of the file.
Each key maps to a function: (color) => svgString
Required keys: tofu, pork, beef_chunk, chicken, egg, garlic, ginger, spring_onion, onion, tomato,
bell_pepper, chilli, lemongrass, kaffir_lime, paste_jar, fermented_beans, soy_sauce, oyster_sauce,
chili_oil, coconut_milk, peppercorn, cumin, paprika, turmeric, stock, cornstarch, oil, flour, generic

Each SVG must:
- Have viewBox="0 0 64 64" width="100%" height="100%"
- Use only inline fill/stroke attributes — no <style> tags inside SVG
- Have 5–10 elements maximum — simple enough to read at 64px
- Use the passed `color` parameter as the main fill
- Use rgba(255,255,255,.1) for highlights and rgba(0,0,0,.15) for shadows
- Include a border/outline rect or circle with rgba(255,255,255,.1) stroke

STEP 2 — Helper functions
Write these three functions:

function getIngredientVisual(visualKey, color) {
  // Returns SVG string from INGREDIENT_VISUALS[visualKey](color)
  // Falls back to INGREDIENT_VISUALS.generic(color) if key not found
}

function getStepBadge(text) {
  // Returns { label: string, type: string } based on keywords in text
  // Types: cut, fry, stir, boil, finish, blend, generic
  // See FORKIT_VISUAL_ENHANCEMENTS.md §4 for keyword mapping
}

function getStepAnimType(text) {
  // Returns animation type string: "cut" | "fry" | "stir" | "boil" | "generic"
  // Same keyword detection as getStepBadge
}

function getVegColorFromText(text) {
  // For "cut" type animations — returns hex colour based on ingredient keywords
  // garlic → #FFFACD, ginger → #C88C2A, onion → #D4813A
  // tomato → #E74C3C, pepper → #E67E22, default → #E67E22
}

STEP 3 — RECIPES array with enriched ingredient objects
Convert ALL 4 recipes' ingredients arrays from plain strings to the structured object format.
Use EXACTLY the data from FORKIT_VISUAL_ENHANCEMENTS.md §6.
Every ingredient object must have: id, amount, label, sub, category, unfamiliar, tip, visual, visualColor, visualBg.

STEP 4 — Keep all other existing constants unchanged (COUNTRIES, LEADERBOARD, getYouTubeId, detectType, buildEmbed)

Output everything up to (but not including) the RecipeDetail function.
```

---

## PHASE 2 PROMPT — Ingredient Panel UI
> Paste after Phase 1 output is confirmed correct.

```
Continue with Phase 2: the updated Ingredient panel inside RecipeDetail.

Write the complete updated RecipeDetail component with these changes:

CHANGE 1 — State updates
- Change: const [checkedIng, setCheckedIng] = useState([])
  To:     const [checkedIng, setCheckedIng] = useState(new Set())
- Add:    const [openTip, setOpenTip] = useState(null)
- Add:    const [activeFilter, setActiveFilter] = useState("all")
- Update toggleIng: use Set methods (has, delete, add) instead of array includes/filter

CHANGE 2 — Edit mode ingredient handling
In edit mode, draft.ingredients is still an array of plain strings for editing.
When saving (saveEdit), do NOT convert back to the new object format — keep draft ingredients as the
ingredient objects but with updated label/amount. The simplest approach:
- In edit mode, render each ingredient as: draft.ingredients[i].label + " " + draft.ingredients[i].amount
- On change: update draft.ingredients[i].label only
This keeps the edit mode working without needing to re-build the full object on save.

CHANGE 3 — Category filter bar
Above the ingredient list (between the tabs and the ingredient rows), add:
- Horizontal scroll row of pills: All / 🥩 Protein / 🥬 Produce / 🫙 Sauces / 🌶 Spices / 💧 Liquids / 🫓 Other
- Active pill: background rgba(249,115,22,.15), border rgba(249,115,22,.4), color #f97316
- Inactive pill: background rgba(255,255,255,.05), color #555
- Tapping a pill sets activeFilter state (client-side only)
- Only show pills for categories that actually exist in this recipe's ingredients

CHANGE 4 — "Check all gathered" button
Right-aligned above the ingredient list, below the filter pills.
Text: "Check all ✓" when any unchecked exist, "Uncheck all" when all checked.
Scoped to the current filter view.

CHANGE 5 — Category section headers
When activeFilter === "all", render a small header before each category group:
- font-size: 9px, color: #444, letter-spacing: 2px, text-transform: uppercase, padding: 12px 16px 4px
- Example: "🥩 PROTEIN", "🥬 PRODUCE", "🫙 SAUCES & PASTES"

CHANGE 6 — New ingredient row design
Replace the existing ingredient row with this layout:

<div style={card styles — see below}>
  <div style="width:64px;height:64px;flex-shrink:0;background:ing.visualBg;display:flex;align-items:center;justify-content:center;overflow:hidden">
    {/* dangerouslySetInnerHTML with getIngredientVisual(ing.visual, ing.visualColor) */}
  </div>
  <div style="flex:1;padding:9px 12px 9px 10px">
    <div style="color:#f97316;font-size:11px;font-weight:700">{ing.amount}</div>
    <div style="color:#f5f0e8;font-size:13px;font-weight:600">{ing.label}</div>
    <div style="color:#444;font-size:10px;margin-top:2px">{ing.sub}</div>
    {ing.unfamiliar && (
      <div onClick={e => { e.stopPropagation(); setOpenTip(openTip === ing.id ? null : ing.id) }}
           style="display:inline-flex;...fire orange pill...">
        ❓ What does this look like?
      </div>
    )}
  </div>
  <div style={check circle — 26×26, right side, 12px margin-right}>
    {/* SVG checkmark, opacity/scale transition */}
  </div>
</div>

{/* Tooltip — shown below card when openTip === ing.id */}
{openTip === ing.id && ing.tip && (
  <div style="background:#211f16;border:1px solid rgba(249,115,22,.2);border-radius:10px;padding:10px 12px;margin:2px 12px 6px;font-size:11px;color:#aaa;line-height:1.6;font-family:sans-serif;animation:fadeIn .18s ease">
    {ing.tip}
  </div>
)}

Card states:
- Default: background var(--bg2 or #1a1710), border rgba(255,255,255,.08), border-radius:14px
- Checked: background rgba(34,197,94,.06), border rgba(34,197,94,.22), label strikethrough
- Hover: border-color rgba(249,115,22,.2), translateX(2px)

The card onClick toggles checkedIng (the Set). The tooltip button onClick is stopPropagation.

CHANGE 7 — Progress bar (unchanged logic, just verify it uses checkedIng.size not checkedIng.length)

CRITICAL: The filtered ingredient display logic must be:
- When activeFilter !== "all": only show ingredients where ing.category === activeFilter
- When activeFilter === "all": show all ingredients, grouped by category with headers

Write the complete RecipeDetail function including ALL existing logic (video embed, edit mode, steps, etc.).
Only the ingredients section changes. Everything else stays identical.
```

---

## PHASE 3 PROMPT — Steps Animations + Back Button
> Paste after Phase 2 output is confirmed.

```
Continue with Phase 3: step animations, step card improvements, and the back button fix.

CHANGE 1 — CSS Animations (add to the <style> block inside RecipeDetail)
Add these keyframe animations after the existing fadeIn and slideUp keyframes:

/* Knife chop */
@keyframes knifeChop {
  0%, 35% { transform: translateY(-18px) rotate(-12deg) }
  52%, 65% { transform: translateY(4px) rotate(-12deg) }
  80%, 100% { transform: translateY(-18px) rotate(-12deg) }
}
@keyframes vegLeft  { 0%,50%{transform:translateX(0)} 65%{transform:translateX(-7px)} 90%{transform:translateX(0)} 100%{transform:translateX(0)} }
@keyframes vegRight { 0%,50%{transform:translateX(0)} 65%{transform:translateX(7px)}  90%{transform:translateX(0)} 100%{transform:translateX(0)} }

/* Stir */
@keyframes stirAnim   { 0%{transform:rotate(-25deg)} 50%{transform:rotate(25deg)} 100%{transform:rotate(-25deg)} }
@keyframes bubbleRise { 0%{transform:translateY(0);opacity:.8} 100%{transform:translateY(-16px);opacity:0} }

/* Fry */
@keyframes sizzle { 0%{transform:translateY(0)} 100%{transform:translateY(-2px)} }
@keyframes splat  { 0%{transform:translateY(0);opacity:.8} 100%{transform:translateY(-18px);opacity:0} }

/* Boil */
@keyframes steamRise { 0%{transform:translateY(0) scaleX(1);opacity:.5} 50%{transform:translateY(-8px) scaleX(1.5);opacity:.25} 100%{transform:translateY(-16px) scaleX(2);opacity:0} }
@keyframes waveMove  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* Done badge pop */
@keyframes popIn { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }

CHANGE 2 — Animation rendering functions
Write these as inline JSX-returning functions inside RecipeDetail (or outside as pure functions):

function renderCutAnim(vegColor) — returns JSX for cutting board animation
function renderFryAnim()         — returns JSX for frying wok animation
function renderStirAnim()        — returns JSX for stirring pan animation
function renderBoilAnim()        — returns JSX for boiling pot animation
function renderStepAnim(type, text) — dispatcher: calls the right function based on type

All animations must be contained in a div of width:72px, height:58px.
Use inline styles throughout — no className that references external CSS.

CHANGE 3 — Updated step card
Replace the existing step card render with this layout:

<div key={i} style={{
  background: doneSteps.includes(i) ? "rgba(34,197,94,.07)" : isNext ? "rgba(249,115,22,.06)" : "rgba(255,255,255,.04)",
  border: `1px solid ${doneSteps.includes(i) ? "rgba(34,197,94,.25)" : isNext ? "rgba(249,115,22,.35)" : "rgba(255,255,255,.08)"}`,
  borderRadius: 16, padding: "14px 14px", marginBottom: 11, cursor: "pointer",
  transition: "all .22s", position: "relative", overflow: "hidden"
}} onClick={() => toggleStep(i)}>

  {/* Done badge — top right corner */}
  {doneSteps.includes(i) && (
    <div style={{ position:"absolute", top:12, right:12, width:22, height:22,
      background:"#22c55e", borderRadius:"50%", display:"flex", alignItems:"center",
      justifyContent:"center", animation:"popIn .25s cubic-bezier(.34,1.56,.64,1)" }}>
      ✓  {/* or inline SVG checkmark */}
    </div>
  )}

  <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>

    {/* Left column: step number + animation */}
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{
        width:30, height:30, borderRadius:"50%", flexShrink:0,
        background: doneSteps.includes(i) ? "#22c55e" : "linear-gradient(135deg,#f97316,#ef4444)",
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"#fff", fontWeight:800, fontSize:12, transition:"all .22s"
      }}>
        {doneSteps.includes(i) ? "✓" : s.step}
      </div>
      {/* Only show animation on undone steps */}
      {!doneSteps.includes(i) && renderStepAnim(getStepAnimType(s.text), s.text)}
    </div>

    {/* Right column: badge + title + text */}
    <div style={{ flex:1, minWidth:0 }}>
      {/* Action badge */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:3,
        background:"rgba(249,115,22,.1)", border:"1px solid rgba(249,115,22,.18)",
        borderRadius:7, padding:"3px 8px", fontSize:9, color:"#f97316",
        fontWeight:700, marginBottom:7, fontFamily:"sans-serif"
      }}>
        {getStepBadge(s.text).label}
      </div>
      <div style={{
        color: doneSteps.includes(i) ? "#444" : "#fff",
        fontWeight:700, fontSize:13, marginBottom:5,
        textDecoration: doneSteps.includes(i) ? "line-through" : "none",
        transition:"all .2s"
      }}>
        {s.title}
      </div>
      <div style={{
        color: doneSteps.includes(i) ? "#333" : "#888",
        fontSize:12, lineHeight:1.65, fontFamily:"Georgia,serif"
      }}>
        {s.text}
      </div>
    </div>
  </div>
</div>

Add const isNext = !doneSteps.includes(i) && i === doneSteps.length before the return.

CHANGE 4 — Back button
In the hero section of RecipeDetail, find this button:
  <button onClick={onClose} style={{ background:"rgba(0,0,0,.4)",...,fontSize:18,...}}>←</button>

Replace the ← with an inline SVG chevron:
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
Keep all existing button styles (size, blur, border-radius, etc.) — only change the content.

CHANGE 5 — Completion card WhatsApp button
In the completion/share section, add WhatsApp to the share buttons:
  {["📸 Instagram", "🎵 TikTok", "𝕏 Twitter", "💬 WhatsApp"].map(s => (
    <div key={s} style={{...existing button style...}}>{s}</div>
  ))}

Write the complete RecipeDetail function with ALL three changes applied.
The output should be the final complete RecipeDetail — ready to slot into the file.
```

---

## PHASE 4 PROMPT — Final Assembly
> Paste after Phase 3 output is confirmed. Assembles the complete file.

```
Final phase: assemble the complete updated forkit-app.jsx.

Combine in this exact order:
1. All import statements (just useState, useRef, useEffect from "react")
2. INGREDIENT_VISUALS constant (from Phase 1)
3. Helper functions: getIngredientVisual, getStepBadge, getStepAnimType, getVegColorFromText (from Phase 1)
4. RECIPES array with enriched ingredient objects (from Phase 1)
5. COUNTRIES array (unchanged)
6. LEADERBOARD array (unchanged)
7. Existing helpers: getYouTubeId, detectType, buildEmbed (unchanged)
8. Updated RecipeDetail component (from Phase 2 + Phase 3)
9. ForkItApp main component (completely unchanged — swipe deck, explore, leaderboard, create tabs stay identical)

FINAL CHECKS before outputting:
- [ ] checkedIng is a Set everywhere (useState(new Set()), .has(), .add(), .delete(), .size — not .length, not .includes())
- [ ] All 4 recipes have structured ingredient objects (not plain strings)
- [ ] Edit mode still works: draft.ingredients edits work with the new object format
- [ ] The filter pills only show categories that exist in the current recipe
- [ ] openTip only closes when the ❓ button is tapped again (stopPropagation on card tap)
- [ ] Back button shows SVG chevron not ← text
- [ ] Step animations use inline styles (not className references to missing CSS)
- [ ] No broken references — all function calls use the new data shape
- [ ] The file is self-contained: single JSX file, no external imports except React

Output the complete forkit-app.jsx. If the file is very long, output it in two parts (say "Part 1 of 2" and wait for me to say "continue" before outputting part 2).
```

---

## DEBUG PROMPT
> Use if something breaks after implementation.

```
There is a bug in the updated forkit-app.jsx after the visual enhancement changes.

Problem: [DESCRIBE — e.g. "ingredients not rendering", "check state broken", "tooltip not closing", "animation not showing"]

Likely causes to check first:
1. checkedIng state — is it a Set? Are we using .has() / .size? If you see .includes() or .length, that is the bug.
2. Ingredient data — are we accessing ing.label and ing.amount, or still treating ing as a string?
3. Edit mode — in edit mode, are we reading/writing draft.ingredients[i].label correctly?
4. Tooltip — is event.stopPropagation() on the ❓ button but NOT on the card? If not, both fire.
5. SVG rendering — are we using dangerouslySetInnerHTML={{ __html: getIngredientVisual(...) }} ? React won't render raw SVG strings without this.
6. Animation display — are the animation divs inside the step card? They must be in the left column, not floating.

Fix the specific bug without changing anything else. Show only the changed section, then confirm the fix.
```

---

## QUICK PROMPTS

### Add a new ingredient visual
```
Add a new SVG visual to the INGREDIENT_VISUALS map in forkit-app.jsx.

Ingredient: [NAME]
Visual description: [DESCRIBE what it looks like — shape, colour, texture]
Key name: [SNAKE_CASE key]
Main colour: [HEX]
Background colour: [DARK HEX for the tile bg]

Rules:
- viewBox="0 0 64 64", inline styles only, max 10 SVG elements
- Use the passed `color` parameter as main fill
- rgba(255,255,255,.1) for highlights, rgba(0,0,0,.15) for shadows
- Keep it simple enough to read at 64×64px

Show only the new function to add to INGREDIENT_VISUALS. Do not change anything else.
```

### Add "What is this?" tip to an ingredient
```
In forkit-app.jsx, find the ingredient object with label "[INGREDIENT NAME]" in recipe id [N].
Update it:
  unfamiliar: true,
  tip: "[WRITE A SHORT PLAIN-ENGLISH DESCRIPTION: what it looks like, smells like, where to buy it, any substitutes]"

Show only the changed ingredient object.
```

### Add a new recipe with full visual data
```
Add a new recipe to the RECIPES array in forkit-app.jsx with the full enriched ingredient format.

Recipe name: [NAME]
Country: [COUNTRY], flag: [FLAG EMOJI], country code: [CODE]
Cuisine gradient: [START COLOR], [END COLOR]
Emoji: [SINGLE EMOJI]
Difficulty: [Easy/Medium/Hard]
Time: [X min]

Ingredients: [LIST THEM]

For each ingredient, determine:
- category (protein/produce/sauce/spice/liquid/other)
- unfamiliar: true/false (true if a home cook in Singapore might not recognise it)
- tip (if unfamiliar: brief shopping description)
- visual key from INGREDIENT_VISUALS (or "generic" if not in library)
- visualColor and visualBg (matching the ingredient's real colour)

Steps: [LIST THEM]
For each step, include enough text that getStepBadge() and getStepAnimType() can auto-detect the type.

Show only the new recipe object to add to the RECIPES array.
```

---

*End of ForkIt Visual Enhancements Prompt v1.0.0*
*Applies to: forkit-app.jsx only*
*Companion spec: FORKIT_VISUAL_ENHANCEMENTS.md*
