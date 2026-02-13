import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { logger } from '../utils/logger';
import { WolkvoxClient } from '../wolkvox/wolkvox-client';
import { ElevenLabsConversationClient } from '../elevenlabs/conversation-client';

/**
 * Verify ElevenLabs webhook signature
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) {
    logger.warn('No webhook signature provided');
    return false;
  }

  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Compare signatures (constant-time comparison to prevent timing attacks)
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return createHmac('sha256', secret)
      .update(signatureBuffer)
      .digest()
      .equals(createHmac('sha256', secret).update(expectedBuffer).digest());
  } catch (error) {
    logger.error('Error verifying webhook signature', { error });
    return false;
  }
}

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
    // Verify webhook signature if secret is configured
    if (process.env.ELEVENLABS_WEBHOOK_SECRET) {
      const signature = req.headers['x-elevenlabs-signature'] as string | undefined;
      const rawBody = JSON.stringify(req.body);

      const isValid = verifyWebhookSignature(
        rawBody,
        signature,
        process.env.ELEVENLABS_WEBHOOK_SECRET
      );

      if (!isValid) {
        logger.warn('Invalid webhook signature', {
          signature,
          headers: req.headers,
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      logger.info('Webhook signature verified successfully');
    }

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

    // Log interaction to Wolkvox con audio completo
    if (process.env.WOLKVOX_SERVER && process.env.WOLKVOX_TOKEN && process.env.ELEVENLABS_API_KEY) {
      try {
        const wolkvoxClient = new WolkvoxClient({
          server: process.env.WOLKVOX_SERVER,
          token: process.env.WOLKVOX_TOKEN,
        });

        const elevenLabsClient = new ElevenLabsConversationClient({
          apiKey: process.env.ELEVENLABS_API_KEY,
        });

        // Paso 1: Obtener conversación completa de ElevenLabs
        logger.info('Fetching complete conversation from ElevenLabs', {
          conversationId: payload.conversation_id,
        });

        const conversation = await elevenLabsClient.getConversation(payload.conversation_id);
        const formattedTranscript = await elevenLabsClient.getFormattedTranscript(payload.conversation_id);

        // Paso 2: Descargar audio si está disponible
        let audioFileName: string | undefined;

        if (conversation.has_audio) {
          try {
            logger.info('Downloading conversation audio from ElevenLabs', {
              conversationId: payload.conversation_id,
            });

            const audioBuffer = await elevenLabsClient.getConversationAudio(payload.conversation_id);
            audioFileName = `elevenlabs_${payload.conversation_id}.mp3`;

            // Paso 3: Subir audio a Wolkvox
            logger.info('Uploading audio to Wolkvox', {
              conversationId: payload.conversation_id,
              fileName: audioFileName,
              sizeBytes: audioBuffer.length,
            });

            await wolkvoxClient.uploadAudio(audioBuffer, audioFileName);

            logger.info('Audio uploaded successfully to Wolkvox', {
              conversationId: payload.conversation_id,
              fileName: audioFileName,
            });
          } catch (audioError) {
            logger.warn('Failed to download/upload audio, continuing without it', {
              conversationId: payload.conversation_id,
              error: audioError instanceof Error ? audioError.message : String(audioError),
            });
            audioFileName = undefined;
          }
        } else {
          logger.info('No audio available for this conversation', {
            conversationId: payload.conversation_id,
          });
        }

        // Paso 4: Registrar interacción en Wolkvox con audio adjunto
        await wolkvoxClient.logInteraction({
          callId: payload.conversation_id,
          agentId: process.env.WOLKVOX_BOT_AGENT_ID || '',
          phoneNumber: callerNumber,
          transcript: formattedTranscript,
          summary: summary,
          duration: payload.call_duration_ms,
          timestamp: new Date().toISOString(),
        });

        logger.info('Complete interaction logged to Wolkvox', {
          conversationId: payload.conversation_id,
          transferred: wasTransferred,
          hasAudio: !!audioFileName,
          audioFile: audioFileName,
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
