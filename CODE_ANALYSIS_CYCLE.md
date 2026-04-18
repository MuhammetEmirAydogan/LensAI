# 🔄 LensAI — CODE ANALYSIS CYCLE

## Amaç
Bu doküman, kodun kalitesini sürekli yüksek tutmak için uygulanan döngüsel analiz protokolünü tanımlar. Her döngü otomatik araçlar + ajan incelemeleri kombinasyonuyla gerçekleşir.

---

## 📅 Analiz Döngüleri

### Döngü 1 — Pre-commit (Her commit'te)
```bash
# Otomatik çalışır (Husky pre-commit hook)

1. ESLint / Pylint → Kod kalite kontrolü
2. Prettier → Format kontrolü
3. TypeScript → Tip kontrolü
4. GitLeaks → Secret detection
5. Unit testler → Etkilenen dosyalar
6. Import sort → Düzensiz import tespiti
```

**Başarısız olursa:** Commit engellenir, geliştirici düzeltir.

---

### Döngü 2 — Pull Request (Her PR'da)
```bash
# GitHub Actions otomatik çalışır

1. Tam test suite çalıştır (unit + integration)
2. Test coverage raporu oluştur (>%80 zorunlu)
3. Bundle size analizi (regression tespiti)
4. Lighthouse CI (>90 zorunlu)
5. OWASP dependency check
6. Docker image build testi
7. API schema değişiklik tespiti (breaking change?)
8. Database migration validasyonu
```

**Başarısız olursa:** PR merge edilemez.

**Ajan İncelemesi:**
- Testing Agent → Test kalitesi ve coverage
- Security Agent → Güvenlik açıkları
- Performance Agent → Bundle/response time etkisi

---

### Döngü 3 — Haftalık Derin Analiz (Her Pazartesi)

#### 3A. Statik Kod Analizi
```bash
# SonarQube / CodeClimate ile

- Kod tekrarı (duplication) tespiti
- Kompleksite analizi (cyclomatic complexity)
- Teknik borç hesaplama
- Code smell tespiti
- Dead code analizi
```

#### 3B. Dependency Audit
```bash
npm audit --audit-level=moderate
pip-audit
snyk test
# Tüm High/Critical vulnler raporlanır
```

#### 3C. Performance Profiling
```bash
# k6 ile yük testi (staging ortamında)
- API endpoint response time profili
- AI servis latency analizi
- Database query yavaş sorgu raporu (>100ms)
- Redis hit/miss oranı analizi
- Memory kullanım trendi
```

#### 3D. AI Maliyet Analizi
```bash
# AI Agent tarafından yürütülür
- Kling API harcaması (son 7 gün)
- GPT-4o token kullanımı
- Remove.bg API kullanımı
- Maliyet/kullanıcı hesabı
- Anomali tespiti (beklenmedik artış?)
```

**Çıktı:** Haftalık Analiz Raporu → Orchestrator'a iletilir

---

### Döngü 4 — Sprint Sonu Retrospektif (2 Haftada Bir)

#### 4A. Kod Kalite Skorkartı
```
Metrik                    | Hedef | Mevcut | Trend
--------------------------|-------|--------|------
Test Coverage             | >%80  | -      | -
Teknik Borç (gün)         | <5    | -      | -
Kritik Bug Sayısı         | 0     | -      | -
P1 Açık Issue Sayısı      | <3    | -      | -
Ortalama PR Review Süresi | <24s  | -      | -
Deploy Sıklığı            | >3/h  | -      | -
MTTR                      | <2s   | -      | -
```

#### 4B. Mimari Sağlık Kontrolü
- Circular dependency var mı?
- Servis boyutları kabul edilebilir mi?
- API breaking change log güncel mi?
- Kullanılmayan endpoint var mı?

#### 4C. Güvenlik Durumu
- Açık CVE var mı?
- Son penetrasyon testi ne zaman?
- Secret rotation yapıldı mı?

---

### Döngü 5 — Aylık Mimari Review (Her Ayın 1'i)

**Orchestrator Agent koordinasyonunda tüm ajanlar katılır:**

1. **Teknik Borç Değerlendirmesi**
   - Birikmiş teknik borç listesi
   - Önceliklendirme ve çözüm planı
   - Refactoring sprint planlaması

2. **Ölçeklenme Analizi**
   - Mevcut trafik trendleri
   - Darboğaz tespiti
   - Kapasite planlaması

3. **Teknoloji Radar Güncellemesi**
   - Kullanılan kütüphanelerin güncel sürüm analizi
   - Yeni teknoloji değerlendirme
   - Deprecation listesi güncelleme

4. **ADR (Architecture Decision Record) Güncellemesi**
   - Yeni mimari kararlar belgelenir
   - Eski kararların geçerliliği sorgulanır

---

## 🛠️ Analiz Araçları

### Statik Analiz
| Araç | Dil | Amaç |
|------|-----|------|
| ESLint | TypeScript/JS | Kod kalitesi |
| Pylint | Python | Kod kalitesi |
| SonarQube | Çok dilli | Kapsamlı analiz |
| TypeScript Compiler | TypeScript | Tip güvenliği |

### Güvenlik
| Araç | Amaç |
|------|------|
| GitLeaks | Secret detection |
| Snyk | Dependency vulns |
| Trivy | Container scan |
| OWASP ZAP | Web app scan |
| npm audit | Node.js vulns |
| pip-audit | Python vulns |

### Performans
| Araç | Amaç |
|------|------|
| k6 | Yük testi |
| Lighthouse CI | Frontend perf |
| webpack-bundle-analyzer | Bundle analiz |
| clinic.js | Node.js profiling |
| py-spy | Python profiling |
| EXPLAIN ANALYZE | PostgreSQL query |

### Coverage
| Araç | Amaç |
|------|------|
| Vitest Coverage (v8) | JS/TS coverage |
| pytest-cov | Python coverage |
| Codecov | Coverage raporlama |

---

## 📊 Analiz Raporu Formatı

Her analiz döngüsü sonunda şu formatta rapor üretilir:

```markdown
# Kod Analiz Raporu — [TARİH] — [DÖNGÜ TÜRÜ]

## Özet
- Durum: 🟢 Sağlıklı / 🟡 Dikkat / 🔴 Kritik
- Önceki döngüye göre: [İyileşti/Kötüleşti/Değişmedi]

## Bulgular

### Kritik (Hemen Aksiyon)
1. [Bulgu]: [Etki] → [Önerilen çözüm]

### Önemli (Bu Sprint)
1. [Bulgu]: [Etki] → [Önerilen çözüm]

### Düşük Öncelik (Backlog)
1. [Bulgu]: [Etki] → [Önerilen çözüm]

## Metrikler
[Tablo]

## Sonraki Adımlar
[Liste]
```

---

## 🚨 Otomatik Uyarı Eşikleri

| Metrik | Uyarı | Kritik |
|--------|-------|--------|
| Test coverage | <%80 | <%70 |
| Bundle size artışı | >%10 | >%25 |
| API p95 response | >500ms | >1s |
| DB query süresi | >100ms | >500ms |
| Memory kullanımı | >%75 | >%90 |
| Error rate | >%1 | >%5 |
| AI API maliyeti | +%30/gün | +%100/gün |

---
*Bu döngüler Testing Agent + Performance Agent + Security Agent tarafından yürütülür. Raporlar Orchestrator Agent'a iletilir.*
