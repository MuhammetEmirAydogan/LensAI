import { Router } from 'express';
import { requireAuth, attachUser } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { Errors } from '../middleware/error.middleware';
import { generatePresignedDownloadUrl } from '../lib/s3';

export const videosRouter = Router();

videosRouter.use(requireAuth, attachUser);

// GET /videos
videosRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1');
    const limit = Math.min(parseInt((req.query['limit'] as string) ?? '20'), 100);
    const projectId = req.query['projectId'] as string | undefined;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user!.id,
      deletedAt: null,
      ...(projectId && { projectId }),
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.video.count({ where }),
    ]);

    res.json({
      success: true,
      data: videos,
      meta: { page, limit, total, hasMore: skip + videos.length < total },
    });
  } catch (error) { next(error); }
});

// GET /videos/:id
videosRouter.get('/:id', async (req, res, next) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
    });
    if (!video) throw Errors.notFound('Video bulunamadı.');
    res.json({ success: true, data: video });
  } catch (error) { next(error); }
});

// POST /videos/:id/download — Presigned download URL üret
videosRouter.post('/:id/download', async (req, res, next) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
    });
    if (!video) throw Errors.notFound('Video bulunamadı.');

    // S3 key'i URL'den çıkar
    const key = new URL(video.videoUrl).pathname.slice(1);
    const downloadUrl = await generatePresignedDownloadUrl(key);

    // İndirme sayacını artır
    await prisma.video.update({
      where: { id: video.id },
      data: { downloadCount: { increment: 1 } },
    });

    res.json({ success: true, data: { downloadUrl, expiresIn: 900 } });
  } catch (error) { next(error); }
});

// DELETE /videos/:id (soft delete)
videosRouter.delete('/:id', async (req, res, next) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
    });
    if (!video) throw Errors.notFound('Video bulunamadı.');

    await prisma.video.update({
      where: { id: video.id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) { next(error); }
});
