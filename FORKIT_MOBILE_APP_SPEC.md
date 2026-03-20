# ForkIt — Mobile App Specification
> **Version:** 1.0.0
> **Platforms:** iOS 16+ · Android 10+ (API 29+)
> **Framework:** Expo (React Native) — Managed Workflow
> **Backend:** Same Supabase + Next.js API already live at `https://forkit-ashy.vercel.app`
> **Relationship to web app:** Separate Expo repo, shared backend. Web app stays as-is.

---

## Table of Contents

1. [Why a Native App](#1-why-a-native-app)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Navigation Structure](#4-navigation-structure)
5. [Design System](#5-design-system)
6. [Screen Specifications](#6-screen-specifications)
   - 6.1 [Onboarding](#61-onboarding)
   - 6.2 [Auth Screens](#62-auth-screens)
   - 6.3 [Discover — Swipe Feed](#63-discover--swipe-feed)
   - 6.4 [Recipe Detail](#64-recipe-detail)
   - 6.5 [Explore — Country Grid](#65-explore--country-grid)
   - 6.6 [Leaderboard](#66-leaderboard)
   - 6.7 [Create Recipe](#67-create-recipe)
   - 6.8 [Profile](#68-profile)
   - 6.9 [Notifications](#69-notifications)
   - 6.10 [Saved Recipes](#610-saved-recipes)
   - 6.11 [Auth Prompt Sheet](#611-auth-prompt-sheet)
7. [Native Features](#7-native-features)
8. [API Integration](#8-api-integration)
9. [App Store Requirements](#9-app-store-requirements)
10. [Environment Variables](#10-environment-variables)
11. [Folder Structure](#11-folder-structure)
12. [Implementation Phases](#12-implementation-phases)
13. [Testing](#13-testing)

---

## 1. Why a Native App

The web app at `forkit-ashy.vercel.app` is mobile-responsive and already works well in a browser. The native app is built **on top of** the working web product — not instead of it. The native layer adds things the browser cannot do:

| Capability | Web | Native App |
|---|---|---|
| Native swipe gesture (60fps, haptic feedback) | Simulated | ✅ Real |
| Push notifications (new votes, follows) | ❌ | ✅ |
| Camera for recipe photo upload | Limited | ✅ Native |
| Home screen presence | ❌ | ✅ |
| Offline saved recipes cache | ❌ | ✅ |
| iOS Share Sheet / Android Share | Limited | ✅ |
| App Store discoverability | ❌ | ✅ |
| Haptic feedback on swipe | ❌ | ✅ |

**Build trigger from spec §18:** MAU > 2,000 and session data showing majority mobile usage.

---

## 2. Tech Stack

### Core

| Package | Version | Purpose |
|---|---|---|
| **Expo** | SDK 52+ | Managed workflow — handles iOS/Android build toolchain |
| **Expo Router** | v4 | File-based routing (same mental model as Next.js App Router) |
| **React Native** | 0.76+ | Cross-platform UI framework |
| **TypeScript** | 5+ | Type safety — share types with web app |

### Gestures & Animation

| Package | Purpose |
|---|---|
| **React Native Reanimated** v3 | Butter-smooth 60fps swipe cards on the JS thread + native driver |
| **React Native Gesture Handler** | Native gesture recognition (pan, tap, long-press) |

### State & Data

| Package | Purpose |
|---|---|
| **Zustand** | Auth state + swipe session state (same stores as web) |
| **TanStack Query** v5 | Server state, caching, mutations — same pattern as web |

### Supabase & Auth

| Package | Purpose |
|---|---|
| **@supabase/supabase-js** | Direct DB + Auth client |
| **expo-auth-session** | OAuth (Google, Facebook) via browser popup |
| **expo-secure-store** | Store Supabase session tokens securely (replaces localStorage) |

### Native Modules (all Expo-managed, no ejecting needed)

| Package | Purpose |
|---|---|
| **expo-notifications** | Push notifications (new votes, follows, tier upgrades) |
| **expo-camera** | Camera for recipe photo capture |
| **expo-image-picker** | Select from camera roll |
| **expo-haptics** | Haptic feedback on swipe events |
| **expo-video** | In-app YouTube-compatible video player |
| **expo-sharing** | iOS Share Sheet / Android Share |
| **expo-image** | Performant image rendering with progressive loading |
| **expo-linear-gradient** | Recipe card gradients |
| **@shopify/flash-list** | High-performance lists (leaderboard, explore) |

### Build & Distribution

| Service | Purpose | Cost |
|---|---|---|
| **Expo EAS Build** | Cloud build for iOS + Android | Free: 30 builds/month |
| **Expo EAS Submit** | Auto-submit to App Store + Play Store | Free |
| **Expo EAS Update** | OTA updates without App Store review | Free: 1,000 MAU |

---

## 3. Architecture

```
┌──────────────────────────────────────────┐
│         FORKIT MOBILE (Expo)             │
│                                          │
│  Expo Router (file-based navigation)     │
│  React Native + Reanimated               │
│  Zustand + TanStack Query                │
└────────────┬─────────────────────────────┘
             │ HTTPS calls
             ▼
┌──────────────────────────────────────────┐
│   EXISTING NEXT.JS API                   │
│   https://forkit-ashy.vercel.app/api/*   │
│                                          │
│   /api/recipes/feed                      │
│   /api/votes                             │
│   /api/saves                             │
│   /api/leaderboard                       │
│   /api/notifications                     │
│   /api/upload                            │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│   SUPABASE (shared with web app)         │
│   PostgreSQL + Auth + Storage            │
└──────────────────────────────────────────┘
```

**Key principle:** The mobile app calls the **same API routes** as the web app. No new backend is needed. Auth tokens from Supabase work across both platforms — a user logged into the web app is automatically logged into the mobile app with the same account.

---

## 4. Navigation Structure

```
Root Stack
├── (auth)/              # Unauthenticated-only screens
│   ├── onboarding       # 3-screen splash (first install only)
│   ├── login
│   └── signup
│
└── (tabs)/              # Main app — bottom tab bar
    ├── index            # Tab 1: Discover (Swipe Feed)
    ├── explore          # Tab 2: Explore (Countries)
    ├── leaderboard      # Tab 3: Leaderboard
    └── create           # Tab 4: Create Recipe (auth gate)

    # Modal / Stack screens (reachable from any tab)
    ├── recipe/[id]      # Recipe Detail (full screen modal)
    ├── profile/[username]
    ├── notifications
    └── saved
```

### Bottom Tab Bar Design

```
[🔥 Swipe] [🌍 Explore] [🏆 Rank] [✨ Create]
```

- Active tab: fire orange icon + orange underline bar (2px)
- Inactive: cream at 40% opacity
- Background: `#0f0d0a` with top border `rgba(255,255,255,0.07)`
- Height: 60px + safe area inset
- No labels on small screens (icon only); labels on larger phones

### Guest Access (same model as web)

| Screen | Guest access |
|---|---|
| Discover (swipe) | ✅ Full access |
| Explore | ✅ Full access |
| Leaderboard | ✅ Full access |
| Recipe Detail | ✅ Full access |
| Profile | ✅ Full access |
| Create | ❌ Shows AuthPromptSheet |
| Saved | ❌ Shows AuthPromptSheet |
| Vote / Save / Follow | ❌ Shows AuthPromptSheet |

---

## 5. Design System

### Colours (exact match to web app)

```typescript
// constants/Colors.ts
export const Colors = {
  bg:     '#0f0d0a',   // primary background
  bg2:    '#1a1710',   // surface / card background
  bg3:    '#211f16',   // elevated surface
  fire:   '#f97316',   // primary accent (orange)
  ember:  '#ef4444',   // secondary accent (red)
  forest: '#22c55e',   // positive / guest badge
  cream:  '#f5f0e8',   // primary text
  muted:  '#6b6454',   // secondary text
  border: 'rgba(255,255,255,0.07)',
};
```

### Typography

```typescript
// constants/Typography.ts
// Fonts loaded via expo-font
export const Fonts = {
  head:     'PlayfairDisplay_900Black',
  headItal: 'PlayfairDisplay_700Italic',
  body:     'DMSans_400Regular',
  bodyMed:  'DMSans_500Medium',
  bodySemi: 'DMSans_600SemiBold',
  mono:     'DMMono_400Regular',
};
```

Load in `app/_layout.tsx`:
```typescript
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_900Black,
  PlayfairDisplay_700Italic,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
```

### Cuisine Gradients

```typescript
// constants/Gradients.ts (mirrors web lib/rewards.ts)
export const CUISINE_GRADIENTS: Record<string, string[]> = {
  CN: ['#c0392b', '#e74c3c', '#f39c12'],
  JP: ['#16a085', '#27ae60', '#2ecc71'],
  IN: ['#f39c12', '#e67e22', '#e74c3c'],
  TH: ['#8e44ad', '#c0392b', '#f39c12'],
  ID: ['#7d3c98', '#c0392b', '#d35400'],
  IT: ['#27ae60', '#2ecc71', '#16a085'],
  MX: ['#e67e22', '#e74c3c', '#c0392b'],
  MA: ['#c0392b', '#e74c3c', '#8e44ad'],
  FR: ['#2c3e50', '#3498db', '#2980b9'],
  GR: ['#2980b9', '#3498db', '#1abc9c'],
  MY: ['#c0392b', '#e74c3c', '#f39c12'],
  VN: ['#c0392b', '#e74c3c', '#f39c12'],
  PH: ['#0038a8', '#ce1127', '#fcd116'],
  ID: ['#ce1127', '#f39c12', '#7d3c98'],
  SG: ['#ef4444', '#ffffff', '#ef4444'],
  DEFAULT: ['#2c3e50', '#8e44ad', '#c0392b'],
};
```

### Spacing

```typescript
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};
```

---

## 6. Screen Specifications

### 6.1 Onboarding

**Route:** `/(auth)/onboarding`
**Shows:** First install only (store flag in `expo-secure-store`)
**Screens:** 3 slides, swipeable

| Slide | Visual | Headline | Sub |
|---|---|---|---|
| 1 | Animated recipe cards fanning out | "Swipe your next obsession." | "300+ recipes from 20+ countries. Zero ads." |
| 2 | Progress bar + checkmarks animation | "Cook, step by step." | "Ingredients you check off. Steps you complete. A celebration when you finish." |
| 3 | Leaderboard podium animation | "Earn your place." | "Upload your recipes. Earn votes. Climb the leaderboard." |

- Pagination dots (fire orange active)
- "Skip" button top-right (goes to login)
- "Next" / "Get Started" button bottom
- "Get Started" → shows login options

---

### 6.2 Auth Screens

**Route:** `/(auth)/login` and `/(auth)/signup`

**Login screen:**
- Logo + tagline at top
- "Continue with Google" — `expo-auth-session` Google OAuth
- "Continue with Facebook" — `expo-auth-session` Facebook OAuth
- Divider "or"
- Email input + Password input
- "Sign In" button (gradient)
- "Don't have an account? Sign up" link
- "Continue as Guest" text link at bottom (navigates to main tabs without auth)

**Signup screen:**
- Same layout but adds: Username input, Confirm password
- Zod validation: username 3–20 chars, lowercase alphanumeric + underscore
- On success: navigate to `/(tabs)/` with welcome toast

**Session persistence:**
Store Supabase session in `expo-secure-store`:
```typescript
// lib/supabase.ts
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(url, anonKey, {
  auth: { storage: ExpoSecureStoreAdapter, autoRefreshToken: true, persistSession: true },
});
```

---

### 6.3 Discover — Swipe Feed

**Route:** `/(tabs)/index`
**Guest access:** Full — no auth required

**Layout:**
```
┌─────────────────────────────┐
│ ForkIt 🔥     🔔  👤        │  ← Header
├─────────────────────────────┤
│                             │
│   ┌───────────────────┐     │
│   │   Recipe Card     │     │  ← Swipe deck (fills 70% height)
│   │   (gradient bg)   │     │
│   │   🌶️              │     │
│   │   Mapo Tofu       │     │
│   │   🇨🇳 · 25min · ❤️ │    │
│   └───────────────────┘     │
│                             │
│      ✕    📖    ♥           │  ← Action buttons
│                             │
│   [ Mapo Tofu ] [ Rendang ] │  ← Saved strip
└─────────────────────────────┘
```

**SwipeCard component (`components/SwipeCard.tsx`):**

```typescript
// Built with Reanimated + Gesture Handler
const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 15;

// Pan gesture → translateX → rotate → opacity overlays
// onEnd: |translateX| > threshold → swipe; else spring back

// Haptics:
// - crossing threshold: Haptics.impactAsync(ImpactFeedbackStyle.Medium)
// - confirmed swipe: Haptics.notificationAsync(NotificationFeedbackType.Success)
```

**Card visual:**
- `expo-linear-gradient` with `CUISINE_GRADIENTS[country_code]`
- Gradient overlay: `rgba(0,0,0,0)` top → `rgba(0,0,0,0.75)` bottom
- Top-left: Country flag + name pill (frosted glass)
- Top-right: Difficulty chip
- Centre: Large emoji (64px) with `textShadow`
- Bottom: Recipe title (PlayfairDisplay, 22px, white), description (2 lines, 14px, cream 70%), time + servings row
- Creator row: If `source === 'curated'` → `🍴 ForkIt Curated` badge; else avatar + username
- Vote count (fire orange, bold)

**Swipe overlays:**
- Swipe right (x > 40px): Green `❤️ SAVE` badge top-left, rotated -20deg
- Swipe left (x < -40px): Red `✕ SKIP` badge top-right, rotated 20deg
- Both fade in proportionally with drag distance

**Action buttons:**
```
  [✕]   [📖]   [♥]
  Skip  View  Save/Vote
```
- ✕: Red ring, 56px circle
- 📖: Gray ring, 48px circle → opens Recipe Detail as modal
- ♥: Green ring, 56px circle (fires if auth; AuthPromptSheet if guest)

**Keyboard (accessibility):**
- Volume up/down → swipe right/left (mobile)
- Swipe up on card → open detail

**Deck management:**
- Pre-load 20 cards; prefetch next 20 when < 5 remain
- Zustand `swipeStore`: `{ seenIds, savedIds }` — persisted with `zustand/middleware/persist` to `expo-secure-store`
- On swipe right: add to `savedIds` locally; if authenticated call `POST /api/votes` + `POST /api/saves`
- If guest swipes right: save locally + show AuthPromptSheet ("Sign in to sync your saves across devices")

**Empty state:** Lottie animation (cooking pot) + "You've seen everything! 🎉" + two buttons

---

### 6.4 Recipe Detail

**Route:** `/recipe/[id]`
**Presentation:** Full-screen stack modal (slides up from bottom)
**Guest access:** Full

**Sections (scrollable):**

1. **Hero** — Full-bleed `expo-linear-gradient`, back button (`←`), share button (iOS Share Sheet)
   - Emoji (56px), title (PlayfairDisplay 26px), chips row (country, time, servings, difficulty)

2. **Action bar** — Vote ♥ (toggle), Save 🔖 (toggle), Share 🔗
   - All trigger `AuthPromptSheet` for guests
   - Vote count displayed next to ♥

3. **Curated / Creator bar**
   ```typescript
   if (recipe.source === 'curated') {
     return <CuratedBadge />;  // "🍴 ForkIt Curated"
   } else {
     return <CreatorBar author={recipe.author} onFollow={handleFollow} />;
   }
   ```

4. **Description** — italic, cream 70%

5. **Video** — `expo-video` component, 16:9 aspect ratio, YouTube embed URL
   - Platform badge: "▶ YouTube" or "👤 Facebook"
   - If no video: dashed placeholder (only edit-able by owner)

6. **Tabs** — Segmented control: `Ingredients` | `Steps`

7. **Ingredients tab:**
   - Checkable rows (`TouchableOpacity` + animated checkmark)
   - Progress bar at top
   - Servings adjuster (+/−)

8. **Steps tab:**
   - Numbered cards, tappable to mark complete
   - Progress bar
   - Completion: confetti animation (lottie) + Share prompt

9. **Edit mode** (community recipes, owner only):
   - Long press recipe title → enters edit mode
   - Inline editing for title, description, video URL
   - "Save Changes" CTA → `PATCH /api/recipes/[id]`

---

### 6.5 Explore — Country Grid

**Route:** `/(tabs)/explore`
**Guest access:** Full

**Layout:**
```
┌──────────────────────────────┐
│ [🔍 Search cuisines...]      │
├──────────────────────────────┤
│ 155 recipes · 20 countries   │  ← Stats bar
├──────────────────────────────┤
│ 🇯🇵 Japan  🇨🇳 China           │
│ 15 recipes  12 recipes       │  ← 2-column grid
│ 🇮🇳 India  🇲🇽 Mexico          │
│ 14 recipes  10 recipes       │
│ ...                          │
└──────────────────────────────┘
```

- `@shopify/flash-list` for performance
- Each tile: `expo-linear-gradient` (cuisine colour), flag (32px), country name, recipe count
- Tap tile → filter swipe deck to that country OR navigate to filtered recipe list
- Search bar filters the grid client-side

---

### 6.6 Leaderboard

**Route:** `/(tabs)/leaderboard`
**Guest access:** Full

**Layout:**
```
┌──────────────────────────────┐
│ Hall of Flavor 🏆            │
│ [All Time][Month][Rising]    │  ← Segmented filter
├──────────────────────────────┤
│    #2        #1        #3    │
│   [MM]      [LL]      [NF]   │  ← Animated podium
│   74k       92k       68k   │
├──────────────────────────────┤
│ #4  [SR]  @sara.recipes   ▶  │
│ #5  [AB]  @aisha.kitchen  ▶  │  ← FlashList rows
│ ...                          │
└──────────────────────────────┘
```

- Podium animates in with spring when screen mounts
- `forkit_curated` excluded from all rankings
- Each row: rank, avatar (initials + gradient), username + flag, vote count, progress bar vs #1
- Tap row → navigate to `/profile/[username]`
- Data from `GET /api/leaderboard?filter=alltime` (cached 1hr by Next.js ISR)

---

### 6.7 Create Recipe

**Route:** `/(tabs)/create`
**Auth required:** Yes — shows `AuthPromptSheet` if guest taps this tab

**Layout:** Vertical scrolling form with sections

**Sections:**

1. **Photo** — Tap to open `expo-image-picker` (camera or library). Preview fills card with gradient overlay.

2. **Basics:**
   - Recipe name (`TextInput`, Playfair Display style)
   - Emoji picker (grid of food emojis, tap to select)
   - Country selector (searchable bottom sheet with flag + name list)
   - Difficulty (3-button segmented: Easy / Medium / Hard)
   - Cook time (number input, minutes)
   - Servings (stepper: − / count / +)

3. **Description** — `TextInput` multiline, 20–500 chars

4. **Ingredients** — Dynamic list:
   - Each row: text input + drag handle + delete icon
   - "＋ Add ingredient" button
   - Minimum 2 enforced

5. **Steps** — Dynamic numbered cards:
   - Each: step number (auto), title input, body textarea
   - "＋ Add step" button
   - Minimum 2 enforced

6. **Video (optional)** — URL input, auto-detects YouTube/Facebook, shows live embed preview

7. **Submit** — "🚀 Publish Recipe" button (gradient, full-width)
   - Progress: upload image → create recipe → success
   - On success: navigate to the new `/recipe/[id]` screen

---

### 6.8 Profile

**Route:** `/profile/[username]`
**Guest access:** Full (can view any profile)

**Layout:**
```
┌──────────────────────────────┐
│ ←  @username           ⋮    │
├──────────────────────────────┤
│  [Avatar]  display_name      │
│  🔥 Hot Chef  ·  🇸🇬         │
│  "Bio text here..."          │
│  📸 @ig  🎵 @tiktok  ...     │
│  [Follow] or [Edit Profile]  │
│  142 followers · 38 following│
├──────────────────────────────┤
│  Recipes (12)                │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │      │ │      │ │      │ │  ← 3-column recipe grid
│  └──────┘ └──────┘ └──────┘ │
└──────────────────────────────┘
```

- **Own profile extras:** "Edit Profile" button → editable form (name, bio, avatar, social links)
- **Avatar upload:** `expo-image-picker` → `POST /api/upload` → update profile
- **Follow button:** `AuthPromptSheet` if guest; toggle follow if authenticated
- **Recipe grid:** `FlashList` 3-column; tap → Recipe Detail
- **Curated profile:** If `username === 'forkit_curated'`, show editorial badge instead of follow/edit

---

### 6.9 Notifications

**Route:** `/notifications`
**Auth required:** Yes
**Accessed from:** Bell icon in header (with unread count badge)

- `FlashList` of notification rows
- Types: `new_vote` ❤️, `new_follower` 👤, `tier_upgrade` 🏆, `recipe_featured` 🍴
- Unread rows: slightly brighter background
- "Mark all read" button in header
- Pull-to-refresh
- Empty state: "You're all caught up! 🎉"

**Push notifications:**
- Register device token on login: `expo-notifications` → send token to Supabase `profiles.push_token`
- Next.js API calls Expo Push API when events fire (new vote, new follower, tier upgrade)
- Notification tap → deep link to relevant recipe or profile

---

### 6.10 Saved Recipes

**Route:** `/saved`
**Auth required:** Yes
**Accessed from:** Profile tab or after signing in from a save prompt

- `FlashList` 2-column grid of saved recipe cards
- Each card: cuisine gradient, emoji, title, country + flag, time
- Tap → Recipe Detail
- Swipe card left → remove from saved (with undo toast)
- Empty state: "Nothing saved yet. Start swiping! 🔥" with "Go to Discover" button

---

### 6.11 Auth Prompt Sheet

**Component:** `components/AuthPromptSheet.tsx`
**Presentation:** Bottom sheet (from `@gorhom/bottom-sheet`)

This is the mobile equivalent of `AuthPromptModal` from the web app. Slides up from the bottom when a guest attempts a restricted action.

```typescript
// Props
type AuthPromptSheetProps = {
  action: 'vote' | 'save' | 'follow' | 'submit' | 'sync';
  onClose: () => void;
  onSuccess?: () => void;
};
```

**Content per action:**
- `vote`: "❤️ Vote for this recipe" — "Help it climb the leaderboard."
- `save`: "🔖 Save this recipe" — "Sync saves across all your devices."
- `follow`: "👤 Follow this creator" — "Get their new recipes first."
- `submit`: "🍴 Share your recipe" — "Free. Takes 2 minutes."
- `sync`: "☁️ Sync your swipes" — "You've swiped right on 5 recipes. Sign in to save them permanently."

**Auth options:**
1. "Continue with Google" → `expo-auth-session` OAuth
2. "Continue with email →" → navigate to login screen
3. "No thanks, keep browsing" → dismiss sheet

---

## 7. Native Features

### Push Notifications

**Setup:**
```typescript
// Register on login
const token = await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });
await supabase.from('profiles').update({ push_token: token.data }).eq('id', userId);
```

**Trigger (server-side, in Next.js API route):**
```typescript
// Called from /api/votes after inserting vote
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: recipientPushToken,
    title: '❤️ New vote!',
    body: `@${voterUsername} voted for your recipe "${recipeTitle}"`,
    data: { screen: 'recipe', recipeId },
  }),
});
```

**Add to `profiles` table:**
```sql
ALTER TABLE profiles ADD COLUMN push_token text;
```

**Notification types:**
| Event | Title | Body | Deep link |
|---|---|---|---|
| New vote | `❤️ New vote!` | `@user voted for "[recipe]"` | `/recipe/[id]` |
| New follower | `👤 New follower` | `@user is now following you` | `/profile/[username]` |
| Tier upgrade | `🔥 You levelled up!` | `You're now a [Tier] on ForkIt!` | `/profile/[username]` |
| Recipe featured | `🍴 Recipe featured!` | `"[recipe]" was featured on the homepage` | `/recipe/[id]` |

---

### Haptics

```typescript
import * as Haptics from 'expo-haptics';

// On crossing swipe threshold:
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// On confirmed swipe right (save):
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// On confirmed swipe left (skip):
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// On vote toggle:
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
```

---

### Camera & Image Upload

```typescript
// components/ImagePickerButton.tsx
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],   // landscape for recipe cards
  });
  if (!result.canceled) {
    await uploadImage(result.assets[0].uri);
  }
};

const uploadImage = async (uri: string) => {
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: 'recipe.jpg' } as any);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: formData,
  });
  const { url } = await res.json();
  return url;
};
```

---

### Deep Linking

```typescript
// app.json
{
  "scheme": "forkit",
  "intentFilters": [
    {
      "action": "VIEW",
      "data": [{ "scheme": "https", "host": "forkit-ashy.vercel.app" }]
    }
  ]
}
```

This means links to `https://forkit-ashy.vercel.app/recipe/abc123` will open in the native app if installed — universal links on iOS, App Links on Android.

---

## 8. API Integration

The mobile app calls the **same Next.js API** at `https://forkit-ashy.vercel.app`.

```typescript
// lib/api.ts
const API_BASE = 'https://forkit-ashy.vercel.app';

export async function apiFetch(path: string, opts?: RequestInit) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts?.headers,
    },
  });
}
```

All existing endpoints work unchanged. The only addition needed server-side is accepting push tokens (already covered in §7).

---

## 9. App Store Requirements

### iOS (App Store)

| Requirement | Value |
|---|---|
| Bundle ID | `app.forkit.mobile` |
| Minimum iOS | 16.0 |
| App Store Category | Food & Drink |
| Privacy — Camera | "Used to photograph your recipes" |
| Privacy — Photo Library | "Used to select recipe photos" |
| Privacy — Notifications | "Used to notify you about votes and follows" |
| Privacy — Tracking | No tracking — N/A |

**App Store screenshots required:**
- 6.7" iPhone (1290×2796): Swipe feed, Recipe Detail, Leaderboard, Create, Profile
- 12.9" iPad (2048×2732): Optional but recommended

**Short description (30 chars):** `Swipe. Cook. Conquer.`
**Long description:** See marketing copy in `FORKIT_PROJECT_SPEC.md`

### Android (Google Play)

| Requirement | Value |
|---|---|
| Application ID | `app.forkit.mobile` |
| Minimum SDK | API 29 (Android 10) |
| Category | Food & Drink |
| Content Rating | Everyone |
| Target SDK | API 35 (Android 15) |

---

## 10. Environment Variables

```env
# .env (Expo — prefix with EXPO_PUBLIC_ for client-visible vars)

EXPO_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
EXPO_PUBLIC_API_BASE="https://forkit-ashy.vercel.app"
EXPO_PUBLIC_EAS_PROJECT_ID="xxxx-xxxx-xxxx-xxxx"  # from eas.json

# Google OAuth (from Google Cloud Console)
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS="xxx.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID="xxx.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB="xxx.apps.googleusercontent.com"  # for Supabase

# Facebook OAuth
EXPO_PUBLIC_FACEBOOK_APP_ID="xxx"
```

---

## 11. Folder Structure

```
forkit-mobile/
├── app/
│   ├── _layout.tsx              # Root layout: fonts, providers, splash
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab bar config
│   │   ├── index.tsx            # Discover / Swipe Feed
│   │   ├── explore.tsx          # Country Explorer
│   │   ├── leaderboard.tsx      # Hall of Flavor
│   │   └── create.tsx           # Create Recipe
│   ├── recipe/[id].tsx          # Recipe Detail (modal)
│   ├── profile/[username].tsx   # Profile
│   ├── notifications.tsx
│   └── saved.tsx
│
├── components/
│   ├── SwipeCard.tsx            # Reanimated swipe card
│   ├── SwipeDeck.tsx            # Card stack manager
│   ├── RecipeDetail.tsx         # Full recipe view
│   ├── IngredientList.tsx       # Checkable ingredients
│   ├── StepsList.tsx            # Completable steps
│   ├── VideoPlayer.tsx          # expo-video wrapper
│   ├── AuthPromptSheet.tsx      # Bottom sheet for guest actions
│   ├── CuratedBadge.tsx         # 🍴 ForkIt Curated display
│   ├── TierBadge.tsx            # Reward tier badge
│   ├── Podium.tsx               # Leaderboard top 3
│   ├── LeaderboardRow.tsx
│   ├── CountryTile.tsx
│   ├── RecipeCard.tsx           # Compact grid card
│   ├── ImagePickerButton.tsx
│   ├── CountrySelector.tsx      # Searchable bottom sheet
│   ├── EmojiPicker.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Avatar.tsx
│       ├── Skeleton.tsx
│       ├── Toast.tsx
│       └── ProgressBar.tsx
│
├── hooks/
│   ├── useVote.ts
│   ├── useSave.ts
│   ├── useFollow.ts
│   ├── useUser.ts
│   └── useSwipeDeck.ts
│
├── stores/
│   ├── authStore.ts             # Zustand (same shape as web)
│   └── swipeStore.ts            # Persisted with SecureStore
│
├── lib/
│   ├── supabase.ts              # Client with SecureStore adapter
│   ├── api.ts                   # apiFetch wrapper
│   ├── video.ts                 # detectVideoType, buildEmbedUrl
│   └── rewards.ts               # calculateTier, CUISINE_GRADIENTS
│
├── constants/
│   ├── Colors.ts
│   ├── Typography.ts
│   ├── Spacing.ts
│   └── Gradients.ts
│
├── types/
│   └── index.ts                 # Shared with web — copy/symlink
│
├── assets/
│   ├── icon.png                 # 1024×1024 app icon
│   ├── splash.png               # 1284×2778 splash screen
│   ├── adaptive-icon.png        # Android adaptive icon
│   └── animations/              # Lottie files
│       ├── swipe-empty.json
│       └── cooking-complete.json
│
├── app.json                     # Expo config
├── eas.json                     # EAS Build config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 12. Implementation Phases

### Phase 0 — Scaffold + Setup (Day 1–2)

- [ ] `npx create-expo-app@latest forkit-mobile --template tabs` (TypeScript)
- [ ] Install all dependencies (§2 Tech Stack)
- [ ] Configure `app.json`: name, slug, scheme, icon, splash, iOS bundle ID, Android package
- [ ] Create `eas.json`: development + preview + production profiles
- [ ] Load fonts in `app/_layout.tsx` with `expo-font`
- [ ] `constants/Colors.ts`, `Typography.ts`, `Spacing.ts`, `Gradients.ts`
- [ ] `lib/supabase.ts` with `expo-secure-store` session adapter
- [ ] `lib/api.ts` with `apiFetch` wrapper
- [ ] `types/index.ts` — copy from web app (Recipe, Profile, Ingredient, etc.)
- [ ] `stores/authStore.ts`, `stores/swipeStore.ts` (with AsyncStorage/SecureStore persist)
- [ ] `lib/video.ts`, `lib/rewards.ts` (copy from web)
- [ ] Root `_layout.tsx`: QueryClient provider, session listener, font loader, splash hide

**Deliverable:** Blank Expo app running on iOS Simulator and Android Emulator.

---

### Phase 1 — Auth + Navigation Shell (Week 1)

- [ ] `(auth)/onboarding.tsx` — 3 slides with `FlatList` horizontal pager
- [ ] `(auth)/login.tsx` — email/password + Google OAuth + "Continue as Guest"
- [ ] `(auth)/signup.tsx` — email/password/username
- [ ] `lib/supabase.ts` — Google OAuth with `expo-auth-session`
- [ ] `(tabs)/_layout.tsx` — bottom tab bar with fire orange active state
- [ ] `useUser` hook — session listener that populates authStore
- [ ] `AuthPromptSheet.tsx` — `@gorhom/bottom-sheet` integration
- [ ] Header component — logo left, bell icon right (with badge), user avatar right
- [ ] First install detection + onboarding routing (SecureStore flag)
- [ ] Guest routing: tabs 1–3 accessible without auth; tab 4 shows AuthPromptSheet

**Deliverable:** Full auth flow working on both platforms. Guest can navigate all tabs except Create.

---

### Phase 2 — Swipe Feed (Week 2)

- [ ] `components/SwipeCard.tsx` — full Reanimated implementation
  - Pan gesture → translateX, rotate, overlay opacity
  - Threshold detection → haptics
  - Spring-back animation when released before threshold
  - SAVE / SKIP overlays
- [ ] `components/SwipeDeck.tsx` — card stack (active + 2 shadows)
  - Batch loading from `GET /api/recipes/feed`
  - Prefetch when < 5 cards remain
  - `swipeStore` integration for seenIds
  - Empty state with Lottie animation
- [ ] `(tabs)/index.tsx` — Discover screen with header, deck, action buttons, saved strip
- [ ] `hooks/useVote.ts`, `hooks/useSave.ts` — AuthPromptSheet for guests
- [ ] `hooks/useSwipeDeck.ts` — deck state, swipe handlers, batch management

**Deliverable:** Core swipe experience working natively on both platforms at 60fps with haptics.

---

### Phase 3 — Recipe Detail (Week 3)

- [ ] `app/recipe/[id].tsx` — modal presentation
- [ ] `components/RecipeDetail.tsx` — all sections
  - Hero gradient (expo-linear-gradient), back button, share button
  - Vote + Save action bar (AuthPromptSheet for guests)
  - Curated vs community creator bar
  - Description + tags
- [ ] `components/VideoPlayer.tsx` — expo-video, 16:9, YouTube/Facebook
- [ ] `components/IngredientList.tsx` — checkable rows, progress bar, serving adjuster
- [ ] `components/StepsList.tsx` — completable cards, progress bar, Lottie completion animation
- [ ] iOS Share Sheet + Android Share via `expo-sharing`
- [ ] Edit mode (community + owner): inline editing → `PATCH /api/recipes/[id]`

**Deliverable:** Full recipe experience with native video, checkable ingredients, haptic feedback.

---

### Phase 4 — Explore + Leaderboard (Week 4)

- [ ] `(tabs)/explore.tsx` — FlashList 2-column country grid, search bar
- [ ] `components/CountryTile.tsx` — gradient tile, flag, recipe count
- [ ] Tap country → filtered recipe list (reuses SwipeDeck with country filter)
- [ ] `(tabs)/leaderboard.tsx` — filter tabs, podium, FlashList rows
- [ ] `components/Podium.tsx` — animated spring-in podium
- [ ] `components/LeaderboardRow.tsx` — rank, avatar, username, votes, progress bar
- [ ] Tap leaderboard row → Profile screen
- [ ] `app/profile/[username].tsx` — avatar, tier, stats, social links, recipe grid
- [ ] Follow/Unfollow with optimistic UI
- [ ] Own profile: edit mode + avatar upload via expo-image-picker

**Deliverable:** Full explore + leaderboard + profile flow.

---

### Phase 5 — Create Recipe + Notifications (Week 5)

- [ ] `(tabs)/create.tsx` — full recipe form
  - `components/ImagePickerButton.tsx` — camera + library
  - `components/EmojiPicker.tsx` — food emoji grid
  - `components/CountrySelector.tsx` — searchable bottom sheet
  - Dynamic ingredients + steps with drag reorder
  - Video URL with live preview
  - Submit → `POST /api/recipes` → navigate to new recipe
- [ ] `app/saved.tsx` — FlashList 2-column, swipe-to-remove
- [ ] `app/notifications.tsx` — FlashList notifications, mark read
- [ ] Push notification registration on login
- [ ] Push notification handling (foreground + background tap → deep link)
- [ ] **Server-side:** Update Next.js API to send Expo Push notifications on vote/follow/tier events
- [ ] Deep linking (universal links iOS, App Links Android)

**Deliverable:** Complete feature parity with web app plus native-only features.

---

### Phase 6 — Polish + App Store (Week 6)

- [ ] App icon (1024×1024 PNG, no alpha) — fire fork on dark background
- [ ] Splash screen (ForkIt wordmark, dark bg, fire orange accent)
- [ ] Adaptive icon for Android
- [ ] Loading skeletons on all async content
- [ ] Error boundaries on all screens
- [ ] Proper safe area handling (notch, Dynamic Island, Android nav bar)
- [ ] Dark mode only (app is dark-themed; lock to dark in `app.json`)
- [ ] Accessibility: `accessibilityLabel` on all interactive elements, `accessibilityRole`
- [ ] Performance: `memo` on SwipeCard, `useCallback` on gesture handlers, `FlashList` everywhere
- [ ] EAS Build: `eas build --platform all --profile production`
- [ ] TestFlight internal testing (iOS)
- [ ] Play Store internal testing (Android)
- [ ] App Store submission
- [ ] Google Play submission

**Deliverable:** App live in both stores.

---

## 13. Testing

### Manual QA (each phase)

- [ ] Swipe gesture: smooth 60fps on iPhone SE (older device) and mid-range Android
- [ ] Guest browses Discover without account — no crashes, no auth errors
- [ ] AuthPromptSheet appears on vote/save/follow (guest)
- [ ] Curated recipes show "🍴 ForkIt Curated" badge, no edit/follow buttons
- [ ] YouTube video plays in-app (no redirect to YouTube app)
- [ ] Image upload from camera + library on both platforms
- [ ] Push notification received when another account votes on a recipe
- [ ] Notification tap deep-links to correct recipe
- [ ] Safe area respected on iPhone 15 Pro (Dynamic Island) and Android with nav bar
- [ ] App restores session after background kill

### Automated

- Unit tests (Jest + React Native Testing Library): SwipeCard gesture logic, calculateTier, detectVideoType
- E2E (Detox): Guest swipe flow, sign in, create recipe

---

*End of ForkIt Mobile App Specification v1.0.0*
*iOS + Android · Expo SDK 52 · Same Supabase backend as web*
