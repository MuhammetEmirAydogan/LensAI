# 🚀 LensAI — DEVELOPER ONBOARDING

## Yeni Geliştirici Başlangıç Kılavuzu

### Gün 1 — Ortam Kurulumu

```bash
# Gereksinimler
node >= 20.0.0
python >= 3.11
docker >= 24.0
git >= 2.40

# Repo klonlama
git clone https://github.com/lensai/lensai.git
cd lensai

# Bağımlılıklar
npm install        # tüm workspace bağımlılıkları
pip install -r services/ai-service/requirements.txt

# Environment dosyaları
cp .env.example .env.local
# .env.local'ı doldur (takımdan API key'leri al)

# Docker ile servisleri başlat
docker compose up -d postgres redis mongodb

# Veritabanı kurulumu
npm run db:migrate
npm run db:seed

# Tüm servisleri başlat
npm run dev
```

### Gün 2 — Mimari Anlama
- [ ] MASTER_PLAN.md oku
- [ ] ARCHITECTURE_REVIEW.md oku
- [ ] AGENT_CAPABILITIES.md oku
- [ ] ORCHESTRATOR_AGENT.md oku
- [ ] Kendi uzmanlık ajanının dosyasını oku

### Gün 3 — İlk Görev
- [ ] PROGRESS_TRACKER.md'den açık görev seç
- [ ] İlgili spec dosyasını oku
- [ ] Feature branch aç: `feature/your-task-name`
- [ ] Görevi implement et
- [ ] Test yaz
- [ ] PR aç

---

## 📁 Proje Dokümantasyon Yapısı

> **NOT:** Tüm dokümantasyon dosyaları proje root dizinindedir.

```
LensAI/
├── 🧠 CONTEXT_ROUTER.md        ← İLK OKU: Göreve göre hangi dosyayı oku
├── 📋 MASTER_PLAN.md           ← Proje vizyonu, fazlar, tech stack
├── 📊 PROGRESS_TRACKER.md      ← Canlı ilerleme takibi
├── 🧠 ORCHESTRATOR_AGENT.md    ← Ana ajan ve onay mekanizması
├── 🏗️  BUILD_CONTROLLER.md      ← Blok bazlı yapım kontrolü
├── 🤖 AGENT_CAPABILITIES.md    ← Ajan ekosistemi ve yetenekleri
├── 🔄 CODE_ANALYSIS_CYCLE.md   ← Kod analiz döngüleri
├── 🎨 FRONTEND_SPEC.md         ← Web frontend standartları
├── 📱 MOBILE_SPEC.md           ← Mobil uygulama spesifikasyonu
├── ⚙️  BACKEND_SPEC.md          ← API & backend standartları
├── 🗄️  DATABASE_SPEC.md         ← Veritabanı şemaları
├── 🔒 SECURITY_AUDIT.md        ← Güvenlik denetimi
├── 🏛️  ARCHITECTURE_REVIEW.md   ← Sistem mimarisi & ADR
├── 💰 TOKEN_USAGE.md           ← AI token/maliyet yönetimi
├── 💸 COST_OPTIMIZATION.md     ← Maliyet düşürme stratejileri
├── 🎬 STYLE_LIBRARY.md         ← Video stil kütüphanesi
├── ❌ ERROR_HANDLING.md        ← Hata kodları ve retry
├── 🔐 ENV_VARIABLES.md         ← Environment değişkenleri
├── 🧪 TESTING_STRATEGY.md      ← Test stratejisi & piramidi
├── 🔗 API_INTEGRATION_GUIDE.md ← Public API kılavuzu
├── 🔄 CICD_PIPELINE.md         ← CI/CD pipeline
├── 📡 MONITORING_ALERTING.md   ← İzleme ve alarmlar
└── 🚀 DEVELOPER_ONBOARDING.md  ← Bu dosya
```

---

## ❓ Troubleshooting (Sık Karşılaşılan Sorunlar)

### Docker servisleri başlatamıyorum
```bash
# Port çakışması kontrolü
netstat -tln | grep -E '5432|6379|27017'

# Docker temizlik
docker compose down -v
docker system prune
docker compose up -d
```

### Prisma migration hatası
```bash
# Migration reset (SADECE local)
npx prisma migrate reset
npx prisma generate
npm run db:seed
```

### AI servis bağlanamıyor
```bash
# Python environment kontrolü
cd services/ai-service
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### TypeScript tip hataları
```bash
# Shared types rebuild
npm run build --filter=shared-types
npm run type-check
```

---

## 🛠️ Geliştirici Araçları

### VS Code Uzantıları (Zorunlu)
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.pylint",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### Faydalı Komutlar
```bash
npm run dev          # Tüm servisleri başlat
npm run test         # Testleri çalıştır
npm run test:watch   # Watch mode
npm run lint         # Lint kontrolü
npm run type-check   # TypeScript kontrolü
npm run build        # Production build
npm run db:migrate   # Migration çalıştır
npm run db:studio    # Prisma Studio (DB GUI)
npm run storybook    # Storybook başlat
```

---
*Bu doküman tüm geliştiriciler için referans kaynağıdır.*
