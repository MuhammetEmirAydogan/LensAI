# 📱 LensAI — MOBILE SPEC

## Amaç
Bu doküman, LensAI mobil uygulamasının (React Native / Expo) detaylı teknik spesifikasyonunu, ekran akışlarını, native API entegrasyonlarını ve mobil-özel UX kararlarını tanımlar.

---

## 🛠️ Tech Stack

```
Framework:      React Native 0.75+ (Expo SDK 51)
Router:         Expo Router v3 (file-based routing)
Stil:           NativeWind v4 (Tailwind for RN)
State:          Zustand (client) + TanStack Query (server)
Kamera:         expo-camera v15
Bildirim:       expo-notifications
Dosya:          expo-file-system + expo-media-library
Güvenli Depo:   expo-secure-store
Animasyon:      react-native-reanimated v3
Gesture:        react-native-gesture-handler
Video Player:   expo-av
İmaj İşleme:    expo-image-manipulator
Auth:           Clerk Expo SDK
Analytics:      PostHog React Native
Error Tracking: Sentry React Native
```

---

## 📱 Ekran Yapısı

```
app/
├── _layout.tsx                  # Root layout (Providers)
│
├── (auth)/
│   ├── _layout.tsx              # Auth stack layout
│   ├── welcome.tsx              # Onboarding carousel (ilk açılış)
│   ├── login.tsx                # E-posta + şifre giriş
│   └── register.tsx             # Kayıt formu
│
├── (tabs)/
│   ├── _layout.tsx              # Tab navigator (Bottom tabs)
│   │
│   ├── (home)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Ana feed — son üretimler
│   │   └── [projectId].tsx      # Proje detay
│   │
│   ├── create/
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Kameradan çek veya galeriden seç
│   │   ├── edit.tsx             # Maskeleme önizleme + kırpma
│   │   ├── style.tsx            # Stil seçimi (horizontal scroll)
│   │   ├── settings.tsx         # Prompt/ayar düzenleme
│   │   └── generating.tsx       # Render bekleme animasyonu
│   │
│   ├── library/
│   │   ├── _layout.tsx
│   │   └── index.tsx            # Video kütüphanesi (grid)
│   │
│   └── profile/
│       ├── _layout.tsx
│       ├── index.tsx            # Profil + kullanım istatistikleri
│       ├── settings.tsx         # Uygulama ayarları
│       ├── subscription.tsx     # Plan & fatura
│       └── brand-kit.tsx        # Marka kiti yönetimi
│
└── modal/
    ├── video-player.tsx         # Fullscreen video oynatıcı
    ├── share.tsx                # Sosyal medya paylaşım sayfası
    └── notification-settings.tsx # Bildirim tercihleri
```

---

## 🎨 Design Tokens (Mobil)

```typescript
export const mobileTheme = {
  colors: {
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    background: '#0A0A0F',
    surface: '#13131A',
    surfaceElevated: '#1C1C27',
    border: '#2D2D3F',
    text: '#F8F8FF',
    textSecondary: '#9494B8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
  },
  borderRadius: {
    sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter-Bold' },
    h2: { fontSize: 22, fontWeight: '600', fontFamily: 'Inter-SemiBold' },
    body: { fontSize: 16, fontWeight: '400', fontFamily: 'Inter-Regular' },
    caption: { fontSize: 13, fontWeight: '400', fontFamily: 'Inter-Regular' },
  },
};
```

---

## 📸 Kamera Akışı

### Kamera Ekranı
```typescript
interface CameraConfig {
  type: 'back';                    // Sadece arka kamera
  ratio: '4:3';                   // Ürün fotoğrafı için en iyi oran
  flashMode: 'auto';
  autoFocus: true;
  stabilization: true;
  quality: 0.9;                    // JPEG kalitesi
  maxResolution: { width: 2048, height: 2048 };
  
  // Overlay
  gridLines: true;                 // Kılavuz çizgileri
  centerCrosshair: true;           // Merkez hedef
  productFrame: true;              // "Ürünü buraya yerleştir" çerçevesi
}
```

### Fotoğraf İşleme Pipeline (Mobil)
```
Çekim → Kırpma (isteğe bağlı) → Sıkıştırma → Upload
  │
  ├── Otomatik kırpma önerisi (AI-assisted crop)
  ├── Parlaklık/kontrast ayarı
  └── Arka plan tespit önizlemesi
```

---

## 🔔 Push Notification Yapısı

### Notification Tipleri
```typescript
type NotificationType =
  | 'render_started'       // Video üretimi başladı
  | 'render_completed'     // Video hazır ↓ İNDİR
  | 'render_failed'        // Video üretim hatası
  | 'plan_expiring'        // Plan bitiyor (3 gün kala)
  | 'usage_warning'        // Kota %80 kullanıldı
  | 'new_style'            // Yeni stil kütüphanede
  | 'weekly_report'        // Haftalık performans özeti
  | 'social_published';    // Sosyal medyada paylaşıldı

interface PushPayload {
  type: NotificationType;
  title: string;
  body: string;
  data: {
    screen: string;        // Tıklandığında açılacak ekran
    params: Record<string, string>;
  };
  badge?: number;
  sound?: 'default' | 'success' | 'alert';
}
```

### Örnek Push Payload'lar
```json
{
  "type": "render_completed",
  "title": "Videon hazır! 🎬",
  "body": "\"Cinematic Luxury\" stilinde videon tamamlandı",
  "data": {
    "screen": "modal/video-player",
    "params": { "videoId": "vid_abc123" }
  },
  "sound": "success"
}
```

---

## 📲 Gesture & Animasyon

### Stil Seçim Ekranı
```typescript
// Horizontal carousel + TikTok-style swipe
const StyleSelector = {
  gesture: 'horizontal-swipe',
  animation: {
    enter: 'spring({ damping: 15, stiffness: 150 })',
    exit: 'fadeOutLeft(200)',
    preview: 'scale(1.05) on long-press' // Uzun basınca büyüt + video preview
  },
  haptics: {
    onSelect: 'impactLight',
    onSwipe: 'selectionChanged',
    onConfirm: 'notificationSuccess'
  }
};
```

### Render Bekleme Ekranı
```typescript
// Animasyonlu bekleme ekranı
const RenderWaiting = {
  stages: [
    { id: 'uploading', icon: '☁️', animation: 'pulse' },
    { id: 'masking', icon: '✂️', animation: 'scissor-cut' },
    { id: 'classifying', icon: '🔍', animation: 'scan' },
    { id: 'prompting', icon: '✍️', animation: 'typewriter' },
    { id: 'generating', icon: '🎬', animation: 'film-reel' },
    { id: 'processing', icon: '⚡', animation: 'sparkle' },
  ],
  backgroundAnimation: 'gradient-shift',
  showEstimatedTime: true,
  allowBackgroundMode: true  // Uygulamayı kapatabilir
};
```

---

## 📴 Offline Desteği

```typescript
const OfflineStrategy = {
  // Offline'da yapılabilecek
  available: [
    'Galeri görselleri görüntüleme',
    'Fotoğraf çekme (queue\'lanır)',
    'Tamamlanmış videoları izleme (cache\'de varsa)',
    'Profil görüntüleme',
  ],
  
  // Offline'da yapılamayan
  unavailable: [
    'Video üretimi (server gerekli)',
    'Upload (bağlantı gerekli)',
    'Sosyal medya paylaşımı',
    'Plan yükseltme',
  ],
  
  // Queue sistemi
  offlineQueue: {
    maxItems: 10,
    retryOnConnection: true,
    priority: ['upload', 'generate', 'share']
  }
};
```

---

## 📦 App Store Bilgileri

### iOS
```yaml
bundle_id: io.lensai.app
minimum_ios: "16.0"
required_capabilities:
  - camera
  - photo-library
  - push-notifications
app_category: Photo & Video
content_rating: "4+"
```

### Android
```yaml
package_name: io.lensai.app
min_sdk: 26  # Android 8.0
target_sdk: 34
permissions:
  - CAMERA
  - READ_EXTERNAL_STORAGE
  - WRITE_EXTERNAL_STORAGE
  - INTERNET
  - RECEIVE_BOOT_COMPLETED  # Push notification
play_category: Photography
content_rating: Everyone
```

---

## 📏 Performans Hedefleri (Mobil)

| Metrik | Hedef | Ölçüm |
|--------|-------|-------|
| Cold start | <2 saniye | expo-performance |
| Tab geçişi | <100ms | react-native-perf |
| Kamera açılma | <500ms | Manual timing |
| Upload başlangıcı | <1 saniye | Manual timing |
| Bellek kullanımı | <200MB | Xcode/Android Profiler |
| Bundle boyutu (iOS) | <50MB | App Store Connect |
| Bundle boyutu (Android) | <40MB | Play Console |
| Crash-free sessions | >%99.5 | Sentry |

---
*Bu doküman Mobile Agent tarafından yönetilir. Her sprint güncellenir.*
