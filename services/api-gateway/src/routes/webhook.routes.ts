import express, { Router } from 'express';
import { stripe } from '../lib/stripe';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import Stripe from 'stripe';

export const webhookRouter = Router();

// Webhook için raw body parser kullanmamız gerek, bu yüzden rotaya özel parser ayarlanır
webhookRouter.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];

    if (!signature || !webhookSecret) {
      logger.error('Missing Stripe signature or webhook secret');
      return res.status(400).send('Webhook Error: Missing configuration');
    }

    let event: Stripe.Event;

    try {
      // Signature kontrolü ile webhook'un gercekten Stripe'dan geldigini dogrula
      event = stripe.webhooks.constructEvent(
        req.body, // Parselanmamış (raw) JSON buffer olmalı
        signature,
        webhookSecret
      );
    } catch (err: any) {
      logger.error({ error: err.message }, 'Stripe webhook signature verification failed');
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // ─────────────────────────────────────
      // ÖDEME BAŞARILI (Checkout Session Tamamlandı)
      // ─────────────────────────────────────
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          logger.info({ userId, planId }, 'Checkout session completed');

          if (planId === 'credit_pack_100') {
            // Tek seferlik kredi satın alımı
            await prisma.user.update({
              where: { id: userId },
              data: {
                credits: { increment: 100 },
              },
            });
            logger.info({ userId }, 'Added 100 credits to user');
          } else {
            // Abonelik satın alımı
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionTier: planId === 'pro_monthly' ? 'PRO' : 'AGENCY',
                subscriptionId: session.subscription as string,
                subscriptionStatus: 'active',
                subscriptionPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
              },
            });
            logger.info({ userId, planId }, 'Upgraded user subscription');
          }
        }
      }

      // ─────────────────────────────────────
      // ABONELİK İPTALİ VEYA ÖDEME BAŞARISIZ MANTIKLARI
      // ─────────────────────────────────────
      else if (event.type === 'customer.subscription.deleted') {
         const subscription = event.data.object as Stripe.Subscription;
         await prisma.user.updateMany({
           where: { subscriptionId: subscription.id },
           data: {
             subscriptionStatus: 'canceled',
             subscriptionTier: 'FREE' 
           }
         });
         logger.info({ subId: subscription.id }, 'Subscription canceled');
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error processing Stripe webhook');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);
