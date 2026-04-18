import { Router } from 'express';
import { requireAuth, attachUser } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import Stripe from 'stripe';

export const subscriptionsRouter = Router();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2024-09-30.acacia',
});

const PLAN_PRICES: Record<string, string> = {
  starter: process.env['STRIPE_PRICE_STARTER'] ?? '',
  pro: process.env['STRIPE_PRICE_PRO'] ?? '',
  agency: process.env['STRIPE_PRICE_AGENCY'] ?? '',
};

subscriptionsRouter.use(requireAuth, attachUser);

// GET /subscriptions/plans
subscriptionsRouter.get('/plans', (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'free', name: 'Free', price: 0, videos: 5, features: [] },
      { id: 'starter', name: 'Starter', price: 29, videos: 50, features: ['batch'] },
      { id: 'pro', name: 'Pro', price: 79, videos: 200, features: ['batch', 'api', 'analytics', '4K'] },
      { id: 'agency', name: 'Agency', price: 199, videos: -1, features: ['batch', 'api', 'white-label', 'team', '4K'] },
    ],
  });
});

// GET /subscriptions/current
subscriptionsRouter.get('/current', async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id },
    });
    res.json({ success: true, data: subscription ?? { plan: 'free', status: 'active' } });
  } catch (error) { next(error); }
});

// POST /subscriptions/checkout — Stripe Checkout Session
subscriptionsRouter.post('/checkout', async (req, res, next) => {
  try {
    const { plan } = req.body as { plan: string };
    const priceId = PLAN_PRICES[plan];
    if (!priceId) throw new Error('Geçersiz plan.');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: req.user!.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env['APP_URL']}/settings/billing?success=true`,
      cancel_url: `${process.env['APP_URL']}/settings/billing?cancelled=true`,
      metadata: { userId: req.user!.id, plan },
    });

    res.json({ success: true, data: { url: session.url } });
  } catch (error) { next(error); }
});

// POST /subscriptions/portal — Stripe Customer Portal
subscriptionsRouter.post('/portal', async (req, res, next) => {
  try {
    if (!req.user!.stripeCustomerId) {
      throw new Error('Stripe hesabı bulunamadı.');
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user!.stripeCustomerId,
      return_url: `${process.env['APP_URL']}/settings/billing`,
    });
    res.json({ success: true, data: { url: session.url } });
  } catch (error) { next(error); }
});
