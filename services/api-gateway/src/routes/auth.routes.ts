import { Router } from 'express';

export const authRouter = Router();

// Auth Clerk tarafından yönetilir.
// Bu route'lar sadece örnek endpoint'lerdir.
// Gerçek auth flow: Clerk hosted pages veya Clerk components

// GET /auth/me — Mevcut kullanıcı bilgisi
// Bu endpoint requireAuth + attachUser middleware ile korunur
// Ayrı bir user route'unda implement edildi (/users/profile)
authRouter.get('/me', (_req, res) => {
  res.json({
    success: true,
    message: 'Auth is managed by Clerk. Use /api/v1/users/profile for user data.',
  });
});
