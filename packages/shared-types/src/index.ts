// ═══════════════════════════════════════════════════
// LensAI — Shared Types
// Tüm servisler ve frontend bu paketi kullanır
// ═══════════════════════════════════════════════════

// ─────────────────────────────────────
// USER & AUTH
// ─────────────────────────────────────
export type UserPlan = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: UserPlan;
  stripeCustomerId: string | null;
  videosUsed: number;
  videosLimit: number;
  teamId: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: UserPlan;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────
// PROJECT
// ─────────────────────────────────────
export type ProjectStatus = 'active' | 'archived' | 'deleted';

export interface Project {
  id: string;
  userId: string;
  teamId: string | null;
  name: string;
  description: string | null;
  brandKitId: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────
// MEDIA
// ─────────────────────────────────────
export type MimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface MediaItem {
  id: string;
  projectId: string;
  userId: string;
  originalUrl: string;
  maskedUrl: string | null;
  thumbnailUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: MimeType | null;
  width: number | null;
  height: number | null;
  productCategory: string | null;
  createdAt: Date;
}

// ─────────────────────────────────────
// VIDEO JOB
// ─────────────────────────────────────
export type AIProvider = 'kling' | 'runway' | 'luma';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type RenderStage =
  | 'uploading'
  | 'masking'
  | 'classifying'
  | 'prompting'
  | 'generating'
  | 'processing'
  | 'completed'
  | 'failed';

export interface VideoJob {
  id: string;
  userId: string;
  mediaItemId: string;
  styleId: string;
  customPrompt: string | null;
  aiProvider: AIProvider | null;
  status: JobStatus;
  progress: number; // 0-100
  stage: RenderStage;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface VideoJobStatusUpdate {
  jobId: string;
  status: JobStatus;
  stage: RenderStage;
  progress: number;
  message?: string;
  estimatedRemainingMs?: number;
}

// ─────────────────────────────────────
// VIDEO
// ─────────────────────────────────────
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type VideoQuality = 'HD' | '4K';
export type VideoResolution = '1920x1080' | '3840x2160' | '1080x1920' | '2160x3840';

export interface Video {
  id: string;
  jobId: string;
  userId: string;
  projectId: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  resolution: VideoResolution | null;
  fileSize: number | null;
  hasWatermark: boolean;
  isFavorite: boolean;
  downloadCount: number;
  createdAt: Date;
}

// ─────────────────────────────────────
// STYLE
// ─────────────────────────────────────
export type StyleCategory =
  | 'cinematic'
  | 'viral'
  | 'minimalist'
  | 'luxury'
  | 'dynamic'
  | 'nature'
  | 'tech'
  | 'food';

export interface VideoStyle {
  id: string;           // 'cinematic-luxury'
  name: string;         // 'Cinematic Luxury'
  category: StyleCategory;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl: string | null;
  bestFor: string[];    // ['jewelry', 'watch', 'perfume']
  parameters: StyleParameters;
  isPremium: boolean;   // Pro+ planı gerektirir
  successRate: number;  // 0-1
  avgQualityScore: number; // 0-10
}

export interface StyleParameters {
  duration: 3 | 4 | 5 | 8 | 10;
  fps: 24 | 30;
  aspectRatio: AspectRatio;
  motionStrength: number;   // 0-1
}

// ─────────────────────────────────────
// GENERATE
// ─────────────────────────────────────
export interface GenerateVideoInput {
  mediaItemId: string;
  styleId: string;
  customPrompt?: string;
  options?: {
    aspectRatio?: AspectRatio;
    duration?: number;
    fps?: number;
    addWatermark?: boolean;
    quality?: VideoQuality;
  };
  webhookUrl?: string;
}

export interface GenerateVideoOutput {
  jobId: string;
  status: JobStatus;
  estimatedTimeMs: number;
}

// ─────────────────────────────────────
// SUBSCRIPTION
// ─────────────────────────────────────
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete';

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string | null;
  plan: UserPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanLimits {
  videos: number;          // -1 = unlimited
  quality: VideoQuality;
  features: PlanFeature[];
  apiAccess: boolean;
  whiteLabel: boolean;
  teamMembers: number;     // -1 = unlimited
}

export type PlanFeature =
  | 'batch'
  | 'api'
  | 'white-label'
  | 'team'
  | 'custom-brand'
  | 'analytics'
  | 'social-publish';

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    videos: 5,
    quality: 'HD',
    features: [],
    apiAccess: false,
    whiteLabel: false,
    teamMembers: 1,
  },
  starter: {
    videos: 50,
    quality: 'HD',
    features: ['batch'],
    apiAccess: false,
    whiteLabel: false,
    teamMembers: 1,
  },
  pro: {
    videos: 200,
    quality: '4K',
    features: ['batch', 'api', 'analytics', 'social-publish'],
    apiAccess: true,
    whiteLabel: false,
    teamMembers: 5,
  },
  agency: {
    videos: -1,
    quality: '4K',
    features: ['batch', 'api', 'white-label', 'team', 'custom-brand', 'analytics', 'social-publish'],
    apiAccess: true,
    whiteLabel: true,
    teamMembers: -1,
  },
  enterprise: {
    videos: -1,
    quality: '4K',
    features: ['batch', 'api', 'white-label', 'team', 'custom-brand', 'analytics', 'social-publish'],
    apiAccess: true,
    whiteLabel: true,
    teamMembers: -1,
  },
};

// ─────────────────────────────────────
// BRAND KIT
// ─────────────────────────────────────
export interface BrandKit {
  id: string;
  userId: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;   // '#RRGGBB'
  secondaryColor: string | null;
  fontName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────
// SOCIAL MEDIA
// ─────────────────────────────────────
export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube';
export type PublishStatus = 'scheduled' | 'published' | 'failed' | 'cancelled';

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  accountId: string | null;
  isActive: boolean;
  createdAt: Date;
}

// ─────────────────────────────────────
// API RESPONSE STANDARDS
// ─────────────────────────────────────
export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
    details?: unknown;
    requestId: string;
    retryable: boolean;
    retryAfterMs?: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ─────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────
export interface VideoAnalytics {
  videoId: string;
  platform: SocialPlatform;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
  };
  viralScore: number;  // 0-10
  fetchedAt: Date;
}

// ─────────────────────────────────────
// WEBSOCKET EVENTS (Socket.io)
// ─────────────────────────────────────
export interface SocketEvents {
  // Server → Client
  'job:update': VideoJobStatusUpdate;
  'job:completed': { jobId: string; video: Video };
  'job:failed': { jobId: string; error: string };
  'notification': { type: string; message: string };

  // Client → Server
  'job:subscribe': { jobId: string };
  'job:unsubscribe': { jobId: string };
}
