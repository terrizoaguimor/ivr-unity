import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { WolkvoxClient } from '../wolkvox/wolkvox-client';

/**
 * ElevenLabs Post-Call Webhook Payload
 */
interface ElevenLabsPostCallPayload {
  conversation_id: string;
  agent_id: string;
  call_duration_ms: number;
  status: 'completed' | 'failed' | 'transferred';
  transcript: Array<{
    role: 'user' | 'agent';
    message: string;
    timestamp: string;
  }>;
  analysis?: {
    summary?: string;
    sentiment?: string;
    intent?: string;
  };
  metadata?: {
    caller_number?: string;
    transfer_number?: string;
    transfer_reason?: string;
  };
  variables?: Record<string, any>;
}

/**
 * Handle ElevenLabs post-call webhook
 */
export async function handlePostCallWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload: ElevenLabsPostCallPayload = req.body;

    logger.info('ElevenLabs post-call webhook received', {
      conversationId: payload.conversation_id,
      agentId: payload.agent_id,
      duration: payload.call_duration_ms,
      status: payload.status,
    });

    // Extract call information
    const callerNumber = payload.metadata?.caller_number || 'unknown';
    const duration = Math.round(payload.call_duration_ms / 1000); // Convert to seconds

    // Build transcript text
    const transcriptText = payload.transcript
      .map((t) => `${t.role.toUpperCase()}: ${t.message}`)
      .join('\n');

    // Build summary
    let summary = `🤖 RESUMEN DE CONVERSACIÓN CON BOT\n\n`;
    summary += `Cliente: ${callerNumber}\n`;
    summary += `Duración: ${duration}s\n`;
    summary += `Inicio: ${new Date().toLocaleString('es-US')}\n\n`;

    // Check if call was transferred
    const wasTransferred = payload.status === 'transferred' || !!payload.metadata?.transfer_number;

    if (wasTransferred) {
      summary += `✅ TRANSFERIDO A: ${payload.metadata?.transfer_number || 'Agente humano'}\n`;
      if (payload.metadata?.transfer_reason) {
        summary += `Motivo: ${payload.metadata.transfer_reason}\n`;
      }
    } else {
      summary += `Llamada completada sin transferencia\n`;
    }

    summary += `\nConversación:\n${transcriptText}`;

    // Log interaction to Wolkvox
    if (process.env.WOLKVOX_SERVER && process.env.WOLKVOX_TOKEN) {
      try {
        const wolkvoxClient = new WolkvoxClient({
          server: process.env.WOLKVOX_SERVER,
          token: process.env.WOLKVOX_TOKEN,
        });

        await wolkvoxClient.logInteraction({
          callId: payload.conversation_id,
          agentId: wasTransferred ? 'elevenlabs_transfer' : 'elevenlabs_bot',
          phoneNumber: callerNumber,
          transcript: transcriptText,
          summary: summary,
          duration: payload.call_duration_ms,
          timestamp: new Date().toISOString(),
        });

        logger.info('Interaction logged to Wolkvox', {
          conversationId: payload.conversation_id,
          transferred: wasTransferred,
        });
      } catch (error) {
        logger.error('Failed to log interaction to Wolkvox', {
          conversationId: payload.conversation_id,
          error,
        });
      }
    }

    // Respond to ElevenLabs
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error processing post-call webhook', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
}
