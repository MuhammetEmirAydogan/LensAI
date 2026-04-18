# 🔒 LensAI — SECURITY AUDIT

## Amaç
Bu doküman, LensAI platformunun tüm güvenlik açıklarını, denetim protokollerini ve güvenlik standartlarını tanımlar. Security Agent bu dokümanı referans alarak sürekli denetim gerçekleştirir.

---

## 🛡️ Güvenlik Seviyeleri

| Seviye | Renk | Açıklama |
|--------|------|---------|
| P0 — Kritik | 🔴 | Anında aksiyon, deployment durdur |
| P1 — Yüksek | 🟠 | 24 saat içinde çözülmeli |
| P2 — Orta | 🟡 | Sprint içinde çözülmeli |
| P3 — Düşük | 🟢 | Backlog'a alınır |

---

## 🔍 Denetim Alanları

### 1. Authentication & Authorization
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| JWT token süresi <15 dakika mı? | ⬜ | P1 | Access token |
| Refresh token rotation uygulandı mı? | ⬜ | P1 | - |
| RBAC doğru implemente edildi mi? | ⬜ | P0 | - |
| Admin endpoint'leri korumalı mı? | ⬜ | P0 | - |
| Brute-force koruması var mı? | ⬜ | P1 | Rate limiting |
| Şifreler bcrypt ile hashleniyor mu? | ⬜ | P0 | min 12 round |
| OAuth PKCE uygulandı mı? | ⬜ | P1 | - |
| Session fixation koruması? | ⬜ | P1 | - |

### 2. API Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| Tüm endpoint'lerde auth middleware var mı? | ⬜ | P0 | - |
| Input validation (Zod/Joi) uygulandı mı? | ⬜ | P0 | - |
| SQL injection koruması var mı? | ⬜ | P0 | Prisma ORM |
| NoSQL injection koruması? | ⬜ | P0 | MongoDB |
| Rate limiting aktif mi? | ⬜ | P1 | 100 req/dk/user |
| API versioning uygulandı mı? | ⬜ | P2 | - |
| CORS politikası doğru mu? | ⬜ | P1 | Whitelist |
| Güvenli HTTP başlıkları (Helmet)? | ⬜ | P1 | - |
| Request boyutu sınırı var mı? | ⬜ | P2 | 50MB max |

### 3. Dosya Yükleme Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| Dosya tipi whitelist kontrolü? | ⬜ | P0 | jpg/png/webp |
| Magic byte doğrulaması? | ⬜ | P0 | Sadece extension değil |
| Dosya boyutu sınırı? | ⬜ | P1 | 50MB max |
| Virüs taraması? | ⬜ | P1 | ClamAV |
| Dosyalar public erişimden izole mi? | ⬜ | P0 | S3 private bucket |
| Presigned URL TTL sınırlı mı? | ⬜ | P1 | 15 dakika max |
| Dosya adı sanitasyonu? | ⬜ | P1 | Path traversal |
| Kullanıcı başına kota kontrolü? | ⬜ | P2 | - |

### 4. Veri Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| Hassas veriler şifrelendi mi (at rest)? | ⬜ | P0 | AES-256 |
| TLS 1.3 tüm iletişimde aktif mi? | ⬜ | P0 | - |
| PII verileri maskeleniyor mu (loglarda)? | ⬜ | P1 | - |
| GDPR/KVKK uyumluluğu sağlandı mı? | ⬜ | P1 | - |
| Veri silme politikası var mı? | ⬜ | P2 | Right to deletion |
| Veri şifreleme anahtarı rotasyonu? | ⬜ | P2 | - |
| Veritabanı bağlantısı şifreli mi? | ⬜ | P0 | SSL/TLS |
| Backup veriler şifreli mi? | ⬜ | P1 | - |

### 5. AI Servisi Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| AI API anahtarları güvenli mi? | ⬜ | P0 | Secrets Manager |
| Prompt injection koruması? | ⬜ | P1 | Input sanitizasyon |
| AI çıktı içerik filtresi? | ⬜ | P1 | NSFW filter |
| API maliyet limiti tanımlı mı? | ⬜ | P1 | Budget alert |
| AI servisi timeout yönetimi? | ⬜ | P2 | 5 dk max |
| Model output validasyonu? | ⬜ | P2 | - |

### 6. Ödeme Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| PCI DSS uyumluluğu? | ⬜ | P0 | Stripe yönetir |
| Kart verisi hiç store edilmiyor mu? | ⬜ | P0 | - |
| Stripe webhook imzası doğrulandı mı? | ⬜ | P0 | - |
| İdempotency key kullanılıyor mu? | ⬜ | P1 | - |
| Fraud detection aktif mi? | ⬜ | P1 | Stripe Radar |

### 7. Altyapı Güvenliği
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| VPC yapılandırması doğru mu? | ⬜ | P0 | Private subnets |
| Security Group kuralları minimal mi? | ⬜ | P0 | Principle of least privilege |
| SSH anahtarları rotasyonu? | ⬜ | P1 | - |
| Container image'ları taranıyor mu? | ⬜ | P1 | Trivy |
| Kubernetes RBAC doğru mu? | ⬜ | P1 | - |
| Secrets Kubernetes'te şifreli mi? | ⬜ | P0 | - |
| Network policy tanımlı mı? | ⬜ | P1 | - |
| WAF aktif mi? | ⬜ | P1 | AWS WAF |

### 8. Monitoring & Logging
| Kontrol | Durum | Öncelik | Notlar |
|---------|-------|---------|--------|
| Tüm auth eventleri loglanıyor mu? | ⬜ | P1 | - |
| Log'larda hassas veri yok mu? | ⬜ | P0 | PII maskeleme |
| Anormal aktivite alarmı var mı? | ⬜ | P1 | Datadog |
| Log retention politikası tanımlı mı? | ⬜ | P2 | 90 gün |
| SIEM entegrasyonu? | ⬜ | P2 | - |

---

## 🧪 Penetrasyon Testi Planı

### Faz 1 — Otomatik Tarama (Her Deploy)
```bash
# OWASP ZAP otomatik tarama
# Dependency vulnerability scan (npm audit, safety)
# Container image scan (Trivy)
# Secret detection (GitLeaks)
```

### Faz 2 — Manuel Test (MVP Öncesi)
- SQL Injection testi
- XSS testi
- CSRF testi
- Authentication bypass denemeleri
- File upload bypass denemeleri
- API authorization bypass denemeleri

### Faz 3 — 3. Parti Pentest (Launch Öncesi)
- Profesyonel penetrasyon testi şirketi
- Kapsam: Tüm public API'ler, web uygulaması, mobil uygulama
- Süre: 2 hafta
- Rapor: Executive + Technical

---

## 🚨 Güvenlik Olayı Yanıt Protokolü

### P0 Olay Tespiti
1. Tüm deployment'ları durdur
2. Etkilenen servisleri izole et
3. Forensics için log snapshot al
4. Kullanıcıları bilgilendir (72 saat içinde — GDPR)
5. Yasal makamları bilgilendir (gerekirse)
6. Root cause analizi yap
7. Patch geliştir ve test et
8. Post-mortem raporu yaz

---

## 📋 Güvenlik Politikaları

### Şifre Politikası
- Minimum 8 karakter
- En az 1 büyük harf, 1 rakam, 1 özel karakter
- Son 5 şifre tekrar kullanılamaz
- 90 günde bir değişim zorlaması (admin hesaplar)

### API Anahtar Politikası
- Tüm API anahtarları AWS Secrets Manager'da
- 90 günde bir otomatik rotasyon
- Kod repository'de asla API anahtarı bulunmayacak
- GitLeaks pre-commit hook aktif

### Dependency Güvenliği
- Haftalık `npm audit` ve `safety check`
- Critical/High vulnerability: 48 saat içinde patch
- Dependabot aktif ve otomatik PR

---

## 🏆 Güvenlik Sertifikasyon Hedefleri

| Sertifika | Hedef Tarih | Durum |
|-----------|-------------|-------|
| SOC 2 Type I | 12. ay | ⬜ |
| ISO 27001 | 18. ay | ⬜ |
| GDPR Uyumluluk | Launch öncesi | ⬜ |
| KVKK Uyumluluk | Launch öncesi | ⬜ |

---
*Bu doküman Security Agent tarafından her sprint sonunda güncellenir.*
