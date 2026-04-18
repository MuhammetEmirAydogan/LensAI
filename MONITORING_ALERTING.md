# 📡 LensAI — MONITORING & ALERTING

## Amaç
Bu doküman, LensAI'ın tüm servislerinin nasıl izlendiğini, hangi alertlerin kurulduğunu ve olaya müdahale protokollerini tanımlar.

---

## 🛠️ Monitoring Stack

| Araç | Amaç | Dashboard |
|------|------|-----------|
| Datadog APM | Servis performansı, traces | app.datadoghq.com |
| Sentry | Hata takibi, stack traces | sentry.io |
| PostHog | Ürün analitiği | posthog.com |
| Uptime Robot | Uptime monitoring | uptimerobot.com |
| AWS CloudWatch | AWS servis metrikleri | AWS Console |
| PgHero | PostgreSQL monitoring | Internal |

---

## 🚨 Alert Kuralları

### P0 — Anında Aksiyon (PagerDuty)
```yaml
- API error rate > %5 (5 dakika)
- Tüm servisler çevrimdışı
- Database bağlantı hatası
- AI provider tam kesinti (3 provider birden)
- Stripe webhook başarısızlığı
- Memory > %95 (OOM riski)
- Disk > %90
```

### P1 — Çalışma Saatlerinde (Slack #alerts-critical)
```yaml
- API p95 latency > 1s (10 dakika)
- AI service error rate > %10
- Job queue birikimi > 500 iş
- Redis memory > %80
- Günlük AI maliyeti > $700 (limit %82)
- Yeni kullanıcı kaydı 0 (2 saat)
```

### P2 — İş Günü İçinde (Slack #alerts-warning)
```yaml
- Test coverage < %80
- Bundle size %10 arttı
- Slow queries > 10 adet/saat
- Cache miss rate > %30
- Disk > %75
```

---

## 📊 Kritik Dashboard'lar

### 1. İşletme Dashboard'u (Gerçek Zamanlı)
```
┌─────────────────────────────────────────────┐
│  AKTİF KULLANICILAR    BUGÜNKÜ VİDEOLAR     │
│       1,247            8,432                 │
├─────────────────────────────────────────────┤
│  AKTIF RENDER JOBLAR   QUEUE DERINLIGI       │
│       89               127                  │
├─────────────────────────────────────────────┤
│  AI MALİYETİ (BUGÜN)   ERROR RATE           │
│       $412.50          %0.3                  │
└─────────────────────────────────────────────┘
```

### 2. AI Provider Dashboard'u
- Her provider için başarı oranı
- Ortalama render süresi per provider
- Maliyet per video per provider
- Fallback tetiklenme sayısı

### 3. Gelir Dashboard'u
- Anlık MRR
- Bugün yeni abonelik
- Bugün churn
- Plan dağılımı

---

## 🔄 Incident Response Playbook

### Servis Çökmesi (P0)
```
T+0:  Alert alındı
T+2:  Oncall mühendis müdahale etti
T+5:  İlk tespit yapıldı (rollback mı, patch mi?)
T+15: Karar verildi ve uygulandı
T+30: Servis kurtarıldı, izleme devam
T+60: Post-mortem başladı
T+24s: Post-mortem raporu yayınlandı
```

### Post-Mortem Şablonu
```markdown
# Incident #[ID] — [Başlık]

## Özet
- Başlangıç: [Tarih/Saat]
- Tespit: [Tarih/Saat]
- Çözüm: [Tarih/Saat]
- Toplam süre: X dakika
- Etkilenen kullanıcı: ~X

## Zaman Çizelgesi
[Dakika dakika ne oldu]

## Kök Neden
[Teknik açıklama]

## Neden Daha Erken Yakalanmadı?
[Analiz]

## Düzeltici Aksiyonlar
| Aksiyon | Sorumlu | Tarih |
```

---
*Bu doküman DevOps Agent + Analytics Agent tarafından yönetilir.*
