import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { generateStreamTeXML } from './texml-generator';
import { config } from '../config';

/**
 * Telnyx webhook event types
 */
export type TelnyxEventType =
  | 'call.initiated'
  | 'call.answered'
  | 'call.hangup'
  | 'call.machine.detection.ended'
  | 'streaming.started'
  | 'streaming.stopped'
  | 'streaming.failed';

export interface TelnyxWebhookEvent {
  data: {
    event_type: TelnyxEventType;
    id: string;
    occurred_at: string;
    payload: {
      call_control_id: string;
      call_leg_id: string;
      call_session_id: string;
      connection_id: string;
      from: string;
      to: string;
      direction: 'incoming' | 'outgoing';
      state: string;
      start_time?: string;
      end_time?: string;
      hangup_cause?: string;
      hangup_source?: string;
    };
    record_type: string;
  };
  meta: {
    attempt: number;
    delivered_to: string;
  };
}

/**
 * Handle incoming Telnyx voice webhooks
 */
export function handleTelnyxVoiceWebhook(req: Request, res: Response): void {
  const event = req.body as TelnyxWebhookEvent;
  const eventType = event.data.event_type;
  const payload = event.data.payload;

  logger.info('Telnyx webhook received', {
    eventType,
    callControlId: payload.call_control_id,
    from: payload.from,
    to: payload.to,
  });

  switch (eventType) {
    case 'call.initiated':
      handleCallInitiated(res, payload);
      break;

    case 'call.answered':
      logger.info('Call answered', { callId: payload.call_control_id });
      res.status(200).send();
      break;

    case 'call.hangup':
      logger.info('Call ended', {
        callId: payload.call_control_id,
        cause: payload.hangup_cause,
        source: payload.hangup_source,
      });
      res.status(200).send();
      break;

    case 'streaming.started':
      logger.info('Audio streaming started', { callId: payload.call_control_id });
      res.status(200).send();
      break;

    case 'streaming.stopped':
      logger.info('Audio streaming stopped', { callId: payload.call_control_id });
      res.status(200).send();
      break;

    case 'streaming.failed':
      logger.error('Audio streaming failed', { callId: payload.call_control_id });
      res.status(200).send();
      break;

    default:
      logger.debug('Unhandled Telnyx event', { eventType });
      res.status(200).send();
  }
}

/**
 * Handle incoming call - respond with TeXML to start audio stream
 */
function handleCallInitiated(
  res: Response,
  payload: TelnyxWebhookEvent['data']['payload']
): void {
  const protocol = config.nodeEnv === 'production' ? 'wss' : 'ws';
  const host = process.env.HOST || 'localhost:' + config.port;
  const wsUrl = `${protocol}://${host}/stream`;

  const texml = generateStreamTeXML(wsUrl, {
    callId: payload.call_control_id,
    caller: payload.from,
    calledNumber: payload.to,
  });

  logger.info('Responding with Stream TeXML', {
    callId: payload.call_control_id,
    wsUrl,
  });

  res.set('Content-Type', 'application/xml');
  res.status(200).send(texml);
}

/**
 * Validate Telnyx webhook signature
 * Note: Implement proper signature validation in production
 */
export function validateTelnyxSignature(req: Request): boolean {
  const signature = req.headers['telnyx-signature-ed25519'];
  const timestamp = req.headers['telnyx-timestamp'];

  if (!signature || !timestamp) {
    logger.warn('Missing Telnyx signature headers');
    return false;
  }

  // TODO: Implement proper Ed25519 signature validation
  // For now, we'll trust the request in development
  if (config.nodeEnv === 'development') {
    return true;
  }

  // In production, implement signature validation using config.telnyx.publicKey
  return true;
}
