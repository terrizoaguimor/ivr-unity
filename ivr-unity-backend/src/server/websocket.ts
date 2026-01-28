import { Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { parse as parseUrl } from 'url';
import { AudioBridge } from '../bridge/audio-bridge';
import { sessionManager } from '../bridge/call-session';
import { logger } from '../utils/logger';

/**
 * Create WebSocket server for Telnyx audio streaming
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
 * Handle new WebSocket connection from Telnyx
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

      const { call_control_id, custom_parameters } = event.start;
      const caller = custom_parameters?.caller || 'unknown';
      const calledNumber = custom_parameters?.called_number;

      logger.info('Stream started', {
        callId: call_control_id,
        caller,
        calledNumber,
      });

      // Create session
      const session = sessionManager.createSession(
        call_control_id,
        caller,
        calledNumber
      );

      // Create and start audio bridge
      const bridge = new AudioBridge(ws, session);

      bridge.on('userTranscript', (text: string) => {
        logger.info('User said', { callId: call_control_id, text });
      });

      bridge.on('agentResponse', (text: string) => {
        logger.info('Agent said', { callId: call_control_id, text });
      });

      bridge.on('transfer', (department: string, reason?: string) => {
        logger.info('Transfer initiated', { callId: call_control_id, department, reason });
        // In a real implementation, you would use Telnyx Call Control API
        // to transfer the call to the appropriate queue
      });

      bridge.on('stopped', () => {
        logger.info('Bridge stopped', { callId: call_control_id });
      });

      try {
        await bridge.start();
      } catch (error) {
        logger.error('Failed to start bridge', { callId: call_control_id, error });
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
