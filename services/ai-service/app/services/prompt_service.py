from typing import Optional, Dict
import random

# Şablon Kütüphanesi
STYLES = {
    'style_1': {
        'name': 'Katalog Çekimi',
        'lighting': 'studio lighting, softbox, highly detailed',
        'background': 'pure white background, infinite seamless backdrop',
        'camera': '85mm lens, f/2.8, professional photography, 4k, sharp focus',
    },
    'style_2': {
        'name': 'Doğa Konsepti',
        'lighting': 'natural sunlight, golden hour, dappled light',
        'background': 'lush green forest, bokeh background, moss and wood textures',
        'camera': '50mm lens, f/1.8, cinematic depth of field, 8k resolution',
    },
    'style_3': {
        'name': 'Karanlık ve Çarpıcı (Dark & Edgy)',
        'lighting': 'dramatic high contrast lighting, neon accents, rim light',
        'background': 'dark concrete surface, subtle smoke or fog',
        'camera': 'close up, macro photography, cinematic grading',
    }
}

CAMERA_MOVEMENTS = [
    'slow pan from left to right',
    'slight tilt up revealing product details',
    'smooth tracking shot',
    'subtle push in (zoom in slowly)',
    'static cinematic lockdown shot'
]

class PromptEngine:
    @staticmethod
    def generate_prompt(category: str, style_id: str, custom_prompt: Optional[str] = None) -> str:
        """
        Kural tabanlı bir asistan gibi prompt üretir.
        """
        # Stil verisini bul, yoksa varsayılanı kullan
        style = STYLES.get(style_id, STYLES['style_1'])
        
        # Kamera hareketini rastgele seç
        camera_movement = random.choice(CAMERA_MOVEMENTS)
        
        product_desc = category if category else 'product'
        
        base_prompt = f"A highly detailed cinematic video shot of a {product_desc}. "
        
        if custom_prompt:
            base_prompt += f"User specifics: {custom_prompt}. "
            
        # Şablon detaylarını ekle
        prompt = (
            f"{base_prompt}"
            f"Settings: {style['background']}. "
            f"Lighting: {style['lighting']}. "
            f"Camera: {style['camera']}. "
            f"Motion: {camera_movement}. "
            f"Masterpiece, trending on artstation, unreal engine 5 render style, photorealistic."
        )
        
        return prompt
