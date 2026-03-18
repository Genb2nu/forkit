# 🔥 ForkIt — Cook. Swipe. Conquer.

> A Tinder-style recipe discovery platform. Swipe through dishes from 20+ countries, vote for your favourites, and join a community of food creators. No ads, no life stories, no account required.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

- **Swipe-to-discover** — Tinder-style recipe cards with drag gestures (Framer Motion)
- **Guest-first** — Browse, swipe, and explore without signing up
- **300+ curated recipes** — Seeded from TheMealDB across 26 countries
- **Country Explorer** — Browse cuisines by country with interactive tiles
- **Live Leaderboard** — Community-voted creator rankings (hourly ISR)
- **Creator Tiers** — Earn badges from 🌱 Starter → 🔥 Hot Chef → ⭐ Star Creator → 🏆 Legend
- **Embedded videos** — YouTube/Facebook tutorials baked into recipe pages
- **Step-by-step cooking** — Check off ingredients and steps as you cook
- **Follow system** — Follow creators and get notified of new recipes
- **SEO optimized** — Dynamic metadata, JSON-LD, OG images, sitemap
- **Mobile-first** — Feels like a native app on phones

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion 12 |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| State | Zustand 5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts 3 (dynamic import) |
| Email | Resend |
| OG Images | @vercel/og |
| Deployment | Vercel |

## 📁 Project Structure

```
forkit/
├── app/
│   ├── (landing)/        # Marketing pages (/, /about, /creators)
│   ├── (app)/            # Web app (/discover, /explore, /leaderboard, etc.)
│   ├── api/              # Route Handlers (REST API)
│   ├── auth/             # OAuth callback + email confirm
│   ├── layout.tsx        # Root layout (fonts, providers, toaster)
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt config
├── components/
│   ├── auth/             # AuthPromptModal
│   ├── explore/          # CountryGrid, CountryTile
│   ├── layout/           # AppNav, BottomNav, Navbar, Footer
│   ├── leaderboard/      # Podium, LeaderboardRow
│   ├── profile/          # ProfileHeader, TierBadge, CreatorAnalytics
│   ├── recipe/           # SwipeDeck, SwipeCard, RecipeDetail, RecipeForm, etc.
│   ├── providers/        # QueryProvider
│   └── ui/               # shadcn + Skeleton, ErrorBoundary, EmptyState
├── hooks/                # useUser, useVote, useSave, useDebounce
├── lib/                  # supabase clients, rewards, video, validation, resend
├── stores/               # authStore, swipeStore, authPromptStore (Zustand)
├── types/                # TypeScript interfaces
├── scripts/              # seed-from-mealdb.ts
├── supabase/             # schema.sql, seed.sql
└── .github/workflows/    # CI/CD
```

## 🚀 Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/forkit.git
cd forkit
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` | Resend API key for tier upgrade emails |
| `RESEND_FROM_EMAIL` | Sender email for Resend |

### 3. Supabase Setup

#### Schema

Run the SQL from `supabase/schema.sql` in your Supabase SQL Editor. This creates:
- All tables (profiles, recipes, ingredients, recipe_steps, tags, recipe_tags, votes, saved_recipes, follows, countries, notifications)
- Enums (reward_tier, difficulty, video_type, notification_type)
- Indexes for common queries
- Row-Level Security (RLS) policies
- Triggers (auto-create profile on signup, auto-update vote counts)
- RPCs (increment_country_count)

#### Seed Data

Run the SQL from `supabase/seed.sql` to insert:
- System curator profile (`forkit_curated`)
- 26 countries with flags and codes
- Sample tags

#### Storage

Create a public storage bucket named `recipe-images` in your Supabase dashboard.

#### OAuth (Optional)

Set up Google OAuth in Supabase → Authentication → Providers for social login.

### 4. Seed Curated Recipes

Import 300+ recipes from TheMealDB:

```bash
npx tsx scripts/seed-from-mealdb.ts
```

This script:
- Fetches recipes from all 26 cuisines via TheMealDB API
- Parses ingredients (20 slots) and steps
- Inserts as `source='curated'` under the `forkit_curated` system user
- Includes video URLs where available
- Sleeps 500ms between requests to respect rate limits

### 5. Run Development Server

```bash
npm run dev
```

> **Note:** If you're behind a corporate proxy with SSL inspection, you may need:
> ```powershell
> $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run dev
> ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🌐 Vercel Deployment

1. Push your repo to GitHub
2. Import into Vercel
3. Add all environment variables from the table above
4. Deploy!

Or use the CLI:

```bash
npm i -g vercel
vercel --prod
```

### GitHub Actions CI/CD

The `.github/workflows/deploy.yml` workflow:
- Runs lint + type-check + build on every PR
- Deploys preview on PRs
- Deploys to production on push to `main`

Required GitHub secrets:
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- All Supabase env vars

## 📋 Phase Implementation Checklist

- [x] **Phase 0** — Scaffold + Supabase schema + TheMealDB seed script
- [x] **Phase 1** — Landing website (10-section marketing page)
- [x] **Phase 2** — Auth + app shell (guest-first, AuthPromptModal)
- [x] **Phase 3** — Swipe feed + recipe detail (drag gestures, JSON-LD)
- [x] **Phase 4** — Recipe creation + editing (RHF + Zod, image upload)
- [x] **Phase 5** — Community (leaderboard, explorer, follows, notifications, analytics)
- [x] **Phase 6** — SEO, polish, performance, launch

## 🗺 API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/recipes/feed` | GET | No | Swipe feed (paginated, exclude filter) |
| `/api/recipes` | GET | No | Search/filter recipes |
| `/api/recipes` | POST | Yes | Create recipe |
| `/api/recipes/[id]` | GET | No | Get single recipe |
| `/api/recipes/[id]` | PATCH | Yes | Update own recipe |
| `/api/votes` | POST | Yes | Toggle vote |
| `/api/saves` | POST | Yes | Toggle save |
| `/api/saves` | GET | Yes | List saved recipes |
| `/api/follows/[username]` | POST | Yes | Follow user |
| `/api/follows/[username]` | DELETE | Yes | Unfollow user |
| `/api/notifications` | GET | Yes | List notifications |
| `/api/notifications` | PATCH | Yes | Mark all read |
| `/api/leaderboard` | GET | No | Creator rankings (ISR 1hr) |
| `/api/upload` | POST | Yes | Upload recipe image |
| `/api/og/recipe/[id]` | GET | No | Recipe OG image |
| `/api/og/profile/[username]` | GET | No | Profile OG image |

## 📄 License

MIT

---

Built with ❤️ and 🔥 by a solo developer on a zero budget.
