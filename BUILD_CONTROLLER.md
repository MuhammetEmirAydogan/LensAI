# 🏗️ LensAI — BUILD CONTROLLER

## Amaç
Build Controller, projenin her katmanının doğru sırayla, doğru bağımlılıklarla inşa edildiğini garanti eden merkezi kontrol mekanizmasıdır. Her adım tamamlanmadan bir sonrakine geçilemez.

---

## 🔒 Geçiş Kuralları

> **KURAL #1:** Her blok içindeki tüm görevler ✅ olmadan bir sonraki bloğa GEÇİLEMEZ.
> **KURAL #2:** Her bloğun çıktısı Security Agent tarafından taranır.
> **KURAL #3:** Her bloğun sonunda Orchestrator onayı zorunludur.
> **KURAL #4:** Herhangi bir ❌ durumu tüm süreci durdurur.

---

## 📦 BLOK 0 — TEMEL ALTYAPI
*Hiçbir geliştirme bu blok tamamlanmadan başlayamaz.*

```
[ ] Monorepo yapısı kuruldu (Turborepo)
[ ] Docker Compose çalışıyor
[ ] Environment yönetimi tanımlandı (.env şablonları)
[ ] GitHub repo & koruma kuralları aktif
[ ] Temel CI/CD pipeline çalışıyor
[ ] AWS hesabı & IAM rolleri tanımlandı
[ ] S3 bucket'lar oluşturuldu
[ ] Secrets manager yapılandırıldı

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 0 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 1 — VERİTABANI KATMANI
*Blok 0 tamamlanmadan başlanamaz.*

```
[ ] PostgreSQL şema tasarımı onaylandı
[ ] Tüm migration'lar oluşturuldu ve test edildi
[ ] Prisma ORM yapılandırıldı
[ ] Redis cluster kuruldu
[ ] MongoDB Atlas bağlandı
[ ] Pinecone vector DB bağlandı
[ ] Backup stratejisi aktif
[ ] Database monitoring kuruldu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 1 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 2 — AUTH & GÜVENLİK KATMANI
*Blok 1 tamamlanmadan başlanamaz.*

```
[ ] Clerk entegrasyonu tamamlandı
[ ] JWT middleware aktif
[ ] RBAC sistemi kuruldu
[ ] Rate limiting aktif
[ ] CORS politikası tanımlandı
[ ] Helmet.js güvenlik başlıkları aktif
[ ] API key yönetim sistemi kuruldu
[ ] Security Agent ilk tarama yaptı ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 2 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 3 — CORE API KATMANI
*Blok 2 tamamlanmadan başlanamaz.*

```
[ ] API Gateway servisi kuruldu
[ ] Kullanıcı CRUD endpoint'leri
[ ] Proje CRUD endpoint'leri
[ ] Dosya upload endpoint'leri
[ ] Subscription yönetim endpoint'leri
[ ] Webhook endpoint'leri
[ ] API dokümantasyonu (Swagger) tamamlandı
[ ] Integration testler geçiyor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 3 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 4 — AI SERVİSİ KATMANI
*Blok 3 tamamlanmadan başlanamaz.*

```
[ ] FastAPI servisi kuruldu
[ ] Görsel maskeleme servisi (SAM2 + Remove.bg)
[ ] Ürün sınıflandırma servisi
[ ] Prompt motoru (GPT-4o) entegrasyonu
[ ] Kling AI video üretim servisi
[ ] Job queue sistemi (BullMQ) kuruldu
[ ] Real-time durum güncellemesi (Socket.io)
[ ] Fallback mekanizması test edildi
[ ] AI output kalite kontrol sistemi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 4 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 5 — FRONTEND KATMANI
*Blok 4 tamamlanmadan başlanamaz.*

```
[ ] Next.js 14 kurulumu tamamlandı
[ ] Design system & Tailwind yapılandırması
[ ] Auth flow sayfaları (login/register/forgot)
[ ] Dashboard ana sayfası
[ ] Drag & drop upload bileşeni
[ ] Video stüdyo sayfası
[ ] Real-time render durum ekranı
[ ] Video önizleme oynatıcısı
[ ] Pricing & checkout sayfası
[ ] Ayarlar & profil sayfaları
[ ] Responsive test tamamlandı
[ ] Lighthouse skoru >90

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 5 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 6 — ÖDEME & ABONELİK
*Blok 5 tamamlanmadan başlanamaz.*

```
[ ] Stripe entegrasyonu tamamlandı
[ ] Plan yönetimi (Free/Starter/Pro/Agency)
[ ] Kullanım limiti sistemi
[ ] Fatura oluşturma
[ ] Webhook (ödeme başarılı/başarısız)
[ ] Upgrade/downgrade akışı
[ ] Deneme süresi yönetimi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 6 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 7 — TEST & KALİTE KAPISI
*Blok 6 tamamlanmadan başlanamaz.*

```
[ ] Unit test coverage >%80
[ ] Integration testler tamamlandı
[ ] E2E testler (Playwright) tamamlandı
[ ] Performance testleri (k6) geçti
[ ] Security penetration testi tamamlandı
[ ] Accessibility audit tamamlandı
[ ] Cross-browser test tamamlandı

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 7 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 8 — PRODUCTION DEPLOYMENT
*Blok 7 tamamlanmadan başlanamaz.*

```
[ ] Kubernetes manifests tamamlandı
[ ] Production environment variables ayarlandı
[ ] SSL sertifikaları yapılandırıldı
[ ] CDN yapılandırması tamamlandı
[ ] Monitoring & alerting aktif (Datadog)
[ ] Error tracking aktif (Sentry)
[ ] Backup sistemi test edildi
[ ] Rollback planı hazır
[ ] Load balancer yapılandırıldı
[ ] DNS yapılandırması tamamlandı

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 8 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 BLOK 9 — LAUNCH KONTROL
*Blok 8 tamamlanmadan başlanamaz.*

```
[ ] Beta kullanıcı testi tamamlandı
[ ] Onboarding flow test edildi
[ ] Support sistemi hazır
[ ] Landing page yayında
[ ] Analytics tracking aktif
[ ] Marketing email sıraları hazır
[ ] App Store & Play Store başvuruları yapıldı
[ ] KVKK/GDPR dokümantasyonu tamamlandı

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬛ BLOK 9 DURUMU: TAMAMLANMADI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚦 Genel Build Durumu

```
BLOK 0: ⬛ Temel Altyapı
BLOK 1: ⬛ Veritabanı
BLOK 2: ⬛ Auth & Güvenlik
BLOK 3: ⬛ Core API
BLOK 4: ⬛ AI Servisi
BLOK 5: ⬛ Frontend
BLOK 6: ⬛ Ödeme & Abonelik
BLOK 7: ⬛ Test & Kalite
BLOK 8: ⬛ Production Deploy
BLOK 9: ⬛ Launch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 LAUNCH'A HAZIRLIK: %0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Bu dosya yalnızca Orchestrator Agent tarafından güncellenir. Manuel değişiklik yasaktır.*
