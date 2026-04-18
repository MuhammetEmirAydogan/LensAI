-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "owner_id" UUID,
    "plan" VARCHAR(50) NOT NULL DEFAULT 'agency',
    "logo_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clerk_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "avatar_url" TEXT,
    "plan" VARCHAR(50) NOT NULL DEFAULT 'free',
    "stripe_customer_id" VARCHAR(255),
    "videos_used" INTEGER NOT NULL DEFAULT 0,
    "videos_limit" INTEGER NOT NULL DEFAULT 5,
    "team_id" UUID,
    "role" VARCHAR(50) NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "team_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "brand_kit_id" UUID,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "original_url" TEXT NOT NULL,
    "masked_url" TEXT,
    "thumbnail_url" TEXT,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "width" INTEGER,
    "height" INTEGER,
    "product_category" VARCHAR(100),
    "image_hash" VARCHAR(64),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "media_item_id" UUID NOT NULL,
    "style_id" VARCHAR(100) NOT NULL,
    "custom_prompt" TEXT,
    "ai_provider" VARCHAR(50),
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "stage" VARCHAR(50) NOT NULL DEFAULT 'uploading',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "video_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "duration" DECIMAL(5,2),
    "resolution" VARCHAR(20),
    "file_size" BIGINT,
    "has_watermark" BOOLEAN NOT NULL DEFAULT true,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "stripe_subscription_id" VARCHAR(255),
    "plan" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "current_period_start" TIMESTAMPTZ,
    "current_period_end" TIMESTAMPTZ,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "trial_end" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_kits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo_url" TEXT,
    "primary_color" VARCHAR(7),
    "secondary_color" VARCHAR(7),
    "font_name" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "brand_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "account_id" VARCHAR(255),
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publish_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "video_id" UUID NOT NULL,
    "social_account_id" UUID NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "external_post_id" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL,
    "scheduled_at" TIMESTAMPTZ,
    "published_at" TIMESTAMPTZ,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publish_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "key_hash" VARCHAR(255) NOT NULL,
    "key_prefix" VARCHAR(10) NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "last_used_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "period" VARCHAR(7) NOT NULL,
    "videos_generated" INTEGER NOT NULL DEFAULT 0,
    "videos_downloaded" INTEGER NOT NULL DEFAULT 0,
    "storage_used_mb" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "api_calls" INTEGER NOT NULL DEFAULT 0,
    "ai_cost_usd" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "resource_id" UUID,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_cost_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "job_id" UUID,
    "provider" VARCHAR(50) NOT NULL,
    "operation" VARCHAR(100) NOT NULL,
    "tokens_input" INTEGER,
    "tokens_output" INTEGER,
    "credits_used" DECIMAL(10,4),
    "cost_usd" DECIMAL(10,6) NOT NULL,
    "model" VARCHAR(100),
    "latency_ms" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_cost_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_clerk_id_idx" ON "users"("clerk_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_team_id_idx" ON "users"("team_id");

-- CreateIndex
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");

-- CreateIndex
CREATE INDEX "projects_team_id_idx" ON "projects"("team_id");

-- CreateIndex
CREATE INDEX "media_items_project_id_idx" ON "media_items"("project_id");

-- CreateIndex
CREATE INDEX "media_items_user_id_idx" ON "media_items"("user_id");

-- CreateIndex
CREATE INDEX "media_items_image_hash_idx" ON "media_items"("image_hash");

-- CreateIndex
CREATE INDEX "video_jobs_user_id_idx" ON "video_jobs"("user_id");

-- CreateIndex
CREATE INDEX "video_jobs_status_idx" ON "video_jobs"("status");

-- CreateIndex
CREATE INDEX "video_jobs_created_at_idx" ON "video_jobs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "videos_job_id_key" ON "videos"("job_id");

-- CreateIndex
CREATE INDEX "videos_user_id_idx" ON "videos"("user_id");

-- CreateIndex
CREATE INDEX "videos_project_id_idx" ON "videos"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "social_accounts_user_id_idx" ON "social_accounts"("user_id");

-- CreateIndex
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");

-- CreateIndex
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "usage_logs_user_id_period_idx" ON "usage_logs"("user_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_user_id_period_key" ON "usage_logs"("user_id", "period");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "ai_cost_logs_provider_idx" ON "ai_cost_logs"("provider");

-- CreateIndex
CREATE INDEX "ai_cost_logs_user_id_idx" ON "ai_cost_logs"("user_id");

-- CreateIndex
CREATE INDEX "ai_cost_logs_created_at_idx" ON "ai_cost_logs"("created_at");

-- CreateIndex
CREATE INDEX "ai_cost_logs_job_id_idx" ON "ai_cost_logs"("job_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_brand_kit_id_fkey" FOREIGN KEY ("brand_kit_id") REFERENCES "brand_kits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_jobs" ADD CONSTRAINT "video_jobs_media_item_id_fkey" FOREIGN KEY ("media_item_id") REFERENCES "media_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "video_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_kits" ADD CONSTRAINT "brand_kits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publish_logs" ADD CONSTRAINT "publish_logs_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publish_logs" ADD CONSTRAINT "publish_logs_social_account_id_fkey" FOREIGN KEY ("social_account_id") REFERENCES "social_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_cost_logs" ADD CONSTRAINT "ai_cost_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_cost_logs" ADD CONSTRAINT "ai_cost_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "video_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
