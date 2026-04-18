# 🗄️ LensAI — DATABASE SPEC

## Veritabanı Mimarisi

### Kullanılan Veritabanları
| DB | Kullanım | Neden |
|----|---------|-------|
| PostgreSQL | Ana veri (users, projects, jobs) | ACID, ilişkisel veri |
| MongoDB | Video metadata, AI output logs | Şema esnekliği |
| Redis | Cache, session, job queue | Hız, geçici veri |
| Pinecone | Vektör arama (stil benzerliği) | Semantik arama |

---

## 📋 PostgreSQL Şeması

### users
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id        VARCHAR(255) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255),
  avatar_url      TEXT,
  plan            VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  videos_used     INTEGER DEFAULT 0,
  videos_limit    INTEGER DEFAULT 5,
  team_id         UUID REFERENCES teams(id),
  role            VARCHAR(50) DEFAULT 'member',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_team_id ON users(team_id);
```

### teams
```sql
CREATE TABLE teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  owner_id    UUID REFERENCES users(id),
  plan        VARCHAR(50) DEFAULT 'agency',
  logo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### projects
```sql
CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id      UUID REFERENCES teams(id),
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  brand_kit_id UUID REFERENCES brand_kits(id),
  status       VARCHAR(50) DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_team_id ON projects(team_id);
```

### media_items
```sql
CREATE TABLE media_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES users(id),
  original_url     TEXT NOT NULL,    -- S3 URL
  masked_url       TEXT,             -- Maskelenmiş görsel
  thumbnail_url    TEXT,
  file_name        VARCHAR(255),
  file_size        INTEGER,
  mime_type        VARCHAR(100),
  width            INTEGER,
  height           INTEGER,
  product_category VARCHAR(100),     -- AI sınıflandırma sonucu
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_items_project_id ON media_items(project_id);
```

### video_jobs
```sql
CREATE TABLE video_jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id),
  media_item_id    UUID REFERENCES media_items(id),
  style_id         VARCHAR(100),
  custom_prompt    TEXT,
  ai_provider      VARCHAR(50),       -- 'kling', 'runway', 'luma'
  status           VARCHAR(50) DEFAULT 'pending',
  -- pending, processing, completed, failed
  progress         INTEGER DEFAULT 0, -- 0-100
  error_message    TEXT,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_jobs_user_id ON video_jobs(user_id);
CREATE INDEX idx_video_jobs_status ON video_jobs(status);
```

### videos
```sql
CREATE TABLE videos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           UUID REFERENCES video_jobs(id),
  user_id          UUID REFERENCES users(id),
  project_id       UUID REFERENCES projects(id),
  video_url        TEXT NOT NULL,     -- S3 CDN URL
  thumbnail_url    TEXT,
  duration         DECIMAL(5,2),      -- saniye
  resolution       VARCHAR(20),       -- '1920x1080'
  file_size        BIGINT,
  has_watermark    BOOLEAN DEFAULT true,
  is_favorite      BOOLEAN DEFAULT false,
  download_count   INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_project_id ON videos(project_id);
```

### subscriptions
```sql
CREATE TABLE subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan                 VARCHAR(50) NOT NULL,
  status               VARCHAR(50) NOT NULL,
  -- active, canceled, past_due, trialing
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);
```

### brand_kits
```sql
CREATE TABLE brand_kits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  name          VARCHAR(255),
  logo_url      TEXT,
  primary_color VARCHAR(7),   -- '#RRGGBB'
  secondary_color VARCHAR(7),
  font_name     VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### social_accounts
```sql
CREATE TABLE social_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  platform        VARCHAR(50) NOT NULL,  -- instagram, tiktok, youtube
  account_id      VARCHAR(255),
  access_token    TEXT,  -- encrypted
  refresh_token   TEXT,  -- encrypted
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### publish_logs
```sql
CREATE TABLE publish_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id        UUID REFERENCES videos(id),
  social_account_id UUID REFERENCES social_accounts(id),
  platform        VARCHAR(50),
  external_post_id VARCHAR(255),
  status          VARCHAR(50),   -- published, failed, scheduled
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  action          VARCHAR(100) NOT NULL,    -- 'project.create', 'video.delete'
  resource_type   VARCHAR(50) NOT NULL,     -- 'project', 'video', 'user'
  resource_id     UUID,
  old_value       JSONB,                    -- Değişiklik öncesi
  new_value       JSONB,                    -- Değişiklik sonrası
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

### api_keys
```sql
CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,    -- "Production Key"
  key_hash        VARCHAR(255) NOT NULL,    -- SHA-256 hash
  key_prefix      VARCHAR(10) NOT NULL,     -- "lns_pk_..." gösterim için
  scopes          TEXT[] DEFAULT '{}',      -- ['read', 'write', 'generate']
  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
```

### usage_logs
```sql
CREATE TABLE usage_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  period          VARCHAR(7) NOT NULL,      -- '2024-01' (YYYY-MM)
  videos_generated INTEGER DEFAULT 0,
  videos_downloaded INTEGER DEFAULT 0,
  storage_used_mb  DECIMAL(10,2) DEFAULT 0,
  api_calls       INTEGER DEFAULT 0,
  ai_cost_usd     DECIMAL(10,4) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period)
);

CREATE INDEX idx_usage_user_period ON usage_logs(user_id, period);
```

---

## 🍃 MongoDB Koleksiyonları

### ai_generation_logs
```javascript
{
  _id: ObjectId,
  jobId: "uuid",
  userId: "uuid",
  provider: "kling",
  prompt: "full prompt text...",
  promptTokens: 245,
  negativePrompt: "...",
  parameters: {
    style: "cinematic",
    duration: 5,
    aspectRatio: "9:16",
    fps: 24
  },
  providerJobId: "kling_job_123",
  cost: 0.45,          // USD
  latency: 145230,     // ms
  outputUrl: "...",
  qualityScore: 0.87,  // AI kalite değerlendirmesi
  createdAt: ISODate
}
```

### video_analytics
```javascript
{
  _id: ObjectId,
  videoId: "uuid",
  userId: "uuid",
  platform: "instagram",
  externalPostId: "...",
  metrics: {
    views: 15420,
    likes: 892,
    comments: 45,
    shares: 234,
    saves: 156,
    reach: 28000,
    impressions: 32000
  },
  viralScore: 7.8,    // 0-10 arası
  fetchedAt: ISODate,
  createdAt: ISODate
}
```

### prompt_templates
```javascript
{
  _id: ObjectId,
  styleId: "cinematic-luxury",
  styleName: "Cinematic Luxury",
  category: "product",
  productTypes: ["jewelry", "watch", "perfume"],
  template: "Ultra-cinematic shot of {product} floating in...",
  negativeTemplate: "blurry, low quality...",
  defaultParameters: {
    duration: 5,
    fps: 24,
    motionStrength: 0.7
  },
  successRate: 0.92,
  avgQualityScore: 8.4,
  usageCount: 1250,
  createdAt: ISODate
}
```

---

## ⚡ Redis Veri Yapıları

### Session Cache
```
KEY: session:{userId}
TYPE: Hash
TTL: 7 gün
FIELDS: {token, expiresAt, plan, videosUsed}
```

### Kullanım Sayacı
```
KEY: usage:{userId}:{YYYY-MM}
TYPE: String (integer)
TTL: 32 gün
```

### Rate Limiting
```
KEY: ratelimit:{userId}:{endpoint}
TYPE: String (counter)
TTL: 60 saniye
```

### Job Durumu Cache
```
KEY: job:{jobId}:status
TYPE: Hash
TTL: 24 saat
FIELDS: {status, progress, stage, message}
```

### Stil Kütüphanesi Cache
```
KEY: styles:all
TYPE: String (JSON)
TTL: 1 saat
```

---

## 🔄 Migration Stratejisi

### Kural 1: Her migration backward compatible
```sql
-- İYİ: Yeni sütun nullable olarak ekle
ALTER TABLE users ADD COLUMN new_feature TEXT;

-- KÖTÜ: Var olan sütunu direkt değiştirme
ALTER TABLE users ALTER COLUMN existing NOT NULL;
```

### Kural 2: Büyük tablo migration'ları
```sql
-- Ghost table pattern kullan
-- 1. Yeni tablo oluştur
-- 2. Trigger ile senkronize et
-- 3. Veriyi batch batch kopyala
-- 4. Atomic swap
-- 5. Eski tabloyu sil
```

### Migration Adlandırma
```
YYYYMMDDHHMMSS_kisa_aciklama.sql
Örnek: 20240115103000_add_brand_kit_to_projects.sql
```

---

## 📊 Performans Kuralları

### Index Stratejisi
- Foreign key'ler her zaman index'li
- Sık sorgulanan filtre alanları index'li
- Composite index: sıralama önemli (selectivity azalan)
- Partial index: soft-delete pattern için `WHERE deleted_at IS NULL`

### Query Optimizasyon
- N+1 sorgudan kaçın → Prisma `include` kullan
- Büyük liste'lerde `cursor-based pagination`
- Aggregate sorgular için ClickHouse'a yönlendir
- Raw SQL sadece performans kritik noktalarda

### Connection Pooling
```
PostgreSQL: PgBouncer (max 20 connection/servis)
MongoDB: connection pool: 10
Redis: connection pool: 5
```

---
*Bu doküman Database Agent tarafından her migration'da güncellenir.*
