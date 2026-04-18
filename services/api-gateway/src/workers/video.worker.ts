import { Worker, Job } from 'bullmq';
import axios from 'axios';
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';
import { VIDEO_QUEUE_NAME } from '../lib/queue';
import { io } from '../app';
import { prisma } from '../lib/prisma';

interface VideoJobData {
  jobId: string;
  imageUrl: string;
  prompt: string;
  userId: string;
}

// PiAPI (Kling) API sabitleri - Çevre değişkenden okunur
const KLING_API_KEY = process.env['KLING_API_KEY'] || '';
const KLING_BASE_URL = 'https://api.piapi.ai/api/v1/task';

/**
 * Worker süreci - Belirtilen kuyruk adını dinler.
 */
export const videoWorker = new Worker<VideoJobData>(
  VIDEO_QUEUE_NAME,
  async (job: Job<VideoJobData>) => {
    const { jobId, imageUrl, prompt } = job.data;
    logger.info({ jobId, prompt }, 'Starting video generation job in Worker');

    try {
      // 1) Kling AI (PiAPI) Görevi Başlat
      const startResponse = await axios.post(
        KLING_BASE_URL,
        {
          model: 'kling',
          task_type: 'image_to_video',
          input: {
            image_url: imageUrl,
            prompt: prompt,
            duration: 5,
          },
        },
        {
          headers: {
            'x-api-key': KLING_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const taskId = startResponse.data?.data?.task_id;
      if (!taskId) {
        throw new Error('Failed to get task_id from Kling API');
      }

      logger.info({ jobId, aiTaskId: taskId }, 'Wait loop started for Kling AI generation');

      // 2) Sonuç çıkana kadar Polling yap (Her 5 saniyede bir)
      let isCompleted = false;
      let finalVideoUrl = '';

      while (!isCompleted) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 saniye bekle

        const statusResponse = await axios.get(`${KLING_BASE_URL}/${taskId}`, {
          headers: { 'x-api-key': KLING_API_KEY },
        });

        const status = statusResponse.data?.data?.status;
        const progress = statusResponse.data?.data?.progress || 0;

        // Socket üzerinden frontend'e haberi uçur
        io.to(`job:${jobId}`).emit('job:progress', { jobId, progress, status });
        logger.debug({ jobId, progress }, 'Job progress updated');

        if (status === 'completed') {
          isCompleted = true;
          finalVideoUrl = statusResponse.data?.data?.output?.video_url;
        } else if (status === 'failed') {
          throw new Error('Kling API Task failed internally');
        }
      }

      // 3) Tamamlanınca Veritabanını Güncelle ve Frontend'e bitiş haberini ver
      await prisma.videoJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', resultUrl: finalVideoUrl },
      });

      io.to(`job:${jobId}`).emit('job:completed', { jobId, resultUrl: finalVideoUrl });
      logger.info({ jobId, finalVideoUrl }, 'Job processing completely finished');

      return finalVideoUrl;
    } catch (error: any) {
      logger.error({ jobId, error: error.message }, 'Error in videoWorker');
      
      await prisma.videoJob.update({
        where: { id: jobId },
        data: { status: 'FAILED' },
      });
      
      io.to(`job:${jobId}`).emit('job:failed', { jobId, error: 'Video generation failed' });
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 1, // Aynı anda kaç video işlensin?
  }
);
