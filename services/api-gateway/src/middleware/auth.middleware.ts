import { clerkMiddleware, getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { Errors } from './error.middleware';
import { logger } from '../lib/logger';
import type { User } from '@prisma/client';

// Clerk middleware — tüm route'larda çalışır
export const clerkAuth = clerkMiddleware();

// Express Request'e user ekle
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

// ─────────────────────────────────────
// AUTH ZORUNLU middleware
// ─────────────────────────────────────
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);

  if (!auth.userId) {
    next(Errors.unauthorized());
    return;
  }

  req.userId = auth.userId;
  next();
}

// ─────────────────────────────────────
// KULLANICI BİLGİSİ middleware
// DB'den user'ı çeker ve req.user'a bağlar
// ─────────────────────────────────────
export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.userId) {
    next();
    return;
  }

  try {
    // Önce cache'e bak
    const cacheKey = `user:${req.userId}`;
    const cachedUser = await cache.get<User>(cacheKey);

    if (cachedUser) {
      req.user = cachedUser;
      next();
      return;
    }

    // DB'den çek
    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId, deletedAt: null },
    });

    if (!user) {
      next(Errors.unauthorized('Kullanıcı bulunamadı.'));
      return;
    }

    // Cache'e al (5 dakika)
    await cache.set(cacheKey, user, 300);
    req.user = user;
    next();
  } catch (error) {
    logger.error({ error, userId: req.userId }, 'Failed to attach user');
    next(error);
  }
}

// ─────────────────────────────────────
// PLAN KONTROLÜ middleware
// ─────────────────────────────────────
export function requirePlan(...plans: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(Errors.unauthorized());
      return;
    }

    if (!plans.includes(req.user.plan)) {
      next(Errors.forbidden('Bu özellik için planınızı yükseltmeniz gerekiyor.'));
      return;
    }

    next();
  };
}

// ─────────────────────────────────────
// KULLANIM LİMİTİ middleware
// ─────────────────────────────────────
export async function checkUsageLimit(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = req.user;

  if (!user) {
    next(Errors.unauthorized());
    return;
  }

  // 1. Abonelik Kontrolü
  // Eğer kullanıcının aktif ve iptal edilmemiş bir aboneliği varsa (örn: PRO veya AGENCY)
  // genellikle Limitsiz (veya yüksek limitli) hakka sahiptir.
  if (user.subscriptionTier && user.subscriptionTier !== 'FREE' && user.subscriptionStatus === 'active') {
    // Limitsiz pakette olduğunu varsayarsak devam eder.
    if (user.subscriptionTier === 'AGENCY') {
        return next();
    }
  }

  // 2. Kredi Sistemi Kontrolü 
  // Abonelik yoksa veya bittiyse "kredi" harcaması üzerinden çalıştır (Phase 1.8 Kredi Mantığı)
  if (user.credits && user.credits > 0) {
    // İşlem başarılı olursa kredisini 1 azalt
    await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } }
    });
    return next();
  }

  // Hak bitti!
  next(Errors.usageLimitReached());
}
