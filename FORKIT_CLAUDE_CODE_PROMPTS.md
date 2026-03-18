# ForkIt — Claude Code Implementation Prompts
> **Version:** 2.0.0 — updated to reflect guest-first auth, TheMealDB seeding, AuthPromptModal
> Always attach `FORKIT_PROJECT_SPEC.md` (v3.0.0) before using any prompt below.

---

## HOW TO USE

1. **Attach the spec first** — drag `FORKIT_PROJECT_SPEC.md` into Claude Code before pasting any prompt.
2. **Start with the Master Prompt** — orients Claude on the full project without writing any code.
3. **One phase at a time** — paste each Phase Prompt, wait for completion, review, then continue.
4. **Phase 0 must include the seed script** — this is new in v3 and critical before Phase 1.
5. **Use the Debug Prompt** when something breaks.

---

---
## MASTER PROMPT
> Paste this once at the start. No code yet.
---

```
I have attached FORKIT_PROJECT_SPEC.md — please read it fully before doing anything.

ForkIt is a Tinder-style recipe discovery platform. Here is the key context:

WHAT IT IS:
- Users swipe through recipe cards from 20+ countries, vote, save, and follow creators
- Creators upload recipes with ingredients, steps, and embedded YouTube/Facebook videos
- A leaderboard ranks top creators by community votes
- Creator rewards are recognition-based (no monetary reward yet) — see §19 for roadmap

WHAT WE ARE BUILDING:
- One Next.js 14 (App Router) project: landing site + web app on the same domain
- Landing: (landing)/ route group — marketing pages
- App: (app)/ route group — /discover, /explore, /leaderboard, /recipe/[id], etc.
- Backend: Next.js Route Handlers only — no separate server
- Database: Supabase (free tier) — PostgreSQL + Auth + Storage

THREE CRITICAL CONSTRAINTS — NEVER VIOLATE:
1. GUEST-FIRST: /discover, /explore, /leaderboard, /recipe/[id], /profile/[username] must work without login. No auth redirect on these routes.
2. AUTH PROMPT, NOT REDIRECT: When a guest tries to vote/save/follow, show AuthPromptModal — a slide-up sheet with Google sign-in. Never redirect mid-experience.
3. CURATED CONTENT: 300+ recipes from TheMealDB are imported before launch via scripts/seed-from-mealdb.ts. These show a "🍴 ForkIt Curated" badge instead of a creator row. They are not editable by users.

TECH STACK:
- Next.js 14 + TypeScript + Tailwind CSS
- Framer Motion (swipe gestures), Zustand (state), TanStack Query (server state)
- React Hook Form + Zod (forms), shadcn/ui (components)
- @supabase/ssr (server-side Supabase in App Router)
- @vercel/og (OG images, free), Resend (email, free)

DESIGN:
- Dark theme: background #0f0d0a, accent #f97316 (fire), #ef4444 (ember), #22c55e (forest)
- Fonts: Playfair Display (headings), DM Sans (body), DM Mono (mono/labels)
- Mobile-first, card-based, feels like a native app on phones

BUILD ORDER (phases, one at a time):
Phase 0 → Scaffold + Supabase + TheMealDB seed
Phase 1 → Landing website (marketing pages)
Phase 2 → Auth + app shell (guest-first middleware)
Phase 3 → Swipe feed + recipe detail
Phase 4 → Recipe creation + editing
Phase 5 → Community (leaderboard, explorer, follows, notifications)
Phase 6 → SEO, polish, performance, launch

Confirm you have read the spec. Tell me:
1. What ForkIt is in 3 sentences
2. What the 3 critical constraints are
3. That you are ready for Phase 0

Do NOT write any code yet.
```

---

---
## PHASE 0 — Scaffold + Supabase + TheMealDB Seed
---

```
We are starting Phase 0. Set up the complete project foundation.

STEP 1 — Create Next.js project:
npx create-next-app@latest forkit --typescript --tailwind --app --src-dir=no --import-alias="@/*"
(Do NOT use src/ directory)

STEP 2 — Install dependencies:
npm install framer-motion zustand @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js @supabase/ssr
npm install @vercel/og resend recharts tsx
npm install -D @types/node vitest @vitejs/plugin-react

STEP 3 — shadcn/ui setup:
npx shadcn-ui@latest init (Default style, CSS variables: yes)
Add: button, input, textarea, select, tabs, badge, avatar, toast, dropdown-menu, dialog, sheet

STEP 4 — Create EVERY folder and file from the folder structure in spec §7.
Every file should at minimum export a valid placeholder. Exact paths matter.
Key new files vs v2:
- components/auth/AuthPromptModal.tsx (NEW — guest action upsell)
- scripts/seed-from-mealdb.ts (NEW — TheMealDB import)
- supabase/schema.sql (database schema)
- supabase/seed.sql (countries, tags, system profile)

STEP 5 — Tailwind config (spec §11):
Add to tailwind.config.ts:
- Colors: bg-base (#0f0d0a), bg-surface (#1a1710), fire (#f97316), ember (#ef4444), forest (#22c55e), cream (#f5f0e8), muted (#6b6454)
- Font families: display (Playfair Display), body (DM Sans), mono (DM Mono)

STEP 6 — globals.css with all CSS variables from spec §11

STEP 7 — Load Google Fonts in app/layout.tsx:
Playfair Display (wght 700,900; italic 700) + DM Sans (wght 300,400,500,600) + DM Mono (wght 400,500)

STEP 8 — Supabase helpers (lib/supabase/):
- client.ts: browser client using createBrowserClient from @supabase/ssr
- server.ts: server client using createServerClient with cookies
- middleware.ts: session refresh helper function

STEP 9 — middleware.ts (root level) — GUEST-FIRST:
Only protect /create, /saved, /profile/*/edit
ALL other routes pass through without auth check
Use regex: const PROFILE_EDIT = /^\/profile\/[^/]+\/edit/

STEP 10 — types/index.ts:
Define TypeScript interfaces for: Profile, Recipe, Ingredient, RecipeStep, Tag, Vote, SavedRecipe, Follow, Country, Notification
Include enums: RewardTier, Difficulty, VideoType, NotificationType
Add 'source' field to Recipe type: 'community' | 'curated'
Add 'source_url' field to Recipe type: string | null

STEP 11 — Zustand stores:
- stores/authStore.ts: { user: Profile | null, setUser, clearUser, isLoading, setLoading }
- stores/swipeStore.ts: { seenIds: Set<string>, savedIds: string[], addSeen, addSaved, reset }

STEP 12 — lib/video.ts: detectVideoType() + buildEmbedUrl() (exact code from spec §9.9)
STEP 13 — lib/rewards.ts: calculateTier() + CUISINE_GRADIENTS (exact code from spec §11 + §9.7)

STEP 14 — .env.example with all variables from spec §12 and placeholder values

STEP 15 — Root app/layout.tsx:
TanStack Query provider, Supabase session provider, Toaster, dark background, correct font classes

STEP 16 — supabase/schema.sql:
Write the COMPLETE SQL from spec §8 including:
- All CREATE TYPE enums
- All CREATE TABLE statements (include 'source' and 'source_url' columns on recipes)
- All CREATE INDEX statements
- handle_new_user() trigger
- update_vote_counts() trigger
- increment_country_count() RPC function
- All RLS ALTER TABLE and CREATE POLICY statements
- NOTE: recipes.source has DEFAULT 'community', not 'curated'

STEP 17 — supabase/seed.sql:
- System curator profile (UUID: 00000000-0000-0000-0000-000000000001)
- All 26 countries from spec §8 seed data
- Sample tags from spec §8

STEP 18 — scripts/seed-from-mealdb.ts:
Write the COMPLETE import script from spec Appendix A.
It must:
- Loop through all 26 AREAS array
- Fetch meal list per area from TheMealDB
- Fetch full detail per meal
- Parse ingredients (strIngredient1-20 + strMeasure1-20)
- Parse steps (split instructions on newlines, filter short lines)
- Insert recipe with source='curated', author_id=SYSTEM_USER_ID
- Insert ingredients and steps
- Call increment_country_count RPC
- Sleep 500ms between each meal request
- Use SUPABASE_SERVICE_ROLE_KEY (service role, not anon)

RULES:
- TypeScript strict mode throughout
- Named exports for components, default exports for page.tsx
- No 'any' types
- Every exported file must have valid TypeScript syntax

When done, show the complete folder tree and confirm all files exist.
Then say: "Phase 0 complete. Ready for Phase 1."
```

---

---
## PHASE 1 — Landing Website
---

```
Phase 0 is complete. Build Phase 1: the Landing Website.

IMPORTANT CHANGES VS OLD VERSION:
- Primary CTA is now "🔥 Browse Free" / "🔥 Start Browsing Free" — NOT "Get Early Access"
- Hero guest badge: "✅ No account needed — browse everything for free"
- Hero stats: 300+ Recipes Ready / 20+ Countries / 0 Ads. Ever. / $0 To Browse
- There is a new "Curated Library" section (between About and How It Works)
- Creator rewards section must be HONEST about no monetary reward, with future roadmap
- App CTA: "Browse Free — No Sign Up" primary, App Store/Play Store as secondary (coming soon)

BUILD app/(landing)/layout.tsx:
- Imports Navbar and Footer
- Navbar: fixed, frosted glass on scroll, "Fork[fire]It" logo, nav links (About, Recipes, How It Works, Features, Creators), "🔥 Browse Free" CTA button

BUILD app/(landing)/page.tsx — 10 sections in this exact order:

1. HERO:
Left side:
- Kicker pill: "🍴 300+ Curated Recipes Ready Now" (pulsing dot)
- Headline: "Swipe / your next / obsession." (Playfair Display, huge, fire colour on "your next")
- Subtitle: explains ForkIt, includes "No ads. No life stories. No account required."
- Green guest badge: "✅ No account needed — browse everything for free"
- Two CTAs: "🔥 Start Browsing Free" (primary gradient) + "Share Your Recipe ✨" (ghost)
- Stats row: 300+ Recipes Ready / 20+ Countries / 0 Ads. Ever. / $0 To Browse

Right side:
- Floating phone card stack (3 overlapping recipe cards, CSS float animations)
- Each card is a mini recipe card with gradient background, emoji, country badge, recipe name
- Top card (most visible): Mapo Tofu with mock swipe buttons ✕ and ♥
- Floating labels: "← Swipe to skip", "❤️ 4,821 votes this week", "🍴 ForkIt Curated"

2. TICKER:
- Scrolling infinite marquee of 14 recipe names (duplicate for seamless loop)
- Pauses on hover
- Subtle border top/bottom

3. ABOUT ("Recipes were boring. We fixed that."):
- 2-column: text left, orbiting emoji ring right
- Text: 4 paragraphs — punchy, honest, includes "You don't need an account to start."
- Pill tag cloud: "Free to browse", "No sign-up required", "Swipe to discover", etc.
- Orbiting emoji ring: 🍴 centre, 6 food emojis orbiting via CSS keyframes

4. CURATED LIBRARY (NEW SECTION - dark bg2):
- Section header: "Ready on Day One" kicker, "300+ recipes. / 20+ countries. Zero wait." headline
- Subtitle: explains the curated library exists from day one so visitors always find something
- 8-tile grid: Japan, China, India, Mexico, Italy, Morocco, Thailand, France — each shows flag, country name, approx recipe count, top dish
- Note box: "These recipes are curated by the ForkIt team — each includes ingredients, steps, and many include an embedded YouTube tutorial. More added every week."
- Dark bg2 background with fire-colour gradient lines top and bottom

5. HOW IT WORKS:
- 4-step grid: 01 Discover / 02 Explore / 03 Cook / 04 Share
- Each: step number in mono font, large emoji, Playfair title, description
- Note in intro: "no account needed for any of them"

6. FEATURES BENTO:
- 3-column asymmetric grid (cards 1 spans 2 cols)
- Cards: Tinder-style swipe (wide, mini card demo), Country explorer (flag grid), Live leaderboard (mini ranked list), Embedded videos, Interactive cooking mode, Creator editing
- Each: icon, title, description, coloured tag badge, hover lift + fire border

7. CREATOR REWARDS:
- Section header + HONEST note box (green/forest accent):
  "ForkIt is built by one person, zero budget. We can't pay creators yet. What we can do is build you a genuine audience, index your recipes on Google, shout you out on social media, and make warm introductions to brands when the time comes."
- 4 tier cards: Starter / Hot Chef / Star Creator (featured) / Legend
- Each tier shows votes required and specific non-monetary perks
- Below tiers: Future monetization roadmap (4 stages: Recognition → Tipping → Sponsored → Creator Fund)
  as a 4-column card grid with stage number, title, description

8. COUNTRIES STRIP:
- "20 Cuisines from Day One" + "The whole world is on the menu."
- Horizontal scroll of 16 country tiles (flag, name, recipe count, top dish)

9. TESTIMONIALS:
- 3 creator cards with quotes, name, handle, tier, stars
- Testimonial 2 specifically mentions "I didn't even need an account to start swiping"

10. CTA BAND:
- "Your next favourite meal / is one swipe away."
- "300+ recipes across 20+ countries. Free forever for explorers."
- Green guest callout: "✅ Browse, swipe & cook — completely free, no sign-up"
- "🔥 Start Browsing Free" primary button (large)
- App Store button (active) + Google Play button (labelled "Coming soon to")

BUILD app/(landing)/about/page.tsx (simple, reuses design system)
BUILD app/(landing)/creators/page.tsx (detailed tier breakdown + full monetization roadmap)
BUILD app/(landing)/login/page.tsx (email + Google + Facebook, link to signup)
BUILD app/(landing)/signup/page.tsx (email + Google + Facebook, link to login)

ANIMATION REQUIREMENTS:
- IntersectionObserver scroll-reveal on .reveal elements
- CSS float animation on phone cards (different delays per card)
- CSS orbit animation on emoji ring
- CSS ticker marquee animation
- Frosted glass nav on scroll

RULES:
- Mobile responsive at 375px — all sections must work on phone
- The "Browse Free" button on desktop nav should link to /discover
- Ticker must be perfectly seamless (duplicate content array)
- No placeholder TODO sections — every section fully built

When done: list all files created.
```

---

---
## PHASE 2 — Auth + App Shell (Guest-First)
---

```
Phase 1 is complete. Build Phase 2: Auth and the App Shell.

CRITICAL: This phase implements the guest-first auth model. The app shell must render for unauthenticated users on most routes.

TASK A — Supabase Auth Pages:
app/(landing)/login/page.tsx (may already exist from Phase 1 — complete it):
- Email + password form (React Hook Form + Zod)
- "Continue with Google" button
- "Continue with Facebook" button
- supabase.auth.signInWithPassword() for email
- supabase.auth.signInWithOAuth({ provider: 'google' | 'facebook' }) for OAuth
- On success: redirect to ?next param or /discover
- Error states: inline form errors + toast

app/(landing)/signup/page.tsx:
- Email + password + username fields
- Username validation: lowercase, alphanumeric + underscore, 3-20 chars
- OAuth buttons
- On success: "Check your email to confirm your account"

app/auth/callback/route.ts:
- Handles supabase OAuth callback (exchanges code for session)
- Redirects to /discover or ?next on success, /login?error=... on failure

app/auth/confirm/route.ts:
- Handles email verification link
- Redirects to /discover on success

TASK B — Supabase Helpers (fill in Phase 0 placeholders):
lib/supabase/client.ts:
  import { createBrowserClient } from '@supabase/ssr'
  export const createClient = () => createBrowserClient(url, key)

lib/supabase/server.ts:
  import { createServerClient } from '@supabase/ssr'
  // Server-side client that reads/writes cookies
  // Used in Route Handlers and Server Components

middleware.ts (root — already created in Phase 0 but confirm it's correct):
  - Only blocks /create, /saved, /profile/*/edit
  - All other routes pass through freely
  - On block: redirect to /login?next={pathname}
  - Also refreshes Supabase session cookie on every request

TASK C — Auth Store + useUser Hook:
stores/authStore.ts: full Zustand store
hooks/useUser.ts:
- Client hook
- On mount: calls supabase.auth.getUser() + fetches profile from profiles table
- Sets user in Zustand store
- Returns { user, isLoading, isAuthenticated }

TASK D — AuthPromptModal (NEW — critical for guest-first):
Build components/auth/AuthPromptModal.tsx:

Props: { action: 'vote' | 'save' | 'follow' | 'submit', onClose: () => void, onSuccess?: () => void }

Design:
- Mobile: slides up from bottom (fixed, bottom-0, left-0, right-0, rounded-top-xl)
- Desktop: centered modal (max-w-sm, centered with backdrop)
- Dark glass background (bg-surface), fire orange accent
- Backdrop overlay (click to close)

Content per action:
- 'vote': "❤️ Vote for this recipe" — "Show some love for [recipe name] and help it climb the leaderboard."
- 'save': "🔖 Save this recipe" — "Save it to your personal cookbook for when you're ready to cook."
- 'follow': "👤 Follow this creator" — "Get their new recipes in your feed first."
- 'submit': "🍴 Share your recipe" — "Publish your recipe and start earning votes. Free, takes 2 minutes."

Auth options in modal:
1. "Continue with Google" — primary button, gradient
2. "Continue with email →" — secondary link
3. Tiny text: "Already have an account? Log in"
"Takes 10 seconds. No credit card." reassurance text.

After OAuth completes: onSuccess() is called so the parent can complete the original action.

TASK E — Update hooks to use AuthPromptModal:
hooks/useVote.ts:
- If user is null when toggle() called: set showAuthPrompt=true (don't call API)
- If user exists: proceed with mutation
- Return { toggle, showAuthPrompt, setShowAuthPrompt, voted, voteCount }

hooks/useSave.ts:
- Same pattern as useVote

TASK F — App Layout:
app/(app)/layout.tsx:
- Server component
- Does NOT hard-redirect unauthenticated users
- Fetches optional session (may be null)
- Renders: AppNav, {children}, BottomNav

components/layout/AppNav.tsx:
- Logo left: "ForkIt" Playfair Display
- If authenticated: notification bell (unread badge), user avatar dropdown (Profile, Saved, Sign Out)
- If guest: "Sign In" ghost button + "Start Browsing" (already on page, so maybe just "Sign In")
- Sticky top, frosted glass backdrop

components/layout/BottomNav.tsx:
- Fixed bottom on mobile (hidden md:hidden)
- 4 tabs: 🔥 Swipe (/discover) | 🌍 Explore | 🏆 Leaderboard | ✨ Create
- Active: fire orange + gradient underline bar
- Create tab: if guest, tapping shows AuthPromptModal (action='submit')

TASK G — Basic Profile Page:
app/(app)/profile/[username]/page.tsx (SSR):
- Fetch profile + public recipes
- generateMetadata
- Render ProfileHeader + recipe grid

components/profile/ProfileHeader.tsx:
- Avatar (initials if no image), display name, username, bio, country
- TierBadge component
- Social links (icons linking out to Instagram, TikTok, YouTube, Facebook)
- Follower / following counts
- Follow button: if guest → AuthPromptModal(action='follow'); if auth → toggle follow
- "Edit Profile" button (own profile only)

components/profile/TierBadge.tsx:
- Coloured pill: 🌱 Starter (muted) / 🔥 Hot Chef (orange) / ⭐ Star Creator (orange, bold) / 🏆 Legend (gradient)

RULES:
- AppNav must display correctly for BOTH authenticated and guest users — no crashes
- AuthPromptModal must be globally accessible without deep prop-passing (consider Zustand or React context)
- The "Create" bottom nav tab must trigger AuthPromptModal for guests, not redirect
- Profile page works for all visitors without auth

When done, confirm:
1. Guest can visit /discover without login
2. AuthPromptModal appears when guest taps vote on swipe card
3. App shell renders correctly with bottom nav
```

---

---
## PHASE 3 — Swipe Feed + Recipe Detail
---

```
Phase 2 is complete. Build Phase 3: the Swipe Feed and Recipe Detail page.

CRITICAL RULE: Both /discover and /recipe/[id] must work for unauthenticated guests.

TASK A — Feed API:
app/api/recipes/feed/route.ts:
- GET handler
- NO auth required (public endpoint)
- Query params: limit (default 20), exclude (comma-separated IDs)
- Supabase query: select recipes + profiles, order by total_votes DESC then created_at DESC
- Filter: published=true, exclude provided IDs
- Return: { recipes: Recipe[], hasMore: boolean }

app/api/recipes/route.ts (GET):
- Public endpoint
- Query params: country, tag, sort, search, featured, limit
- Full-text search: .textSearch('title', q, { type: 'websearch' }) when search param provided

TASK B — SwipeCard Component:
components/recipe/SwipeCard.tsx:

Props: { recipe: Recipe, onSwipeRight, onSwipeLeft, onViewDetail, style? }

Build with Framer Motion:
- useMotionValue(0) for x
- useTransform(x, [-150,0,150], [-15,0,15]) for rotate
- drag="x" dragConstraints={{ left:0, right:0 }}
- animate prop controlled by parent (for programmatic swipe)
- onDragEnd: velocity > 500 or offset > 120 → trigger swipe; else spring back

Card visual:
- Full gradient background from CUISINE_GRADIENTS (country_code → gradient)
- Top row: country badge (flag + name) + time badge
- Centre: large emoji (68px, drop shadow)
- Bottom: title (Playfair Display 24px), description (2 lines), tags row, creator row

Creator row rules:
- If recipe.source === 'curated': show "🍴 ForkIt Curated" badge (no avatar, no username)
- If recipe.source === 'community': show avatar circle (initials), username, vote count
- "View →" button always present

SWIPE overlays:
- Dragging right > 60px: green "SAVE 🔥" badge fades in (top-left, rotated)
- Dragging left < -60px: red "SKIP ✗" badge fades in (top-right, rotated)

TASK C — SwipeDeck:
components/recipe/SwipeDeck.tsx:

- Manages a batch of 20 cards
- Renders: active card (z-index 3) + 2 shadow cards behind (scaled down, offset)
- Tracks seenIds in swipeStore
- On swipeRight: add to seenIds + savedIds; if authenticated call POST /api/votes; if guest call setShowVotePrompt(true) AFTER adding to seen (still advances the card)
- On swipeLeft: add to seenIds only
- When remaining < 5: fetch next batch (exclude all seenIds)
- Empty state: "You've seen it all! 🎉" with "Start Over" and "Explore by Country" buttons
- Random button: setCardIndex(random unseen index)

Action buttons row (below card):
✕ (red ring) | 📖 (grey, opens detail) | ♥ (green ring)
Arrow keys: Left → swipeLeft, Right → swipeRight, Enter → openDetail (add keydown listener)
Accessibility hint: "← → Arrow keys to swipe" below buttons

Saved recipes strip at bottom:
- Shows recipes in savedIds as small gradient chips
- Clicking opens RecipeDetail

TASK D — Discover Page:
app/(app)/discover/page.tsx:
- "Discover • What's next?" header
- 🎲 Random button
- <SwipeDeck /> 
- Saved recipes strip
- Note: page is fully public

TASK E — Recipe Detail:
app/(app)/recipe/[id]/page.tsx:
- Server component (SSR for SEO)
- Fetch recipe with all relations (ingredients, steps, author profile)
- generateMetadata with dynamic title + OG image
- JSON-LD Recipe schema:
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Recipe',
    name: recipe.title, description: recipe.description,
    author: { '@type': 'Person', name: recipe.author.display_name },
    recipeIngredient: recipe.ingredients.map(i => i.text),
    recipeInstructions: recipe.steps.map(s => ({ '@type': 'HowToStep', name: s.title, text: s.body })),
    cookTime: `PT${recipe.time_minutes}M`, recipeYield: String(recipe.servings),
  }) }} />
- Renders <RecipeDetail recipe={recipe} currentUserId={currentUser?.id} />

components/recipe/RecipeDetail.tsx:
Build in sections:

HERO:
- Gradient background by country_code (CUISINE_GRADIENTS)
- Dark overlay gradient (180deg, transparent → 60% black)
- Back button (← circles)
- Edit button: ONLY if recipe.source === 'community' AND currentUserId === recipe.author_id
- Bookmark toggle (useSave hook — triggers AuthPromptModal if guest)
- Vote heart toggle (useVote hook — triggers AuthPromptModal if guest)
- Vote count displayed
- Large emoji (52px)
- Recipe title (Playfair Display, white, 24px)
- Chips: country flag + name, time, servings, difficulty

CREATOR / CURATOR BAR:
if (recipe.source === 'curated') {
  // Show ForkIt Curated badge only
  <div>🍴 ForkIt Curated · Hand-picked by the ForkIt team</div>
} else {
  // Show author avatar, display name, username, total votes, Follow button
  // Follow button triggers AuthPromptModal if guest
}

DESCRIPTION + TAGS: italic quote, tag pills

VIDEO SECTION: see VideoEmbed component below

TAB BAR: shadcn Tabs, Ingredients | Steps tabs

INGREDIENTS TAB (components/recipe/IngredientList.tsx):
- Checkable rows (tap to cross off) — local state only
- Progress counter + bar
- Edit mode: text inputs + add/remove buttons (only in edit mode)

STEPS TAB (components/recipe/StepsList.tsx):
- Completable cards (tap to mark done)
- Green tick badge when done
- Progress bar
- Completion state (100%): 🍽️ "You cooked it!" + share prompt
  Share buttons: Copy, X, WhatsApp (pre-filled caption with recipe name + ForkIt)
- Edit mode: title input + body textarea + add/remove

EDIT MODE (community recipes, owner only):
- "✏️ Edit Recipe" button visible only when source==='community' && currentUserId===author_id
- All sections switch to edit mode simultaneously
- Title becomes editable input
- Description becomes textarea
- Video URL becomes input with live detection preview
- "💾 Save" → PATCH /api/recipes/[id]
- "Cancel" → discard all changes

components/recipe/VideoEmbed.tsx:
- Import detectVideoType, buildEmbedUrl from lib/video.ts
- If video_url: render 16:9 iframe (padding-top:56.25% wrapper)
- Platform badge: "▶️ YouTube" or "👤 Facebook"
- video_note callout box if present
- No video + owner: "Add a video link" prompt that enables edit mode
- No video + guest/non-owner: dashed empty placeholder

TASK F — Votes + Saves API:
app/api/votes/route.ts (POST { recipeId }):
- Requires auth (return 401 if no session)
- Check not own recipe
- Toggle vote (insert if not exists, delete if exists)
- After vote: calculateTier(author.total_votes) — if tier changed, update profile + create notification + send Resend email
- Return { voted: boolean, totalVotes: number }

app/api/saves/route.ts (POST { recipeId }):
- Requires auth
- Toggle save (insert/delete saved_recipes)
- Return { saved: boolean }

TASK G — OG Image:
app/api/og/recipe/[id]/route.tsx:
- @vercel/og ImageResponse, 1200×630
- Fetch recipe (use service role key)
- Gradient background from CUISINE_GRADIENTS
- Large emoji, recipe title (Playfair Display), country flag + name, "by @username on ForkIt", vote count
- Bottom right: ForkIt logo

RULES:
- SwipeDeck must work with 0 authenticated state — guests can swipe freely
- When guest swipes right, save locally (swipeStore.savedIds) WITHOUT calling the API — show AuthPromptModal optionally but don't block the swipe
- The "View →" button must always work — opening RecipeDetail is never gated
- RecipeDetail voting/saving triggers AuthPromptModal for guests
- Curated recipes: no edit button, no "Follow" button in creator bar

When done, test the complete guest swipe flow (no account) and confirm it works.
```

---

---
## PHASE 4 — Recipe Creation + Editing
---

```
Phase 3 is complete. Build Phase 4: Recipe Creation and Editing.

TASK A — Recipe Form Component:
components/recipe/RecipeForm.tsx (mode: 'create' | 'edit', initialData?: Recipe):

Implement CreateRecipeSchema in lib/validation.ts:
- title: string (3-100 chars)
- description: string (20-500 chars)
- emoji: string (single emoji)
- countryCode + countryName + countryFlag: from country select
- difficulty: 'easy' | 'medium' | 'hard'
- timeMinutes: number (1-1440)
- servings: number (1-100)
- tags: string[] (max 8, each 3-30 chars)
- videoUrl: optional, regex validates YouTube or Facebook URL if provided
- videoNote: optional, max 200 chars
- ingredients: { text, sort_order }[] (min 2)
- steps: { step_number, title, body }[] (min 2)
- imageUrl: optional string

FORM SECTIONS (single scroll):

Section 1 — BASICS:
- Recipe name input
- Emoji input ("e.g. 🍳")
- Country searchable select: load from Supabase countries table, show flag + name
- Difficulty radio: Easy / Medium / Hard
- Cook time (minutes) number input
- Servings number input

Section 2 — DESCRIPTION & TAGS:
- Description textarea
- Tags: type + Enter to add (max 8), each shown as removable pill badge

Section 3 — COVER IMAGE:
- File input (JPEG/PNG, max 5MB)
- Client-side preview
- Upload happens at submit time via POST /api/upload

Section 4 — INGREDIENTS (dynamic):
- "Add Ingredient" button
- Each row: text input + drag-handle (or up/down arrows) + × remove
- Min 2 enforced (error on submit if less)

Section 5 — STEPS (dynamic):
- "Add Step" button
- Each step card: auto-numbered, title input, body textarea, × remove
- Auto-renumber on remove

Section 6 — VIDEO (optional):
- URL input (monospace)
- Auto-detect platform on blur: show ▶️ YouTube or 👤 Facebook badge
- Live embed preview shown

Submit button: "🚀 Submit Recipe" — shows spinner while uploading

TASK B — Upload API:
app/api/upload/route.ts:
- POST with FormData
- Validate: MIME in [image/jpeg, image/png, image/webp], max 5MB
- Upload to Supabase Storage bucket 'recipe-images' at path: {userId}/{timestamp}-{filename}
- Return { url: string } (public URL)

TASK C — Create Recipe API:
app/api/recipes/route.ts (POST):
- Auth required
- Validate body with CreateRecipeSchema
- Insert recipe (source='community', author_id = auth user)
- Insert all ingredients
- Insert all steps
- Find or create tags, create recipe_tags joins
- Increment countries.recipe_count
- Return full recipe

TASK D — Edit + Delete API:
app/api/recipes/[id]/route.ts:
- GET: full recipe with relations (public, no auth needed)
- PATCH: requires auth + recipe.author_id === user.id + recipe.source === 'community'
  Delete + re-insert ingredients and steps (simple approach)
  Update recipe fields and tags
  Return updated recipe
- DELETE: requires auth + owner + community only
  Set published=false (soft delete) OR hard delete

TASK E — /create Page:
app/(app)/create/page.tsx:
- Auth-gated (middleware handles redirect)
- Renders RecipeForm mode="create"
- On success: redirect to /recipe/{newId} with toast "🚀 Recipe is live!"
- Below form: small collapsible "Rewards preview" showing what votes will unlock

TASK F — Saved Recipes Page:
app/(app)/saved/page.tsx:
- Auth-gated
- Fetch saved_recipes for current user (joined with recipes + profiles)
- Render as 2-column grid of RecipeCard components
- Empty state: "Nothing saved yet. Start swiping! 🔥" with link to /discover

components/recipe/RecipeCard.tsx (compact grid card):
- Gradient background (cuisine colour), emoji, title, country + flag, time, creator or "Curated" badge, vote count
- Tap → navigate to /recipe/[id]
- Hover: lift + fire border

RULES:
- Curated recipes are never submitted through this form; source always 'community' on creation
- Form state should warn before navigating away (useBeforeUnload or confirm dialog)
- Image upload is step 1 of submit; if it fails, allow submit without image
- Edit mode in RecipeDetail uses the same Zod schemas as create mode
```

---

---
## PHASE 5 — Community Features
---

```
Phase 4 is complete. Build Phase 5: Community Features.

TASK A — Country Explorer:
app/(app)/explore/page.tsx:
- Public (no auth)
- Server: fetch countries with recipe_count + trending recipes (last 7 days, top votes)
- Stats banner: total countries, total recipes, total profiles (aggregate queries)
- Search bar (client-side filter on loaded country list)
- CountryGrid (2-col mobile, 4-col desktop)
- Trending section below grid (5 recipes as horizontal cards)

components/explore/CountryGrid.tsx + CountryTile.tsx:
- CountryTile: flag, name, recipe count
- On click: expand to show top dish + vote count
- "Browse [Country] recipes →" → /explore?country=XX
- CountryGrid handles selectedCountry state, queries filtered recipes on expansion

TASK B — Leaderboard:
app/api/leaderboard/route.ts:
export const revalidate = 3600; // ISR: regenerate hourly
- GET with filter param (alltime | month | country)
- Always exclude forkit_curated: WHERE username != 'forkit_curated'
- alltime: profiles ORDER BY total_votes DESC LIMIT 50
- month: join votes WHERE created_at > 30 days ago GROUP BY profile
- country: alltime with profiles.country = countryCode filter

app/(app)/leaderboard/page.tsx:
- Public (no auth)
- Filter tab state (client)
- Fetches /api/leaderboard?filter=...
- Re-fetches on filter change

components/leaderboard/Podium.tsx:
- Rank 2 left (medium height), rank 1 centre (tallest), rank 3 right (shortest)
- Each: rank badge emoji, avatar circle (initials + gradient), username, total votes
- Podium bars animate up with CSS on mount

components/leaderboard/LeaderboardRow.tsx:
- Rank#, avatar, username + country flag, recipe count, total votes
- Progress bar comparing to rank #1 votes

TASK C — Follow System:
app/api/follows/[username]/route.ts:
- POST: insert into follows (auth, check not self-follow)
- DELETE: delete from follows (auth)
- Both return { following: boolean, followerCount: number }

Update ProfileHeader.tsx:
- Check if current user follows this profile
- Follow button: if guest → AuthPromptModal(action='follow'); if auth → call API
- Optimistic UI: update follower count immediately

TASK D — Notifications:
app/api/notifications/route.ts:
- GET: fetch user's notifications ORDER BY created_at DESC LIMIT 20 (auth)
- PATCH body {readAll:true}: mark all read (auth)

Update AppNav.tsx with notification bell:
- Fetch notifications on mount with TanStack Query (refetch every 60s)
- Show unread count badge (red circle) on bell icon
- Click → shadcn DropdownMenu showing last 10 notifications
- Each notification: icon per type, message, "2h ago" relative time, read/unread styling
- "Mark all read" button at top

Generate notifications in these Route Handlers:
- /api/votes POST (after vote): insert new_vote notification { recipe_id, recipe_title, voter_username }
- /api/follows/[username] POST: insert new_follower notification { follower_username }
- /api/votes POST (after tier upgrade): insert tier_upgrade notification { new_tier }

TASK E — Tier Upgrade Email:
lib/resend.ts:
- sendTierUpgradeEmail(toEmail, newTier, displayName, recipeTitle)
- Uses Resend SDK
- HTML email: congrats, new tier name + emoji, what new perks they unlocked, link to profile
- Only send in production (check NODE_ENV !== 'development')

TASK F — Recipe Search:
In app/api/recipes/route.ts GET handler:
- If search param provided: .textSearch('title', query, { type: 'websearch', config: 'english' })

In app/(app)/explore/page.tsx:
- Add search input above country grid
- useDebounce hook (400ms)
- Query /api/recipes?search=... when debounced value changes
- Show recipe results below search when query is active
- Empty state: "No recipes found for '[query]'. Try something else."

TASK G — Creator Analytics:
In app/(app)/profile/[username]/page.tsx:
- If viewing own profile AND (reward_tier === 'hot_chef' || 'star_creator' || 'legend')
- Show analytics section below recipe grid
- Fetch: for each recipe, total_votes + count of saves
- Render as Recharts BarChart (dynamic import, ssr:false):
  x-axis: recipe titles (truncated to 15 chars)
  y-axis: votes
  Bar fill: #f97316 (fire orange)
  Bar label: vote count on top

RULES:
- Leaderboard must exclude forkit_curated from all rankings
- ISR on leaderboard (revalidate=3600) — no Redis needed
- Follow/unfollow must use optimistic UI
- Notifications use 60s polling, NOT WebSockets
- Recipe search uses Supabase textSearch, NOT external service

When done, confirm all 5 community features are working and the leaderboard excludes the curated system profile.
```

---

---
## PHASE 6 — SEO, Polish & Launch
---

```
Phase 5 is complete. Final phase — make it production-ready and launch.

TASK A — SEO & Metadata:
generateMetadata() on every page:
- app/(landing)/page.tsx: static meta + OG
- app/(app)/recipe/[id]/page.tsx: dynamic title "[Recipe] — ForkIt", OG image URL
- app/(app)/profile/[username]/page.tsx: dynamic title "@user's recipes on ForkIt"
- All other (app) pages: relevant static metadata

app/api/og/profile/[username]/route.tsx:
- @vercel/og, 1200×630
- Gradient background, avatar circle (initials), display name, @username
- Tier badge, recipe count, vote count, ForkIt branding

app/sitemap.ts:
- Fetch all published recipe IDs and all usernames from Supabase
- Return entries for: /, /about, /creators, /discover, /explore, /leaderboard, /create, /recipe/[each id], /profile/[each username]
- Set lastModified and changeFrequency appropriately

app/robots.ts:
- Disallow: /api/, /profile/*/edit, /create, /auth/
- Allow: everything else

JSON-LD on recipe pages (already in Phase 3 — confirm it's correct and complete).

TASK B — Loading Skeletons:
Create components/ui/Skeleton.tsx (if not in shadcn already):
- Animated shimmer: bg-surface with animate-pulse, rounded

Add skeletons to:
- SwipeDeck: show single skeleton card while initial feed loads
- RecipeDetail: skeleton hero + skeleton tabs while loading
- Leaderboard page: 5 skeleton rows
- Profile page: skeleton header + 4 skeleton recipe cards
- Explore page: skeleton country grid (8 tiles)

TASK C — Error Boundaries + Empty States:
components/ui/ErrorBoundary.tsx (React class component):
- Catches render errors in subtree
- Shows: "Something went wrong 🤔" + Retry button + optional error details

Wrap in ErrorBoundary: SwipeDeck, RecipeDetail, Leaderboard, Profile recipe grid

components/ui/EmptyState.tsx:
Props: { emoji, title, description, actionLabel?, actionHref? }
Use in:
- SwipeDeck exhausted: 🎉 "You've seen it all! Explore by country or start over."
- Saved page: 🔖 "Nothing saved yet. Start swiping!"
- Profile with no recipes: ✨ "No recipes yet. Share your first dish!"
- Search no results: 🔍 "No recipes found for '[query]'."

TASK D — Toast Notifications:
Add toast() calls for all user actions:
- Vote added: "❤️ Voted!"
- Vote removed: "Vote removed"
- Saved: "🔖 Saved to cookbook"
- Unsaved: "Removed from saved"
- Recipe created: "🚀 Your recipe is live!"
- Recipe updated: "💾 Changes saved"
- Recipe deleted: "Recipe deleted"
- Followed: "Following @username"
- Unfollowed: "Unfollowed @username"
- Error: "Something went wrong. Please try again." (on any API failure)

TASK E — Keyboard Accessibility:
SwipeDeck keydown handler:
- ArrowRight → swipeRight()
- ArrowLeft → swipeLeft()
- Enter or Space → openDetail()

aria-label on ALL icon-only buttons across the entire app:
- Heart/vote button: "Vote for this recipe"
- Bookmark button: "Save recipe"
- Skip button: "Skip this recipe"
- Close/back button: "Close"
- Bell button: "Notifications"
- Random button: "Surprise me"

TASK F — Performance:
next/image for all recipe images:
- sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
- priority={true} on first visible card

ISR: confirm revalidate is set on leaderboard and explore (countries) route handlers

Dynamic imports (lazy):
- Recharts analytics: dynamic(() => import('recharts'), { ssr: false })
- RecipeForm: dynamic(() => import('@/components/recipe/RecipeForm'))

TASK G — Final Config:
next.config.ts:
- images.remotePatterns: add www.themealdb.com (for curated images) and supabase project URL
- reactStrictMode: true

.github/workflows/deploy.yml: CI/CD as per spec §16

README.md (comprehensive):
- Project overview + tech stack
- Local setup (clone → install → .env.local → supabase SQL → seed script → npm run dev)
- Supabase setup guide (schema, seed, storage bucket, OAuth)
- TheMealDB seed script instructions
- Vercel deploy guide
- Environment variables reference table
- Phase implementation checklist

FINAL CHECKLIST — fix any issues:
- [ ] npm run build completes without TypeScript errors
- [ ] npm run lint passes
- [ ] Guest can visit /discover and /recipe/[id] without any login prompt
- [ ] AuthPromptModal appears on vote/save/follow (guest)
- [ ] Curated recipes show ForkIt Curated badge, no edit/follow buttons
- [ ] Leaderboard excludes forkit_curated
- [ ] TheMealDB images load correctly (add domain to next.config.ts)
- [ ] YouTube embeds render
- [ ] All pages have correct metadata
- [ ] Sitemap generates without errors
- [ ] Loading skeletons visible during data fetch
- [ ] All keyboard shortcuts work on /discover

When done, provide a complete summary of all pages, components, and API routes built across all 6 phases.
```

---

---
## DEBUG PROMPT
> Use when something breaks. Replace [DESCRIBE THE PROBLEM].
---

```
Something is not working. Diagnose and fix it.

PROJECT: ForkIt (Next.js 14 App Router, TypeScript, Supabase, Vercel Hobby)
SPEC: FORKIT_PROJECT_SPEC.md v3.0.0

PROBLEM:
[DESCRIBE THE PROBLEM — include error messages, file path, expected vs actual behaviour]

DIAGNOSIS STEPS:
1. Read the relevant spec section for this feature
2. Check the relevant file(s)
3. Identify root cause
4. Apply fix
5. Explain what was wrong

CONSTRAINTS:
- Do not change the tech stack
- Do not use 'any' TypeScript type as a workaround
- Do not disable RLS policies as a shortcut
- Do not add paid services
- Guest-first model must be preserved — do not add auth checks to public routes as a "quick fix"
```

---

---
## QUICK PROMPTS
---

### Add a new curated recipe manually
```
Add a manual curated recipe to supabase/seed.sql for [RECIPE NAME] from [COUNTRY].
Use author_id = '00000000-0000-0000-0000-000000000001' (forkit_curated system user).
Set source='curated'. Include 6-8 ingredients and 4-5 steps. Add a YouTube video URL if you know one.
```

### Fix a TypeScript error
```
Fix this TypeScript error in the ForkIt project without using `any` or type assertions:
[PASTE ERROR]
File: [FILE PATH]
```

### Add a new notification type
```
Add a new notification type '[TYPE_NAME]' to ForkIt:
1. Add to notification_type enum in supabase/schema.sql
2. Add to NotificationType in types/index.ts
3. Generate notification in [ROUTE HANDLER] when [TRIGGER]
4. Add display format in the AppNav notification dropdown (icon + message template)
```

### Update landing page CTA text
```
Update the primary CTA button text across the landing page.
Current text: [CURRENT]
New text: [NEW]
Files to update: app/(landing)/page.tsx (hero section + CTA section), components/layout/Navbar.tsx
```

---

*End of ForkIt Claude Code Prompts v2.0.0*
*Spec version: 3.0.0 · Guest-first · TheMealDB seeded · Zero budget*
