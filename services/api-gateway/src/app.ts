import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';

const app = express();
const httpServer = createServer(app);

// ─────────────────────────────────────
// SOCKET.IO
// ─────────────────────────────────────
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env['APP_URL'] ?? 'http://localhost:3000',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Client connected');

  socket.on('job:subscribe', ({ jobId }: { jobId: string }) => {
    void socket.join(`job:${jobId}`);
    logger.debug({ socketId: socket.id, jobId }, 'Subscribed to job');
  });

  socket.on('job:unsubscribe', ({ jobId }: { jobId: string }) => {
    void socket.leave(`job:${jobId}`);
  });

  socket.on('disconnect', () => {
    logger.debug({ socketId: socket.id }, 'Client disconnected');
  });
});

// ─────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors({
  origin: process.env['APP_URL'] ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Rate limiting — genel
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 1005,
      type: 'RATE_LIMITED',
      message: 'Çok fazla istek. Lütfen biraz bekleyin.',
      retryable: true,
      retryAfterMs: 60000,
    },
  },
}));

// ─────────────────────────────────────
// HEALTH CHECK (Auth gerektirmez)
// ─────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    res.json({
      status: 'ready',
      services: { postgres: 'ok', redis: 'ok' },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Readiness check failed');
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
    });
  }
});

// ─────────────────────────────────────
// ROUTES
// ─────────────────────────────────────
setupRoutes(app);

// ─────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 1002,
      type: 'NOT_FOUND',
      message: 'Bu endpoint bulunamadı.',
      retryable: false,
      requestId: 'unknown',
    },
  });
});

// ─────────────────────────────────────
// GRACEFUL SHUTDOWN
// ─────────────────────────────────────
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received');

  httpServer.close(async () => {
    logger.info('HTTP server closed');

    try {
      await prisma.$disconnect();
      logger.info('Database disconnected');

      await redis.quit();
      logger.info('Redis disconnected');

      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

// ─────────────────────────────────────
// START SERVER
// ─────────────────────────────────────
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

httpServer.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env['NODE_ENV'] }, '🚀 API Gateway started');
});

export { app, httpServer };
