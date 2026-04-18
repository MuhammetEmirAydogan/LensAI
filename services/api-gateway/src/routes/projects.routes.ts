import { Router } from 'express';
import { requireAuth, attachUser } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { Errors } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { z } from 'zod';

export const projectsRouter = Router();

// Tüm project route'ları auth gerektirir
projectsRouter.use(requireAuth, attachUser);

// GET /projects
projectsRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1');
    const limit = Math.min(parseInt((req.query['limit'] as string) ?? '20'), 100);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId: req.user!.id, deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: { _count: { select: { mediaItems: true, videos: true } } },
      }),
      prisma.project.count({ where: { userId: req.user!.id, deletedAt: null } }),
    ]);

    res.json({
      success: true,
      data: projects,
      meta: { page, limit, total, hasMore: skip + projects.length < total },
    });
  } catch (error) { next(error); }
});

// POST /projects
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

projectsRouter.post('/', validateRequest(createProjectSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: {
        userId: req.user!.id,
        ...(req.body as z.infer<typeof createProjectSchema>),
      },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) { next(error); }
});

// GET /projects/:id
projectsRouter.get('/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
      include: {
        mediaItems: { orderBy: { createdAt: 'desc' }, take: 10 },
        videos: { orderBy: { createdAt: 'desc' }, take: 10 },
        brandKit: true,
      },
    });
    if (!project) throw Errors.notFound('Proje bulunamadı.');
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
});

// PUT /projects/:id
const updateProjectSchema = createProjectSchema.partial();
projectsRouter.put('/:id', validateRequest(updateProjectSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
    });
    if (!project) throw Errors.notFound('Proje bulunamadı.');

    const updated = await prisma.project.update({
      where: { id: req.params['id']! },
      data: req.body as z.infer<typeof updateProjectSchema>,
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// DELETE /projects/:id (soft delete)
projectsRouter.delete('/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params['id']!, userId: req.user!.id, deletedAt: null },
    });
    if (!project) throw Errors.notFound('Proje bulunamadı.');

    await prisma.project.update({
      where: { id: req.params['id']! },
      data: { deletedAt: new Date(), status: 'deleted' },
    });
    res.status(204).send();
  } catch (error) { next(error); }
});
