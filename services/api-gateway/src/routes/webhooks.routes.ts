import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { logger } from '../lib/logger';
import Stripe from 'stripe';
import { Webhook } from 'svix'; // Clerk webhook doğrulaması
import express from 'express';

export const webhooksRouter = Router();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2024-09-30.acacia' as any,
});

const PLAN_VIDEO_LIMITS: Record<string, number> = {
  free: 5, starter: 50, pro: 200, agency: -1, enterprise: -1,
};

// ─────────────────────────────────────
// Stripe Webhook
// ─────────────────────────────────────
webhooksRouter.post(
  '/stripe',
  express.raw({ type: 'application/json' }), // Raw body Stripe imzası için
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      res.status(400).send('Missing stripe signature');
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig,
        process.env['STRIPE_WEBHOOK_SECRET'] ?? '',
      );
    } catch (err) {
      logger.error({ error: err }, 'Stripe webhook signature verification failed');
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.['userId'];
          const plan = session.metadata?.['plan'];

          if (userId && plan) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                plan,
                stripeCustomerId: session.customer as string,
                videosLimit: PLAN_VIDEO_LIMITS[plan] ?? 5,
              },
            });

            await prisma.subscription.upsert({
              where: { userId },
              update: {
                plan,
                stripeSubscriptionId: session.subscription as string,
                status: 'active',
              },
              create: {
                userId,
                plan,
                stripeSubscriptionId: session.subscription as string,
                status: 'active',
              },
            });

            await cache.del(`user:${userId}`);
            logger.info({ userId, plan }, 'Subscription created via checkout');
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object as Stripe.Subscription;
          const dbSub = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: sub.id },
          });
          if (dbSub) {
            await prisma.user.update({
              where: { id: dbSub.userId },
              data: { plan: 'free', videosLimit: 5 },
            });
            await prisma.subscription.update({
              where: { id: dbSub.id },
              data: { status: 'canceled' },
            });
            await cache.del(`user:${dbSub.userId}`);
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          logger.warn({ customerId: invoice.customer }, 'Payment failed');
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      logger.error({ error, eventType: event.type }, 'Stripe webhook processing failed');
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },
);

// ─────────────────────────────────────
// Clerk Webhook
// ─────────────────────────────────────
webhooksRouter.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const webhookSecret = process.env['CLERK_WEBHOOK_SECRET'] ?? '';
    const wh = new Webhook(webhookSecret);

    let evt: { type: string; data: Record<string, unknown> };
    try {
      evt = wh.verify(req.body as Buffer, {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
      }) as typeof evt;
    } catch {
      res.status(400).send('Invalid signature');
      return;
    }

    try {
      if (evt.type === 'user.created') {
        const data = evt.data;
        await prisma.user.create({
          data: {
            clerkId: data['id'] as string,
            email: (data['email_addresses'] as Array<{email_address: string}>)[0]?.email_address ?? '',
            name: `${data['first_name'] as string} ${data['last_name'] as string}`.trim() || null,
            avatarUrl: data['image_url'] as string | null,
          },
        });
        logger.info({ clerkId: data['id'] }, 'New user created via Clerk');
      }

      if (evt.type === 'user.deleted') {
        await prisma.user.updateMany({
          where: { clerkId: evt.data['id'] as string },
          data: { deletedAt: new Date() },
        });
      }

      res.json({ received: true });
    } catch (error) {
      logger.error({ error, eventType: evt.type }, 'Clerk webhook processing failed');
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },
);

// ─────────────────────────────────────
// AI Provider Webhook (job completed/failed)
// ─────────────────────────────────────
webhooksRouter.post('/ai-provider', async (req, res) => {
  // Internal secret doğrulama
  const secret = req.headers['x-internal-secret'];
  if (secret !== process.env['INTERNAL_API_SECRET']) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { jobId, status, videoUrl, error } = req.body as {
    jobId: string;
    status: 'completed' | 'failed';
    videoUrl?: string;
    error?: string;
  };

  try {
    if (status === 'completed' && videoUrl) {
      const job = await prisma.videoJob.update({
        where: { id: jobId },
        data: { status: 'completed', stage: 'completed', progress: 100, completedAt: new Date() },
      });

      const video = await prisma.video.create({
        data: {
          jobId,
          userId: job.userId,
          projectId: (await prisma.mediaItem.findUnique({ where: { id: job.mediaItemId } }))!.projectId,
          videoUrl,
          hasWatermark: false,
        },
      });

      // Socket.io ile kullanıcıya bildir
      const { io } = await import('../app');
      io.to(`job:${jobId}`).emit('job:completed', { jobId, video });

      await cache.del(`job:${jobId}:status`);
    } else {
      await prisma.videoJob.update({
        where: { id: jobId },
        data: { status: 'failed', stage: 'failed', errorMessage: error },
      });

      const { io } = await import('../app');
      io.to(`job:${jobId}`).emit('job:failed', { jobId, error });
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err, jobId }, 'AI provider webhook processing failed');
    res.status(500).json({ error: 'Processing failed' });
  }
});
