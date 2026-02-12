import express, { Application, Request, Response, NextFunction } from 'express';
import { handleTwilioVoiceWebhook, handleTwilioStatusCallback, validateTwilioSignature } from '../telephony/twilio-handler';
import { sessionManager } from '../bridge/call-session';
import { config } from '../config';
import { logger } from '../utils/logger';
import {
  handleBuscarCliente,
  handleGuardarContexto,
  handleCrearSiniestro,
} from './elevenlabs-webhooks';
import {
  getWolkvoxStatus,
  getActiveCalls,
  forceTransfer,
  getAgents,
  getSkills,
  startOrchestrator,
  stopOrchestrator,
} from './wolkvox-routes';

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
    logger.info('HTTP request', {
      method: req.method,
      path: req.path,
      url: req.url,
      originalUrl: req.originalUrl,
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    logger.info('Health check requested');
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

  // Twilio voice webhook
  app.post('/twilio/voice', (req: Request, res: Response) => {
    // Validate signature in production
    if (config.nodeEnv === 'production' && !validateTwilioSignature(req)) {
      logger.warn('Invalid Twilio signature');
      res.status(403).send('Forbidden');
      return;
    }

    handleTwilioVoiceWebhook(req, res);
  });

  // Twilio status callback (optional)
  app.post('/twilio/status', (req: Request, res: Response) => {
    handleTwilioStatusCallback(req, res);
  });

  // ========================================
  // ElevenLabs Webhook Endpoints (P&C MOCK)
  // ========================================

  // Buscar cliente por teléfono
  app.get('/api/elevenlabs/buscar-cliente', handleBuscarCliente);

  // Guardar contexto antes de transferencia
  app.post('/api/elevenlabs/guardar-contexto', handleGuardarContexto);

  // Crear siniestro (FUTURO)
  app.post('/api/elevenlabs/crear-siniestro', handleCrearSiniestro);

  // ========================================
  // Wolkvox Control Endpoints
  // ========================================

  // Get orchestrator and Wolkvox status
  app.get('/api/wolkvox/status', getWolkvoxStatus);

  // Get active calls
  app.get('/api/wolkvox/active-calls', getActiveCalls);

  // Force transfer a call
  app.post('/api/wolkvox/transfer', forceTransfer);

  // Get real-time agents (query param: ?status=available|oncall)
  app.get('/api/wolkvox/agents', getAgents);

  // Get real-time skills/queues
  app.get('/api/wolkvox/skills', getSkills);

  // Start orchestrator
  app.post('/api/wolkvox/start', startOrchestrator);

  // Stop orchestrator
  app.post('/api/wolkvox/stop', stopOrchestrator);

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
