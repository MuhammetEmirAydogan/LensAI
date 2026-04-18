import Stripe from 'stripe';
import { logger } from './logger';

export const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

logger.info('Stripe SDK initialized');
