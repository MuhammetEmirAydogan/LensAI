# 🎯 LensAI — MASTER PLAN

## Proje Vizyonu
LensAI, e-ticaret firmaları ve fotoğrafçılar için geliştirilmiş, ürün fotoğraflarını yapay zeka ile otomatik olarak sinematik viral videolara dönüştüren tam kapsamlı bir SaaS platformudur. Kullanıcı sadece fotoğraf yükler; AI arka planda maskeleme, prompt üretimi, video render ve sosyal medya paylaşımını otomatik gerçekleştirir.

---

## 🏗️ Proje Kapsamı

### Hedef Kitle
- E-ticaret firmaları (Shopify, WooCommerce, Trendyol entegrasyonu)
- Ürün fotoğrafçıları
- Sosyal medya yöneticileri
- Reklam ajansları
- Dropshipping girişimcileri

### Temel Özellikler
1. **AI Maskeleme** — Ürünü arka plandan otomatik ayır (SAM2 / Remove.bg API)
2. **Prompt Motoru** — Ürün kategorisine göre otomatik sinematik prompt üretimi
3. **Video Üretimi** — Kling AI, Runway Gen-3, Luma Dream Machine API entegrasyonu
4. **Stil Kütüphanesi** — 50+ hazır video stili (Cinematic, Viral, Luxury, Minimalist, vb.)
5. **Toplu İşlem** — Aynı anda 50 ürün videosu üretimi
6. **Sosyal Medya** — Instagram Reels, TikTok, YouTube Shorts direkt paylaşım
7. **Marka Kiti** — Logo, renk paleti, font entegrasyonu ile marka uyumlu video
8. **Analytics** — Video performans takibi ve viral skor tahmini
9. **A/B Test** — Aynı üründen 3 farklı stil, hangisi daha iyi performans gösteriyor?

---

## 📱 Platform Mimarisi

### Web Uygulaması (Next.js 14)
- Dashboard
- Proje yönetimi
- Video stüdyo
- Analytics panel
- Team workspace

### Mobil Uygulama (React Native / Expo)
- Kameradan direkt ürün çekimi
- Anlık video önizleme
- Sosyal medya paylaşımı
- Push notification (render tamamlandı)

### Backend (Node.js + Python)
- Node.js: API Gateway, Auth, Webhook yönetimi
- Python (FastAPI): AI işlemleri, görüntü işleme, prompt motoru

---

## 🗓️ Geliştirme Fazları

### Faz 1 — MVP (0-3 Ay)
- [ ] Auth sistemi (Clerk)
- [ ] Görsel yükleme ve maskeleme
- [ ] Temel prompt motoru
- [ ] Kling AI entegrasyonu
- [ ] Video download
- [ ] Stripe ödeme

### Faz 2 — Growth (3-6 Ay)
- [ ] Runway + Luma entegrasyonu
- [ ] Stil kütüphanesi (50+ stil)
- [ ] Toplu işlem
- [ ] Sosyal medya API entegrasyonları
- [ ] Mobil uygulama

### Faz 3 — Scale (6-12 Ay)
- [ ] Shopify / WooCommerce plugin
- [ ] White-label çözüm
- [ ] Enterprise plan
- [ ] Kendi AI modelimizi fine-tune etme
- [ ] Affiliate program

---

## 💰 Gelir Modeli

| Plan | Fiyat | Özellikler |
|------|-------|-----------|
| Free | $0/ay | 5 video/ay, watermark |
| Starter | $29/ay | 50 video/ay, HD |
| Pro | $79/ay | 200 video/ay, 4K, API erişimi |
| Agency | $199/ay | Sınırsız, white-label, team |
| Enterprise | Özel | Self-hosted, SLA |

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/UI
- Framer Motion (animasyonlar)
- React Three Fiber (3D önizleme)
- Zustand (state management)
- React Query (server state)

### Mobile
- React Native (Expo SDK 51)
- NativeWind
- Expo Camera
- Expo Notifications

### Backend
- Node.js + Express (API Gateway)
- Python + FastAPI (AI servisleri)
- BullMQ (job queue)
- Redis (cache + queue)
- Socket.io (real-time render durumu)

### AI/ML
- Kling AI API (primary video generation)
- Runway Gen-3 API (fallback)
- Luma Dream Machine API (alternatif stil)
- Stability AI (maskeleme + background removal)
- OpenAI GPT-4o (prompt motoru)
- Replicate (custom models)

### Database
- PostgreSQL (ana veritabanı)
- MongoDB (video metadata)
- Redis (cache)
- Pinecone (vektör DB — stil benzerlik araması)

### Infrastructure
- AWS (EC2, S3, CloudFront, SQS)
- Docker + Kubernetes
- GitHub Actions (CI/CD)
- Terraform (IaC)

### Monitoring
- Sentry (error tracking)
- Datadog (APM)
- PostHog (product analytics)

---

## 📁 Klasör Yapısı

```
LensAI/
├── apps/
│   ├── web/                    # Next.js web uygulaması
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── projects/
│   │   │   │   ├── studio/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── studio/
│   │   │   ├── upload/
│   │   │   └── analytics/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── stores/
│   │
│   └── mobile/                 # React Native uygulaması
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── navigation/
│       │   ├── stores/
│       │   └── services/
│       └── assets/
│
├── services/
│   ├── api-gateway/            # Node.js API Gateway
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── controllers/
│   │   │   └── validators/
│   │   └── tests/
│   │
│   ├── ai-service/             # Python FastAPI AI servisi
│   │   ├── app/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   │   ├── masking/
│   │   │   │   ├── prompt_engine/
│   │   │   │   └── video_generation/
│   │   │   └── utils/
│   │   └── tests/
│   │
│   ├── notification-service/   # Push & Email bildirimleri
│   ├── analytics-service/      # Video performans analizi
│   └── webhook-service/        # Sosyal medya webhook'ları
│
├── packages/
│   ├── shared-types/           # TypeScript tip tanımları
│   ├── ui-kit/                 # Paylaşılan UI bileşenleri
│   └── utils/                  # Ortak yardımcı fonksiyonlar
│
├── infrastructure/
│   ├── terraform/
│   ├── kubernetes/
│   ├── docker/
│   └── scripts/
│
├── agents/                     # AI Ajan tanım dosyaları
├── docs/                       # Genel dokümantasyon
├── .github/
│   └── workflows/
└── monitoring/
```

---

## 🎯 Başarı Metrikleri

- **MRR Hedefi**: 6. ayda $50K MRR
- **Kullanıcı Hedefi**: 6. ayda 5.000 aktif kullanıcı
- **Video Üretimi**: Günlük 10.000 video render
- **Churn Rate**: <%5/ay
- **NPS**: >50
