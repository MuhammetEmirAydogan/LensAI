# ❌ LensAI — ERROR HANDLING

## Amaç
Bu doküman, LensAI'ın tüm servislerinde kullanılan hata kodlarını, retry stratejilerini, circuit breaker yapılandırmasını ve kullanıcıya gösterilecek mesajları tanımlar.

---

## 📋 Hata Kodu Katalogu

### Genel Hata Kodları (1xxx)
| Kod | Sabit | HTTP | Açıklama | Kullanıcı Mesajı |
|-----|-------|------|----------|------------------|
| 1000 | UNKNOWN_ERROR | 500 | Bilinmeyen hata | Bir hata oluştu. Lütfen tekrar deneyin. |
| 1001 | VALIDATION_ERROR | 400 | Giriş validasyonu başarısız | Lütfen bilgilerinizi kontrol edin. |
| 1002 | NOT_FOUND | 404 | Kaynak bulunamadı | Aradığınız kaynak bulunamadı. |
| 1003 | UNAUTHORIZED | 401 | Yetersiz kimlik bilgisi | Lütfen giriş yapın. |
| 1004 | FORBIDDEN | 403 | Yetersiz yetki | Bu işlem için yetkiniz yok. |
| 1005 | RATE_LIMITED | 429 | Rate limit aşıldı | Çok fazla istek. Lütfen biraz bekleyin. |
| 1006 | SERVICE_UNAVAILABLE | 503 | Servis geçici kapalı | Servis şu anda meşgul. Lütfen bekleyin. |
| 1007 | CONFLICT | 409 | Kaynak çakışması | Bu kaynak zaten mevcut. |
| 1008 | REQUEST_TOO_LARGE | 413 | Payload çok büyük | Dosya boyutu çok büyük. |

### Auth Hata Kodları (2xxx)
| Kod | Sabit | Açıklama | Kullanıcı Mesajı |
|-----|-------|----------|------------------|
| 2001 | AUTH_TOKEN_EXPIRED | Token süresi dolmuş | Oturumunuz sona erdi. Tekrar giriş yapın. |
| 2002 | AUTH_TOKEN_INVALID | Geçersiz token | Geçersiz oturum. Tekrar giriş yapın. |
| 2003 | AUTH_ACCOUNT_LOCKED | Hesap kilitli | Hesabınız geçici kilitlendi. 30 dk sonra deneyin. |
| 2004 | AUTH_EMAIL_EXISTS | E-posta zaten kayıtlı | Bu e-posta adresi zaten kullanımda. |
| 2005 | AUTH_WEAK_PASSWORD | Zayıf şifre | Şifreniz gereksinimleri karşılamıyor. |

### Upload Hata Kodları (3xxx)
| Kod | Sabit | Açıklama | Kullanıcı Mesajı |
|-----|-------|----------|------------------|
| 3001 | UPLOAD_TYPE_INVALID | Geçersiz dosya tipi | Sadece JPG, PNG ve WebP dosyaları kabul edilir. |
| 3002 | UPLOAD_SIZE_EXCEEDED | Dosya boyutu aşıldı | Maksimum dosya boyutu 50MB. |
| 3003 | UPLOAD_FAILED | Yükleme başarısız | Dosya yüklenemedi. Lütfen tekrar deneyin. |
| 3004 | UPLOAD_QUOTA_EXCEEDED | Depolama kotası aşıldı | Depolama alanınız doldu. Planınızı yükseltin. |
| 3005 | UPLOAD_CORRUPTED | Dosya bozuk | Dosya bozuk görünüyor. Farklı bir dosya deneyin. |

### AI Servisi Hata Kodları (4xxx)
| Kod | Sabit | Açıklama | Kullanıcı Mesajı |
|-----|-------|----------|------------------|
| 4001 | AI_MASKING_FAILED | Maskeleme başarısız | Ürün arka plandan ayrılamadı. Farklı açıdan deneyin. |
| 4002 | AI_CLASSIFICATION_FAILED | Sınıflandırma başarısız | Ürün türü belirlenemedi. Manuel seçin. |
| 4003 | AI_PROMPT_FAILED | Prompt üretilemedi | Video açıklaması oluşturulamadı. Tekrar deneyin. |
| 4004 | AI_GENERATION_FAILED | Video üretim başarısız | Video üretilemedi. Farklı stil/ayar ile deneyin. |
| 4005 | AI_GENERATION_TIMEOUT | Video üretim zaman aşımı | Video üretimi zaman aşımına uğradı. Otomatik tekrar deneyeceğiz. |
| 4006 | AI_PROVIDER_DOWN | AI sağlayıcı çöktü | Video servisi geçici olarak kullanılamıyor. |
| 4007 | AI_ALL_PROVIDERS_DOWN | Tüm sağlayıcılar çöktü | Video üretim servisi şu anda bakımda. |
| 4008 | AI_QUALITY_LOW | Kalite eşiği altında | Üretilen video kalite standardını karşılamadı. Tekrar deniyoruz. |
| 4009 | AI_NSFW_DETECTED | Uygunsuz içerik tespit | İçerik politikalarımıza uygun değil. |
| 4010 | AI_BUDGET_EXCEEDED | AI bütçe limiti aşıldı | Sistem yoğun. Lütfen daha sonra deneyin. |

### Ödeme Hata Kodları (5xxx)
| Kod | Sabit | Açıklama | Kullanıcı Mesajı |
|-----|-------|----------|------------------|
| 5001 | PAYMENT_FAILED | Ödeme başarısız | Ödeme işleminiz başarısız. Kart bilgilerinizi kontrol edin. |
| 5002 | SUBSCRIPTION_EXPIRED | Abonelik sona erdi | Aboneliğiniz sona erdi. Yenilemek için tıklayın. |
| 5003 | USAGE_LIMIT_REACHED | Kullanım limiti aşıldı | Bu ayki video kotanız doldu. Planınızı yükseltin. |
| 5004 | PLAN_DOWNGRADE_BLOCKED | Downgrade engellendi | Mevcut kullanımınız bu plana uymuyor. |
| 5005 | PAYMENT_METHOD_REQUIRED | Ödeme yöntemi gerekli | Lütfen bir ödeme yöntemi ekleyin. |

### Sosyal Medya Hata Kodları (6xxx)
| Kod | Sabit | Açıklama | Kullanıcı Mesajı |
|-----|-------|----------|------------------|
| 6001 | SOCIAL_AUTH_FAILED | Sosyal medya auth başarısız | Hesap bağlantısı kurulamadı. Tekrar deneyin. |
| 6002 | SOCIAL_PUBLISH_FAILED | Paylaşım başarısız | İçerik paylaşılamadı. Hesap bağlantınızı kontrol edin. |
| 6003 | SOCIAL_TOKEN_EXPIRED | Sosyal medya token süresi dolmuş | Hesap bağlantınız sona erdi. Yeniden bağlayın. |
| 6004 | SOCIAL_RATE_LIMITED | Sosyal medya rate limit | Platform limiti aşıldı. Daha sonra deneyin. |

---

## 🔄 Retry Stratejisi

### Genel Kurallar
```typescript
interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

const DEFAULT_RETRY: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,   // Exponential backoff
  retryableErrors: [
    'UNKNOWN_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMITED',
    'AI_GENERATION_TIMEOUT',
    'AI_PROVIDER_DOWN',
  ]
};
```

### Servis Bazlı Retry Yapılandırması
```typescript
const RETRY_CONFIGS = {
  'video-generation': {
    maxAttempts: 3,
    initialDelayMs: 5000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
    // İlk başarısız → 5s, ikinci → 10s, üçüncü → 20s
    onFinalFailure: 'switchProvider'  // Farklı AI provider dene
  },
  'image-masking': {
    maxAttempts: 3,
    initialDelayMs: 2000,
    maxDelayMs: 15000,
    backoffMultiplier: 2,
    onFinalFailure: 'switchProvider'
  },
  'social-publish': {
    maxAttempts: 5,
    initialDelayMs: 10000,
    maxDelayMs: 300000,     // 5 dakikaya kadar
    backoffMultiplier: 3,
    onFinalFailure: 'notifyUser'
  },
  'stripe-webhook': {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
    onFinalFailure: 'alertOps'
  },
  'email-notification': {
    maxAttempts: 3,
    initialDelayMs: 5000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    onFinalFailure: 'logAndSkip'
  }
};
```

### Retry Edilmeyecek Hatalar (Non-retryable)
```typescript
const NON_RETRYABLE = [
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'AUTH_TOKEN_INVALID',
  'UPLOAD_TYPE_INVALID',
  'UPLOAD_SIZE_EXCEEDED',
  'AI_NSFW_DETECTED',
  'PAYMENT_FAILED',
  'USAGE_LIMIT_REACHED',
];
```

---

## 🔌 Circuit Breaker Yapılandırması

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number;     // Açılma eşiği
  successThreshold: number;     // Kapanma eşiği
  timeout: number;              // Half-open timeout (ms)
  monitorInterval: number;      // İzleme penceresi (ms)
}

const CIRCUIT_BREAKERS = {
  'kling-ai': {
    failureThreshold: 5,       // 5 ardışık hata → devre açılır
    successThreshold: 3,       // 3 ardışık başarı → devre kapanır
    timeout: 30000,            // 30s sonra half-open dene
    monitorInterval: 60000,    // 1 dk izleme penceresi
    fallback: 'runway'         // Devre açıkken bu provider'a yönlendir
  },
  'runway': {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 30000,
    monitorInterval: 60000,
    fallback: 'luma'
  },
  'luma': {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 30000,
    monitorInterval: 60000,
    fallback: null             // Son fallback, null = hata döndür
  },
  'openai': {
    failureThreshold: 10,
    successThreshold: 5,
    timeout: 15000,
    monitorInterval: 60000,
    fallback: 'gpt-4o-mini'   // Model downgrade
  },
  'removebg': {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 20000,
    monitorInterval: 60000,
    fallback: 'stability-ai'
  }
};
```

### Circuit Breaker Durum Akışı
```
CLOSED (Normal) ──[failureThreshold aşıldı]──→ OPEN (Devre Açık)
                                                      │
                                                [timeout sonra]
                                                      │
                                                      ▼
                                               HALF-OPEN (Deneme)
                                                  │         │
                                            [başarılı]  [başarısız]
                                                  │         │
                                                  ▼         ▼
                                               CLOSED     OPEN
```

---

## 🌐 Hata Response Standardı

### API Hata Response
```typescript
// Her hata bu formata uyar
interface ErrorResponse {
  success: false;
  error: {
    code: number;           // 4004
    type: string;           // 'AI_GENERATION_FAILED'
    message: string;        // Kullanıcıya gösterilecek Türkçe mesaj
    details?: unknown;      // Validation detayları, field-level hatalar
    requestId: string;      // 'req_abc123' — destek ekibine iletilir
    retryable: boolean;     // Client tekrar deneyebilir mi?
    retryAfterMs?: number;  // Ne kadar sonra denenmeli?
    docs?: string;          // Hata doküman URL'i
  };
}
```

### Örnek Hata Yanıtları
```json
// 400 — Validation Error
{
  "success": false,
  "error": {
    "code": 1001,
    "type": "VALIDATION_ERROR",
    "message": "Lütfen bilgilerinizi kontrol edin.",
    "details": {
      "fields": {
        "email": "Geçerli bir e-posta adresi girin",
        "name": "İsim en az 2 karakter olmalı"
      }
    },
    "requestId": "req_abc123",
    "retryable": false
  }
}

// 429 — Rate Limited
{
  "success": false,
  "error": {
    "code": 1005,
    "type": "RATE_LIMITED",
    "message": "Çok fazla istek. Lütfen biraz bekleyin.",
    "requestId": "req_def456",
    "retryable": true,
    "retryAfterMs": 60000
  }
}

// 500 — AI Generation Failed
{
  "success": false,
  "error": {
    "code": 4004,
    "type": "AI_GENERATION_FAILED",
    "message": "Video üretilemedi. Farklı stil/ayar ile deneyin.",
    "requestId": "req_ghi789",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

---

## 🔔 Hata Bildirimi Matrisi

| Hata Türü | Kullanıcıya | Slack | PagerDuty | Sentry | Log |
|-----------|-------------|-------|-----------|--------|-----|
| Validation (1001) | ✅ | ❌ | ❌ | ❌ | INFO |
| Rate Limit (1005) | ✅ | ⚠️ sık ise | ❌ | ❌ | WARN |
| AI Timeout (4005) | ✅ | ✅ | ❌ | ✅ | WARN |
| All Providers Down (4007) | ✅ | ✅ | ✅ | ✅ | ERROR |
| Payment Failed (5001) | ✅ | ✅ | ❌ | ✅ | WARN |
| Unknown Error (1000) | ✅ | ✅ | ⚠️ sık ise | ✅ | ERROR |

---
*Bu doküman Backend Agent tarafından yönetilir. Her yeni hata kodu eklendiğinde güncellenir.*
