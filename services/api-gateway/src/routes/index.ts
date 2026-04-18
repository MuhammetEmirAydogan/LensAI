import type { Express } from 'express';
import { Router } from 'express';
import { clerkAuth } from './middleware/auth.middleware';

// Route'lar
import { authRouter } from './routes/auth.routes';
import { usersRouter } from './routes/users.routes';
import { projectsRouter } from './routes/projects.routes';
import { generateRouter } from './routes/generate.routes';
import { videosRouter } from './routes/videos.routes';
import { subscriptionsRouter } from './routes/subscriptions.routes';
import { webhooksRouter } from './routes/webhooks.routes';
import { stylesRouter } from './routes/styles.routes';

const API_V1 = '/api/v1';

export function setupRoutes(app: Express): void {
  // Clerk auth tüm route'lara uygulanır (isteğe bağlı — sadece Auth route'larda zorunlu)
  app.use(clerkAuth);

  const v1 = Router();

  // Public route'lar
  v1.use('/auth', authRouter);
  v1.use('/styles', stylesRouter);

  // Korumalı route'lar (her birinde requireAuth çalışır)
  v1.use('/users', usersRouter);
  v1.use('/projects', projectsRouter);
  v1.use('/generate', generateRouter);
  v1.use('/videos', videosRouter);
  v1.use('/subscriptions', subscriptionsRouter);

  // Webhook route'ları (Clerk auth bypass — kendi doğrulamaları var)
  v1.use('/webhooks', webhooksRouter);

  app.use(API_V1, v1);
}
