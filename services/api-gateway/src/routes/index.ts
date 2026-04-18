import type { Express } from 'express';
import { Router } from 'express';
import { clerkAuth } from '../middleware/auth.middleware';

// Route'lar
import { authRouter } from './auth.routes';
import { usersRouter } from './users.routes';
import { projectsRouter } from './projects.routes';
import { generateRouter } from './generate.routes';
import { videosRouter } from './videos.routes';
import { subscriptionsRouter } from './subscriptions.routes';
import { webhooksRouter } from './webhooks.routes';
import { stylesRouter } from './styles.routes';
import { paymentRouter } from './payment.routes';
import { webhookRouter } from './webhook.routes';

const API_V1 = '/api/v1';

export function setupRoutes(app: Express): void {
  // Clerk auth tüm route'lara uygulanır (isteğe bağlı — sadece Auth route'larda zorunlu)
  app.use(clerkAuth);

  const v1 = Router();

  // Public route'lar
  v1.use('/auth', authRouter);
  v1.use('/styles', stylesRouter);

  // Webhook route'ları (Clerk auth bypass — kendi doğrulamaları var, json yerine raw calısacak)
  v1.use('/webhook', webhookRouter);

  // Korumalı route'lar (her birinde requireAuth çalışır)
  v1.use('/users', usersRouter);
  v1.use('/projects', projectsRouter);
  v1.use('/generate', generateRouter);
  v1.use('/videos', videosRouter);
  v1.use('/subscriptions', subscriptionsRouter);
  v1.use('/payments', paymentRouter);

  app.use(API_V1, v1);
}
