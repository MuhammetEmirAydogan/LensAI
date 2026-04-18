import pino from 'pino';

export const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport:
    process.env['NODE_ENV'] === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    service: 'api-gateway',
    env: process.env['NODE_ENV'],
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.credit_card',
      'body.ssn',
    ],
    censor: '[REDACTED]',
  },
});
