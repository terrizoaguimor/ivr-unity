import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { generateStreamTwiML } from './twiml-generator';
import { config } from '../config';
import crypto from 'crypto';

/**
 * Twilio webhook event types
 */
export type TwilioEventType = 'inbound' | 'status';

export interface TwilioVoiceWebhook {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: string;
  Direction: string;
  Caller?: string;
  Called?: string;
}

/**
 * Handle incoming Twilio voice webhooks
 */
export function handleTwilioVoiceWebhook(req: Request, res: Response): void {
  const webhook = req.body as TwilioVoiceWebhook;

  logger.info('Twilio webhook received', {
    callSid: webhook.CallSid,
    from: webhook.From,
    to: webhook.To,
    status: webhook.CallStatus,
    direction: webhook.Direction,
  });

  // Generate WebSocket URL for streaming
  const protocol = config.nodeEnv === 'production' ? 'wss' : 'ws';
  const host = process.env.HOST || `localhost:${config.port}`;
  const wsUrl = `${protocol}://${host}/stream`;

  // Generate TwiML to start audio stream
  const twiml = generateStreamTwiML(wsUrl, {
    callSid: webhook.CallSid,
    caller: webhook.From,
    calledNumber: webhook.To,
  });

  logger.info('Responding with TwiML Stream', {
    callSid: webhook.CallSid,
    wsUrl,
  });

  res.set('Content-Type', 'application/xml');
  res.status(200).send(twiml);
}

/**
 * Handle Twilio status callbacks
 */
export function handleTwilioStatusCallback(req: Request, res: Response): void {
  const webhook = req.body as TwilioVoiceWebhook;

  logger.info('Twilio status callback', {
    callSid: webhook.CallSid,
    status: webhook.CallStatus,
  });

  res.status(200).send();
}

/**
 * Validate Twilio request signature
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function validateTwilioSignature(req: Request): boolean {
  const signature = req.headers['x-twilio-signature'] as string;

  if (!signature) {
    logger.warn('Missing Twilio signature header');
    return false;
  }

  // In development, skip validation
  if (config.nodeEnv === 'development') {
    return true;
  }

  const authToken = config.twilio.authToken;
  const url = `https://${req.hostname}${req.originalUrl}`;
  const params = req.body;

  // Compute expected signature
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);

  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');

  const isValid = signature === expectedSignature;

  if (!isValid) {
    logger.warn('Invalid Twilio signature', {
      expected: expectedSignature,
      received: signature,
    });
  }

  return isValid;
}
