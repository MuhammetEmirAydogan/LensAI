# 🧭 LensAI — CONTEXT ROUTER

## Amaç
Bu dosya, AI modelin context window'unu verimli kullanması için tasarlanmıştır. Model bir görev aldığında **ÖNCE bu dosyayı okur**, sonra sadece ilgili dosyaları yükler. Tüm projeyi hafızaya almak yasaktır.

---

## 🚦 ÇALIŞMA PROTOKOLÜ

```
1. Bu dosyayı oku (CONTEXT_ROUTER.md)
2. Görev türünü tespit et (aşağıdaki tablodan)
3. SADECE "Oku" sütunundaki dosyaları yükle
4. İşi bitir
5. İlgili dosyaları güncelle (varsa)
```

> **KURAL:** Görevle ilgisi olmayan dosyaları ASLA okuma. Bu context window israfıdır.

---

## 📋 GÖREV → DOSYA EŞLEŞTİRME TABLOSU

### 🎨 Frontend Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Yeni sayfa/bileşen oluşturma | FRONTEND_SPEC.md | MASTER_PLAN.md |
| UI/UX düzeltme | FRONTEND_SPEC.md | — |
| Animasyon ekleme | FRONTEND_SPEC.md | — |
| Responsive düzeltme | FRONTEND_SPEC.md | — |
| State management | FRONTEND_SPEC.md | BACKEND_SPEC.md (API şekli) |
| Storybook story yazma | FRONTEND_SPEC.md | — |

### ⚙️ Backend Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Yeni API endpoint | BACKEND_SPEC.md, DATABASE_SPEC.md | ERROR_HANDLING.md |
| Middleware ekleme | BACKEND_SPEC.md, SECURITY_AUDIT.md | — |
| Job queue görevi | BACKEND_SPEC.md | TOKEN_USAGE.md |
| Stripe/ödeme işi | BACKEND_SPEC.md, SECURITY_AUDIT.md | — |
| Webhook geliştirme | BACKEND_SPEC.md, API_INTEGRATION_GUIDE.md | — |

### 🤖 AI Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Prompt mühendisliği | STYLE_LIBRARY.md, TOKEN_USAGE.md | BACKEND_SPEC.md |
| Yeni AI provider | TOKEN_USAGE.md, COST_OPTIMIZATION.md | ARCHITECTURE_REVIEW.md |
| Maskeleme servisi | TOKEN_USAGE.md | BACKEND_SPEC.md |
| Video üretim pipeline | TOKEN_USAGE.md, BACKEND_SPEC.md | COST_OPTIMIZATION.md |
| Maliyet optimizasyonu | TOKEN_USAGE.md, COST_OPTIMIZATION.md | — |

### 🗄️ Veritabanı Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Şema değişikliği | DATABASE_SPEC.md | BACKEND_SPEC.md |
| Migration yazma | DATABASE_SPEC.md | — |
| Query optimizasyonu | DATABASE_SPEC.md | MONITORING_ALERTING.md |
| Redis yapısı | DATABASE_SPEC.md | — |
| Index ekleme | DATABASE_SPEC.md | — |

### 🔒 Güvenlik Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Güvenlik denetimi | SECURITY_AUDIT.md | BACKEND_SPEC.md |
| Auth değişikliği | SECURITY_AUDIT.md, BACKEND_SPEC.md | — |
| Penetrasyon testi | SECURITY_AUDIT.md | MONITORING_ALERTING.md |
| GDPR/KVKK uyumluluk | SECURITY_AUDIT.md | DATABASE_SPEC.md |

### 🚀 DevOps Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Docker/K8s işi | CICD_PIPELINE.md | ARCHITECTURE_REVIEW.md |
| CI/CD pipeline | CICD_PIPELINE.md | CODE_ANALYSIS_CYCLE.md |
| Monitoring kurulumu | MONITORING_ALERTING.md | — |
| Environment ayarı | ENV_VARIABLES.md | CICD_PIPELINE.md |
| Production deploy | CICD_PIPELINE.md, BUILD_CONTROLLER.md | SECURITY_AUDIT.md |

### 🧪 Test Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Unit test yazma | TESTING_STRATEGY.md | İlgili SPEC dosyası |
| E2E test yazma | TESTING_STRATEGY.md | FRONTEND_SPEC.md |
| Performance test | TESTING_STRATEGY.md, MONITORING_ALERTING.md | — |
| Test coverage | TESTING_STRATEGY.md, CODE_ANALYSIS_CYCLE.md | — |

### 🔌 Entegrasyon Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Sosyal medya API | API_INTEGRATION_GUIDE.md, BACKEND_SPEC.md | — |
| E-ticaret plugin | API_INTEGRATION_GUIDE.md | BACKEND_SPEC.md |
| Webhook yönetimi | API_INTEGRATION_GUIDE.md, BACKEND_SPEC.md | — |
| SDK geliştirme | API_INTEGRATION_GUIDE.md | — |

### 📊 Analytics Görevleri
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Metrik takibi | MONITORING_ALERTING.md | DATABASE_SPEC.md |
| Dashboard widget | MONITORING_ALERTING.md, FRONTEND_SPEC.md | — |
| A/B test tasarımı | TESTING_STRATEGY.md | — |
| Maliyet analizi | TOKEN_USAGE.md, COST_OPTIMIZATION.md | — |

### 📱 Mobil Görevler
| Görev Türü | Oku | Gerekirse Bak |
|-----------|-----|---------------|
| Mobil ekran geliştirme | MOBILE_SPEC.md | BACKEND_SPEC.md |
| Push notification | MOBILE_SPEC.md | BACKEND_SPEC.md |
| Kamera entegrasyonu | MOBILE_SPEC.md | — |
| App Store yayını | MOBILE_SPEC.md, CICD_PIPELINE.md | — |

---

## 🏗️ PROJE GENELI GÖREVLER

| Görev Türü | Oku |
|-----------|-----|
| Proje durumunu öğrenme | PROGRESS_TRACKER.md, BUILD_CONTROLLER.md |
| Yeni sprint planlama | PROGRESS_TRACKER.md, ORCHESTRATOR_AGENT.md |
| Mimari karar verme | ARCHITECTURE_REVIEW.md, MASTER_PLAN.md |
| Yeni ajan ekleme | AGENT_CAPABILITIES.md, ORCHESTRATOR_AGENT.md |
| Yeni geliştirici onboarding | DEVELOPER_ONBOARDING.md |
| Maliyet kontrolü | TOKEN_USAGE.md, COST_OPTIMIZATION.md |

---

## 📄 DOSYA DİZİNİ (Hızlı Referans)

| Dosya | Boyut | İçerik | Güncelleyen |
|-------|-------|--------|-------------|
| MASTER_PLAN.md | Ana | Proje vizyonu, fazlar, tech stack | Orchestrator |
| PROGRESS_TRACKER.md | Ana | Görev durumları, KPI'lar | Orchestrator |
| ORCHESTRATOR_AGENT.md | Ana | Onay mekanizması, sprint döngüsü | Orchestrator |
| BUILD_CONTROLLER.md | Ana | Blok bazlı build sırası | Orchestrator |
| ARCHITECTURE_REVIEW.md | Mimari | Sistem mimarisi, ADR'ler | Architecture |
| AGENT_CAPABILITIES.md | Ajan | Tüm ajanların yetenekleri | Orchestrator |
| FRONTEND_SPEC.md | Frontend | UI standartları, design system | Frontend Agent |
| MOBILE_SPEC.md | Mobil | Mobil uygulama detayları | Mobile Agent |
| BACKEND_SPEC.md | Backend | API, iş mantığı, queue | Backend Agent |
| DATABASE_SPEC.md | DB | Tüm şemalar, migration kuralları | Database Agent |
| SECURITY_AUDIT.md | Güvenlik | Denetim, politikalar | Security Agent |
| TOKEN_USAGE.md | AI/Maliyet | Token limitleri, bütçe | AI Agent |
| COST_OPTIMIZATION.md | AI/Maliyet | Maliyet düşürme stratejileri | AI + Analytics |
| STYLE_LIBRARY.md | AI/İçerik | Video stil katalogu | AI Agent |
| ERROR_HANDLING.md | Backend | Hata kodları, retry stratejisi | Backend Agent |
| ENV_VARIABLES.md | DevOps | Environment değişkenleri | DevOps Agent |
| TESTING_STRATEGY.md | Test | Test piramidi, stratejiler | Testing Agent |
| CICD_PIPELINE.md | DevOps | CI/CD workflow'ları | DevOps Agent |
| CODE_ANALYSIS_CYCLE.md | Kalite | Analiz döngüleri, araçlar | Testing + Perf |
| MONITORING_ALERTING.md | Ops | İzleme, alert kuralları | DevOps Agent |
| API_INTEGRATION_GUIDE.md | Entegrasyon | Public API kılavuzu | Integration Agent |
| DEVELOPER_ONBOARDING.md | Genel | Yeni geliştirici rehberi | Tüm Ekip |

---

## ⚡ HIZLI KARAR AĞACI

```
Görev ne ile ilgili?
│
├── UI/Tasarım → FRONTEND_SPEC.md
├── Mobil → MOBILE_SPEC.md  
├── API/Endpoint → BACKEND_SPEC.md + DATABASE_SPEC.md
├── AI/Video → TOKEN_USAGE.md + STYLE_LIBRARY.md
├── Veritabanı → DATABASE_SPEC.md
├── Güvenlik → SECURITY_AUDIT.md
├── Deploy/Altyapı → CICD_PIPELINE.md + ENV_VARIABLES.md
├── Test → TESTING_STRATEGY.md
├── Maliyet → TOKEN_USAGE.md + COST_OPTIMIZATION.md
├── Monitoring → MONITORING_ALERTING.md
├── Entegrasyon → API_INTEGRATION_GUIDE.md
├── Proje durumu → PROGRESS_TRACKER.md
└── Genel planlama → MASTER_PLAN.md + ORCHESTRATOR_AGENT.md
```

---
*Bu dosya her yeni MD dosyası eklendiğinde güncellenir. Orchestrator Agent yönetir.*
