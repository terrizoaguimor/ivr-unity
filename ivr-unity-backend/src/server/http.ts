import express, { Application, Request, Response, NextFunction } from 'express';
import { handleTelnyxVoiceWebhook, validateTelnyxSignature } from '../telephony/telnyx-handler';
import { sessionManager } from '../bridge/call-session';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Create and configure Express application
 */
export function createHttpServer(): Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug('HTTP request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      activeCalls: sessionManager.activeCount,
      environment: config.nodeEnv,
    });
  });

  // Readiness check
  app.get('/ready', (req: Request, res: Response) => {
    const ready =
      config.elevenlabs.apiKey !== '' &&
      config.elevenlabs.agentId !== '';

    if (ready) {
      res.json({ status: 'ready' });
    } else {
      res.status(503).json({
        status: 'not ready',
        reason: 'Missing required configuration',
      });
    }
  });

  // Telnyx voice webhook
  app.post('/telnyx/voice', (req: Request, res: Response) => {
    // Validate signature in production
    if (config.nodeEnv === 'production' && !validateTelnyxSignature(req)) {
      logger.warn('Invalid Telnyx signature');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    handleTelnyxVoiceWebhook(req, res);
  });

  // Telnyx status callback (optional)
  app.post('/telnyx/status', (req: Request, res: Response) => {
    logger.info('Telnyx status callback', { body: req.body });
    res.status(200).send();
  });

  // Session info endpoint (for debugging)
  app.get('/sessions', (req: Request, res: Response) => {
    if (config.nodeEnv !== 'development') {
      res.status(403).json({ error: 'Not available in production' });
      return;
    }

    const sessions = sessionManager.getActiveSessions().map((s) => s.getSummary());
    res.json({
      count: sessions.length,
      sessions,
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('HTTP error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
