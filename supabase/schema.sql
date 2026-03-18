-- ============================================================
-- ForkIt — Complete Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ENUMS
create type reward_tier as enum ('starter', 'hot_chef', 'star_creator', 'legend');
create type difficulty as enum ('easy', 'medium', 'hard');
create type video_type as enum ('youtube', 'facebook');
create type notification_type as enum (
  'new_vote', 'new_follower', 'tier_upgrade', 'recipe_featured'
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
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
    split_part(new.email, '@', 1) || '_' || floor(random() * 9000 + 1000)::text,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- RECIPES
-- ============================================================
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
  source_url    text,                       -- attribution link for curated recipes
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

-- ============================================================
-- INGREDIENTS
-- ============================================================
create table ingredients (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  text       text not null,
  sort_order integer not null
);

create index ingredients_recipe_id_idx on ingredients(recipe_id);

-- ============================================================
-- STEPS
-- ============================================================
create table recipe_steps (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references recipes(id) on delete cascade,
  step_number integer not null,
  title       text not null,
  body        text not null
);

create index recipe_steps_recipe_id_idx on recipe_steps(recipe_id);

-- ============================================================
-- TAGS
-- ============================================================
create table tags (
  id   uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table recipe_tags (
  recipe_id uuid references recipes(id) on delete cascade,
  tag_id    uuid references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- ============================================================
-- VOTES
-- ============================================================
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
    update recipes set total_votes = greatest(total_votes - 1, 0) where id = OLD.recipe_id;
    update profiles set total_votes = greatest(total_votes - 1, 0)
      where id = (select author_id from recipes where id = OLD.recipe_id);
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_vote_change
  after insert or delete on votes
  for each row execute procedure update_vote_counts();

-- ============================================================
-- SAVED RECIPES
-- ============================================================
create table saved_recipes (
  user_id    uuid references profiles(id) on delete cascade,
  recipe_id  uuid references recipes(id) on delete cascade,
  saved_at   timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- ============================================================
-- FOLLOWS
-- ============================================================
create table follows (
  follower_id  uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- ============================================================
-- COUNTRIES
-- ============================================================
create table countries (
  code          text primary key,
  name          text not null,
  flag          text not null,
  recipe_count  integer default 0
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  type       notification_type not null,
  payload    jsonb default '{}',
  read       boolean default false,
  created_at timestamptz default now()
);

create index notifications_user_id_idx on notifications(user_id, read);

-- ============================================================
-- RPC: Increment country recipe count
-- ============================================================
create or replace function increment_country_count(country_code text)
returns void as $$
  update countries set recipe_count = recipe_count + 1 where code = country_code;
$$ language sql security definer;

-- ============================================================
-- RPC: Decrement country recipe count
-- ============================================================
create or replace function decrement_country_count(country_code text)
returns void as $$
  update countries set recipe_count = greatest(recipe_count - 1, 0) where code = country_code;
$$ language sql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

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
create policy "Votes public"           on votes for select using (true);
create policy "Users manage own votes"  on votes for all using (auth.uid() = user_id);

-- Saves
create policy "Users manage own saves" on saved_recipes for all using (auth.uid() = user_id);

-- Follows
create policy "Follows public"           on follows for select using (true);
create policy "Users manage own follows" on follows for all using (auth.uid() = follower_id);

-- Notifications
create policy "Own notifications" on notifications for all using (auth.uid() = user_id);
