# 🧪 LensAI — TESTING STRATEGY

## Amaç
Bu doküman, LensAI'ın tüm test stratejisini, test piramidini, mock/stub yönetimini, test data factory yapısını ve E2E test senaryolarını tanımlar.

---

## 🔺 Test Piramidi

```
         ╱╲
        ╱  ╲         E2E Tests (Playwright)
       ╱ 10 ╲        → Kritik kullanıcı yolculukları
      ╱──────╲       → 10-15 senaryo
     ╱        ╲
    ╱   25     ╲      Integration Tests (Supertest)
   ╱────────────╲    → API endpoint testleri
  ╱              ╲   → Servisler arası iletişim
 ╱      65        ╲   Unit Tests (Vitest / pytest)
╱──────────────────╲ → İş mantığı, util fonksiyonlar
                      → Her servis için ayrı
```

| Katman | Araç | Coverage Hedefi | Çalışma Süresi |
|--------|------|-----------------|----------------|
| Unit | Vitest + pytest | >%85 | <30 saniye |
| Integration | Supertest + httpx | >%70 | <2 dakika |
| E2E | Playwright | Kritik yollar | <5 dakika |
| Performance | k6 | Baseline var | <10 dakika |

---

## 🏗️ Test Altyapısı

### Dizin Yapısı
```
services/
├── api-gateway/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   └── services/
│   │       └── user.service.ts
│   └── tests/
│       ├── unit/
│       │   ├── user.service.test.ts
│       │   └── video.service.test.ts
│       ├── integration/
│       │   ├── auth.test.ts
│       │   └── video-generation.test.ts
│       ├── fixtures/
│       │   ├── users.ts
│       │   └── videos.ts
│       └── __mocks__/
│           ├── stripe.ts
│           ├── clerk.ts
│           └── s3.ts
│
├── ai-service/
│   ├── app/
│   │   └── services/
│   └── tests/
│       ├── test_masking.py
│       ├── test_prompt_engine.py
│       ├── conftest.py          # pytest fixtures
│       └── mocks/
│
└── e2e/
    ├── tests/
    │   ├── auth.spec.ts
    │   ├── upload-generate.spec.ts
    │   ├── payment.spec.ts
    │   └── social-publish.spec.ts
    ├── fixtures/
    │   └── test-images/
    └── playwright.config.ts
```

---

## 🧱 Unit Test Standartları

### Adlandırma Kuralı
```typescript
// Dosya: {modül}.test.ts veya test_{modül}.py
// Describe: modül adı
// Test: "should {beklenen davranış} when {koşul}"

describe('VideoGenerationService', () => {
  it('should create a job when valid input provided', async () => { ... });
  it('should throw USAGE_LIMIT_REACHED when quota exceeded', async () => { ... });
  it('should fallback to runway when kling fails', async () => { ... });
});
```

### Her Unit Test İçin Zorunlu
- [ ] Happy path (başarılı senaryo)
- [ ] Validation hatası (yanlış input)
- [ ] Edge case (boş array, null, max limit)
- [ ] Error handling (servis çöktüğünde ne olur)
- [ ] Yetkilendirme (yetkisiz erişim)

### Mock Stratejisi
```typescript
// KURAL: Dış servisleri DAIMA mockla, iç mantığı gerçek çalıştır

// ✅ DOĞRU — Dış servis mocklanmış
vi.mock('@/lib/stripe', () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ id: 'session_123' })
}));

// ❌ YANLIŞ — İç mantık mocklanmış
vi.mock('@/services/user.service', () => ({
  checkUsageLimit: vi.fn().mockReturnValue(true) // İçsel mantığı mockla-MA
}));
```

### Neyi Mockla, Neyi Mocklama
| Mockla ✅ | Mocklama ❌ |
|----------|------------|
| Stripe API | İş mantığı fonksiyonları |
| Clerk Auth | Validation fonksiyonları |
| AWS S3 | Util/helper fonksiyonları |
| AI Provider API'leri | Error handling |
| Redis (istenirse) | Type dönüşümleri |
| Email servisi | — |

---

## 🔗 Integration Test Standartları

### Ortam
```typescript
// Docker Compose ile test veritabanları
// docker-compose.test.yml
services:
  postgres-test:
    image: postgres:16
    environment:
      POSTGRES_DB: lensai_test
    ports: ['5433:5432']
  redis-test:
    image: redis:7
    ports: ['6380:6379']
```

### Her Endpoint İçin Test Listesi
```typescript
describe('POST /api/v1/generate/video', () => {
  // Happy paths
  it('should return 201 with valid job', async () => { ... });
  
  // Auth
  it('should return 401 without token', async () => { ... });
  it('should return 403 for insufficient plan', async () => { ... });
  
  // Validation
  it('should return 400 for missing image', async () => { ... });
  it('should return 400 for invalid style', async () => { ... });
  
  // Business logic
  it('should return 422 when usage limit reached', async () => { ... });
  it('should increment usage counter', async () => { ... });
  
  // Edge cases
  it('should handle concurrent requests', async () => { ... });
});
```

### Veritabanı İzolasyonu
```typescript
// Her test cascade başlar, temiz slate
beforeEach(async () => {
  await db.execute('TRUNCATE users, projects, video_jobs CASCADE');
  await seedTestData();
});

afterAll(async () => {
  await db.$disconnect();
});
```

---

## 🌐 E2E Test Senaryoları (Playwright)

### Kritik Kullanıcı Yolculukları

#### 1. Kayıt → İlk Video Üretimi
```typescript
test('new user can register and generate first video', async ({ page }) => {
  // 1. Landing page'e git
  // 2. "Ücretsiz Başla" tıkla
  // 3. E-posta + şifre ile kayıt ol
  // 4. Dashboard'a yönlendirildiğini doğrula
  // 5. "Yeni Proje" oluştur
  // 6. Test görseli yükle
  // 7. Stil seç
  // 8. "Video Üret" tıkla
  // 9. Render bekleme ekranını gör
  // 10. Video tamamlandı ekranını gör (mock)
});
```

#### 2. Ödeme → Plan Yükseltme
```typescript
test('user can upgrade from free to pro plan', async ({ page }) => {
  // 1. Login ol (free plan kullanıcı)
  // 2. Settings > Billing'e git
  // 3. Pro plan "Yükselt" tıkla
  // 4. Stripe Checkout (test mode)
  // 5. Başarılı ödeme sonrası dashboard'a dön
  // 6. Plan durumunun "Pro" olduğunu doğrula
  // 7. Video limitinin 200'e çıktığını doğrula
});
```

#### 3. Upload → Download Akışı
```typescript
test('user can upload image, generate video, and download', async ({ page }) => {
  // 1. Login (Pro plan)
  // 2. Proje aç
  // 3. Drag & drop ile görsel yükle
  // 4. Maskeleme önizlemesini gör
  // 5. "Cinematic Luxury" stili seç
  // 6. Video üret
  // 7. Tamamlanan videoyu önizle
  // 8. MP4 olarak indir
});
```

#### 4. Toplu İşlem
```typescript
test('user can batch upload and generate multiple videos', async ({ page }) => {
  // 1. Login (Agency plan)
  // 2. Proje aç
  // 3. 5 görsel birden yükle
  // 4. Aynı stili tümüne uygula
  // 5. "Toplu üret" tıkla
  // 6. Tüm job'ların progress'ini gör
  // 7. Tümünü ZIP olarak indir
});
```

---

## 📦 Test Data Factory

```typescript
// tests/fixtures/factory.ts
import { faker } from '@faker-js/faker';

export const createTestUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  plan: 'free',
  videosUsed: 0,
  videosLimit: 5,
  ...overrides
});

export const createTestProject = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  status: 'active',
  ...overrides
});

export const createTestVideoJob = (overrides = {}) => ({
  id: faker.string.uuid(),
  styleId: 'cinematic-luxury',
  status: 'pending',
  progress: 0,
  ...overrides
});

export const createTestMediaItem = (overrides = {}) => ({
  id: faker.string.uuid(),
  originalUrl: `https://test-bucket.s3.amazonaws.com/${faker.string.uuid()}.jpg`,
  fileName: 'product-photo.jpg',
  fileSize: 2048000,
  mimeType: 'image/jpeg',
  width: 1920,
  height: 1080,
  ...overrides
});
```

---

## 🏃 Test Çalıştırma Komutları

```bash
# Unit testler
npm run test                    # Tüm unit testler
npm run test:watch              # Watch mode
npm run test -- --coverage      # Coverage raporu ile

# Python AI servis testleri
cd services/ai-service
pytest                          # Tüm testler
pytest --cov=app                # Coverage ile
pytest -k "test_masking"        # Belirli test

# Integration testler
npm run test:integration        # Docker gerektirir

# E2E testler
npm run test:e2e                # Headless
npm run test:e2e -- --headed    # Tarayıcıyı göster
npm run test:e2e -- --ui        # Playwright UI

# Tüm testler (CI)
npm run test:ci                 # Unit + integration + lint + type-check
```

---

## 📊 Coverage Kuralları

| Katman | Dosya Türü | Min Coverage |
|--------|-----------|-------------|
| Services | `*.service.ts` | %90 |
| Controllers | `*.controller.ts` | %85 |
| Middleware | `*.middleware.ts` | %85 |
| Utils | `*.util.ts` | %95 |
| Routes | `*.route.ts` | %70 (integration) |
| Python Services | `*.py` (services/) | %85 |
| React Components | `*.tsx` | %75 |

### Coverage'dan Hariç Tutulanlar
```typescript
// vitest.config.ts
coverage: {
  exclude: [
    'tests/**',
    '**/*.d.ts',
    '**/index.ts',     // Barrel exports
    '**/types.ts',     // Type-only files
    'migrations/**',
    'scripts/**',
  ]
}
```

---
*Bu doküman Testing Agent tarafından yönetilir. Her sprint güncellenir.*
