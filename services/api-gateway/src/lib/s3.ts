import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from './logger';

const s3 = new S3Client({
  region: process.env['AWS_REGION'] ?? 'eu-central-1',
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
  },
});

const UPLOADS_BUCKET = process.env['S3_BUCKET_UPLOADS'] ?? 'lensai-uploads-dev';
const VIDEOS_BUCKET = process.env['S3_BUCKET_VIDEOS'] ?? 'lensai-videos-dev';
const CDN_DOMAIN = process.env['CLOUDFRONT_DOMAIN'];

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  mimeType: string,
  bucket = UPLOADS_BUCKET,
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ServerSideEncryption: 'AES256',
  }));

  const url = CDN_DOMAIN
    ? `https://${CDN_DOMAIN}/${key}`
    : `https://${bucket}.s3.${process.env['AWS_REGION']}.amazonaws.com/${key}`;

  logger.debug({ key, bucket, url }, 'File uploaded to S3');
  return url;
}

export async function generatePresignedUploadUrl(
  key: string,
  mimeType: string,
  expiresInSeconds = 900,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: UPLOADS_BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresInSeconds = 900,
  bucket = VIDEOS_BUCKET,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

export { UPLOADS_BUCKET, VIDEOS_BUCKET };
