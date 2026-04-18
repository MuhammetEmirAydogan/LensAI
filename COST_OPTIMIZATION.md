# 💸 LensAI — COST OPTIMIZATION

## Amaç
Bu doküman, LensAI'ın AI servis maliyetlerini düşürmek, kârlılığı artırmak ve bütçe kontrolünü sağlamak için uygulanan tüm optimizasyon stratejilerini tanımlar.

---

## 📊 Mevcut Maliyet Yapısı

### Video Başına Maliyet Dağılımı
```
$0.59 / video (ortalama)
│
├── %68 — Video Üretimi (Kling AI)     $0.40
├── %30 — Maskeleme (Remove.bg)         $0.18
├── %01 — Prompt Üretimi (GPT-4o)       $0.005
├── %01 — Sınıflandırma (GPT-4o)        $0.003
└── %00 — Kalite Kontrol (GPT-4o-mini)  $0.002
```

### Hedef Maliyet: $0.35/video (%41 düşüş)
```
$0.35 / video (hedef)
│
├── %71 — Video Üretimi                 $0.25 (toplu indirim)
├── %14 — Maskeleme                     $0.05 (SAM2 self-hosted)
├── %01 — Prompt (cached)               $0.002
├── %01 — Sınıflandırma (cached)        $0.001
└── %00 — Kalite Kontrol                $0.001
```

---

## 🎯 Optimizasyon Stratejileri

### STRATEJİ 1: Akıllı Caching Katmanı

#### Maskeleme Cache
```typescript
// Aynı görsel 2. kez yüklenirse maskelemeyi tekrar yapma
const maskingCache = {
  strategy: 'content-hash',           // perceptual hash değil, SHA-256
  storage: 'S3 + Redis pointer',
  ttl: '90 gün',
  expectedHitRate: '%40-60',
  savings: '$0.18 × hitRate = ~$0.09/video average'
};

// İmaj hash hesaplama
async function getImageHash(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
```

#### Prompt Cache
```typescript
// Aynı ürün kategorisi + aynı stil = cache'den prompt
const promptCache = {
  key: 'prompt:{category}:{styleId}:{lang}',
  storage: 'Redis',
  ttl: '24 saat',
  variations: 5,              // Her kombinasyon için 5 varyasyon üret
  rotateStrategy: 'random',   // Her istekte farklı varyasyon
  expectedHitRate: '%70-80',
  savings: '$0.005 × hitRate = ~$0.004/video'
};
```

#### Sınıflandırma Cache
```typescript
// Benzer görseller aynı kategoriye düşer
const classificationCache = {
  key: 'classify:{imagePerceptualHash}',  // pHash kullan (benzer görseller)
  storage: 'Redis',
  ttl: '30 gün',
  hashAlgorithm: 'perceptual',           // Birebir değil, benzerlik
  hammingThreshold: 8,                    // 8-bit farka kadar aynı say
  expectedHitRate: '%50-70',
  savings: '$0.003 × hitRate = ~$0.002/video'
};
```

---

### STRATEJİ 2: Self-Hosted Maskeleme (Faz 2)

```
Mevcut:   Remove.bg API → $0.18/görsel
Hedef:    SAM2 Self-hosted → ~$0.02/görsel
Tasarruf: $0.16/görsel (%89 düşüş)
```

#### Altyapı Gereksinimi
```yaml
# GPU Instance (AWS)
instance_type: g5.xlarge       # 1x NVIDIA A10G, 24GB VRAM
cost: ~$1.01/saat
capacity: ~200 maskeleme/saat
cost_per_mask: $1.01/200 = $0.005

# Veya Spot Instance
spot_price: ~$0.35/saat
cost_per_mask: $0.35/200 = $0.00175
```

#### Geçiş Planı
```
1. SAM2 modeli GPU instance'da deploy et
2. İlk 2 hafta: A/B test (%20 trafik SAM2'ye)
3. Kalite karşılaştırması yap
4. Kalite ≥ Remove.bg %95 → %100 geçiş
5. Remove.bg'yi fallback olarak tut
```

---

### STRATEJİ 3: Batch API Kullanımı

#### OpenAI Batch API (%50 indirim)
```typescript
// Acil olmayan istekler batch'e alınır
const batchConfig = {
  minBatchSize: 10,
  maxBatchSize: 50000,
  maxWaitTime: '24h',
  discount: '%50',
  
  // Batch'e uygun işlemler
  batchable: [
    'prompt_generation',      // Toplu promptlar
    'quality_assessment',     // Toplu kalite kontrol
    'style_recommendation',   // Stil önerisi
  ],
  
  // Batch'e UYGUN OLMAYAN
  nonBatchable: [
    'classification',         // Anlık sonuç bekleniyor
    'real_time_prompt',       // Kullanıcı bekliyor
  ]
};
```

#### Remove.bg Batch
```typescript
// 10+ görsel batch olarak gönder
const removebgBatch = {
  endpoint: '/v1.0/removebg/batch',
  maxBatchSize: 50,
  discount: '%20 (enterprise plan)',
  turnaroundTime: '5 dakika max'
};
```

---

### STRATEJİ 4: Model Kademesi (Tiered Models)

```typescript
const modelTiers = {
  // Tier 1 — Ucuz, hızlı (basit görevler)
  tier1: {
    model: 'gpt-4o-mini',
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
    use_for: [
      'quality_check',           // Kalite puanlama
      'simple_classification',   // Basit kategori tespiti
      'prompt_variation',        // Mevcut prompt'tan varyasyon
      'metadata_extraction',     // Ürün bilgisi çıkarma
    ]
  },
  
  // Tier 2 — Orta fiyat, yüksek kalite (üretim görevleri)
  tier2: {
    model: 'gpt-4o',
    costPer1kTokens: { input: 0.0025, output: 0.01 },
    use_for: [
      'initial_prompt_generation',  // İlk prompt üretimi
      'complex_classification',     // Karmaşık ürün tespiti
      'style_matching',             // Stil eşleştirme
    ]
  },
  
  // Tier 3 — Premium (nadir, kritik görevler)
  tier3: {
    model: 'gpt-4o',
    maxTokens: 2000,
    use_for: [
      'failed_prompt_regeneration',  // Başarısız prompt tekrar
      'custom_brand_prompt',         // Marka bazlı özel prompt
    ]
  }
};
```

---

### STRATEJİ 5: Provider Negotiation & Volume Discount

| Provider | Mevcut Fiyat | Hedef Fiyat | Koşul | Tahmini Tasarruf/Ay |
|----------|-------------|-------------|-------|---------------------|
| Kling AI | $0.40/video | $0.30/video | 5K+ video/ay | $500 |
| Kling AI | $0.30/video | $0.25/video | 10K+ video/ay | $500 |
| Remove.bg | $0.18/görsel | $0.12/görsel | Enterprise plan | $600 |
| OpenAI | Standart | Committed Use %20↓ | 12 ay taahhüt | $120 |

---

### STRATEJİ 6: Akıllı Provider Routing

```typescript
// Maliyet-kalite dengesine göre dinamik routing
class SmartRouter {
  async selectProvider(input: VideoInput): Promise<Provider> {
    const factors = {
      userPlan: input.userPlan,
      styleComplexity: this.getComplexity(input.styleId),
      budgetRemaining: await this.getDailyBudgetRemaining(),
      providerHealth: await this.getProviderHealth(),
    };
    
    // Free plan → En ucuz provider
    if (factors.userPlan === 'free') {
      return this.getCheapestHealthy(factors);
    }
    
    // Bütçe %80+ kullandıysa → Ucuz provider'a yönlendir
    if (factors.budgetRemaining < 0.20) {
      return this.getCheapestHealthy(factors);
    }
    
    // Basit stiller → Ucuz provider yeterli
    if (factors.styleComplexity === 'low') {
      return this.getCheapestHealthy(factors);
    }
    
    // Karmaşık stiller → En kaliteli provider
    return this.getBestQuality(factors);
  }
}
```

---

## 📈 ROI Hesaplama

### Kısa Vadeli (3 Ay)
| Strateji | Yatırım | Aylık Tasarruf | ROI Süresi |
|----------|---------|----------------|------------|
| Caching katmanı | $0 (code only) | ~$800 | Anında |
| Model kademesi | $0 (config only) | ~$200 | Anında |
| Batch API | $0 (code only) | ~$300 | Anında |
| **TOPLAM** | **$0** | **~$1,300/ay** | **Anında** |

### Orta Vadeli (6 Ay)
| Strateji | Yatırım | Aylık Tasarruf | ROI Süresi |
|----------|---------|----------------|------------|
| SAM2 self-hosted | $500 setup | ~$1,200 | 2 hafta |
| Volume discount | $0 (negotiation) | ~$1,220 | Anında |
| **TOPLAM** | **$500** | **~$2,420/ay** | **1 hafta** |

### Toplam Potansiyel Tasarruf
```
Mevcut aylik AI maliyeti:        ~$6,970
Optimizasyon sonrası hedef:      ~$3,250
Aylık tasarruf:                  ~$3,720 (%53 düşüş)
Yıllık tasarruf:                 ~$44,640
```

---

## 📊 Maliyet Dashboard Metrikleri

### Takip Edilecek KPI'lar
| KPI | Hesaplama | Hedef | Alert Eşiği |
|-----|-----------|-------|-------------|
| Ortalama maliyet/video | Toplam maliyet / toplam video | <$0.35 | >$0.50 |
| Cache hit rate | Cache hit / toplam istek | >%50 | <%30 |
| Günlük AI maliyeti | SUM(ai_cost_logs WHERE today) | <$235 | >$200 |
| Provider başarı oranı | Başarılı / toplam, per provider | >%90 | <%80 |
| Bütçe kullanım oranı | Harcanan / aylık bütçe | <%80 | >%85 |

---
*Bu doküman AI Agent + Analytics Agent tarafından yönetilir.*
