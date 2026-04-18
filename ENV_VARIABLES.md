# 🔐 LensAI — ENVIRONMENT VARIABLES

## Amaç
Bu doküman, LensAI'ın tüm servislerinde kullanılan environment değişkenlerini, formatlarını ve yapılandırma kurallarını tanımlar. Her yeni servis/özellik eklendiğinde bu dosya güncellenmeli ve `.env.example` senkronize edilmelidir.

---

## 📋 Değişken Kuralları

> **KURAL #1:** Production'da hiçbir secret hardcode edilmez  
> **KURAL #2:** Tüm secret'lar AWS Secrets Manager'dan okunur  
> **KURAL #3:** `.env` dosyaları asla Git'e commit edilmez  
> **KURAL #4:** Her yeni değişken bu dosyaya ve `.env.example`'a eklenir

---

## 🌍 Ortamlar
| Ortam | Dosya | Notlar |
|-------|-------|--------|
| Local | `.env.local` | Geliştiricinin kendi makinesi |
| Test | `.env.test` | CI/CD ve test ortamı |
| Staging | `.env.staging` | Pre-production |
| Production | `.env.production` | Canlı ortam (Secrets Manager) |

---

## 📦 GENEL DEĞİŞKENLER

```bash
# ═══════════════════════════════════════
# UYGULAMA GENEL
# ═══════════════════════════════════════
NODE_ENV=development                # ✅ Zorunlu | development | staging | production
APP_URL=http://localhost:3000       # ✅ Zorunlu | Web uygulaması URL'i
API_URL=http://localhost:3001       # ✅ Zorunlu | API Gateway URL'i
AI_SERVICE_URL=http://localhost:8000 # ✅ Zorunlu | AI Service URL'i
APP_VERSION=1.0.0                   # ⬜ Opsiyonel | Semantik versiyon
LOG_LEVEL=debug                     # ⬜ Opsiyonel | debug | info | warn | error
```

---

## 🔑 AUTH (Clerk)

```bash
# ═══════════════════════════════════════
# CLERK AUTHENTICATION
# ═══════════════════════════════════════
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx  # ✅ Zorunlu | Clerk Dashboard > API Keys
CLERK_SECRET_KEY=sk_test_xxx                    # ✅ Zorunlu | Clerk Dashboard > API Keys
CLERK_WEBHOOK_SECRET=whsec_xxx                  # ✅ Zorunlu | Clerk Dashboard > Webhooks

# Sign-in/Sign-up URL'leri
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login            # ⬜ Opsiyonel | Default: /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register         # ⬜ Opsiyonel | Default: /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard  # ⬜ Opsiyonel | Default: /
```

---

## 🗄️ VERİTABANI

```bash
# ═══════════════════════════════════════
# POSTGRESQL
# ═══════════════════════════════════════
DATABASE_URL=postgresql://user:password@localhost:5432/lensai  # ✅ Zorunlu
DATABASE_POOL_MIN=2                 # ⬜ Opsiyonel | Min connection | Default: 2
DATABASE_POOL_MAX=20                # ⬜ Opsiyonel | Max connection | Default: 20
DATABASE_SSL=false                  # ⬜ Opsiyonel | Production'da true

# ═══════════════════════════════════════
# MONGODB
# ═══════════════════════════════════════
MONGODB_URI=mongodb://localhost:27017/lensai    # ✅ Zorunlu
MONGODB_DB_NAME=lensai                          # ⬜ Opsiyonel | Default: lensai

# ═══════════════════════════════════════
# REDIS
# ═══════════════════════════════════════
REDIS_URL=redis://localhost:6379              # ✅ Zorunlu
REDIS_PASSWORD=                               # ⬜ Opsiyonel | Local'de boş
REDIS_TLS=false                               # ⬜ Opsiyonel | Production'da true

# ═══════════════════════════════════════
# PINECONE (Vektör DB)
# ═══════════════════════════════════════
PINECONE_API_KEY=xxx                          # ✅ Zorunlu
PINECONE_ENVIRONMENT=us-east-1-aws            # ✅ Zorunlu
PINECONE_INDEX_NAME=lensai-styles             # ✅ Zorunlu
```

---

## 🤖 AI PROVİDER API ANAHTARLARI

```bash
# ═══════════════════════════════════════
# OPENAI
# ═══════════════════════════════════════
OPENAI_API_KEY=sk-xxx                         # ✅ Zorunlu | platform.openai.com > API Keys
OPENAI_ORG_ID=org-xxx                         # ⬜ Opsiyonel | Organizasyon ID
OPENAI_DEFAULT_MODEL=gpt-4o                   # ⬜ Opsiyonel | Default: gpt-4o
OPENAI_FALLBACK_MODEL=gpt-4o-mini             # ⬜ Opsiyonel | Default: gpt-4o-mini

# ═══════════════════════════════════════
# KLING AI (Primary Video)
# ═══════════════════════════════════════
KLING_API_KEY=xxx                             # ✅ Zorunlu
KLING_API_URL=https://api.klingai.com         # ⬜ Opsiyonel
KLING_TIMEOUT_MS=300000                       # ⬜ Opsiyonel | Default: 5 dakika

# ═══════════════════════════════════════
# RUNWAY (Fallback Video)
# ═══════════════════════════════════════
RUNWAY_API_KEY=xxx                            # ✅ Zorunlu
RUNWAY_API_URL=https://api.runwayml.com       # ⬜ Opsiyonel
RUNWAY_TIMEOUT_MS=300000                      # ⬜ Opsiyonel

# ═══════════════════════════════════════
# LUMA DREAM MACHINE (Alt Video)
# ═══════════════════════════════════════
LUMA_API_KEY=xxx                              # ✅ Zorunlu
LUMA_API_URL=https://api.lumalabs.ai          # ⬜ Opsiyonel

# ═══════════════════════════════════════
# REMOVE.BG (Maskeleme)
# ═══════════════════════════════════════
REMOVEBG_API_KEY=xxx                          # ✅ Zorunlu
REMOVEBG_API_URL=https://api.remove.bg/v1.0  # ⬜ Opsiyonel

# ═══════════════════════════════════════
# STABILITY AI
# ═══════════════════════════════════════
STABILITY_API_KEY=xxx                         # ✅ Zorunlu
STABILITY_API_URL=https://api.stability.ai    # ⬜ Opsiyonel

# ═══════════════════════════════════════
# REPLICATE (Custom Models)
# ═══════════════════════════════════════
REPLICATE_API_TOKEN=xxx                       # ⬜ Opsiyonel | Faz 3'te zorunlu
```

---

## 💳 ÖDEME (Stripe)

```bash
# ═══════════════════════════════════════
# STRIPE
# ═══════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_xxx                 # ✅ Zorunlu
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx # ✅ Zorunlu
STRIPE_WEBHOOK_SECRET=whsec_xxx               # ✅ Zorunlu
STRIPE_PRICE_FREE=price_xxx                   # ✅ Zorunlu | Stripe Price ID'leri
STRIPE_PRICE_STARTER=price_xxx                # ✅ Zorunlu
STRIPE_PRICE_PRO=price_xxx                    # ✅ Zorunlu
STRIPE_PRICE_AGENCY=price_xxx                 # ✅ Zorunlu
```

---

## ☁️ AWS

```bash
# ═══════════════════════════════════════
# AWS GENEL
# ═══════════════════════════════════════
AWS_REGION=eu-central-1                       # ✅ Zorunlu
AWS_ACCESS_KEY_ID=xxx                         # ✅ Zorunlu  
AWS_SECRET_ACCESS_KEY=xxx                     # ✅ Zorunlu

# ═══════════════════════════════════════
# S3
# ═══════════════════════════════════════
S3_BUCKET_UPLOADS=lensai-uploads              # ✅ Zorunlu | Kullanıcı yüklemeleri
S3_BUCKET_VIDEOS=lensai-videos                # ✅ Zorunlu | Üretilen videolar
S3_BUCKET_ASSETS=lensai-assets                # ⬜ Opsiyonel | Statik dosyalar
S3_PRESIGNED_URL_EXPIRES=900                  # ⬜ Opsiyonel | 15 dakika (saniye)

# ═══════════════════════════════════════
# CLOUDFRONT
# ═══════════════════════════════════════
CLOUDFRONT_DISTRIBUTION_ID=xxx                # ✅ Zorunlu (production)
CLOUDFRONT_DOMAIN=cdn.lensai.io               # ✅ Zorunlu (production)
```

---

## 📡 MONITORING & LOGGING

```bash
# ═══════════════════════════════════════
# SENTRY
# ═══════════════════════════════════════
SENTRY_DSN=https://xxx@sentry.io/xxx          # ✅ Zorunlu (staging+prod)
SENTRY_ENVIRONMENT=development                 # ⬜ Opsiyonel

# ═══════════════════════════════════════
# DATADOG
# ═══════════════════════════════════════
DD_API_KEY=xxx                                # ✅ Zorunlu (production)
DD_APP_KEY=xxx                                # ✅ Zorunlu (production)
DD_SERVICE_NAME=lensai-api                    # ⬜ Opsiyonel

# ═══════════════════════════════════════
# POSTHOG
# ═══════════════════════════════════════
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx               # ✅ Zorunlu
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com # ⬜ Opsiyonel
```

---

## 📧 BİLDİRİMLER

```bash
# ═══════════════════════════════════════
# RESEND (Email)
# ═══════════════════════════════════════
RESEND_API_KEY=re_xxx                         # ✅ Zorunlu
RESEND_FROM_EMAIL=noreply@lensai.io           # ✅ Zorunlu

# ═══════════════════════════════════════
# SLACK (Alerting)
# ═══════════════════════════════════════
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx # ✅ Zorunlu (staging+prod)
SLACK_CHANNEL_ALERTS=#alerts-critical         # ⬜ Opsiyonel
```

---

## 📊 MALIYET LİMİTLERİ

```bash
# ═══════════════════════════════════════
# AI BÜTÇE LİMİTLERİ (USD)
# ═══════════════════════════════════════
AI_DAILY_BUDGET_TOTAL=235                     # ⬜ Opsiyonel | Günlük toplam limit
AI_DAILY_BUDGET_KLING=100                     # ⬜ Opsiyonel
AI_DAILY_BUDGET_OPENAI=20                     # ⬜ Opsiyonel
AI_MONTHLY_BUDGET_TOTAL=6970                  # ⬜ Opsiyonel | Aylık toplam limit
AI_BUDGET_WARNING_THRESHOLD=0.70              # ⬜ Opsiyonel | %70 uyarı
AI_BUDGET_CRITICAL_THRESHOLD=0.85             # ⬜ Opsiyonel | %85 kritik
AI_BUDGET_SHUTDOWN_THRESHOLD=0.95             # ⬜ Opsiyonel | %95 durdur
```

---

## 📝 Özet Tablo

| Kategori | Zorunlu | Opsiyonel | Toplam |
|----------|---------|-----------|--------|
| Genel | 4 | 2 | 6 |
| Auth (Clerk) | 3 | 3 | 6 |
| Veritabanı | 5 | 6 | 11 |
| AI Provider | 7 | 10 | 17 |
| Ödeme (Stripe) | 6 | 0 | 6 |
| AWS | 5 | 3 | 8 |
| Monitoring | 4 | 3 | 7 |
| Bildirimler | 2 | 1 | 3 |
| Maliyet Limitleri | 0 | 8 | 8 |
| **TOPLAM** | **36** | **36** | **72** |

---
*Bu doküman DevOps Agent tarafından yönetilir. Her yeni servis eklendiğinde güncellenir.*
