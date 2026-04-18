import { Router } from 'express';
import { requireAuth, attachUser } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { Errors } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { z } from 'zod';

export const usersRouter = Router();

// GET /users/profile
usersRouter.get('/profile', requireAuth, attachUser, async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) { next(error); }
});

// PUT /users/profile
const updateProfileSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  avatarUrl: z.string().url().optional(),
});

usersRouter.put('/profile', requireAuth, attachUser, validateRequest(updateProfileSchema), async (req, res, next) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body as z.infer<typeof updateProfileSchema>,
    });
    await cache.del(`user:${req.userId}`);
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// GET /users/usage
usersRouter.get('/usage', requireAuth, attachUser, async (req, res, next) => {
  try {
    const period = new Date().toISOString().slice(0, 7); // YYYY-MM
    const usage = await prisma.usageLog.findUnique({
      where: { userId_period: { userId: req.user!.id, period } },
    });
    res.json({
      success: true,
      data: {
        plan: req.user!.plan,
        videosUsed: req.user!.videosUsed,
        videosLimit: req.user!.videosLimit,
        period,
        usage: usage ?? { videosGenerated: 0, aiCostUsd: 0 },
      },
    });
  } catch (error) { next(error); }
});

// DELETE /users/account
usersRouter.delete('/account', requireAuth, attachUser, async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { deletedAt: new Date() },
    });
    await cache.del(`user:${req.userId}`);
    res.status(204).send();
  } catch (error) { next(error); }
});
