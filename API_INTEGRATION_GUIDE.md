# 🔗 LensAI — API INTEGRATION GUIDE

## Amaç
LensAI Public API'sini kullanmak isteyen geliştiriciler ve entegrasyon ajansları için kapsamlı kılavuz.

---

## 🔑 Authentication

### API Key Alma
1. app.lensai.io → Settings → API Keys
2. "Generate New Key" → İsim ver → Kopyala
3. Anahtarı güvenli sakla (bir daha gösterilmez)

### İstek Formatı
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-LensAI-Version: 2024-01
```

---

## 📡 Temel Endpoint'ler

### Video Üretimi Başlat
```http
POST https://api.lensai.io/v1/generate

{
  "image_url": "https://your-cdn.com/product.jpg",
  "style": "cinematic-luxury",
  "options": {
    "aspect_ratio": "9:16",
    "duration": 5,
    "add_watermark": false,
    "quality": "4k"
  },
  "webhook_url": "https://your-app.com/webhooks/lensai"
}

Response:
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "queued",
    "estimated_time": 180
  }
}
```

### İş Durumu Sorgula
```http
GET https://api.lensai.io/v1/jobs/{job_id}

Response:
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "completed",
    "progress": 100,
    "video_url": "https://cdn.lensai.io/videos/abc123.mp4",
    "thumbnail_url": "https://cdn.lensai.io/thumbs/abc123.jpg",
    "duration": 5.0,
    "created_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:33:22Z"
  }
}
```

### Webhook Payload (İş Tamamlandığında)
```json
{
  "event": "job.completed",
  "job_id": "job_abc123",
  "status": "completed",
  "video_url": "https://cdn.lensai.io/videos/abc123.mp4",
  "timestamp": "2024-01-15T10:33:22Z"
}
```

---

## 🎨 Stil Kataloğu

```http
GET https://api.lensai.io/v1/styles

Response:
{
  "styles": [
    {
      "id": "cinematic-luxury",
      "name": "Cinematic Luxury",
      "category": "fashion",
      "preview_url": "...",
      "best_for": ["jewelry", "watch", "perfume"]
    },
    ...
  ]
}
```

---

## 📦 SDK'lar

```bash
npm install @lensai/node
pip install lensai
```

### Node.js Örnek
```typescript
import { LensAI } from '@lensai/node'

const client = new LensAI({ apiKey: process.env.LENSAI_KEY })

const job = await client.generate({
  imageUrl: 'https://example.com/product.jpg',
  style: 'cinematic-luxury',
})

const result = await client.waitForCompletion(job.jobId)
console.log(result.videoUrl)
```

---

## ⚡ Rate Limits

| Plan | İstek/dakika | Eş zamanlı iş |
|------|-------------|----------------|
| Free | 5 | 1 |
| Starter | 30 | 5 |
| Pro | 100 | 10 |
| Agency | 500 | 50 |

---
*Bu doküman Integration Agent + Backend Agent tarafından yönetilir.*
