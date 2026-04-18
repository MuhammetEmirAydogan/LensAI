# 🎨 LensAI — FRONTEND SPEC

## Amaç
Bu doküman, LensAI web ve mobil uygulamalarının frontend geliştirme standartlarını, bileşen mimarisini ve UI/UX kurallarını tanımlar.

---

## 🖥️ Web Uygulaması (Next.js 14)

### Tech Stack
```
Framework:      Next.js 14 (App Router)
Dil:            TypeScript (strict mode)
Stil:           Tailwind CSS + Shadcn/UI
Animasyon:      Framer Motion
3D:             React Three Fiber + Drei
State:          Zustand (client) + React Query (server)
Form:           React Hook Form + Zod
Upload:         Uploadthing / react-dropzone
Video:          Video.js / Plyr.js
Real-time:      Socket.io-client
Auth:           Clerk
Ödeme:          Stripe.js + @stripe/react-stripe-js
Icons:          Lucide React
Test:           Vitest + Testing Library + Playwright
```

---

## 🎨 Design System

### Renk Paleti
```css
/* Brand Colors */
--primary:        #7C3AED   /* Mor - Ana renk */
--primary-light:  #A78BFA
--primary-dark:   #5B21B6

/* Accent */
--accent:         #F59E0B   /* Amber - Vurgu */
--accent-light:   #FCD34D

/* Nötr */
--background:     #0A0A0F   /* Koyu arka plan */
--surface:        #13131A
--surface-2:      #1C1C27
--border:         #2D2D3F

/* Metin */
--text-primary:   #F8F8FF
--text-secondary: #9494B8
--text-muted:     #5C5C7A

/* Durum */
--success:        #10B981
--warning:        #F59E0B
--error:          #EF4444
--info:           #3B82F6
```

### Tipografi
```css
/* Font ailesi */
--font-sans:    'Inter Variable', sans-serif
--font-mono:    'JetBrains Mono', monospace
--font-display: 'Cal Sans', sans-serif  /* Başlıklar için */

/* Boyutlar (Tailwind scale) */
xs:   12px
sm:   14px
base: 16px
lg:   18px
xl:   20px
2xl:  24px
3xl:  30px
4xl:  36px
5xl:  48px
6xl:  60px
```

### Spacing & Grid
```
Temel birim: 4px
Container:   max-w-7xl (1280px)
Sidebar:     280px (sabit)
Grid:        12 sütun
Gutter:      24px (desktop), 16px (mobile)
```

### Gölgeler & Efektler
```css
/* Glow efektleri */
--glow-primary: 0 0 40px rgba(124, 58, 237, 0.3)
--glow-accent:  0 0 40px rgba(245, 158, 11, 0.3)

/* Card shadows */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.4)
--shadow-md:  0 4px 16px rgba(0,0,0,0.5)
--shadow-lg:  0 8px 32px rgba(0,0,0,0.6)
```

---

## 📱 Sayfa Yapısı (App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
│
├── (dashboard)/
│   ├── layout.tsx              # Sidebar + header
│   ├── page.tsx                # Ana dashboard
│   ├── projects/
│   │   ├── page.tsx            # Proje listesi
│   │   ├── new/page.tsx        # Yeni proje
│   │   └── [id]/
│   │       ├── page.tsx        # Proje detayı
│   │       └── studio/page.tsx # Video stüdyo
│   ├── library/page.tsx        # Video kütüphanesi
│   ├── analytics/page.tsx      # Analytics
│   ├── integrations/page.tsx   # Sosyal medya bağlantıları
│   └── settings/
│       ├── page.tsx            # Genel ayarlar
│       ├── billing/page.tsx    # Fatura & abonelik
│       ├── brand/page.tsx      # Marka kiti
│       └── team/page.tsx       # Takım yönetimi
│
├── (marketing)/
│   ├── page.tsx                # Landing page
│   ├── pricing/page.tsx
│   ├── blog/page.tsx
│   └── changelog/page.tsx
│
└── api/
    ├── webhooks/stripe/route.ts
    └── [...trpc]/route.ts
```

---

## 🧩 Temel Bileşenler

### Upload Bileşeni
```typescript
// components/upload/UploadZone.tsx
interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;        // default: 10
  maxSize?: number;         // default: 50MB
  accept?: string[];        // default: ['jpg', 'png', 'webp']
  multiple?: boolean;
}

// Özellikler:
// - Drag & drop
// - Click to browse
// - Preview thumbnails
// - Upload progress bar
// - File validation (type, size)
// - Error states
```

### Video Stüdyo
```typescript
// components/studio/VideoStudio.tsx
interface VideoStudioProps {
  projectId: string;
  initialImage: string;
}

// Paneller:
// 1. Sol: Görsel önizleme + maskeleme kontrol
// 2. Orta: Stil seçici (50+ stil kartı)
// 3. Sağ: Prompt editörü + ayarlar
// Alt: Render butonu + geçmiş
```

### Render Durum Ekranı
```typescript
// Aşamalar:
type RenderStage = 
  | 'uploading'      // Yükleniyor
  | 'masking'        // Arka plan kaldırılıyor
  | 'classifying'    // Ürün tanınıyor
  | 'prompting'      // Prompt oluşturuluyor
  | 'generating'     // Video üretiliyor
  | 'processing'     // Son işlemler
  | 'completed'      // Tamamlandı
  | 'failed'         // Hata

// Gerçek zamanlı Socket.io ile güncelleme
// Tahmini süre göstergesi
// Animasyonlu progress bar
```

---

## 📊 Sayfa Özellikleri

### Dashboard Ana Sayfa
- Son 5 proje kartları
- Kullanım istatistikleri (doughnut chart)
- Hızlı aksiyon butonları
- Son aktivite feed
- Plan durumu widget'ı

### Video Stüdyo
- Sol panel: Fotoğraf + maskeleme önizleme
- Orta: Stil şablonları grid (hover'da video preview)
- Sağ: Prompt editörü, aspect ratio, FPS, duration
- Real-time render durumu
- Geçmiş videoların listesi (sağ alt köşe)

### Analytics Sayfası
- Video performans metrikleri (Line chart)
- Platform bazlı dağılım (Bar chart)
- Viral skor dağılımı (Heatmap)
- En iyi performans gösteren videolar
- Stil bazlı başarı analizi

---

## 📱 Mobil Uygulama (React Native)

### Tech Stack
```
Framework:  React Native (Expo SDK 51)
Navigasyon: Expo Router (file-based)
Stil:       NativeWind (Tailwind for RN)
State:      Zustand + React Query
Kamera:     expo-camera
Bildirim:   expo-notifications
Dosya:      expo-file-system
Depolama:   expo-secure-store
```

### Ekran Yapısı
```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
│
└── (tabs)/
    ├── _layout.tsx       # Tab navigator
    ├── index.tsx         # Ana feed
    ├── camera.tsx        # Fotoğraf çek
    ├── library.tsx       # Video kütüphanesi
    └── profile.tsx       # Profil & ayarlar
```

### Mobil UX Kararları
- Kamera ekranı fullscreen, iOS/Android native camera API
- Video render başlayınca uygulama kapatılabilir (push notification gelir)
- Swipe gesture ile stil değiştirme
- Haptic feedback önemli aksiyonlarda
- Dark mode only (marka kararı)

---

## ✅ Frontend Kalite Standartları

### Performance
- [ ] Lighthouse Performance > 90
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Bundle size < 200KB (initial JS)
- [ ] Image lazy loading aktif
- [ ] Font subsetting uygulandı

### Erişilebilirlik
- [ ] WCAG 2.1 AA uyumlu
- [ ] Tüm interactive elementlerde keyboard navigasyon
- [ ] Screen reader uyumlu (aria-label'lar)
- [ ] Renk kontrast oranı ≥ 4.5:1
- [ ] Focus indicator visible

### Kod Kalitesi
- [ ] TypeScript strict mode, sıfır hata
- [ ] ESLint kurallarına tam uyum
- [ ] Prettier ile formatlanmış
- [ ] Bileşenler < 200 satır (gerekirse ayır)
- [ ] Custom hook'lar mantığı bileşenden ayırıyor

---
*Bu doküman Frontend Agent tarafından her sprint güncellenir.*
