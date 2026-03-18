// ============================================================
// ForkIt — TypeScript Interfaces & Enums
// ============================================================

// ---------- Enums ----------

export type RewardTier = 'starter' | 'hot_chef' | 'star_creator' | 'legend';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type VideoType = 'youtube' | 'facebook';

export type NotificationType =
  | 'new_vote'
  | 'new_follower'
  | 'tier_upgrade'
  | 'recipe_featured';

export type RecipeSource = 'community' | 'curated';

// ---------- Profiles ----------

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  social_links: SocialLinks;
  reward_tier: RewardTier;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

// ---------- Recipes ----------

export interface Recipe {
  id: string;
  title: string;
  description: string;
  emoji: string;
  image_url: string | null;
  country_code: string;
  country_name: string;
  country_flag: string;
  difficulty: Difficulty;
  time_minutes: number;
  servings: number;
  video_url: string | null;
  video_type: VideoType | null;
  video_note: string | null;
  published: boolean;
  featured: boolean;
  source: RecipeSource;
  source_url: string | null;
  author_id: string;
  total_votes: number;
  created_at: string;
  updated_at: string;
  // Joined relations (optional, populated when fetched with relations)
  author?: Profile;
  ingredients?: Ingredient[];
  steps?: RecipeStep[];
  tags?: Tag[];
}

// ---------- Ingredients ----------

export interface Ingredient {
  id: string;
  recipe_id: string;
  text: string;
  sort_order: number;
}

// ---------- Steps ----------

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  title: string;
  body: string;
}

// ---------- Tags ----------

export interface Tag {
  id: string;
  name: string;
}

export interface RecipeTag {
  recipe_id: string;
  tag_id: string;
}

// ---------- Votes ----------

export interface Vote {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

// ---------- Saved Recipes ----------

export interface SavedRecipe {
  user_id: string;
  recipe_id: string;
  saved_at: string;
}

// ---------- Follows ----------

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

// ---------- Countries ----------

export interface Country {
  code: string;
  name: string;
  flag: string;
  recipe_count: number;
}

// ---------- Notifications ----------

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
  created_at: string;
}

export interface NotificationPayload {
  recipe_id?: string;
  recipe_title?: string;
  voter_username?: string;
  follower_username?: string;
  new_tier?: RewardTier;
  [key: string]: string | undefined;
}

// ---------- API Response Types ----------

export interface FeedResponse {
  recipes: Recipe[];
  hasMore: boolean;
}

export interface VoteResponse {
  voted: boolean;
  totalVotes: number;
}

export interface SaveResponse {
  saved: boolean;
}

export interface FollowResponse {
  following: boolean;
  followerCount: number;
}

export interface UploadResponse {
  url: string;
}
