import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
  });

// Development'ta slow query log
if (process.env['NODE_ENV'] === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 100) {
      logger.warn(
        { query: e.query, duration: e.duration },
        'Slow query detected',
      );
    }
  });
}

prisma.$on('error', (e) => {
  logger.error({ message: e.message }, 'Prisma error');
});

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
