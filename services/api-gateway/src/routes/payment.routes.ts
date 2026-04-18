import { Router } from 'express';
import { stripe } from '../lib/stripe';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { requireAuth, attachUser } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate.middleware';

export const paymentRouter = Router();

const checkoutSchema = z.object({
  planId: z.enum(['pro_monthly', 'agency_monthly', 'credit_pack_100']),
});

// Fiyat ID'leri (Gerçek Stripe Dashboard'dan alınmış fiyat ID'leri buraya yazılır)
const PRICE_IDS: Record<string, string> = {
  pro_monthly: 'price_1ProPlanIDXXXXX',
  agency_monthly: 'price_1AgencyPlanIDXXXXX',
  credit_pack_100: 'price_1CreditPackIDXXXXX',
};

// ─────────────────────────────────────
// POST /payments/checkout — Ödeme Oturumu Başlat
// ─────────────────────────────────────
paymentRouter.post(
  '/checkout',
  requireAuth,
  attachUser,
  validateRequest(checkoutSchema),
  async (req, res, next) => {
    try {
      const { planId } = req.body as z.infer<typeof checkoutSchema>;
      const user = req.user!;

      const priceId = PRICE_IDS[planId];
      if (!priceId) {
        return res.status(400).json({ success: false, message: 'Invalid plan selected' });
      }

      // Kullanıcının Stripe ID'si var mı kontrol et, yoksa oluştur
      let stripeCustomerId = user.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
        
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      }

      const isSubscription = planId.includes('monthly');

      // Ödeme sayfasını oluştur
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: isSubscription ? 'subscription' : 'payment',
        success_url: `${process.env['APP_URL'] ?? 'http://localhost:3000'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env['APP_URL'] ?? 'http://localhost:3000'}/pricing?payment=cancelled`,
        metadata: {
          userId: user.id,
          planId: planId,
        },
      });

      logger.info({ userId: user.id, sessionId: session.id }, 'Checkout session created');

      res.status(200).json({ success: true, data: { url: session.url } });
    } catch (error) {
      next(error);
    }
  }
);
