# ⚙️ LensAI — BACKEND SPEC

## Amaç
Bu doküman, LensAI backend servislerinin mimarisini, API sözleşmelerini, iş mantığını ve geliştirme standartlarını tanımlar.

---

## 🏗️ Servis Mimarisi

### 1. API Gateway (Node.js + Express)
```
Port: 3001
Dil: TypeScript
ORM: Prisma
Validation: Zod
Auth: Clerk SDK + JWT
Ödeme: Stripe SDK
Queue: BullMQ (producer)
Real-time: Socket.io
Logger: Winston + Pino
```

### 2. AI Service (Python + FastAPI)
```
Port: 8000
Dil: Python 3.11
Async: asyncio + httpx
Queue: BullMQ (consumer via node bridge)
AI: openai, anthropic, httpx (Kling/Runway)
Vision: Pillow, OpenCV
Logger: loguru
```

### 3. Notification Service (Node.js)
```
Port: 3003
Email: Resend
Push: Expo Push Notifications
SMS: Twilio (opsiyonel)
```

### 4. Analytics Service (Node.js)
```
Port: 3004
DB: ClickHouse (analitik sorguları)
Scheduled jobs: node-cron
```

---

## 📡 API Endpoint Tanımları

### Auth Endpoints
```typescript
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
```

### Kullanıcı Endpoints
```typescript
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
DELETE /api/v1/users/account
GET    /api/v1/users/usage          # Kullanım istatistikleri
GET    /api/v1/users/team           # Takım üyeleri
POST   /api/v1/users/team/invite
DELETE /api/v1/users/team/:memberId
```

### Proje Endpoints
```typescript
GET    /api/v1/projects             # Proje listesi
POST   /api/v1/projects             # Yeni proje oluştur
GET    /api/v1/projects/:id
PUT    /api/v1/projects/:id
DELETE /api/v1/projects/:id
POST   /api/v1/projects/:id/duplicate
```

### Video Üretim Endpoints
```typescript
POST   /api/v1/generate/upload      # Görsel yükle
POST   /api/v1/generate/mask        # Maskeleme başlat
POST   /api/v1/generate/video       # Video üretimi başlat
GET    /api/v1/generate/status/:jobId  # İş durumu
GET    /api/v1/generate/styles      # Stil kütüphanesi
POST   /api/v1/generate/batch       # Toplu üretim
DELETE /api/v1/generate/job/:jobId  # İptal et
```

### Video Yönetim Endpoints
```typescript
GET    /api/v1/videos               # Video listesi
GET    /api/v1/videos/:id
DELETE /api/v1/videos/:id
POST   /api/v1/videos/:id/download  # Download URL üret
POST   /api/v1/videos/:id/share     # Paylaşım linki
POST   /api/v1/videos/:id/publish   # Sosyal medyaya paylaş
```

### Abonelik Endpoints
```typescript
GET    /api/v1/subscriptions/plans
GET    /api/v1/subscriptions/current
POST   /api/v1/subscriptions/checkout  # Stripe checkout session
POST   /api/v1/subscriptions/portal    # Stripe customer portal
GET    /api/v1/subscriptions/invoices
```

### Health Check Endpoints
```typescript
GET    /health          # Basit liveness probe (200 OK)
GET    /ready           # Readiness probe (DB + Redis bağlantı kontrol)
GET    /metrics         # Prometheus metrikleri (internal)
```

### Webhook Endpoints (Gelen)
```typescript
POST   /api/v1/webhooks/stripe         # Stripe webhook events
       # → checkout.session.completed
       # → invoice.payment_succeeded
       # → invoice.payment_failed
       # → customer.subscription.updated
       # → customer.subscription.deleted
POST   /api/v1/webhooks/clerk          # Clerk user events
       # → user.created
       # → user.updated
       # → user.deleted
POST   /api/v1/webhooks/ai-provider    # AI provider callback
       # → job.completed
       # → job.failed
```

---

## 📦 Request/Response Standartları

### Başarılı Response Formatı
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}
```

### Hata Response Formatı
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // 'VALIDATION_ERROR', 'NOT_FOUND', vb.
    message: string;     // İnsan okunabilir mesaj
    details?: unknown;   // Validasyon detayları
    requestId: string;   // Tracing için
  };
}
```

### HTTP Status Kodları
```
200 OK            → Başarılı GET/PUT
201 Created       → Başarılı POST
204 No Content    → Başarılı DELETE
400 Bad Request   → Validation hatası
401 Unauthorized  → Auth yok/geçersiz
403 Forbidden     → Yetki yok
404 Not Found     → Kaynak bulunamadı
409 Conflict      → Çakışma (duplicate)
422 Unprocessable → İş mantığı hatası
429 Too Many Req  → Rate limit aşıldı
500 Server Error  → Sunucu hatası
503 Unavailable   → Servis geçici kapalı
```

---

## 💼 İş Mantığı Katmanı

### Video Üretim Pipeline
```typescript
class VideoGenerationService {
  async startGeneration(input: GenerationInput): Promise<Job> {
    // 1. Kullanım limiti kontrolü
    await this.checkUsageLimit(input.userId);
    
    // 2. Görseli S3'e yükle
    const imageUrl = await this.uploadToS3(input.image);
    
    // 3. Job oluştur ve kuyruğa ekle
    const job = await this.createJob(input.userId, imageUrl);
    await this.queue.add('generate-video', {
      jobId: job.id,
      imageUrl,
      style: input.style,
      prompt: input.customPrompt
    });
    
    // 4. Kullanım sayacını artır
    await this.incrementUsage(input.userId);
    
    return job;
  }
}
```

### Kullanım Limiti Mantığı
```typescript
const PLAN_LIMITS = {
  free:    { videos: 5,   quality: 'HD',   features: [] },
  starter: { videos: 50,  quality: 'HD',   features: ['batch'] },
  pro:     { videos: 200, quality: '4K',   features: ['batch', 'api'] },
  agency:  { videos: -1,  quality: '4K',   features: ['batch', 'api', 'white-label'] },
};
```

### AI Provider Router
```typescript
class AIProviderRouter {
  async generateVideo(input: VideoInput): Promise<VideoOutput> {
    const providers = [
      { name: 'kling', weight: 70 },
      { name: 'runway', weight: 20 },
      { name: 'luma', weight: 10 },
    ];
    
    for (const provider of this.prioritize(providers)) {
      try {
        return await this.callProvider(provider.name, input);
      } catch (error) {
        this.logger.warn(`Provider ${provider.name} failed, trying next`);
        continue;
      }
    }
    
    throw new Error('All AI providers failed');
  }
}
```

---

## 🔄 Job Queue Mimarisi

### Queue'lar
```typescript
const QUEUES = {
  'video-generation': {
    concurrency: 10,
    timeout: 300000,    // 5 dakika
    attempts: 3,
    backoff: 'exponential'
  },
  'image-masking': {
    concurrency: 20,
    timeout: 60000,     // 1 dakika
    attempts: 3
  },
  'social-publish': {
    concurrency: 5,
    timeout: 30000,
    attempts: 5
  },
  'email-notification': {
    concurrency: 50,
    timeout: 10000,
    attempts: 3
  }
};
```

### Job Durumu Akışı
```
WAITING → ACTIVE → COMPLETED
                 → FAILED → RETRY → ACTIVE
                                  → DEAD
```

---

## 🔌 Middleware Stack

### Tüm Route'larda
```typescript
app.use(helmet());           // Güvenlik başlıkları
app.use(cors(corsConfig));   // CORS
app.use(compression());      // Gzip
app.use(morgan('combined')); // Request logging
app.use(rateLimit(config));  // Rate limiting
```

### Korumalı Route'larda
```typescript
router.use(authMiddleware);         // JWT doğrulama
router.use(planCheckMiddleware);    // Plan kontrolü
router.use(usageLimitMiddleware);   // Kullanım limiti
router.use(requestLogMiddleware);   // Detaylı loglama
```

---

## 📝 Loglama Standartları

### Log Seviyeleri
```typescript
// ERROR: Kullanıcı etkileniyor, hemen müdahale
logger.error('AI generation failed', { jobId, error, userId });

// WARN: Potansiyel sorun, yakında müdahale
logger.warn('AI provider rate limit approaching', { provider, remaining });

// INFO: Normal iş akışı
logger.info('Video generation started', { jobId, userId, style });

// DEBUG: Geliştirici bilgisi (production'da kapalı)
logger.debug('Prompt generated', { prompt, tokens });
```

### Log Formatı
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "service": "api-gateway",
  "requestId": "req_abc123",
  "userId": "user_xyz789",
  "message": "Video generation started",
  "jobId": "job_def456",
  "duration": 45
}
```

---

## 🧪 Test Standartları

### Unit Test (Vitest)
- Her service için ayrı test dosyası
- Mock'lar `__mocks__` klasöründe
- Coverage hedefi: %85

### Integration Test
- Supertest ile API endpoint testleri
- Test veritabanı (Docker PostgreSQL)
- Her endpoint için happy path + edge cases

### E2E Test (Playwright)
- Kritik kullanıcı yolculukları
- Upload → Generate → Download akışı
- Ödeme akışı (Stripe test mode)

---
*Bu doküman Backend Agent tarafından her sprint güncellenir.*
