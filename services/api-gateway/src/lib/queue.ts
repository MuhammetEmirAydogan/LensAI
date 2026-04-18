import { Queue, QueueEvents } from 'bullmq';
import { redis } from './redis';
import { logger } from './logger';

export const VIDEO_QUEUE_NAME = 'video-generation';

export const videoQueue = new Queue(VIDEO_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Kuyruk olaylarını dinleyip logluyoruz
export const videoQueueEvents = new QueueEvents(VIDEO_QUEUE_NAME, { connection: redis });

videoQueueEvents.on('completed', ({ jobId }) => {
  logger.info({ jobId }, 'Video generation job completed successfully');
});

videoQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error({ jobId, failedReason }, 'Video generation job failed');
});

logger.info('BullMQ video queue initialized');
