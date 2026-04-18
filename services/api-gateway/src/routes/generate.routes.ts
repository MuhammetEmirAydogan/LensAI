import { Router } from 'express';
import { requireAuth, attachUser, checkUsageLimit } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { uploadToS3 } from '../lib/s3';
import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { Errors } from '../middleware/error.middleware';
import { logger } from '../lib/logger';
import { io } from '../app';
import multer from 'multer';
import { z } from 'zod';
import axios from 'axios';

export const generateRouter = Router();

// Multer — memory storage (S3'e yüklemek için)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece JPG, PNG ve WebP dosyaları kabul edilir.'));
    }
  },
});

// ─────────────────────────────────────
// POST /generate/upload — Görsel yükle
// ─────────────────────────────────────
generateRouter.post(
  '/upload',
  requireAuth,
  attachUser,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw Errors.validation('Görsel dosyası gereklidir.');
      }

      const { projectId } = req.body as { projectId: string };
      if (!projectId) throw Errors.validation('projectId gereklidir.');

      // Projenin kullanıcıya ait olduğunu doğrula
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: req.user!.id, deletedAt: null },
      });
      if (!project) throw Errors.notFound('Proje bulunamadı.');

      // S3'e yükle
      const s3Key = `uploads/${req.user!.id}/${Date.now()}-${req.file.originalname}`;
      const originalUrl = await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);

      // MediaItem oluştur
      const mediaItem = await prisma.mediaItem.create({
        data: {
          projectId,
          userId: req.user!.id,
          originalUrl,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype as 'image/jpeg' | 'image/png' | 'image/webp',
        },
      });

      logger.info({ mediaItemId: mediaItem.id, userId: req.user!.id }, 'Image uploaded');

      res.status(201).json({
        success: true,
        data: { mediaItemId: mediaItem.id, originalUrl },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─────────────────────────────────────
// POST /generate/video — Video üretimi başlat
// ─────────────────────────────────────
const generateVideoSchema = z.object({
  mediaItemId: z.string().uuid(),
  styleId: z.string().min(1),
  customPrompt: z.string().max(500).optional(),
  options: z.object({
    aspectRatio: z.enum(['9:16', '16:9', '1:1', '4:5']).optional(),
    duration: z.number().int().min(3).max(10).optional(),
    fps: z.union([z.literal(24), z.literal(30)]).optional(),
  }).optional(),
});

generateRouter.post(
  '/video',
  requireAuth,
  attachUser,
  checkUsageLimit,
  validateRequest(generateVideoSchema),
  async (req, res, next) => {
    try {
      const body = req.body as z.infer<typeof generateVideoSchema>;

      // MediaItem kontrolü
      const mediaItem = await prisma.mediaItem.findFirst({
        where: { id: body.mediaItemId, userId: req.user!.id },
      });
      if (!mediaItem) throw Errors.notFound('Görsel bulunamadı.');

      // Job oluştur
      const job = await prisma.videoJob.create({
        data: {
          userId: req.user!.id,
          mediaItemId: body.mediaItemId,
          styleId: body.styleId,
          customPrompt: body.customPrompt,
          status: 'pending',
          stage: 'uploading',
        },
      });

      // Redis'e job durumu yaz
      await cache.set(`job:${job.id}:status`, {
        status: 'pending',
        stage: 'uploading',
        progress: 0,
      }, 86400);

      // Kullanım sayacını artır
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { videosUsed: { increment: 1 } },
      });

      // AI Service'e iş gönder (async)
      const aiServiceUrl = process.env['AI_SERVICE_URL'] ?? 'http://localhost:8000';
      axios.post(`${aiServiceUrl}/ai/v1/generate`, {
        jobId: job.id,
        mediaItemId: body.mediaItemId,
        imageUrl: mediaItem.originalUrl,
        styleId: body.styleId,
        customPrompt: body.customPrompt,
        userId: req.user!.id,
        options: body.options,
      }).catch((err) => {
        logger.error({ error: err.message, jobId: job.id }, 'Failed to send job to AI service');
      });

      logger.info({ jobId: job.id, userId: req.user!.id, styleId: body.styleId }, 'Video generation started');

      res.status(201).json({
        success: true,
        data: {
          jobId: job.id,
          status: 'pending',
          estimatedTimeMs: 180000,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─────────────────────────────────────
// GET /generate/status/:jobId — İş durumu
// ─────────────────────────────────────
generateRouter.get('/status/:jobId', requireAuth, attachUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Önce Redis cache'e bak
    const cached = await cache.get(`job:${jobId}:status`);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    // DB'den çek
    const job = await prisma.videoJob.findFirst({
      where: { id: jobId, userId: req.user!.id },
    });

    if (!job) throw Errors.notFound('İş bulunamadı.');

    return res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        stage: job.stage,
        progress: job.progress,
        completedAt: job.completedAt,
        errorMessage: job.errorMessage,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────
// GET /generate/styles — Stil kütüphanesi
// ─────────────────────────────────────
generateRouter.get('/styles', async (_req, res, next) => {
  try {
    // Cache'den serve et
    const cached = await cache.get('styles:all');
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    // AI Service'ten çek
    const aiServiceUrl = process.env['AI_SERVICE_URL'] ?? 'http://localhost:8000';
    const response = await axios.get(`${aiServiceUrl}/ai/v1/styles`);
    const styles = response.data;

    // 1 saat cache'le
    await cache.set('styles:all', styles, 3600);

    return res.json({ success: true, data: styles });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────
// DELETE /generate/job/:jobId — İptal et
// ─────────────────────────────────────
generateRouter.delete('/job/:jobId', requireAuth, attachUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.videoJob.findFirst({
      where: { id: jobId, userId: req.user!.id },
    });

    if (!job) throw Errors.notFound('İş bulunamadı.');
    if (job.status === 'completed') {
      throw Errors.validation('Tamamlanmış bir iş iptal edilemez.');
    }

    await prisma.videoJob.update({
      where: { id: jobId },
      data: { status: 'cancelled' },
    });

    // Socket.io ile bildir
    io.to(`job:${jobId}`).emit('job:failed', { jobId, error: 'İş iptal edildi.' });

    res.status(200).json({ success: true, data: { cancelled: true } });
  } catch (error) {
    next(error);
  }
});
