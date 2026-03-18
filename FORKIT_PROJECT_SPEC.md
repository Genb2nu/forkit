# ForkIt — Project Specification
> **Version:** 3.0.0
> **Last Updated:** March 2026
> **Prepared for:** Claude Code development
> **Tagline:** Cook. Swipe. Conquer.
> **Changelog v3:** Added TheMealDB seeding, guest-first auth model, AuthPromptModal, `source` column, updated phases, merged cold start strategy.

---

## ⚠️ Budget & Constraints

This project is built on a **zero-cost / free tier** foundation.

| Service | Plan | Key Limits |
|---|---|---|
| **Vercel** | Hobby (free) | 100GB bandwidth/mo, 10s serverless timeout |
| **Supabase** | Free | 500MB DB, 1GB storage, 2GB bandwidth |
| **GitHub** | Free | 2,000 Actions min/mo |
| **Resend** | Free | 100 emails/day |
| **TheMealDB** | Free, unlimited | Seed-only, no runtime dependency |

**Upgrade trigger:** Supabase Pro ($25/mo) when MAU exceeds ~1,000 active users.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Cold Start Strategy](#2-cold-start-strategy)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [User Personas](#4-user-personas)
5. [Application Architecture](#5-application-architecture)
6. [Tech Stack](#6-tech-stack)
7. [Folder Structure](#7-folder-structure)
8. [Database Schema](#8-database-schema)
9. [Feature Specifications](#9-feature-specifications)
   - 9.1 [Authentication — Guest-First Model](#91-authentication--guest-first-model)
   - 9.2 [Swipe Discovery Feed](#92-swipe-discovery-feed)
   - 9.3 [Recipe Detail Page](#93-recipe-detail-page)
   - 9.4 [Recipe Creation & Editing](#94-recipe-creation--editing)
   - 9.5 [Country Explorer](#95-country-explorer)
   - 9.6 [Leaderboard — Hall of Flavor](#96-leaderboard--hall-of-flavor)
   - 9.7 [Creator Rewards System](#97-creator-rewards-system)
   - 9.8 [Voting System](#98-voting-system)
   - 9.9 [Video Embedding](#99-video-embedding)
   - 9.10 [Interactive Cooking Mode](#910-interactive-cooking-mode)
   - 9.11 [Social Sharing](#911-social-sharing)
   - 9.12 [User Profile](#912-user-profile)
   - 9.13 [Notifications](#913-notifications)
   - 9.14 [AuthPromptModal](#914-authpromptmodal)
10. [API Routes](#10-api-routes)
11. [UI/UX Design System](#11-uiux-design-system)
12. [Environment Variables](#12-environment-variables)
13. [Implementation Phases](#13-implementation-phases)
14. [Non-Functional Requirements](#14-non-functional-requirements)
15. [Testing Requirements](#15-testing-requirements)
16. [Deployment](#16-deployment)
17. [Growth & Launch Playbook](#17-growth--launch-playbook)
18. [Mobile App — Future Phase](#18-mobile-app--future-phase)
19. [Creator Monetization Roadmap](#19-creator-monetization-roadmap)

---

## 1. Project Overview

**ForkIt** is a recipe discovery and creator platform. Instead of recipe websites buried under ads and life stories, ForkIt delivers a swipe-based, gamified experience — part Tinder, part TikTok, part cookbook.

### Platform Surfaces (Priority Order)

| Priority | Surface | Notes |
|---|---|---|
| **1** | **Landing Website** | Marketing: hero, features, rewards, CTAs |
| **2** | **Web App** | Full recipe experience, same domain, responsive + mobile-first |
| **3** | **Mobile App** | React Native — future phase, not in current scope |

The Landing Website and Web App are **one Next.js project, one domain**. Landing pages live in `(landing)/` route group; the app lives in `(app)/`.

### Guest-First Principle
**No account is required to browse, swipe, or cook.** Authentication is only required to vote, save, follow, or submit recipes. This is the single most important design constraint to honour throughout the build.

---

## 2. Cold Start Strategy

> This section documents the plan to solve the empty-platform problem for a zero-budget solo launch.

### The Problem
ForkIt is a community platform. Community platforms are worthless with no content. But content only comes from users. Users only come if there is content. This is the cold start problem.

### Solution A — Pre-Seeded Curated Content (TheMealDB)

ForkIt will launch with **300+ recipes** imported from [TheMealDB](https://www.themealdb.com) — a free, unlimited-use recipe API — covering 26 cuisine areas (marketed as "20+" for clean copy). This gives the swipe feed, country explorer, and leaderboard real content from day one.

**TheMealDB key facts:**
- Free, no API key required, no rate limits (be polite with 500ms delays)
- Base URL: `https://www.themealdb.com/api/json/v1/1/`
- Endpoints used: `filter.php?a={area}` (list by country), `lookup.php?i={id}` (full detail)
- Each recipe includes: title, ingredients (strIngredient1–20 + strMeasure1–20), instructions, meal image URL, YouTube video URL
- 26 cuisine areas supported

**Countries to import:**

| Area | Code | Flag | Area | Code | Flag |
|---|---|---|---|---|---|
| American | US | 🇺🇸 | Japanese | JP | 🇯🇵 |
| British | GB | 🇬🇧 | Malaysian | MY | 🇲🇾 |
| Canadian | CA | 🇨🇦 | Mexican | MX | 🇲🇽 |
| Chinese | CN | 🇨🇳 | Moroccan | MA | 🇲🇦 |
| Croatian | HR | 🇭🇷 | Polish | PL | 🇵🇱 |
| Dutch | NL | 🇳🇱 | Portuguese | PT | 🇵🇹 |
| Egyptian | EG | 🇪🇬 | Russian | RU | 🇷🇺 |
| French | FR | 🇫🇷 | Spanish | ES | 🇪🇸 |
| Greek | GR | 🇬🇷 | Thai | TH | 🇹🇭 |
| Indian | IN | 🇮🇳 | Tunisian | TN | 🇹🇳 |
| Irish | IE | 🇮🇪 | Turkish | TR | 🇹🇷 |
| Italian | IT | 🇮🇹 | Vietnamese | VN | 🇻🇳 |
| Jamaican | JM | 🇯🇲 | Kenyan | KE | 🇰🇪 |

**Import script:** `scripts/seed-from-mealdb.ts` — run once locally before launch.

**Curated content presentation:**
- A dedicated "ForkIt Curated" system profile (`username: forkit_curated`, `reward_tier: legend`) owns all imported recipes
- Recipe cards and detail pages show a special `🍴 ForkIt Curated` badge instead of a personal creator row when `recipe.source === 'curated'`
- No "Follow" or "Edit" button on curated recipes

### Solution B — Guest-First Auth Model

The second part of the cold start fix: remove the login wall from the discovery experience.

**What guests can do (no account required):**
- Browse and swipe the recipe feed (`/discover`)
- View full recipe detail including ingredients, steps, video (`/recipe/[id]`)
- Browse country explorer (`/explore`)
- View leaderboard (`/leaderboard`)
- View any creator profile (`/profile/[username]`)
- Read and watch everything

**What requires an account:**
- Vote / heart a recipe
- Save/bookmark a recipe
- Submit a recipe (`/create`)
- Follow a creator
- View own saved recipes (`/saved`)
- Edit own profile (`/profile/[username]/edit`)

When an unauthenticated guest tries a restricted action, show **AuthPromptModal** (§9.14) — a non-blocking overlay that explains the benefit and offers one-tap Google sign-in. Never redirect to `/login` mid-experience.

---

## 3. Product Vision & Goals

### Problems Solved
- Recipe sites bury content under SEO text and ads
- No tactile way to discover new cuisines without commitment
- Home cooks have no incentive to share knowledge
- Food creators have no platform that rewards them with reach

### Primary Goals
- Launch with real content on day one (TheMealDB seeding)
- Make discovery frictionless: browse free, account optional
- Build a community-voted, country-indexed recipe database
- Give creators recognition and social capital from vote one

### Success Metrics (Year 1, Zero Budget)
- Unique visitors > 5,000 by Month 3 (SEO-driven)
- Registered users > 1,000 by Month 4
- Weekly recipe submissions > 20 by Month 5
- Creator tier unlock rate > 25% of registered submitters
- Lighthouse score ≥ 90

---

## 4. User Personas

### Persona A — The Curious Home Cook
- Age 22–35, urban, cooks 3–4× per week
- Discovers recipes on TikTok but can't find the actual recipe
- **Wants:** Fast discovery, no friction, video, no sign-up pressure
- **ForkIt value:** Browses free, swipes, cooks. Signs up later when they want to save.

### Persona B — The Food Creator
- Age 20–40, small-to-mid following (5k–100k)
- Wants to grow audience, doesn't expect direct payment from a new platform
- **Wants:** Beautiful creator profile, SEO traffic, recognition, social shoutouts
- **ForkIt value:** Free portfolio page, Google-indexed recipes, leaderboard visibility

### Persona C — The Cultural Food Explorer
- Age 25–50, loves cuisine from different countries
- **Wants:** Country-filtered browsing, authentic regional recipes
- **ForkIt value:** 20+ country categories on day one from curated library

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│           SINGLE NEXT.JS PROJECT (Vercel Hobby)         │
│                                                         │
│  (landing)/   → / , /about, /creators                  │
│  (app)/       → /discover, /explore, /recipe/[id]...   │
│  app/api/     → Route Handlers (serverless functions)   │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │       SUPABASE          │
              │  PostgreSQL · Auth      │
              │  Storage · RLS          │
              └─────────────────────────┘

scripts/
  seed-from-mealdb.ts   → Run once locally, imports TheMealDB
```

### Key Architecture Decisions

| Decision | Reason |
|---|---|
| No separate API server | Vercel serverless Route Handlers = zero extra cost |
| No Redis | ISR revalidation handles leaderboard caching at free tier |
| No Cloudinary | Supabase Storage (1GB free) replaces it |
| Supabase Auth | Email + Google + Facebook OAuth with zero config code |
| RLS for security | Database-level policies; no custom auth middleware for reads |
| TheMealDB seeding | Solves cold start with 300+ recipes, free, one-time run |
| Guest-first routing | Max discoverability; auth only on write actions |

---

## 6. Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Framework, SSR, routing, API routes |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| Framer Motion | 11+ | Swipe gestures, animations |
| Zustand | 4+ | Auth state, swipe session state |
| TanStack Query | 5+ | Server state, caching, mutations |
| React Hook Form + Zod | latest | Forms and validation |
| shadcn/ui | latest | Base UI components |
| Recharts | latest | Creator analytics charts |

### Backend (Supabase + Next.js Route Handlers)
| Package | Purpose |
|---|---|
| @supabase/supabase-js | DB, Auth, Storage client |
| @supabase/ssr | Server-side Supabase in App Router |
| Zod | API input validation |
| @vercel/og | OG image generation (free, serverless) |
| Resend | Transactional email (free: 100/day) |

### Infrastructure (All Free)
| Service | Purpose |
|---|---|
| Vercel Hobby | Hosting, CI/CD, serverless, edge |
| Supabase Free | PostgreSQL + Auth + Storage |
| GitHub Free | Source control + Actions CI |
| Resend Free | Email delivery |
| TheMealDB | Seed data (one-time import, not runtime) |

---

## 7. Folder Structure

```
forkit/
├── app/
│   ├── (landing)/
│   │   ├── page.tsx                # Homepage
│   │   ├── about/page.tsx
│   │   ├── creators/page.tsx       # Creator rewards detail
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx              # Navbar + Footer
│   │
│   ├── (app)/
│   │   ├── discover/page.tsx       # Swipe feed (public)
│   │   ├── explore/page.tsx        # Country explorer (public)
│   │   ├── leaderboard/page.tsx    # Leaderboard (public)
│   │   ├── recipe/[id]/page.tsx    # Recipe detail (public, SSR)
│   │   ├── profile/
│   │   │   └── [username]/
│   │   │       ├── page.tsx        # Public profile
│   │   │       └── edit/page.tsx   # Edit profile (auth required)
│   │   ├── create/page.tsx         # Submit recipe (auth required)
│   │   ├── saved/page.tsx          # Saved recipes (auth required)
│   │   └── layout.tsx              # AppNav + BottomNav
│   │
│   ├── api/
│   │   ├── recipes/
│   │   │   ├── route.ts            # GET list, POST create
│   │   │   ├── [id]/route.ts       # GET, PATCH, DELETE
│   │   │   └── feed/route.ts       # GET personalised feed
│   │   ├── votes/route.ts          # POST toggle vote
│   │   ├── saves/route.ts          # POST toggle save
│   │   ├── upload/route.ts         # POST image → Supabase Storage
│   │   ├── leaderboard/route.ts    # GET (ISR revalidate=3600)
│   │   ├── notifications/route.ts  # GET + PATCH read
│   │   └── og/
│   │       ├── recipe/[id]/route.tsx
│   │       └── profile/[username]/route.tsx
│   │
│   ├── auth/
│   │   ├── callback/route.ts       # OAuth callback
│   │   └── confirm/route.ts        # Email verify
│   │
│   ├── sitemap.ts                  # Auto-generated XML sitemap
│   ├── robots.ts
│   ├── layout.tsx                  # Root layout (TanStack Provider, Toaster)
│   └── globals.css
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── recipe/
│   │   ├── SwipeCard.tsx
│   │   ├── SwipeDeck.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── IngredientList.tsx
│   │   ├── StepsList.tsx
│   │   ├── VideoEmbed.tsx
│   │   ├── RecipeForm.tsx
│   │   └── RecipeCard.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── AppNav.tsx
│   │   ├── BottomNav.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   └── AuthPromptModal.tsx     # NEW: guest → auth upsell
│   ├── leaderboard/
│   │   ├── Podium.tsx
│   │   └── LeaderboardRow.tsx
│   ├── explore/
│   │   ├── CountryGrid.tsx
│   │   └── CountryTile.tsx
│   └── profile/
│       ├── ProfileHeader.tsx
│       └── TierBadge.tsx
│
├── hooks/
│   ├── useSwipe.ts
│   ├── useVote.ts                  # Triggers AuthPromptModal if guest
│   ├── useSave.ts                  # Triggers AuthPromptModal if guest
│   └── useUser.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (Route Handlers + RSC)
│   │   └── middleware.ts           # Session refresh helper
│   ├── video.ts                    # detectVideoType, buildEmbedUrl
│   ├── rewards.ts                  # calculateTier, CUISINE_GRADIENTS
│   └── og.ts
│
├── stores/
│   ├── authStore.ts                # { user, setUser, clearUser }
│   └── swipeStore.ts               # { seenIds, savedIds, addSeen, addSaved }
│
├── types/index.ts                  # All TypeScript interfaces + enums
│
├── scripts/
│   └── seed-from-mealdb.ts         # NEW: one-time TheMealDB import
│
├── supabase/
│   ├── schema.sql                  # Full DB schema with RLS
│   └── seed.sql                    # Countries, tags, system profile
│
├── middleware.ts                   # Session refresh (selective routes)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 8. Database Schema

### SQL Schema (`supabase/schema.sql`)

```sql
-- ENUMS
create type reward_tier as enum ('starter','hot_chef','star_creator','legend');
create type difficulty   as enum ('easy','medium','hard');
create type video_type   as enum ('youtube','facebook');
create type notification_type as enum (
  'new_vote','new_follower','tier_upgrade','recipe_featured'
);

-- PROFILES (extends auth.users)
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text not null,
  avatar_url    text,
  bio           text,
  country       text,
  social_links  jsonb default '{}',
  reward_tier   reward_tier default 'starter',
  total_votes   integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, username, display_name)
  values (
    new.id,
    split_part(new.email,'@',1) || '_' || floor(random()*9000+1000)::text,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RECIPES
create table recipes (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  emoji         text not null default '🍴',
  image_url     text,
  country_code  text not null,
  country_name  text not null,
  country_flag  text not null,
  difficulty    difficulty default 'medium',
  time_minutes  integer not null,
  servings      integer default 2,
  video_url     text,
  video_type    video_type,
  video_note    text,
  published     boolean default true,
  featured      boolean default false,
  source        text default 'community',  -- 'community' | 'curated'
  source_url    text,                       -- attribution link for curated
  author_id     uuid not null references profiles(id) on delete cascade,
  total_votes   integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index recipes_country_code_idx on recipes(country_code);
create index recipes_total_votes_idx  on recipes(total_votes desc);
create index recipes_author_id_idx    on recipes(author_id);
create index recipes_featured_idx     on recipes(featured) where featured = true;
create index recipes_source_idx       on recipes(source);

-- INGREDIENTS
create table ingredients (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  text       text not null,
  sort_order integer not null
);
create index ingredients_recipe_id_idx on ingredients(recipe_id);

-- STEPS
create table recipe_steps (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references recipes(id) on delete cascade,
  step_number integer not null,
  title       text not null,
  body        text not null
);
create index recipe_steps_recipe_id_idx on recipe_steps(recipe_id);

-- TAGS
create table tags (
  id   uuid primary key default gen_random_uuid(),
  name text unique not null
);
create table recipe_tags (
  recipe_id uuid references recipes(id) on delete cascade,
  tag_id    uuid references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- VOTES
create table votes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  recipe_id  uuid not null references recipes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, recipe_id)
);
create index votes_recipe_id_idx on votes(recipe_id);

-- Vote count trigger
create or replace function update_vote_counts() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update recipes set total_votes = total_votes + 1 where id = NEW.recipe_id;
    update profiles set total_votes = total_votes + 1
      where id = (select author_id from recipes where id = NEW.recipe_id);
  elsif TG_OP = 'DELETE' then
    update recipes set total_votes = greatest(total_votes-1,0) where id = OLD.recipe_id;
    update profiles set total_votes = greatest(total_votes-1,0)
      where id = (select author_id from recipes where id = OLD.recipe_id);
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_vote_change
  after insert or delete on votes
  for each row execute procedure update_vote_counts();

-- SAVED RECIPES
create table saved_recipes (
  user_id    uuid references profiles(id) on delete cascade,
  recipe_id  uuid references recipes(id) on delete cascade,
  saved_at   timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- FOLLOWS
create table follows (
  follower_id  uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- COUNTRIES
create table countries (
  code          text primary key,
  name          text not null,
  flag          text not null,
  recipe_count  integer default 0
);

-- NOTIFICATIONS
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  type       notification_type not null,
  payload    jsonb default '{}',
  read       boolean default false,
  created_at timestamptz default now()
);
create index notifications_user_id_idx on notifications(user_id, read);
```

### Row Level Security

```sql
-- Enable RLS
alter table profiles       enable row level security;
alter table recipes        enable row level security;
alter table ingredients    enable row level security;
alter table recipe_steps   enable row level security;
alter table votes          enable row level security;
alter table saved_recipes  enable row level security;
alter table follows        enable row level security;
alter table notifications  enable row level security;

-- Profiles
create policy "Public profiles viewable" on profiles for select using (true);
create policy "Own profile update"       on profiles for update using (auth.uid() = id);

-- Recipes: PUBLIC READ (supports guest browsing)
create policy "Published recipes public" on recipes for select using (published = true);
create policy "Auth users create"        on recipes for insert with check (auth.uid() = author_id);
create policy "Owner update"             on recipes for update using (auth.uid() = author_id);
create policy "Owner delete"             on recipes for delete using (auth.uid() = author_id);

-- Ingredients / Steps: follow recipe visibility
create policy "Ingredients visible" on ingredients for select using (
  exists (select 1 from recipes where id = recipe_id and published = true)
);
create policy "Owner manages ingredients" on ingredients for all using (
  exists (select 1 from recipes where id = recipe_id and author_id = auth.uid())
);
create policy "Steps visible" on recipe_steps for select using (
  exists (select 1 from recipes where id = recipe_id and published = true)
);
create policy "Owner manages steps" on recipe_steps for all using (
  exists (select 1 from recipes where id = recipe_id and author_id = auth.uid())
);

-- Votes
create policy "Votes public"          on votes for select using (true);
create policy "Users manage own votes" on votes for all using (auth.uid() = user_id);

-- Saves
create policy "Users manage own saves" on saved_recipes for all using (auth.uid() = user_id);

-- Follows
create policy "Follows public"          on follows for select using (true);
create policy "Users manage own follows" on follows for all using (auth.uid() = follower_id);

-- Notifications
create policy "Own notifications" on notifications for all using (auth.uid() = user_id);
```

### Seed SQL (`supabase/seed.sql`)

```sql
-- System curator account (UUID must match the one used in seed-from-mealdb.ts)
INSERT INTO auth.users (id, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'curated@forkit.app')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, username, display_name, bio, reward_tier) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'forkit_curated',
  'ForkIt Curated',
  'Hand-picked recipes from great cuisines around the world, curated by the ForkIt team.',
  'legend'
) ON CONFLICT DO NOTHING;

-- Countries (26 TheMealDB areas + extras)
INSERT INTO countries (code, name, flag) VALUES
  ('US','American','🇺🇸'),('GB','British','🇬🇧'),('CA','Canadian','🇨🇦'),
  ('CN','Chinese','🇨🇳'),('HR','Croatian','🇭🇷'),('NL','Dutch','🇳🇱'),
  ('EG','Egyptian','🇪🇬'),('FR','French','🇫🇷'),('GR','Greek','🇬🇷'),
  ('IN','Indian','🇮🇳'),('IE','Irish','🇮🇪'),('IT','Italian','🇮🇹'),
  ('JM','Jamaican','🇯🇲'),('JP','Japanese','🇯🇵'),('KE','Kenyan','🇰🇪'),
  ('MY','Malaysian','🇲🇾'),('MX','Mexican','🇲🇽'),('MA','Moroccan','🇲🇦'),
  ('PL','Polish','🇵🇱'),('PT','Portuguese','🇵🇹'),('RU','Russian','🇷🇺'),
  ('ES','Spanish','🇪🇸'),('TH','Thai','🇹🇭'),('TN','Tunisian','🇹🇳'),
  ('TR','Turkish','🇹🇷'),('VN','Vietnamese','🇻🇳')
ON CONFLICT DO NOTHING;

-- Sample tags
INSERT INTO tags (name) VALUES
  ('Spicy'),('Vegetarian'),('Quick'),('Street Food'),('Comfort'),
  ('Breakfast'),('One-Pan'),('Weekend'),('Crowd-Pleaser'),('Slow-Cooked'),
  ('Bold'),('Customizable'),('Dessert'),('Seafood'),('Noodles')
ON CONFLICT DO NOTHING;
```

---

## 9. Feature Specifications

### 9.1 Authentication — Guest-First Model

**Core rule:** Routes are public by default. Only a short list requires authentication.

**Protected routes (redirect to `/login?next=...` if unauthenticated):**
- `/create`
- `/saved`
- `/profile/[username]/edit`

**Public routes (no redirect, auth state optional):**
- `/discover`, `/explore`, `/leaderboard`
- `/recipe/[id]`, `/profile/[username]`
- All landing pages

**Updated `middleware.ts`:**
```typescript
const PROTECTED = ['/create', '/saved'];
const PROFILE_EDIT = /^\/profile\/[^/]+\/edit/;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => request.cookies.get(n)?.value, set: () => {}, remove: () => {} } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some(p => pathname.startsWith(p)) || PROFILE_EDIT.test(pathname);

  if (needsAuth && !session) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
  }
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'] };
```

**Auth providers (Supabase):**
- Email + Password with email verification
- Google OAuth
- Facebook OAuth

**Post-login redirect:** Use `?next=` query param to return user to their intended destination.

---

### 9.2 Swipe Discovery Feed

**Route:** `/discover` — **PUBLIC, no auth required**

**Feed loading:**
- `GET /api/recipes/feed?limit=20&exclude=id1,id2,...`
- Returns recipes ordered by `total_votes DESC, created_at DESC`
- Filters out IDs in `exclude` param (session-tracked in Zustand `swipeStore`)
- Prefetch next batch when remaining cards < 5

**Swipe right** → saves recipe + votes (if authenticated) OR triggers `AuthPromptModal` (if guest)
**Swipe left** → skips, adds to local `seenIds`
**📖 View** → opens recipe detail (always available)

**Framer Motion gesture config:**
```typescript
const x = useMotionValue(0);
const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
// onDragEnd: threshold |velocity| > 500 or |offset| > 120
```

**Empty state:** "You've seen everything! 🎉 Start over or explore by country." with two buttons.

---

### 9.3 Recipe Detail Page

**Route:** `/recipe/[id]` — **PUBLIC, SSR for SEO**

**Sections:**
1. Hero (gradient, emoji, title, country/time/servings/difficulty chips)
2. Action bar (vote ♥, save 🔖, share — all trigger `AuthPromptModal` for guests)
3. Creator bar — hidden / replaced with "🍴 ForkIt Curated" badge when `source === 'curated'`
4. Description (italic)
5. Video embed (§9.9)
6. Tabs: Ingredients | Steps

**Curated recipe display:**
```tsx
{recipe.source === 'curated' ? (
  <div className="curated-bar">
    <span className="curated-badge">🍴 ForkIt Curated</span>
    <span className="text-muted text-xs">Hand-picked by the ForkIt team</span>
  </div>
) : (
  <CreatorBar author={recipe.author} />
)}
```

**Edit mode** (community recipes only, owner only — curated recipes are not editable):
- "✏️ Edit" button visible only when `recipe.source === 'community'` AND `recipe.author_id === currentUser?.id`

**generateMetadata:**
```typescript
export async function generateMetadata({ params }) {
  const recipe = await getRecipe(params.id);
  return {
    title: `${recipe.title} — ForkIt`,
    description: recipe.description,
    openGraph: { images: [`/api/og/recipe/${params.id}`] },
  };
}
```

**JSON-LD Recipe schema** embedded in the page for SEO.

---

### 9.4 Recipe Creation & Editing

**Route:** `/create` — **AUTH REQUIRED**

Form fields and validation: see previous spec version (unchanged).

**Image upload:** Supabase Storage bucket `recipe-images`, public, 5MB max.

**Difference from v2:** The RecipeForm's `source` field defaults to `'community'` (not `'curated'`). Curated recipes are never created through the UI.

---

### 9.5 Country Explorer

**Route:** `/explore` — **PUBLIC**

Stats banner counts: total countries with recipes, total published recipe count, total profiles count — all from Supabase server-side aggregate queries.

Country grid: 2-col mobile, 4-col desktop. Tap to expand → shows top dish. "Browse [Country] recipes" link.

---

### 9.6 Leaderboard — Hall of Flavor

**Route:** `/leaderboard` — **PUBLIC**

```typescript
// Route Handler with ISR — no Redis needed
export const revalidate = 3600; // Re-generate every hour

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') ?? 'alltime';
  // ... Supabase query based on filter
}
```

Filters: All Time | This Month | By Country | Rising Stars

**Note:** The `forkit_curated` system profile is excluded from leaderboard rankings:
```sql
WHERE username != 'forkit_curated'
```

---

### 9.7 Creator Rewards System

#### Tier Thresholds

| Tier | Votes | Platform Perks |
|---|---|---|
| 🌱 Starter | 0–499 | Profile badge, Google-indexed recipe pages, social links displayed |
| 🔥 Hot Chef | 500–4,999 | Homepage feature rotation, swipe deck priority, recipe analytics |
| ⭐ Star Creator | 5,000–24,999 | ForkIt social shoutout, verified badge, homepage spotlight |
| 🏆 Legend | 25,000+ | Brand intro referrals, press opportunities, dedicated `/creators/[username]` page |

#### No Monetary Reward — Honest Framing

ForkIt has zero budget for creator payments at launch. The tier system is entirely recognition-based. See §19 for the monetization roadmap. Creators are clearly informed of this on the platform — no false promises.

#### Tier Upgrade Logic

```typescript
// lib/rewards.ts
export function calculateTier(totalVotes: number): RewardTier {
  if (totalVotes >= 25000) return 'legend';
  if (totalVotes >= 5000)  return 'star_creator';
  if (totalVotes >= 500)   return 'hot_chef';
  return 'starter';
}
```

Tier check runs inline in the `/api/votes` Route Handler after each vote. On upgrade: create notification + send email via Resend.

---

### 9.8 Voting System

**Rules:**
- One vote per user per recipe (unique DB constraint)
- Cannot vote on own recipe (server-side check)
- Votes are togglable (vote again to remove)
- Guests → `AuthPromptModal` instead of 401

**`useVote` hook:**
```typescript
export function useVote(recipeId: string) {
  const { user } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const toggle = async () => {
    if (!user) { setShowAuthPrompt(true); return; }
    // ... optimistic UI + mutation
  };
  return { toggle, showAuthPrompt, setShowAuthPrompt };
}
```

---

### 9.9 Video Embedding

```typescript
// lib/video.ts
export function detectVideoType(url: string): 'youtube' | 'facebook' | null {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/facebook\.com|fb\.com|fb\.watch/.test(url)) return 'facebook';
  return null;
}

export function buildEmbedUrl(url: string): string {
  const type = detectVideoType(url);
  if (type === 'youtube') {
    const id = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?/\s]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
  }
  if (type === 'facebook') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=500`;
  }
  return url;
}
```

**TheMealDB recipes:** Most include a `strYoutube` field (a YouTube watch URL). This is stored as `video_url` and displayed automatically — no creator action needed.

---

### 9.10 Interactive Cooking Mode

Component-local state only (`useState`) — never persisted to DB or `localStorage`.

- `checkedIngredients: Set<number>` — checkable ingredients
- `completedSteps: Set<number>` — completable steps
- Progress bars on both
- Completion → celebration card + share prompt

---

### 9.11 Social Sharing

OG images: `@vercel/og`, serverless, free.

Share targets: Copy link, X, WhatsApp (critical for SEA market), Facebook.

Pre-filled share caption:
```typescript
`Just cooked ${recipe.title} using ForkIt! 🍴 #ForkIt #${recipe.country_name.replace(/\s/g,'')}Cuisine`
```

---

### 9.12 User Profile

**Route:** `/profile/[username]` — **PUBLIC, SSR**

Profile shows:
- Avatar, display name, username, bio, country, follower/following count, total votes
- Reward tier badge (TierBadge component)
- Social links row
- Recipe grid (community recipes only — curated system profile not shown as a browseable creator)
- Follow/Unfollow button (authenticated only)

**Own profile extras:** Edit button, Saved Recipes tab, Analytics (Hot Chef+).

---

### 9.13 Notifications

In-app only (no push for web MVP).

Trigger points:
- `POST /api/votes` → insert `new_vote` notification for recipe author
- `POST /api/follows/[username]` → insert `new_follower` notification
- Tier upgrade in vote handler → insert `tier_upgrade` notification + Resend email
- Admin-only: `recipe_featured` notification

Bell icon in AppNav shows unread count badge. Dropdown lists recent 10, "Mark all read" at top. Polling every 60 seconds via TanStack Query.

---

### 9.14 AuthPromptModal

**NEW component:** `components/auth/AuthPromptModal.tsx`

Triggered when an unauthenticated guest attempts a restricted action (vote, save, follow, submit recipe).

**Design:**
- Mobile: slides up from bottom (sheet)
- Desktop: centered modal, max-width 400px
- Dark glass background, fire orange accent

**Content:**
```tsx
<AuthPromptModal
  action="save"  // 'vote' | 'save' | 'follow' | 'submit'
  onClose={() => setShowAuthPrompt(false)}
/>
```

Each `action` shows a tailored message:
- `vote`: "Love this recipe? ❤️ Vote for it and help it climb the leaderboard."
- `save`: "Save this recipe 🔖 so you can find it when you're ready to cook."
- `follow`: "Follow this creator to see their new recipes first."
- `submit`: "Share your recipe with the world. It's free and takes 2 minutes."

**Auth options in modal:**
- "Continue with Google" (one-tap, fastest)
- "Sign up with email →" (link to /signup)
- "Already have an account? Log in" (link to /login)

**After auth:** Modal closes, the original action completes automatically (no need to re-tap).

---

## 10. API Routes

All are Next.js Route Handlers (serverless). Vercel Hobby limit: 10s timeout.

```
# Recipes
GET    /api/recipes              ?country, tag, sort, search, featured, limit
GET    /api/recipes/feed         ?limit, exclude  (uses optionalAuth)
GET    /api/recipes/[id]         full detail with relations
POST   /api/recipes              create (auth required)
PATCH  /api/recipes/[id]         update (owner, community only)
DELETE /api/recipes/[id]         delete (owner, community only)

# Votes & Saves
POST   /api/votes                toggle { recipeId }  (auth, triggers AuthPromptModal client-side)
POST   /api/saves                toggle { recipeId }  (auth)
GET    /api/saves                list saved recipes (auth)

# Upload
POST   /api/upload               image → Supabase Storage → { url }

# Leaderboard (ISR cached 1hr)
GET    /api/leaderboard          ?filter=alltime|month|country&country=XX

# Notifications
GET    /api/notifications        paginated (auth)
PATCH  /api/notifications/read   mark all read (auth)

# OG Images
GET    /api/og/recipe/[id]       1200×630 PNG
GET    /api/og/profile/[username] 1200×630 PNG
```

---

## 11. UI/UX Design System

### Colours
```css
:root {
  --bg-base:    #0f0d0a;
  --bg-surface: #1a1710;
  --bg-muted:   rgba(255,255,255,0.05);
  --border:     rgba(255,255,255,0.07);
  --fire:       #f97316;
  --ember:      #ef4444;
  --forest:     #22c55e;
  --cream:      #f5f0e8;
  --text-2:     rgba(245,240,232,0.65);
  --muted:      #6b6454;
}
```

### Typography
- **Display/Headings:** Playfair Display (700, 900; italic 700)
- **Body:** DM Sans (300, 400, 500, 600)
- **Mono/Labels:** DM Mono (400, 500)
- Load from Google Fonts (free)

### Cuisine Gradients (`lib/rewards.ts`)
```typescript
export const CUISINE_GRADIENTS: Record<string, string> = {
  CN: 'linear-gradient(135deg,#c0392b,#e74c3c,#f39c12)',
  JP: 'linear-gradient(135deg,#16a085,#27ae60,#2ecc71)',
  IN: 'linear-gradient(135deg,#f39c12,#e67e22,#e74c3c)',
  TH: 'linear-gradient(135deg,#8e44ad,#c0392b,#f39c12)',
  ID: 'linear-gradient(135deg,#7d3c98,#c0392b,#d35400)',
  IT: 'linear-gradient(135deg,#27ae60,#2ecc71,#16a085)',
  MX: 'linear-gradient(135deg,#e67e22,#e74c3c,#c0392b)',
  MA: 'linear-gradient(135deg,#c0392b,#e74c3c,#8e44ad)',
  FR: 'linear-gradient(135deg,#2c3e50,#3498db,#2980b9)',
  GR: 'linear-gradient(135deg,#2980b9,#3498db,#1abc9c)',
  KR: 'linear-gradient(135deg,#c0392b,#e74c3c,#8e44ad)',
  VN: 'linear-gradient(135deg,#c0392b,#e74c3c,#f39c12)',
  TN: 'linear-gradient(135deg,#e67e22,#e74c3c,#c0392b)',
  DEFAULT: 'linear-gradient(135deg,#2c3e50,#8e44ad,#c0392b)',
};
```

### Component Patterns
- Buttons: `border-radius: 100px` pill, gradient primary, ghost secondary
- Cards: dark glass, subtle border, `translateY(-4px)` on hover
- Inputs: `bg: rgba(255,255,255,0.05)`, subtle border, no box-shadow
- Progress bars: 4–6px, rounded, gradient fill
- Mobile bottom nav: fixed, frosted glass, fire underline on active
- Swipe cards: full-bleed gradient, 24px border-radius

### Responsive
- Mobile: < 640px — bottom nav, full-screen swipe cards, single column
- Tablet: 640–1024px — 2-column layouts
- Desktop: > 1024px — 3–4 column grids, modal for recipe detail on hover

---

## 12. Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."    # Server-side only

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Resend (free: 100/day)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@forkit.app"

# TheMealDB (no key needed — used only in seed script)
# MEALDB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

---

## 13. Implementation Phases

### Phase 0 — Setup (Day 1–2)
- [ ] `npx create-next-app@latest forkit --typescript --tailwind --app`
- [ ] Install all dependencies (§6 Tech Stack)
- [ ] shadcn/ui init + add components: button, input, textarea, select, tabs, badge, avatar, toast, dropdown-menu, dialog, sheet
- [ ] Create full folder structure (§7)
- [ ] `tailwind.config.ts` with design tokens (§11)
- [ ] `globals.css` with CSS variables
- [ ] `lib/supabase/client.ts`, `server.ts`, `middleware.ts` (official @supabase/ssr pattern)
- [ ] `types/index.ts` — all interfaces and enums
- [ ] `stores/authStore.ts`, `stores/swipeStore.ts`
- [ ] `lib/video.ts`, `lib/rewards.ts`
- [ ] `.env.example` and `.env.local`
- [ ] Root `app/layout.tsx` with TanStack Query + Toaster providers
- [ ] Create Supabase project, run `supabase/schema.sql`, run `supabase/seed.sql`
- [ ] **Run `scripts/seed-from-mealdb.ts`** — import all TheMealDB areas into Supabase

**Deliverable:** Blank Next.js app on Vercel, Supabase connected, 300+ recipes in DB.

---

### Phase 1 — Landing Website (Week 1–2)
- [ ] `(landing)/layout.tsx` — Navbar + Footer
- [ ] `Navbar.tsx` — fixed, scrolled state, "🔥 Browse Free" CTA
- [ ] `Footer.tsx` — 4-column, social icons
- [ ] `(landing)/page.tsx` — 10 sections:
  - Hero (with guest-free badge + "Browse Free" primary CTA)
  - Ticker marquee
  - About ("Recipes were boring. We fixed that." — guest-first messaging)
  - Curated Library (300+ recipes, 20+ countries, TheMealDB sourcing explained)
  - How It Works (4 steps)
  - Features bento (6 cards)
  - Creator Rewards (4 tiers + monetization roadmap)
  - Countries horizontal scroll
  - Testimonials (3 cards)
  - CTA band ("Browse Free — No Sign Up" primary)
- [ ] `(landing)/about/page.tsx`
- [ ] `(landing)/creators/page.tsx` — detailed tier + roadmap
- [ ] All scroll-reveal animations, floating phone mockup, orbiting emoji

**Deliverable:** Landing site live at `forkit.app`.

---

### Phase 2 — Auth + App Shell (Week 2–3)
- [ ] `middleware.ts` — guest-first model (only protect `/create`, `/saved`, `/profile/*/edit`)
- [ ] `(landing)/login/page.tsx` — email + Google + Facebook
- [ ] `(landing)/signup/page.tsx`
- [ ] `auth/callback/route.ts`, `auth/confirm/route.ts`
- [ ] `hooks/useUser.ts` — reads from Zustand, fetches profile on mount
- [ ] `(app)/layout.tsx` — no hard auth redirect here; handles AppNav + BottomNav
- [ ] `AppNav.tsx` — logo, bell (unread count), user avatar dropdown (or "Sign In" if guest)
- [ ] `BottomNav.tsx` — 4 tabs, fire underline on active, hidden on md+
- [ ] `components/auth/AuthPromptModal.tsx` — guest action upsell (§9.14)
- [ ] `(app)/profile/[username]/page.tsx` — public SSR profile
- [ ] `components/profile/ProfileHeader.tsx`, `TierBadge.tsx`
- [ ] `(app)/profile/[username]/edit/page.tsx` — edit form + avatar upload
- [ ] DB trigger auto-creates profile on signup (already in schema.sql)

**Deliverable:** Auth flow end-to-end. Guest can visit `/discover` without logging in.

---

### Phase 3 — Swipe Feed + Recipe Detail (Week 3–5)
- [ ] `SwipeCard.tsx` — Framer Motion drag, gradient by cuisine, curated badge
- [ ] `SwipeDeck.tsx` — card stack, batch loading, empty state
- [ ] `(app)/discover/page.tsx` — public, action buttons, saved strip
- [ ] `hooks/useVote.ts`, `hooks/useSave.ts` — trigger AuthPromptModal for guests
- [ ] `api/recipes/feed/route.ts` — feed algorithm
- [ ] `(app)/recipe/[id]/page.tsx` — SSR, generateMetadata, JSON-LD
- [ ] `RecipeDetail.tsx` — all sections, curated vs community display logic
- [ ] `IngredientList.tsx` — checkable, edit mode
- [ ] `StepsList.tsx` — completable, progress bar, celebration
- [ ] `VideoEmbed.tsx` — YouTube + Facebook, platform badge
- [ ] `api/votes/route.ts`, `api/saves/route.ts`
- [ ] `api/og/recipe/[id]/route.tsx` — @vercel/og
- [ ] Social share buttons (copy, X, WhatsApp)

**Deliverable:** Core swipe → view → cook flow working, guests included.

---

### Phase 4 — Recipe Creation + Editing (Week 5–6)
- [ ] `(app)/create/page.tsx` — auth-gated, renders RecipeForm
- [ ] `RecipeForm.tsx` — all fields, dynamic ingredients/steps, image upload, video URL
- [ ] `api/upload/route.ts` — Supabase Storage
- [ ] `api/recipes/route.ts` (POST) — create with all relations
- [ ] `api/recipes/[id]/route.ts` (PATCH, DELETE) — owner-only, community-only
- [ ] Inline edit mode in RecipeDetail (community recipes, owner only)
- [ ] `(app)/saved/page.tsx` — auth-gated, saved recipe grid
- [ ] `RecipeCard.tsx` — compact card for grids

**Deliverable:** Full recipe submission and editing workflow.

---

### Phase 5 — Community Features (Week 7–9)
- [ ] `(app)/explore/page.tsx` — country grid, search, trending
- [ ] `CountryGrid.tsx`, `CountryTile.tsx`
- [ ] `(app)/leaderboard/page.tsx` — podium + ranked list (excludes `forkit_curated`)
- [ ] `api/leaderboard/route.ts` — ISR (`revalidate = 3600`)
- [ ] `Podium.tsx`, `LeaderboardRow.tsx`
- [ ] Follow/unfollow API + optimistic UI in ProfileHeader
- [ ] In-app notifications (bell dropdown, polling 60s)
- [ ] `api/notifications/route.ts`
- [ ] Tier upgrade on vote: calculateTier + update profile + notification + Resend email
- [ ] `lib/resend.ts` — tier upgrade email
- [ ] Recipe search (Supabase full-text, debounced)
- [ ] Creator analytics (Recharts bar chart on profile, Hot Chef+)

**Deliverable:** Full community loop.

---

### Phase 6 — SEO, Polish & Launch (Week 10–11)
- [ ] `generateMetadata` on all pages
- [ ] JSON-LD Recipe schema on recipe detail
- [ ] `app/sitemap.ts` — all recipe + profile URLs
- [ ] `app/robots.ts`
- [ ] `api/og/profile/[username]/route.tsx`
- [ ] Loading skeletons on all async content
- [ ] Error boundaries on all page sections
- [ ] Empty states for zero-content views
- [ ] Toast notifications for all user actions
- [ ] Keyboard swipe (arrow keys on `/discover`)
- [ ] All icon buttons with `aria-label`
- [ ] Lighthouse audit → score ≥ 90
- [ ] `README.md` (full setup + deploy guide)
- [ ] `.github/workflows/deploy.yml` — CI/CD

**Deliverable:** Production-ready. Launch.

---

## 14. Non-Functional Requirements

### Performance
- Lighthouse ≥ 90 (Vercel measured)
- FCP < 2s, TTI < 4s
- Swipe animation at 60fps on mid-range mobile

### Vercel Hobby Limits (respect these)
- Serverless timeout: 10s — all DB queries must complete in < 8s
- Bandwidth: 100GB/mo — monitor after launch
- Build minutes: 45/mo — avoid expensive build-time data fetching

### Supabase Free Limits (respect these)
- 500MB DB — monitor via dashboard; TheMealDB import uses ~5–10MB
- 1GB Storage — compress images before upload; max 5MB per file
- 2GB bandwidth — monitor; upgrade if exceeded

### Security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- Validate all API route inputs with Zod
- RLS policies enforce all data access rules
- File upload: validate MIME type + size server-side

### Accessibility
- Visible focus states on all interactive elements
- `aria-label` on all icon-only buttons
- Keyboard alternative for swipe (← → keys on `/discover`)
- Colour contrast ≥ 4.5:1 for body text

### SEO
- All recipe/profile pages SSR
- `Recipe` JSON-LD on detail pages
- Dynamic OG images for social sharing
- Auto-generated sitemap
- Correct `robots.txt`

---

## 15. Testing Requirements

### Unit Tests (Vitest)
- `detectVideoType()` + `buildEmbedUrl()` — all URL variants
- `calculateTier()` — all boundary values
- Zod schemas — valid/invalid recipe form inputs
- Vote toggle optimistic state logic

### E2E Tests (Playwright)
- Guest visits `/discover`, swipes 3 cards, gets AuthPromptModal on vote
- Signup → create recipe → recipe appears on own profile
- Swipe right → recipe in saved list
- Edit own recipe → changes saved; cannot edit curated recipe
- Leaderboard loads and excludes `forkit_curated`

### Manual QA Before Each Phase Deploy
- [ ] Swipe gesture works on mobile Chrome (Android) and Safari (iOS)
- [ ] Guest can browse `/discover` and `/recipe/[id]` without account
- [ ] AuthPromptModal appears on vote/save/follow (guest)
- [ ] Curated recipes show "ForkIt Curated" badge, no edit/follow buttons
- [ ] YouTube video embeds load; Facebook embeds load
- [ ] Image upload works and URL is publicly accessible

---

## 16. Deployment

### Initial Setup
```bash
# 1. Supabase
# - Create project at supabase.com
# - Run supabase/schema.sql in SQL editor
# - Run supabase/seed.sql in SQL editor
# - Create Storage bucket 'recipe-images' (public, 5MB limit)
# - Enable Google OAuth in Auth > Providers
# - Enable Facebook OAuth in Auth > Providers

# 2. TheMealDB seed (local, run once)
npx tsx scripts/seed-from-mealdb.ts

# 3. Vercel
npm i -g vercel
vercel
# Add all .env.local vars in Vercel dashboard
vercel --prod
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run type-check
      - run: npm run test
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 17. Growth & Launch Playbook

### Before Launch — Build in Public (Week 1–8)
Post weekly X/Twitter updates while building: wireframes, swipe demo video, milestone posts. Use `#buildinpublic`, `#indiedev`, `#nextjs`. This costs nothing and builds an audience before you have a product.

Start a waitlist on the landing page (collect emails with Resend). Even 50 people on a waitlist makes launch day feel like an event.

### Launch Day
- **Product Hunt** — solo founder authentic story: *"I built a Tinder for recipes because every recipe site is broken. Zero ads, no life stories, just food."* Prepare screenshots, 60-sec screen recording.
- **Reddit posts:** r/SideProject, r/webdev, r/cooking, r/recipes
- **Hacker News** — "Show HN: ForkIt, Tinder-style recipe discovery built on Next.js + Supabase"
- **Dev.to / Hashnode** — technical article: "Building a recipe app for $0/month with Next.js 14 and Supabase"

### After Launch — Organic Growth
- **SEO:** Every recipe page is a Google search result. 300 indexed pages from day one = 300 chances to rank. JSON-LD schema accelerates indexing.
- **Direct creator outreach:** DM 10 food creators (5k–50k followers) with a personal invite. Quality over quantity.
- **Social sharing loops:** Completion celebration card prompts users to share "I cooked [recipe] on ForkIt" — earned media.
- **Content marketing:** 5 SEO blog posts linking to ForkIt recipe pages (e.g. "10 Underrated Asian Recipes to Try Tonight").

### Why TheMealDB + Guest-First Wins

| | Without this strategy | With this strategy |
|---|---|---|
| Recipes on day 1 | 0 | 300+ across 20+ countries (26 areas) |
| Videos available | 0 | ~150+ (YouTube links from TheMealDB) |
| Guest usability | Login wall | Full browse, no account |
| SEO pages | 0 | 300 indexable recipe pages |
| Swipe experience | Empty deck | Works from first visit |
| Bounce rate | High (empty + gated) | Low (content immediately visible) |

---

## 18. Mobile App — Future Phase

> **Not in current scope.** The web app is mobile-first responsive — it already works well on phones.

**Build trigger:** When MAU > 2,000 and session data shows majority mobile usage.

**Planned stack:**
- Expo (React Native) + Expo Router
- React Native Reanimated + Gesture Handler for native swipe
- Expo Notifications for push
- Expo EAS Build (30 builds/month free)
- Same Supabase backend + TypeScript types

---

## 19. Creator Monetization Roadmap

> Current status: $0 budget. All rewards are recognition-based. This roadmap is honest about when each stage becomes feasible.

| Stage | Timing | What it is | Cost to build |
|---|---|---|---|
| **1 — Recognition Economy** | Now | Tier badges, SEO portfolio, social shoutouts, brand intros | $0 |
| **2 — Creator Tipping** | Year 1 (~1k MAU) | Stripe tipping on profiles; creator keeps 100% | Stripe setup only (free until transaction) |
| **3 — Sponsored Placements** | Year 1–2 | Brands pay ForkIt for featured slots; 30% to recipe creator | Admin dashboard (1 sprint) |
| **4 — Creator Fund** | Year 2+ | Platform revenue pooled monthly; distributed by vote-weighted formula | Automated payout system |
| **5 — Subscriptions** | Year 2–3 | ForkIt Pro ($4.99/mo) + Creator Pro ($9.99/mo) | Stripe subscription billing |

**Guiding principle:** ForkIt will never pay-to-rank, serve ads without consent, or sell creator data. The platform grows only if creators trust it.

---

## Appendix A — TheMealDB Import Script

```typescript
// scripts/seed-from-mealdb.ts
// Run with: npx tsx scripts/seed-from-mealdb.ts
import { createClient } from '@supabase/supabase-js';

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const BASE = 'https://www.themealdb.com/api/json/v1/1';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for seeding
);

const CUISINE_EMOJI: Record<string, string> = {
  Japanese:'🍣', Chinese:'🥟', Indian:'🍛', Thai:'🌶️', Mexican:'🌮',
  Moroccan:'🫕', Italian:'🍝', French:'🥐', Spanish:'🥘', Greek:'🫒',
  Malaysian:'🍲', Vietnamese:'🍜', Tunisian:'🍳', Turkish:'🌯',
  Egyptian:'🧆', Kenyan:'🥩', Jamaican:'🍗', American:'🍔',
  British:'🍖', Canadian:'🥞', Croatian:'🫙', Dutch:'🧀',
  Irish:'🥔', Polish:'🫓', Portuguese:'🥗', Russian:'🥣',
  DEFAULT:'🍴',
};

const AREAS = [
  {area:'American',code:'US',flag:'🇺🇸'},{area:'British',code:'GB',flag:'🇬🇧'},
  {area:'Canadian',code:'CA',flag:'🇨🇦'},{area:'Chinese',code:'CN',flag:'🇨🇳'},
  {area:'Croatian',code:'HR',flag:'🇭🇷'},{area:'Dutch',code:'NL',flag:'🇳🇱'},
  {area:'Egyptian',code:'EG',flag:'🇪🇬'},{area:'French',code:'FR',flag:'🇫🇷'},
  {area:'Greek',code:'GR',flag:'🇬🇷'},{area:'Indian',code:'IN',flag:'🇮🇳'},
  {area:'Irish',code:'IE',flag:'🇮🇪'},{area:'Italian',code:'IT',flag:'🇮🇹'},
  {area:'Jamaican',code:'JM',flag:'🇯🇲'},{area:'Japanese',code:'JP',flag:'🇯🇵'},
  {area:'Kenyan',code:'KE',flag:'🇰🇪'},{area:'Malaysian',code:'MY',flag:'🇲🇾'},
  {area:'Mexican',code:'MX',flag:'🇲🇽'},{area:'Moroccan',code:'MA',flag:'🇲🇦'},
  {area:'Polish',code:'PL',flag:'🇵🇱'},{area:'Portuguese',code:'PT',flag:'🇵🇹'},
  {area:'Russian',code:'RU',flag:'🇷🇺'},{area:'Spanish',code:'ES',flag:'🇪🇸'},
  {area:'Thai',code:'TH',flag:'🇹🇭'},{area:'Tunisian',code:'TN',flag:'🇹🇳'},
  {area:'Turkish',code:'TR',flag:'🇹🇷'},{area:'Vietnamese',code:'VN',flag:'🇻🇳'},
];

async function importArea(area: string, code: string, flag: string) {
  console.log(`\nImporting ${area}...`);
  const listRes = await fetch(`${BASE}/filter.php?a=${area}`);
  const { meals } = await listRes.json();
  if (!meals) { console.log(`  No meals found for ${area}`); return; }

  for (const meal of meals) {
    await sleep(500); // polite rate limiting
    const detailRes = await fetch(`${BASE}/lookup.php?i=${meal.idMeal}`);
    const { meals: [d] } = await detailRes.json();
    if (!d) continue;

    const ingredients: { text: string; sort_order: number }[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = d[`strIngredient${i}`]?.trim();
      const msr = d[`strMeasure${i}`]?.trim();
      if (ing) ingredients.push({ text: [msr, ing].filter(Boolean).join(' '), sort_order: i });
    }

    const rawInstructions = (d.strInstructions || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const stepTexts = rawInstructions
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);
    const steps = stepTexts.map((text: string, i: number) => ({
      step_number: i + 1,
      title: `Step ${i + 1}`,
      body: text,
    }));
    if (steps.length === 0) steps.push({ step_number: 1, title: 'Instructions', body: rawInstructions.trim() });

    const { data: recipe, error } = await supabase.from('recipes').insert({
      title: d.strMeal,
      description: `A classic ${area} dish. ${d.strCategory} cuisine.`,
      emoji: CUISINE_EMOJI[area] ?? CUISINE_EMOJI.DEFAULT,
      image_url: d.strMealThumb,
      country_code: code,
      country_name: area,
      country_flag: flag,
      difficulty: 'medium',
      time_minutes: Math.max(15, steps.length * 8),
      servings: 4,
      video_url: d.strYoutube || null,
      video_type: d.strYoutube ? 'youtube' : null,
      video_note: d.strYoutube ? 'Official cooking tutorial video.' : null,
      published: true,
      featured: false,
      source: 'curated',
      source_url: `https://www.themealdb.com/meal/${d.idMeal}`,
      author_id: SYSTEM_USER_ID,
      total_votes: 0,
    }).select('id').single();

    if (error || !recipe) { console.error(`  ✗ ${d.strMeal}: ${error?.message}`); continue; }

    await supabase.from('ingredients').insert(
      ingredients.map(ing => ({ ...ing, recipe_id: recipe.id }))
    );
    await supabase.from('recipe_steps').insert(
      steps.map(s => ({ ...s, recipe_id: recipe.id }))
    );

    // Update country recipe_count
    await supabase.rpc('increment_country_count', { country_code: code });

    console.log(`  ✓ ${d.strMeal}`);
  }
}

(async () => {
  console.log('🍴 Starting TheMealDB import...');
  for (const { area, code, flag } of AREAS) {
    await importArea(area, code, flag);
  }
  console.log('\n✅ Import complete!');
})();
```

Add this RPC to `supabase/schema.sql`:
```sql
create or replace function increment_country_count(country_code text)
returns void as $$
  update countries set recipe_count = recipe_count + 1 where code = country_code;
$$ language sql security definer;
```

---

## Appendix B — Claude Code Quick-Start Prompt

When starting a new Claude Code session, attach this spec file and use:

```
I have attached FORKIT_PROJECT_SPEC.md (v3.0.0). Read it fully before writing any code.

Summary: ForkIt is a Tinder-style recipe discovery platform. Single Next.js 14 project on Vercel (free tier), Supabase for database + auth + storage, zero budget.

CRITICAL CONSTRAINTS:
1. Guest-first: /discover, /explore, /leaderboard, /recipe/[id] must work WITHOUT an account
2. Auth only gates: /create, /saved, /profile/[username]/edit
3. AuthPromptModal (not redirect) when guest tries to vote/save/follow
4. No separate API server — all backend is Next.js Route Handlers
5. No Redis, no Cloudinary — Supabase handles everything
6. TheMealDB seed script runs ONCE before launch to populate 300+ recipes

BUILD ORDER: Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 (one at a time, confirm before next)

We are starting with [PHASE NUMBER]. Please begin.
```

---

*End of ForkIt Project Specification v3.0.0*
*Zero budget · Guest-first · TheMealDB seeded · Web-first*
