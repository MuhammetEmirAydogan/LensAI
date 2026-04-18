# 💰 LensAI — TOKEN USAGE & MALİYET YÖNETİMİ

## Amaç
Bu doküman, LensAI'ın kullandığı tüm AI servislerinin token/kredi tüketimini, bütçe limitlerini, maliyet takip mekanizmalarını ve optimizasyon stratejilerini tanımlar. Görev yarıda kalmaması için bütçe kontrolü kritiktir.

---

## 📊 AI Provider Fiyatlandırma Tablosu

### Video Üretim API'leri

| Provider | Birim | Fiyat (USD) | Tahmini/Video | Aylık Bütçe |
|----------|-------|-------------|---------------|-------------|
| Kling AI | Kredi bazlı | ~$0.30-0.50/video (5s) | $0.40 | $3,000 |
| Runway Gen-3 | Saniye bazlı | ~$0.05/saniye | $0.25 | $1,500 (fallback) |
| Luma Dream Machine | Kredi bazlı | ~$0.30/video (5s) | $0.30 | $800 (alternatif) |

### Görüntü İşleme API'leri

| Provider | Birim | Fiyat (USD) | Tahmini/İşlem | Aylık Bütçe |
|----------|-------|-------------|---------------|-------------|
| Remove.bg | Kredi | $0.18/görsel (HD) | $0.18 | $1,000 |
| Stability AI (SAM2) | API call | $0.02/maskeleme | $0.02 | $200 |

### LLM API'leri

| Provider | Model | Input Token | Output Token | Tahmini/İstek | Aylık Bütçe |
|----------|-------|-------------|--------------|---------------|-------------|
| OpenAI | GPT-4o | $2.50/1M token | $10.00/1M token | ~$0.008 | $500 |
| OpenAI | GPT-4o-mini | $0.15/1M token | $0.60/1M token | ~$0.001 | $100 (fallback) |

### Vektör Veritabanı

| Provider | Plan | Fiyat (USD) | Aylık Bütçe |
|----------|------|-------------|-------------|
| Pinecone | Starter | $70/ay | $70 |

---

## 🧮 Kullanıcı Başına Maliyet Hesabı

### Video Başına Ortalama Maliyet
```
1 Video Üretim Pipeline:
├── Maskeleme (Remove.bg):     $0.18
├── Sınıflandırma (GPT-4o):    $0.003
├── Prompt Üretimi (GPT-4o):   $0.005
├── Video Üretimi (Kling AI):  $0.40
├── Kalite Kontrol (GPT-4o):   $0.002
└── TOPLAM:                    ~$0.59/video
```

### Plan Bazlı Aylık AI Maliyeti
| Plan | Video Limiti | Max AI Maliyeti | Abonelik Geliri | Marj |
|------|-------------|-----------------|------------------|------|
| Free | 5 video | $2.95 | $0 | -$2.95 |
| Starter | 50 video | $29.50 | $29 | -$0.50 |
| Pro | 200 video | $118.00 | $79 | -$39.00 ⚠️ |
| Agency | Sınırsız (~500) | $295.00 | $199 | -$96.00 ⚠️ |

> [!WARNING]
> Pro ve Agency planları video başına maliyet düşürülmeden **kârlı değil**. Caching, batch optimizasyonu ve provider negotiation ile maliyet $0.35/video hedefine çekilmeli.

---

## 🎛️ Token Kullanım Limitleri

### GPT-4o Token Yönetimi

```typescript
const TOKEN_LIMITS = {
  // Prompt üretimi
  promptGeneration: {
    maxInputTokens: 800,      // Ürün bilgisi + stil template
    maxOutputTokens: 400,     // Üretilen prompt
    temperature: 0.7,
    model: 'gpt-4o',
    fallbackModel: 'gpt-4o-mini'  // Limit aşılırsa
  },
  
  // Ürün sınıflandırma
  classification: {
    maxInputTokens: 1200,     // Görsel + sorum
    maxOutputTokens: 100,     // Kategori sonucu
    temperature: 0.2,
    model: 'gpt-4o',
    fallbackModel: 'gpt-4o-mini'
  },
  
  // Kalite kontrol
  qualityCheck: {
    maxInputTokens: 500,
    maxOutputTokens: 200,
    temperature: 0.1,
    model: 'gpt-4o-mini'     // Maliyet düşürmek için
  }
};
```

### Provider Rate Limitleri
```typescript
const RATE_LIMITS = {
  kling: {
    requestsPerMinute: 10,
    concurrentJobs: 20,
    dailyLimit: 5000,
    monthlyBudget: 3000       // USD
  },
  runway: {
    requestsPerMinute: 5,
    concurrentJobs: 10,
    dailyLimit: 2000,
    monthlyBudget: 1500
  },
  luma: {
    requestsPerMinute: 8,
    concurrentJobs: 15,
    dailyLimit: 1500,
    monthlyBudget: 800
  },
  openai: {
    requestsPerMinute: 60,
    tokensPerMinute: 80000,
    dailyTokenLimit: 5000000,
    monthlyBudget: 600
  },
  removebg: {
    requestsPerMinute: 20,
    dailyLimit: 3000,
    monthlyBudget: 1000
  }
};
```

---

## 📈 Maliyet Takip Sistemi

### Redis Sayaçları
```
KEY: cost:{provider}:{YYYY-MM-DD}
TYPE: String (float — USD)
TTL: 90 gün

KEY: cost:{provider}:{YYYY-MM}:total
TYPE: String (float — USD)
TTL: 365 gün

KEY: tokens:{userId}:gpt4o:{YYYY-MM}
TYPE: String (integer — token count)
TTL: 60 gün
```

### PostgreSQL Maliyet Tablosu
```sql
CREATE TABLE ai_cost_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  job_id          UUID REFERENCES video_jobs(id),
  provider        VARCHAR(50) NOT NULL,     -- 'kling', 'openai', 'removebg'
  operation       VARCHAR(100) NOT NULL,    -- 'video_generation', 'masking', 'prompt'
  tokens_input    INTEGER,                  -- LLM input tokens
  tokens_output   INTEGER,                  -- LLM output tokens
  credits_used    DECIMAL(10,4),            -- Provider credits
  cost_usd        DECIMAL(10,6) NOT NULL,   -- Hesaplanan maliyet
  model           VARCHAR(100),             -- 'gpt-4o', 'kling-v1.5'
  latency_ms      INTEGER,
  success         BOOLEAN DEFAULT true,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_logs_provider ON ai_cost_logs(provider);
CREATE INDEX idx_cost_logs_user ON ai_cost_logs(user_id);
CREATE INDEX idx_cost_logs_date ON ai_cost_logs(created_at);
CREATE INDEX idx_cost_logs_job ON ai_cost_logs(job_id);
```

### Günlük Maliyet Özet Tablosu
```sql
CREATE TABLE daily_cost_summary (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date            DATE NOT NULL,
  provider        VARCHAR(50) NOT NULL,
  total_requests  INTEGER DEFAULT 0,
  successful      INTEGER DEFAULT 0,
  failed          INTEGER DEFAULT 0,
  total_cost_usd  DECIMAL(12,4) DEFAULT 0,
  avg_cost_per_request DECIMAL(10,6),
  total_tokens    BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, provider)
);
```

---

## 🚨 Bütçe Uyarı Sistemi

### Eşik Değerleri
```typescript
const BUDGET_ALERTS = {
  daily: {
    warning:  0.70,   // Günlük bütçenin %70'i → Slack uyarı
    critical: 0.85,   // Günlük bütçenin %85'i → PagerDuty
    shutdown: 0.95,   // Günlük bütçenin %95'i → Yeni iş alma durdur
  },
  monthly: {
    warning:  0.60,   // Aylık bütçenin %60'ı → Slack uyarı
    critical: 0.80,   // Aylık bütçenin %80'i → Email + Slack
    shutdown: 0.90,   // Aylık bütçenin %90'ı → Free plan yeni iş alma durdur
  }
};

const DAILY_BUDGETS = {
  kling:     100,     // $100/gün
  runway:    50,      // $50/gün  
  luma:      30,      // $30/gün
  openai:    20,      // $20/gün
  removebg:  35,      // $35/gün
  total:     235      // Toplam $235/gün max
};

const MONTHLY_BUDGETS = {
  kling:     3000,
  runway:    1500,
  luma:      800,
  openai:    600,
  removebg:  1000,
  pinecone:  70,
  total:     6970     // Toplam ~$7K/ay max
};
```

### Alert Akışı
```
Maliyet Kontrolcü (her 5 dakika)
       │
       ├── %70 → Slack #cost-alerts (bilgi)
       ├── %85 → PagerDuty + Slack (acil)
       ├── %95 → Free plan durdur + Slack + Email
       └── %100 → TÜM yeni işler durdur + P0 eskalasyon
```

---

## 🔄 Maliyet Düşürme Stratejileri

### 1. Akıllı Caching
```typescript
// Aynı ürün + aynı stil = cache'den serve et
const CACHE_STRATEGY = {
  promptCache: {
    key: 'prompt:{productCategory}:{styleId}',
    ttl: '24h',
    hitRate: 'Hedef: >%40'
  },
  maskingCache: {
    key: 'mask:{imageHash}',
    ttl: '30d',
    hitRate: 'Hedef: >%60'  // Aynı ürün tekrar maskelenmez
  },
  classificationCache: {
    key: 'classify:{imageHash}',
    ttl: '30d',
    hitRate: 'Hedef: >%70'
  }
};
```

### 2. Model Kademesi (Tiered Models)
```
Düşük riskli işlemler → GPT-4o-mini (10x ucuz)
  - Ürün sınıflandırma
  - Kalite kontrol
  - Basit prompt varyasyonları

Yüksek kalite gereken → GPT-4o
  - İlk prompt üretimi
  - Karmaşık stil kombinasyonları
```

### 3. Batch Optimizasyonu
```
10 ayrı maskeleme isteği → 1 batch istek
  - Remove.bg batch API: %20 indirim
  - GPT-4o batch API: %50 indirim (24h window)
```

### 4. Provider Negotiation Hedefleri
| Provider | Mevcut | Hedef | Koşul |
|----------|--------|-------|-------|
| Kling AI | $0.40/video | $0.30/video | >5000 video/ay |
| Remove.bg | $0.18/görsel | $0.12/görsel | Enterprise plan |
| OpenAI | Standart | %20 indirim | Committed use |

---

## 📊 Maliyet Raporlama

### Haftalık Rapor Formatı
```markdown
# AI Maliyet Raporu — Hafta [N]

## Özet
| Metrik | Bu Hafta | Önceki Hafta | Değişim |
|--------|----------|--------------|---------|
| Toplam Maliyet | $X | $Y | +/-%Z |
| Video Üretim | X adet | Y adet | +/-%Z |
| Ortalama Maliyet/Video | $X | $Y | +/-%Z |
| Cache Hit Rate | %X | %Y | +/-%Z |

## Provider Bazlı Dağılım
[Pasta grafik verisi]

## Anomaliler
[Beklenmedik artış/düşüşler]

## Öneriler
[Maliyet düşürme fırsatları]
```

### Dashboard Metrikleri (Gerçek Zamanlı)
```
┌───────────────────────────────────────────┐
│  AI MALİYET DASHBOARD                      │
├───────────┬───────────┬───────────────────┤
│ Bugün     │ Bu Ay     │ Bütçe Durumu      │
│ $187.40   │ $2,841    │ ██████░░░░ %41    │
├───────────┴───────────┴───────────────────┤
│ Provider     │ Bugün   │ Ay    │ Limit    │
│ Kling AI     │ $89.20  │ $1,340│ $3,000   │
│ OpenAI       │ $12.50  │ $198  │ $600     │
│ Remove.bg    │ $54.00  │ $812  │ $1,000   │
│ Runway       │ $31.70  │ $491  │ $1,500   │
└──────────────┴─────────┴───────┴──────────┘
```

---

## 🔐 Güvenlik Kuralları

1. API anahtarları **asla** client-side'da kullanılmaz
2. Tüm maliyet verileri server-side hesaplanır
3. Kullanıcılar kendi maliyet verilerini göremez (sadece kullanım limitleri)
4. Provider API key rotasyonu: 90 günde bir
5. Budget override: Sadece ADMIN + 2FA ile

---
*Bu doküman AI Agent + Analytics Agent tarafından yönetilir. Haftalık güncellenir.*
