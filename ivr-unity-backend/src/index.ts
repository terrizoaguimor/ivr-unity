import { createServer } from 'http';
import { config } from './config';
import { createHttpServer } from './server/http';
import { createWebSocketServer, initializeWolkvoxClient } from './server/websocket';
import { logger } from './utils/logger';
import { WolkvoxClient } from './wolkvox/wolkvox-client';
import { CallOrchestrator } from './wolkvox/call-orchestrator';
import { initializeWolkvoxRoutes } from './server/wolkvox-routes';

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

  // Initialize Wolkvox integration (if configured)
  let wolkvoxClient: WolkvoxClient | null = null;
  let callOrchestrator: CallOrchestrator | null = null;

  if (config.wolkvox.token) {
    logger.info('Initializing Wolkvox integration');

    // Create Wolkvox client
    wolkvoxClient = new WolkvoxClient({
      server: config.wolkvox.server,
      token: config.wolkvox.token,
      baseUrl: config.wolkvox.baseUrl,
    });

    // Create call orchestrator
    callOrchestrator = new CallOrchestrator(
      wolkvoxClient,
      {
        pollingIntervalMs: config.wolkvox.pollingIntervalMs,
        defaultSkillId: config.wolkvox.defaultSkillId,
        maxCallDurationMs: config.wolkvox.maxCallDurationMs,
      }
    );

    // Initialize routes with orchestrator
    initializeWolkvoxRoutes(callOrchestrator, wolkvoxClient);

    // Initialize Wolkvox client in WebSocket server
    initializeWolkvoxClient(wolkvoxClient);

    logger.info('Wolkvox integration initialized');
  } else {
    logger.warn('Wolkvox token not configured, Wolkvox integration disabled');
  }

  // Create Express app
  const app = createHttpServer();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = createWebSocketServer(httpServer);

  // Start listening
  httpServer.listen(config.port, async () => {
    logger.info(`Server listening on port ${config.port}`);
    logger.info('Endpoints:');
    logger.info(`  - Health: http://localhost:${config.port}/health`);
    logger.info(`  - Twilio Voice Webhook: http://localhost:${config.port}/twilio/voice`);
    logger.info(`  - WebSocket Stream: ws://localhost:${config.port}/stream`);

    if (callOrchestrator) {
      logger.info(`  - Wolkvox Status: http://localhost:${config.port}/api/wolkvox/status`);
      logger.info(`  - Wolkvox Active Calls: http://localhost:${config.port}/api/wolkvox/active-calls`);
      logger.info(`  - Wolkvox Agents: http://localhost:${config.port}/api/wolkvox/agents`);

      // Start call orchestrator
      try {
        await callOrchestrator.start();
        logger.info('Call orchestrator started successfully');
      } catch (error) {
        logger.error('Failed to start call orchestrator', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    // Stop call orchestrator
    if (callOrchestrator) {
      try {
        await callOrchestrator.stop();
        logger.info('Call orchestrator stopped');
      } catch (error) {
        logger.error('Error stopping call orchestrator', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

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
