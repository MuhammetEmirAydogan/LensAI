# 🏛️ LensAI — ARCHITECTURE REVIEW

## Amaç
Bu doküman, LensAI'ın sistem mimarisini, tasarım kararlarını, mimari riskleri ve architecture review protokollerini tanımlar.

---

## 🗺️ Sistem Genel Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│   │  Web App    │    │ Mobile App  │    │   API Clnt  │   │
│   │ (Next.js)   │    │(React Natv) │    │  (3rd Party)│   │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘   │
└──────────┼────────────────── ┼─────────────────┼───────────┘
           │                   │                  │
           └───────────────────┼──────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    AWS CloudFront   │
                    │       (CDN)         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    AWS WAF          │
                    │  (Web App Firewall) │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Load Balancer     │
                    │   (AWS ALB)         │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                   │
   ┌────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
   │  API Gateway    │ │  AI Service │ │Notification Svc  │
   │  (Node.js)      │ │  (FastAPI)  │ │   (Node.js)      │
   │  Port: 3001     │ │  Port: 8000 │ │   Port: 3003     │
   └────────┬────────┘ └──────┬──────┘ └─────────┬────────┘
            │                  │                   │
            └──────────────────┼───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                 │
   ┌──────────▼──┐  ┌─────────▼──┐  ┌──────────▼──┐
   │ PostgreSQL  │  │   Redis    │  │   MongoDB   │
   │  (RDS)      │  │ (ElastiCch)│  │  (Atlas)    │
   └─────────────┘  └────────────┘  └─────────────┘

              ┌────────────────────────────────┐
              │         AI PROVIDERS           │
              │  ┌────────┐ ┌───────┐ ┌─────┐ │
              │  │Kling AI│ │Runway │ │Luma │ │
              │  └────────┘ └───────┘ └─────┘ │
              │  ┌──────────┐ ┌─────────────┐  │
              │  │ GPT-4o   │ │ Stability AI│  │
              │  └──────────┘ └─────────────┘  │
              └────────────────────────────────┘
```

---

## 🔧 Servis Mimarisi Detayı

### API Gateway (Node.js + Express)
**Sorumluluklar:**
- Kimlik doğrulama & yetkilendirme
- Request routing
- Rate limiting
- Request/response logging
- Input validation
- Ödeme yönetimi (Stripe)

**Endpoints:**
```
/api/v1/auth/*          → Auth işlemleri
/api/v1/users/*         → Kullanıcı yönetimi
/api/v1/projects/*      → Proje yönetimi
/api/v1/uploads/*       → Dosya yükleme
/api/v1/subscriptions/* → Abonelik yönetimi
/api/v1/webhooks/*      → Webhook'lar
```

### AI Service (Python + FastAPI)
**Sorumluluklar:**
- Görsel maskeleme (SAM2 + Remove.bg)
- Ürün sınıflandırma
- Prompt üretimi (GPT-4o)
- Video üretim iş kuyruğu (BullMQ)
- AI provider yönetimi (Kling/Runway/Luma)
- Real-time iş durumu (Socket.io)

**Endpoints:**
```
/ai/v1/mask             → Görsel maskeleme
/ai/v1/classify         → Ürün sınıflandırma
/ai/v1/prompt           → Prompt üretimi
/ai/v1/generate         → Video üretimi başlat
/ai/v1/status/{job_id}  → İş durumu
/ai/v1/styles           → Stil kütüphanesi
```

---

## 📊 Veri Akışı — Video Üretim Pipeline

```
Kullanıcı Fotoğraf Yükler
          │
          ▼
   S3'e Yüklenir (Private)
          │
          ▼
   AI Service Tetiklenir
          │
    ┌─────▼──────┐
    │  Maskeleme │ (SAM2 / Remove.bg)
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │ Sınıflandır│ (GPT-4o Vision)
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │Prompt Üret │ (GPT-4o)
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │Video Üret  │ (Kling AI Primary)
    │            │ (Runway Fallback)
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │Post-Process│ (Watermark, Format)
    └─────┬──────┘
          │
    S3'e Kaydedilir (CDN)
          │
          ▼
   Kullanıcıya Bildirim
```

---

## ⚖️ Mimari Kararlar (ADR)

### ADR-001: Monorepo vs Multi-repo
**Karar:** Monorepo (Turborepo)
**Gerekçe:** Paylaşılan tip tanımları, UI kiti, ortak bağımlılık yönetimi
**Risk:** Repo büyüdükçe yavaşlama → Turborepo caching ile çözüldü

### ADR-002: Node.js + Python Dual Backend
**Karar:** Node.js (API Gateway) + Python (AI)
**Gerekçe:** Python AI/ML ekosistemi çok daha zengin (PyTorch, HuggingFace)
**Risk:** İki dilde tutulmak → Her servis kendi containerında izole

### ADR-003: PostgreSQL Primary Database
**Karar:** PostgreSQL + Prisma ORM
**Gerekçe:** ACID uyumluluğu, kompleks sorgular, JSON desteği
**Risk:** Scaling → Read replica ve connection pooling ile çözüldü

### ADR-004: BullMQ ile Job Queue
**Karar:** BullMQ (Redis tabanlı)
**Gerekçe:** AI video üretimi 1-3 dakika sürer, async zorunlu
**Risk:** Redis çöktüğünde joblar kaybolur → Persistent job logs DB'de

### ADR-005: Multi-AI Provider Stratejisi
**Karar:** Kling primary, Runway+Luma fallback
**Gerekçe:** Tek provider bağımlılığından kaçınmak
**Risk:** Farklı kalite çıktılar → Quality gate + kullanıcıya seçim

---

## 📏 Mimari Prensipler

### 1. Twelve-Factor App
- [ ] Codebase: Tek repo, çoklu deployment
- [ ] Dependencies: Açıkça tanımlanmış
- [ ] Config: Environment'dan okunuyor
- [ ] Backing services: Bağlantı URL'leriyle yönetiliyor
- [ ] Build/Release/Run: Ayrı aşamalar
- [ ] Processes: Stateless
- [ ] Port binding: Servis kendi portunu sunuyor
- [ ] Concurrency: Process modeli
- [ ] Disposability: Hızlı başlatma/kapanma
- [ ] Dev/Prod parity: Ortamlar eşdeğer
- [ ] Logs: Stdout'a stream
- [ ] Admin: Tek seferlik görevler

### 2. Domain-Driven Design (DDD)
```
Bounded Contexts:
├── User Context (auth, profile, subscription)
├── Media Context (upload, masking, storage)
├── AI Context (prompt, generation, quality)
├── Payment Context (billing, invoicing)
└── Analytics Context (metrics, reporting)
```

---

## 🔬 Mimari Review Kontrol Listesi

### Servis Eklenirken
- [ ] Bounded context belirli mi?
- [ ] API kontrakt tanımlandı mı? (OpenAPI spec)
- [ ] Hata yönetimi standartlaştırıldı mı?
- [ ] Liveness/Readiness probe tanımlı mı?
- [ ] Circuit breaker var mı?
- [ ] Distributed tracing entegre mi?
- [ ] SLA tanımlandı mı?

### Veritabanı Değişikliği
- [ ] Migration backward compatible mi?
- [ ] N+1 query sorunu var mı?
- [ ] Index'ler yeterli mi?
- [ ] Büyük tablo migration'ı planlandı mı?
- [ ] Rollback planı var mı?

### AI Entegrasyonu Eklenirken
- [ ] Fallback tanımlı mı?
- [ ] Maliyet hesabı yapıldı mı?
- [ ] Rate limit yönetimi var mı?
- [ ] Output validation var mı?
- [ ] A/B test kapasitesi var mı?

---

## 📈 Ölçeklenme Planı

### 0-1K Kullanıcı (Mevcut Mimari)
- 2x EC2 t3.medium (API)
- 1x EC2 t3.large (AI Service)
- RDS db.t3.medium
- Redis t3.micro

### 1K-10K Kullanıcı
- Auto-scaling group (2-8 instance)
- RDS Read Replica eklenir
- Redis cluster
- SQS yerine Kafka değerlendirmesi

### 10K-100K Kullanıcı
- Kubernetes (EKS)
- Multi-region deployment
- Database sharding
- CDN genişletme
- Kendi GPU sunucuları değerlendirmesi

---
*Bu doküman her mimari değişiklikte Architecture Agent tarafından güncellenir.*
