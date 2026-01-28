import { createServer } from 'http';
import { config } from './config';
import { createHttpServer } from './server/http';
import { createWebSocketServer } from './server/websocket';
import { logger } from './utils/logger';

/**
 * Main entry point for the IVR Unity Backend
 */
async function main(): Promise<void> {
  logger.info('Starting IVR Unity Backend', {
    nodeEnv: config.nodeEnv,
    port: config.port,
  });

  // Validate configuration
  if (!config.elevenlabs.apiKey) {
    logger.error('ELEVENLABS_API_KEY is required');
    process.exit(1);
  }

  if (!config.elevenlabs.agentId) {
    logger.error('ELEVENLABS_AGENT_ID is required');
    process.exit(1);
  }

  // Create Express app
  const app = createHttpServer();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = createWebSocketServer(httpServer);

  // Start listening
  httpServer.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
    logger.info('Endpoints:');
    logger.info(`  - Health: http://localhost:${config.port}/health`);
    logger.info(`  - Telnyx Voice Webhook: http://localhost:${config.port}/telnyx/voice`);
    logger.info(`  - WebSocket Stream: ws://localhost:${config.port}/stream`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    // Close WebSocket server
    wss.close(() => {
      logger.info('WebSocket server closed');
    });

    // Close HTTP server
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force exit after timeout
    setTimeout(() => {
      logger.warn('Forced exit after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
  });
}

// Run
main().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});
