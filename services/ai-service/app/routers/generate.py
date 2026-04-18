from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import structlog
from app.services.masking_service import process_and_mask_image
from app.services.prompt_service import PromptEngine

logger = structlog.get_logger()
router = APIRouter()

class MaskRequest(BaseModel):
    imageUrl: str
    userId: str
    fileName: str

@router.post("/mask")
async def mask_image(req: MaskRequest):
    logger.info("Masking request received", user_id=req.userId)
    try:
        masked_url = await process_and_mask_image(req.imageUrl, req.userId, req.fileName)
        return {"success": True, "maskedUrl": masked_url}
    except Exception as e:
        logger.error("Masking failed", error=str(e))
        raise HTTPException(status_code=500, detail="Masking failed")

class GenerateRequest(BaseModel):
    jobId: str
    mediaItemId: str
    imageUrl: str
    styleId: str
    customPrompt: Optional[str] = None
    userId: str
    options: Optional[dict] = None

@router.post("/generate")
async def process_video_generation(req: GenerateRequest, background_tasks: BackgroundTasks):
    logger.info("Video generation job received", job_id=req.jobId)
    # Gelecekte Kling AI vb. asenkron video üretim API entegrasyonu buraya gelecek.
    return {"success": True, "message": "Job accepted"}

class PromptGenRequest(BaseModel):
    category: str
    styleId: str
    customPrompt: Optional[str] = None

@router.post("/generate-prompt")
async def generate_prompt(req: PromptGenRequest):
    logger.info("Prompt generation requested", category=req.category, style=req.styleId)
    try:
        prompt = PromptEngine.generate_prompt(req.category, req.styleId, req.customPrompt)
        return {"success": True, "prompt": prompt}
    except Exception as e:
        logger.error("Prompt generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Prompt generation failed")

