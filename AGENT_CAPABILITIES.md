# 🤖 LensAI — AGENT CAPABILITIES

## Ajan Ekosistemi Genel Bakış

LensAI, her biri kendi uzmanlık alanında derinleşmiş 11 yapay zeka ajanından oluşan bir ekiple yönetilir. Her ajan kendi alanında otonom çalışır, ancak tüm kararlar Orchestrator Agent'ın onayından geçer.

---

## 🧠 Orchestrator Agent
**Rol:** Ana koordinatör, onay mekanizması
**Dosya:** `ORCHESTRATOR_AGENT.md`

### Yetenekler
- Tüm ajanların çıktılarını inceler ve onaylar/reddeder
- Sprint planlaması ve görev ataması yapar
- Ajanlar arası çakışmaları çözer
- PROGRESS_TRACKER.md'yi günceller
- Escalation protokollerini yönetir
- Kalite kapılarını (quality gates) denetler

### Karar Verebileceği Konular
- Hangi ajanın hangi görevi yapacağı
- Görev öncelikleri ve sıralaması
- Teknik mimari tartışmalarında final karar
- Production'a geçiş onayı

### Karar Veremeyeceği Konular
- P0 güvenlik açıkları (Security Agent + insan)
- Ödeme sistemi kritik değişiklikler (insan onayı)
- 3. parti API sözleşme değişiklikleri

---

## 🎨 Frontend Agent
**Rol:** Web ve mobil UI geliştirme
**Dosya:** `agents/frontend_agent.md`

### Yetenekler
- Next.js 14 App Router ile sayfa geliştirme
- React Native / Expo mobil ekran geliştirme
- Shadcn/UI + Tailwind ile bileşen oluşturma
- Framer Motion animasyonları
- React Three Fiber 3D elementler
- Zustand store yönetimi
- React Query ile server state
- Lighthouse optimizasyonu
- WCAG 2.1 erişilebilirlik
- Responsive / mobile-first tasarım

### Sorumluluk Sınırı
- API endpoint'leri tanımlayamaz
- Veritabanı şeması değiştiremez
- AI model parametrelerini değiştiremez

### Çıktı Formatı
- Çalışan TypeScript bileşenleri
- Storybook stories
- Component test'leri (Testing Library)
- Güncellenmiş FRONTEND_SPEC.md

---

## ⚙️ Backend Agent
**Rol:** API ve servis geliştirme
**Dosya:** `agents/backend_agent.md`

### Yetenekler
- Express/Fastify REST API endpoint geliştirme
- FastAPI (Python) endpoint geliştirme
- Prisma ORM sorgu yazımı
- BullMQ job tanımlama
- Socket.io event yönetimi
- Stripe entegrasyonu
- Clerk auth middleware
- Zod validasyon şemaları
- API dokümantasyonu (Swagger/OpenAPI)
- Redis cache stratejileri

### Sorumluluk Sınırı
- Veritabanı migration'larını direkt çalıştıramaz
- AI model seçimi yapamaz (AI Agent'a bırakır)
- Kubernetes yapılandırması değiştiremez

### Çıktı Formatı
- TypeScript/Python servis kodları
- Postman/Thunder Client collection
- Integration testleri
- Güncellenmiş API dokümantasyonu

---

## 🤖 AI Agent
**Rol:** Tüm AI/ML entegrasyonları ve prompt mühendisliği
**Dosya:** `agents/ai_agent.md`

### Yetenekler
- Kling AI API entegrasyonu ve yönetimi
- Runway Gen-3 API entegrasyonu
- Luma Dream Machine entegrasyonu
- OpenAI GPT-4o prompt mühendisliği
- SAM2 segmentasyon modeli
- Remove.bg API yönetimi
- Replicate model entegrasyonu
- AI provider router tasarımı
- Maliyet optimizasyonu
- Prompt şablonu kütüphanesi yönetimi
- Video kalite değerlendirme algoritması
- Ürün sınıflandırma sistemi

### Sorumluluk Sınırı
- API Gateway endpoint'i ekleyemez
- Veritabanı şeması değiştiremez
- UI bileşeni yazamaz

### Çıktı Formatı
- Python AI servis kodları
- Prompt şablonları (JSON)
- Model performans raporları
- Maliyet analizi raporları

---

## 🗄️ Database Agent
**Rol:** Tüm veritabanı operasyonları
**Dosya:** `agents/database_agent.md`

### Yetenekler
- PostgreSQL şema tasarımı
- Prisma migration yazımı
- MongoDB koleksiyon tasarımı
- Redis data structure tasarımı
- Pinecone vektör koleksiyon yönetimi
- Query optimizasyonu
- Index stratejisi
- Backup ve recovery planlaması
- ClickHouse analitik schema

### Sorumluluk Sınırı
- Production'da doğrudan migration çalıştıramaz (DevOps onayı gerekli)
- Application kodu yazamaz
- API endpoint tanımlayamaz

### Çıktı Formatı
- SQL migration dosyaları
- Prisma schema güncellemeleri
- Index önerileri raporu
- Query performance analizi

---

## 🔒 Security Agent
**Rol:** Güvenlik denetimi ve penetrasyon testi
**Dosya:** `agents/security_agent.md`

### Yetenekler
- OWASP Top 10 denetimi
- JWT/OAuth güvenlik analizi
- SQL injection, XSS, CSRF taraması
- Dependency vulnerability taraması
- Secret detection (GitLeaks)
- Container image güvenlik taraması (Trivy)
- API güvenlik denetimi
- GDPR/KVKK uyumluluk denetimi
- Penetrasyon testi koordinasyonu
- Security başlıkları denetimi

### Sorumluluk Sınırı
- Güvenlik açıklarını kendisi yamalayamaz (Backend/DevOps Agent'a aktarır)
- Production sistemlere doğrudan erişemez

### Çıktı Formatı
- Güvenlik açığı raporları (öncelik sıralı)
- Güncellenmiş SECURITY_AUDIT.md
- Patch önerileri
- Compliance raporu

---

## 🚀 DevOps Agent
**Rol:** Altyapı, deployment ve CI/CD
**Dosya:** `agents/devops_agent.md`

### Yetenekler
- Docker containerization
- Kubernetes manifest yazımı
- Terraform IaC
- GitHub Actions workflow
- AWS servis yapılandırması (EC2, RDS, S3, CloudFront)
- Nginx/Load balancer yapılandırması
- Monitoring kurulumu (Datadog, Sentry)
- Auto-scaling politikaları
- SSL sertifika yönetimi
- Disaster recovery planlaması

### Sorumluluk Sınırı
- Application kodu değiştiremez
- Veritabanı şeması değiştiremez
- Production deployment için Orchestrator + Security Agent onayı zorunlu

### Çıktı Formatı
- Docker/Kubernetes YAML dosyaları
- Terraform planları
- CI/CD workflow dosyaları
- Runbook dökümanları

---

## 🧪 Testing Agent
**Rol:** Tüm test yazımı ve QA süreçleri
**Dosya:** `agents/testing_agent.md`

### Yetenekler
- Vitest unit test yazımı
- Supertest integration test yazımı
- Playwright E2E test yazımı
- k6 performance test yazımı
- Test coverage analizi
- Bug raporlama ve önceliklendirme
- Test data factory oluşturma
- Mock ve stub yönetimi
- CI pipeline'a test entegrasyonu
- Accessibility test (axe-core)

### Sorumluluk Sınırı
- Bug'ları kendisi düzeltemez
- Test'leri geçmesi için prodüksiyon kodunu değiştiremez

### Çıktı Formatı
- Test dosyaları
- Coverage raporları
- Bug raporları (öncelik sıralı)
- Test stratejisi dokümanı

---

## 🔌 Integration Agent
**Rol:** 3. parti servis entegrasyonları
**Dosya:** `agents/integration_agent.md`

### Yetenekler
- Instagram Graph API entegrasyonu
- TikTok for Developers API
- YouTube Data API v3
- Shopify App entegrasyonu
- WooCommerce REST API
- Zapier webhook entegrasyonu
- OAuth 2.0 flow implementasyonu
- Webhook yönetimi
- API rate limit yönetimi
- Trendyol API entegrasyonu

### Sorumluluk Sınırı
- Temel platform kodunu değiştiremez
- Veritabanı şeması değiştiremez

### Çıktı Formatı
- Entegrasyon servisi kodları
- OAuth flow dokümantasyonu
- API mapping dokümanları

---

## 📊 Analytics Agent
**Rol:** Veri analizi, metrik takibi ve raporlama
**Dosya:** `agents/analytics_agent.md`

### Yetenekler
- PostHog event tracking kurulumu
- ClickHouse analitik sorguları
- Viral skor algoritması geliştirme
- A/B test tasarımı ve analizi
- Kullanıcı cohort analizi
- Revenue metrik takibi (MRR, Churn, LTV)
- Video performans skoru hesaplama
- Dashboard widget'ları için veri servisleri
- Anomali tespiti

### Sorumluluk Sınırı
- UI değişikliği yapamaz
- Veritabanı şeması değiştiremez
- Kendi başına A/B test sonuç kararı veremez

### Çıktı Formatı
- Analytics event spesifikasyonu
- SQL/ClickHouse sorguları
- Haftalık metrik raporları
- A/B test sonuç analizi

---

## ⚡ Performance Agent
**Rol:** Sistem ve uygulama optimizasyonu
**Dosya:** `agents/performance_agent.md`

### Yetenekler
- Frontend bundle analizi ve optimizasyonu
- API response time optimizasyonu
- Database query optimizasyonu
- Redis caching stratejisi
- CDN optimizasyonu
- Image/video optimizasyonu
- Memory leak tespiti
- Load test analizi (k6)
- Core Web Vitals optimizasyonu

### Sorumluluk Sınırı
- Sadece öneri yapar, implementasyon ilgili ajana aktarılır
- Production'da doğrudan değişiklik yapamaz

### Çıktı Formatı
- Performans audit raporu
- Optimizasyon önerileri (öncelik sıralı)
- Before/After metrik karşılaştırması

---

## 📱 Mobile Agent
**Rol:** React Native / Expo mobil uygulama geliştirme
**Dosya:** `agents/mobile_agent.md`

### Yetenekler
- React Native (Expo SDK 51) uygulama geliştirme
- Expo Router file-based navigasyon
- NativeWind (Tailwind for RN) ile mobil UI
- expo-camera entegrasyonu
- expo-notifications (push bildirimler)
- react-native-reanimated animasyonlar
- react-native-gesture-handler gesture yönetimi
- expo-av ile video oynatma
- expo-secure-store güvenli depolama
- Offline queue yönetimi
- App Store & Play Store yayın süreçleri
- Expo EAS Build & Submit

### Tetikleme Koşulları
- Mobil ekran ekleme/değiştirme talebi geldiğinde
- Kamera veya native API entegrasyonu gerektiğinde
- Push notification sistemi kurulurken
- App Store/Play Store yayın sürecinde

### Sorumluluk Sınırı
- Backend API endpoint'i tanımlayamaz
- Veritabanı şeması değiştiremez
- Web uygulaması bileşeni yazamaz

### Çıktı Formatı
- React Native bileşenleri (TypeScript)
- Native modül yapılandırmaları
- App Store/Play Store asset'leri
- Güncellenmiş MOBILE_SPEC.md

---

## 🔄 Ajan İşbirliği Matrisi

| Görev | Birincil Ajan | Destek Ajan | Onay |
|-------|---------------|-------------|------|
| Yeni özellik geliştirme | Frontend/Backend | Testing | Orchestrator |
| AI model değişikliği | AI Agent | Backend, Security | Orchestrator |
| Veritabanı migration | Database | Backend, DevOps | Orchestrator |
| Production deploy | DevOps | Security, Testing | Orchestrator |
| Güvenlik açığı patch | Security | Backend/DevOps | Orchestrator |
| Yeni entegrasyon | Integration | Backend, Security | Orchestrator |
| Performance sorunu | Performance | Backend/Database | Orchestrator |

---
*Bu doküman Orchestrator Agent tarafından yönetilir.*
