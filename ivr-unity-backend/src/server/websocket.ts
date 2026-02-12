import { Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { parse as parseUrl } from 'url';
import { TwilioAudioBridge } from '../bridge/twilio-audio-bridge';
import { sessionManager } from '../bridge/call-session';
import { logger } from '../utils/logger';
import { WolkvoxClient } from '../wolkvox/wolkvox-client';
import { WolkvoxCallHandler } from '../wolkvox/wolkvox-call-handler';
import { config } from '../config';

// Store Wolkvox client instance
let wolkvoxClientInstance: WolkvoxClient | null = null;

/**
 * Initialize Wolkvox client for WebSocket server
 */
export function initializeWolkvoxClient(client: WolkvoxClient): void {
  wolkvoxClientInstance = client;
  logger.info('Wolkvox client initialized in WebSocket server');
}

/**
 * Create WebSocket server for Twilio audio streaming
 */
export function createWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/stream',
  });

  logger.info('WebSocket server created on path /stream');

  wss.on('connection', (ws: WebSocket, request) => {
    const url = parseUrl(request.url || '', true);
    const queryParams = url.query;

    logger.info('New WebSocket connection', {
      ip: request.socket.remoteAddress,
      query: queryParams,
    });

    handleNewConnection(ws, queryParams);
  });

  wss.on('error', (error) => {
    logger.error('WebSocket server error', { error: error.message });
  });

  return wss;
}

/**
 * Handle new WebSocket connection from Twilio
 */
async function handleNewConnection(
  ws: WebSocket,
  queryParams: Record<string, string | string[] | undefined>
): Promise<void> {
  // Wait for the start event to get call parameters
  const startTimeout = setTimeout(() => {
    logger.warn('No start event received, closing connection');
    ws.close();
  }, 10000);

  ws.once('message', async (data: WebSocket.Data) => {
    clearTimeout(startTimeout);

    try {
      const event = JSON.parse(data.toString());

      if (event.event !== 'start') {
        logger.warn('First message was not start event', { event: event.event });
        ws.close();
        return;
      }

      const { callSid, customParameters } = event.start;
      const caller = customParameters?.caller || 'unknown';
      const calledNumber = customParameters?.calledNumber || config.twilio.phoneNumber;

      logger.info('Stream started', {
        callSid,
        caller,
        calledNumber,
      });

      // Create session
      const session = sessionManager.createSession(
        callSid,
        caller,
        calledNumber
      );

      // Create audio bridge
      const bridge = new TwilioAudioBridge(ws, session);

      // Create Wolkvox handler if client is available
      let wolkvoxHandler: WolkvoxCallHandler | null = null;
      if (wolkvoxClientInstance) {
        wolkvoxHandler = new WolkvoxCallHandler(
          session,
          wolkvoxClientInstance,
          caller
        );
        wolkvoxHandler.attachBridge(bridge);
        logger.info('Wolkvox handler attached', { callSid });
      }

      bridge.on('userTranscript', (text: string) => {
        logger.info('User said', { callSid, text });
      });

      bridge.on('agentResponse', (text: string) => {
        logger.info('Agent said', { callSid, text });
      });

      bridge.on('transfer', (department: string, reason?: string) => {
        logger.info('Transfer initiated', { callSid, department, reason });
        // TODO: Implement Twilio call transfer to Wolkvox number
        // For now, just log - Wolkvox handler will log the interaction
      });

      bridge.on('stopped', () => {
        logger.info('Bridge stopped', { callSid });
      });

      try {
        await bridge.start();
      } catch (error) {
        logger.error('Failed to start bridge', { callSid, error });
        ws.close();
      }
    } catch (error) {
      logger.error('Failed to handle start event', { error });
      ws.close();
    }
  });

  ws.on('close', (code, reason) => {
    clearTimeout(startTimeout);
    logger.debug('WebSocket closed before start', { code, reason: reason.toString() });
  });
}

/**
 * Get WebSocket server stats
 */
export function getWebSocketStats(wss: WebSocketServer): {
  connections: number;
} {
  return {
    connections: wss.clients.size,
  };
}
