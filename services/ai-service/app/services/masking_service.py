import httpx
import boto3
from io import BytesIO
from PIL import Image
from rembg import remove, new_session
from app.config import settings
import structlog

logger = structlog.get_logger()
session = new_session("u2net")

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.AWS_S3_ENDPOINT,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

async def process_and_mask_image(image_url: str, user_id: str, file_name: str) -> str:
    """Resmi indirir, arkaplanını siler ve MinIO'ya geri yükler."""
    # MinIO Docker network'ünde minio üzerinden çağrıldığı için hostname dönüşümü
    # image_url http://localhost:9000/... gelirse docker içinde bulamaz.
    safe_image_url = image_url.replace("localhost", "lensai-minio")
    
    logger.info(f"Downloading image from {safe_image_url}")
    async with httpx.AsyncClient() as client:
        resp = await client.get(safe_image_url)
        resp.raise_for_status()
        input_img = Image.open(BytesIO(resp.content))

    logger.info("Removing background via rembg")
    output_img = remove(input_img, session=session)

    out_buffer = BytesIO()
    output_img.save(out_buffer, format="PNG")
    out_buffer.seek(0)
    
    out_key = f"uploads/{user_id}/masked_{file_name}.png"
    
    logger.info(f"Uploading masked image to S3: {out_key}")
    s3_client.put_object(
        Bucket=settings.AWS_S3_BUCKET,
        Key=out_key,
        Body=out_buffer,
        ContentType="image/png"
    )
    
    public_url = f"http://localhost:9000/{settings.AWS_S3_BUCKET}/{out_key}"
    return public_url
