# 🎬 LensAI — STYLE LIBRARY

## Amaç
Bu doküman, LensAI'ın video üretim stil kütüphanesini tanımlar. Her stil için prompt şablonu, en iyi kullanım alanları, teknik parametreler ve kalite metrikleri belgelenir.

---

## 📊 Stil Kategorileri

| Kategori | Stil Sayısı | Hedef Sektör |
|----------|-------------|-------------|
| Cinematic | 10 | Lüks ürünler, mücevher |
| Viral | 8 | E-ticaret, sosyal medya |
| Minimalist | 7 | Teknoloji, tasarım |
| Luxury | 6 | Moda, kozmetik |
| Dynamic | 6 | Spor, outdoor |
| Nature | 5 | Organik, doğal ürünler |
| Tech | 4 | Elektronik, gadget |
| Food | 4 | Yiyecek, içecek |
| **TOPLAM** | **50** | — |

---

## 🎥 Stil Katalogu

### CINEMATIC KATEGORİSİ

#### 1. cinematic-luxury
```yaml
id: cinematic-luxury
name: Cinematic Luxury
category: cinematic
best_for: [jewelry, watch, perfume, luxury-bag]
prompt_template: >
  Ultra-cinematic 4K shot of {product} floating gracefully against a deep 
  black velvet background. Dramatic golden rim lighting creates a luxurious 
  halo effect. Slow rotation revealing intricate details. Subtle particle 
  dust in volumetric light beams. Professional product photography style.
negative_prompt: >
  blurry, low quality, oversaturated, cartoon, illustration, text, 
  watermark, human hands, busy background
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.6
  guidance_scale: 7.5
success_rate: 0.92
avg_quality_score: 8.4
usage_count: 1250
```

#### 2. cinematic-orbit
```yaml
id: cinematic-orbit
name: Cinematic Orbit
category: cinematic
best_for: [shoe, sneaker, electronics, sculpture]
prompt_template: >
  Smooth cinematic 360-degree orbit around {product} on a reflective 
  dark surface. Professional studio lighting with key light and fill. 
  Subtle depth of field. Camera slowly circles the product revealing 
  all angles. Film grain texture, anamorphic lens flare.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.7
success_rate: 0.88
avg_quality_score: 8.1
```

#### 3. cinematic-reveal
```yaml
id: cinematic-reveal
name: Cinematic Reveal
category: cinematic
best_for: [perfume, cosmetics, premium-packaging]
prompt_template: >
  Dramatic slow reveal of {product} emerging from soft billowing smoke. 
  Moody dark environment with a single spotlight gradually illuminating 
  the product. Shallow depth of field, bokeh lights in background. 
  Slow-motion smoke tendrils wrapping around the product.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.5
success_rate: 0.90
avg_quality_score: 8.6
```

### VIRAL KATEGORİSİ

#### 4. viral-satisfying
```yaml
id: viral-satisfying
name: Viral Satisfying
category: viral
best_for: [any-product, gadget, food, cosmetics]
prompt_template: >
  Extremely satisfying close-up shot of {product}. Smooth, 
  satisfying motion — perhaps unboxing, clicking, or sliding into 
  place. ASMR-like visual texture. Macro lens detail shots. 
  Bright, clean lighting. The kind of video that makes you watch 
  it on repeat.
parameters:
  duration: 4
  fps: 30
  aspect_ratio: "9:16"
  motion_strength: 0.8
success_rate: 0.85
avg_quality_score: 7.8
```

#### 5. viral-transition
```yaml
id: viral-transition
name: Viral Transition
category: viral
best_for: [clothing, accessories, before-after]
prompt_template: >
  Dynamic transition effect revealing {product}. Starts with a 
  creative wipe, morph, or zoom transition. Fast-paced, trendy 
  social media style. Bold colors, high contrast. Quick cuts 
  with satisfying visual flow. Instagram Reels / TikTok optimized.
parameters:
  duration: 3
  fps: 30
  aspect_ratio: "9:16"
  motion_strength: 0.9
success_rate: 0.82
avg_quality_score: 7.5
```

#### 6. viral-unboxing
```yaml
id: viral-unboxing
name: Viral Unboxing
category: viral
best_for: [electronics, subscription-box, luxury-packaging]
prompt_template: >
  Cinematic unboxing experience of {product}. Premium packaging 
  slowly being opened. Camera focuses on the reveal moment. 
  Clean white/marble surface. Soft shadows, natural lighting. 
  The anticipation builds as layers are peeled away. ASMR-style 
  close up of textures.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.5
success_rate: 0.87
avg_quality_score: 8.0
```

### MINIMALIST KATEGORİSİ

#### 7. minimalist-clean
```yaml
id: minimalist-clean
name: Minimalist Clean
category: minimalist
best_for: [tech, skincare, stationery, design-products]
prompt_template: >
  Ultra-clean minimalist shot of {product} on pure white background. 
  Soft diffused lighting, no harsh shadows. Product slowly rotates 
  with subtle breathing animation. Negative space emphasized. 
  Apple-style product photography aesthetic. Crisp, sharp details.
parameters:
  duration: 4
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.3
success_rate: 0.94
avg_quality_score: 8.8
```

#### 8. minimalist-shadow
```yaml
id: minimalist-shadow
name: Minimalist Shadow Play
category: minimalist
best_for: [furniture, home-decor, architecture-model]
prompt_template: >
  Artistic shadow play with {product}. Hard directional sunlight 
  creates dramatic long shadows. Slowly shifting light angle 
  throughout the shot. Warm golden hour tones on neutral beige/cream 
  surface. Bauhaus-inspired composition. Silent, meditative mood.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.4
success_rate: 0.89
avg_quality_score: 8.3
```

### LUXURY KATEGORİSİ

#### 9. luxury-liquid
```yaml
id: luxury-liquid
name: Luxury Liquid Gold
category: luxury
best_for: [perfume, skincare, premium-beverage]
prompt_template: >
  {product} surrounded by flowing liquid gold. Thick, viscous golden 
  fluid slowly cascading around the product. Dark obsidian background. 
  Reflective surfaces catching the warm golden light. Ultra-premium, 
  opulent atmosphere. Slow motion fluid dynamics.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.6
success_rate: 0.86
avg_quality_score: 8.5
```

#### 10. luxury-velvet
```yaml
id: luxury-velvet
name: Luxury Velvet
category: luxury
best_for: [jewelry, watch, ring, necklace]
prompt_template: >
  {product} resting on deep burgundy velvet fabric. Soft caressing 
  camera movement. Warm spotlight highlighting metallic surfaces. 
  Fabric gently ripples creating luxurious texture. Extreme close-up 
  detail shots of craftsmanship. Rich, warm color grading.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.4
success_rate: 0.91
avg_quality_score: 8.7
```

### DYNAMIC KATEGORİSİ

#### 11. dynamic-action
```yaml
id: dynamic-action
name: Dynamic Action
category: dynamic
best_for: [sportswear, sneaker, outdoor-gear, energy-drink]
prompt_template: >
  High-energy dynamic shot of {product} in action. Fast camera 
  movements, dramatic angles. Splashing water or dust particles 
  creating impact. Vibrant saturated colors, high contrast. 
  Sports-photography inspired lighting. Power and energy conveyed 
  through motion blur and speed lines.
parameters:
  duration: 4
  fps: 30
  aspect_ratio: "9:16"
  motion_strength: 0.9
success_rate: 0.83
avg_quality_score: 7.9
```

#### 12. dynamic-explode
```yaml
id: dynamic-explode
name: Dynamic Explode View
category: dynamic
best_for: [electronics, gadget, mechanical-product]
prompt_template: >
  Exploded view animation of {product}. Components gracefully 
  separate and float apart in 3D space, revealing internal 
  structure. Clean white environment. Technical precision with 
  artistic flair. Components slowly reassemble. Engineering 
  marvel showcase.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.7
success_rate: 0.80
avg_quality_score: 8.2
```

### NATURE KATEGORİSİ

#### 13. nature-botanical
```yaml
id: nature-botanical
name: Nature Botanical
category: nature
best_for: [organic-product, skincare, tea, essential-oil]
prompt_template: >
  {product} nestled among fresh green botanical elements. Living 
  plants, leaves, and flowers gently swaying. Morning dew drops 
  on petals. Soft natural daylight filtering through foliage. 
  Earthy, organic color palette. Growth animation of small 
  plants around the product.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.4
success_rate: 0.88
avg_quality_score: 8.1
```

### FOOD KATEGORİSİ

#### 14. food-sizzle
```yaml
id: food-sizzle
name: Food Sizzle
category: food
best_for: [food-product, sauce, seasoning, kitchen-tool]
prompt_template: >
  Mouth-watering close-up of {product} in a sizzling cooking 
  scene. Steam rising, oils glistening, spices falling in slow 
  motion. Warm, appetizing color grading. Macro details of 
  texture. Professional food photography lighting. Makes you 
  hungry just watching.
parameters:
  duration: 4
  fps: 30
  aspect_ratio: "9:16"
  motion_strength: 0.6
success_rate: 0.84
avg_quality_score: 7.7
```

### TECH KATEGORİSİ

#### 15. tech-hologram
```yaml
id: tech-hologram
name: Tech Hologram
category: tech
best_for: [phone, laptop, smart-device, wearable]
prompt_template: >
  Futuristic holographic display of {product}. Floating in a 
  dark tech environment with cyan/blue holographic UI elements 
  orbiting around it. Digital particles and data streams. 
  Sci-fi inspired, Blade Runner aesthetic. Neon edge lighting. 
  HUD-style annotations appearing and fading.
parameters:
  duration: 5
  fps: 24
  aspect_ratio: "9:16"
  motion_strength: 0.7
success_rate: 0.81
avg_quality_score: 7.9
```

---

## 📐 Prompt Değişkenleri

Tüm şablonlarda kullanılabilecek değişkenler:

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `{product}` | Ürün adı/açıklaması | "a luxury rose gold watch" |
| `{brand_color}` | Marka ana rengi | "#7C3AED" |
| `{brand_name}` | Marka adı | "LuxWatch" |
| `{target_mood}` | Hedef duygu | "elegant, premium" |
| `{season}` | Mevsim/dönem | "winter collection" |

---

## 📊 Stil Performans Metrikleri

Her stilin performansı şu metriklerle izlenir:

| Metrik | Açıklama | Hedef |
|--------|----------|-------|
| Success Rate | Başarılı üretim oranı | >%85 |
| Avg Quality Score | Ortalama kalite puanı (0-10) | >7.5 |
| Usage Count | Toplam kullanım sayısı | — |
| Avg Render Time | Ortalama render süresi | <180s |
| User Rating | Kullanıcı puanı (1-5) | >4.0 |
| Viral Score Avg | Ortalama viral potansiyel | >6.0 |

---

## 🔄 Stil Ekleme Protokolü

Yeni stil eklerken:
1. AI Agent prompt şablonu yazar
2. 10 test görselle denenir
3. Quality score >7.5 ise onaylanır
4. Stil kütüphanesine eklenir
5. Bu dosya güncellenir
6. Frontend'de stil kartı oluşturulur

---
*Bu doküman AI Agent tarafından yönetilir. Yeni stil eklendikçe güncellenir.*
