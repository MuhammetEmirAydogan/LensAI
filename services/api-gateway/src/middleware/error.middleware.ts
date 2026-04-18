import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  type?: string;
  retryable?: boolean;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? 1000;
  const type = err.type ?? 'UNKNOWN_ERROR';

  logger.error(
    {
      error: err.message,
      stack: err.stack,
      requestId: req.requestId,
      path: req.path,
      method: req.method,
      statusCode,
    },
    'Request error',
  );

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      type,
      message: statusCode === 500
        ? 'Bir hata oluştu. Lütfen tekrar deneyin.'
        : err.message,
      requestId: req.requestId,
      retryable: err.retryable ?? statusCode >= 500,
    },
  });
}

// ─────────────────────────────────────
// HATA OLUŞTURUCULAR
// ─────────────────────────────────────
export function createError(
  message: string,
  statusCode: number,
  code: number,
  type: string,
  retryable = false,
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.type = type;
  error.retryable = retryable;
  return error;
}

export const Errors = {
  notFound: (msg = 'Kaynak bulunamadı.') =>
    createError(msg, 404, 1002, 'NOT_FOUND'),

  unauthorized: (msg = 'Lütfen giriş yapın.') =>
    createError(msg, 401, 1003, 'UNAUTHORIZED'),

  forbidden: (msg = 'Bu işlem için yetkiniz yok.') =>
    createError(msg, 403, 1004, 'FORBIDDEN'),

  rateLimited: () =>
    createError('Çok fazla istek. Lütfen biraz bekleyin.', 429, 1005, 'RATE_LIMITED', true),

  conflict: (msg = 'Bu kaynak zaten mevcut.') =>
    createError(msg, 409, 1007, 'CONFLICT'),

  validation: (msg = 'Lütfen bilgilerinizi kontrol edin.') =>
    createError(msg, 400, 1001, 'VALIDATION_ERROR'),

  usageLimitReached: () =>
    createError('Bu ayki video kotanız doldu. Planınızı yükseltin.', 422, 5003, 'USAGE_LIMIT_REACHED'),

  aiGenerationFailed: () =>
    createError('Video üretilemedi. Farklı stil/ayar ile deneyin.', 502, 4004, 'AI_GENERATION_FAILED', true),

  aiProviderDown: () =>
    createError('Video servisi geçici olarak kullanılamıyor.', 503, 4006, 'AI_PROVIDER_DOWN', true),

  uploadFailed: () =>
    createError('Dosya yüklenemedi. Lütfen tekrar deneyin.', 500, 3003, 'UPLOAD_FAILED', true),
};
