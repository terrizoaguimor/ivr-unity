import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { WolkvoxClient } from '../wolkvox/wolkvox-client';

/**
 * Save conversation context before transfer (Client Tool)
 */
interface SaveContextPayload {
  caller_phone: string;
  caller_name?: string;
  issue_type: string; // "AUTO_ACCIDENT", "HOME_DAMAGE", "GENERAL_INQUIRY"
  summary: string;
  conversation_id: string;
}

export async function handleSaveContext(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload: SaveContextPayload = req.body;

    logger.info('Saving conversation context before transfer', {
      phone: payload.caller_phone,
      issueType: payload.issue_type,
      conversationId: payload.conversation_id,
    });

    // Build summary for Wolkvox
    const now = new Date();
    let summary = `🤖 CONTEXTO DE CONVERSACIÓN CON BOT\n\n`;
    summary += `Cliente: ${payload.caller_phone}\n`;
    if (payload.caller_name) {
      summary += `Nombre: ${payload.caller_name}\n`;
    }
    summary += `Hora: ${now.toLocaleString('es-US')}\n`;
    summary += `Tipo: ${payload.issue_type}\n\n`;
    summary += `Resumen:\n${payload.summary}\n\n`;
    summary += `⚠️ LLAMADA EN TRANSFERENCIA - Cliente espera asistencia`;

    // Send to Wolkvox immediately
    if (process.env.WOLKVOX_SERVER && process.env.WOLKVOX_TOKEN) {
      try {
        const wolkvoxClient = new WolkvoxClient({
          server: process.env.WOLKVOX_SERVER,
          token: process.env.WOLKVOX_TOKEN,
        });

        await wolkvoxClient.logInteraction({
          callId: payload.conversation_id,
          agentId: 'elevenlabs_pre_transfer',
          phoneNumber: payload.caller_phone,
          transcript: payload.summary,
          summary: summary,
          duration: 0, // Call still in progress
          timestamp: now.toISOString(),
        });

        logger.info('Context saved to Wolkvox successfully', {
          conversationId: payload.conversation_id,
          phone: payload.caller_phone,
        });

        // Return success to ElevenLabs agent
        res.status(200).json({
          success: true,
          message: 'Context saved successfully',
          timestamp: now.toISOString(),
        });
      } catch (error) {
        logger.error('Failed to save context to Wolkvox', {
          conversationId: payload.conversation_id,
          error,
        });

        // Still return success to agent so transfer can proceed
        res.status(200).json({
          success: true,
          message: 'Context saved (with warnings)',
          warning: 'Wolkvox logging failed but transfer will proceed',
        });
      }
    } else {
      logger.warn('Wolkvox not configured, skipping context save');
      res.status(200).json({
        success: true,
        message: 'Context received (Wolkvox not configured)',
      });
    }
  } catch (error) {
    logger.error('Error in handleSaveContext', { error });

    // Return success anyway so transfer isn't blocked
    res.status(200).json({
      success: true,
      message: 'Error saving context but transfer can proceed',
    });
  }
}
