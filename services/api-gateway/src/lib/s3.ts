import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export const s3Client = new S3Client({
  region: process.env['AWS_REGION'] || 'us-east-1',
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || 'minioadmin',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || 'minioadmin',
  },
  endpoint: process.env['AWS_S3_ENDPOINT'] || 'http://localhost:9000',
  forcePathStyle: true, // MinIO için gerekli
});

const BUCKET_NAME = process.env['AWS_S3_BUCKET'] || 'lensai-uploads';

/**
 * Client'ın doğrudan S3'e (veya Minio'ya) doysa yükleyebilmesi için Presigned URL üretir.
 */
export async function generateUploadUrl(userId: string, contentType: string, originalName: string) {
  const extension = originalName.split('.').pop() || 'tmp';
  const fileName = `${uuidv4()}.${extension}`;
  const key = `uploads/${userId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // 15 dakika geçerli yükleme URL'si
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  
  const publicUrl = `${process.env['AWS_S3_ENDPOINT'] || 'http://localhost:9000'}/${BUCKET_NAME}/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function generatePresignedDownloadUrl(key: string, originalName?: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: originalName ? `attachment; filename="${originalName}"` : undefined,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
