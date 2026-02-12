/**
 * Wolkvox Call Handler
 *
 * Integrates Telnyx/ElevenLabs calls with Wolkvox tracking and transfer
 */

import { CallSession } from '../bridge/call-session';
import { WolkvoxClient } from './wolkvox-client';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';
import { transferCallToWolkvoxSIP } from './sip-transfer';

export interface WolkvoxCallContext {
  wolkvoxCallId?: string; // ID de llamada en Wolkvox (si viene de allí)
  customerPhone: string;
  startTime: Date;
  transcript: string[];
  agentResponses: string[];
  toolsUsed: string[];
}

/**
 * Handler que conecta una llamada de Telnyx/ElevenLabs con Wolkvox
 */
export class WolkvoxCallHandler {
  private session: CallSession;
  private audioBridge: EventEmitter | null;
  private wolkvoxClient: WolkvoxClient;
  private context: WolkvoxCallContext;
  private transferRequested: boolean;
  private transferDestination?: string;
  private transferReason?: string;

  constructor(
    session: CallSession,
    wolkvoxClient: WolkvoxClient,
    customerPhone: string,
    wolkvoxCallId?: string
  ) {
    this.session = session;
    this.wolkvoxClient = wolkvoxClient;
    this.audioBridge = null;
    this.transferRequested = false;

    this.context = {
      wolkvoxCallId,
      customerPhone,
      startTime: new Date(),
      transcript: [],
      agentResponses: [],
      toolsUsed: [],
    };

    logger.info('WolkvoxCallHandler created', {
      callId: session.callId,
      customerPhone,
      wolkvoxCallId,
    });
  }

  /**
   * Attach an AudioBridge to this handler
   */
  attachBridge(bridge: EventEmitter): void {
    this.audioBridge = bridge;

    // Listen to bridge events
    bridge.on('userTranscript', (text: string) => {
      this.context.transcript.push(`USER: ${text}`);
      logger.debug('User transcript captured', {
        callId: this.session.callId,
        text,
      });
    });

    bridge.on('agentResponse', (text: string) => {
      this.context.agentResponses.push(text);
      this.context.transcript.push(`AGENT: ${text}`);
      logger.debug('Agent response captured', {
        callId: this.session.callId,
        text,
      });
    });

    bridge.on('transfer', (department: string, reason?: string) => {
      this.handleTransferRequest(department, reason);
    });

    bridge.on('stopped', () => {
      this.handleCallEnded();
    });

    logger.info('AudioBridge attached to WolkvoxCallHandler', {
      callId: this.session.callId,
    });
  }

  /**
   * Handle transfer request from bot
   */
  private async handleTransferRequest(
    department: string,
    reason?: string
  ): Promise<void> {
    this.transferRequested = true;
    this.transferDestination = department;
    this.transferReason = reason;

    logger.info('Transfer requested by bot', {
      callId: this.session.callId,
      department,
      reason,
    });

    // Generate summary for Wolkvox agent
    const summary = this.generateCallSummary();

    // Map department to Wolkvox skill ID
    const skillId = this.mapDepartmentToSkill(department);

    try {
      // Log interaction in Wolkvox
      await this.wolkvoxClient.logInteraction({
        callId: this.session.callId,
        phoneNumber: this.context.customerPhone,
        transcript: this.context.transcript.join('\n'),
        summary,
        duration: Date.now() - this.context.startTime.getTime(),
        timestamp: new Date().toISOString(),
      });

      logger.info('Call context logged in Wolkvox', {
        callId: this.session.callId,
        skillId,
      });

      // Transfer call to Wolkvox via SIP
      await transferCallToWolkvoxSIP(
        this.session.callId,
        department,
        summary
      );

      logger.info('Call transferred to Wolkvox via SIP', {
        callId: this.session.callId,
        department,
      });

    } catch (error) {
      logger.error('Failed to log transfer in Wolkvox', {
        callId: this.session.callId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Handle call ended
   */
  private async handleCallEnded(): Promise<void> {
    logger.info('Call ended, finalizing Wolkvox integration', {
      callId: this.session.callId,
      duration: Date.now() - this.context.startTime.getTime(),
      transferRequested: this.transferRequested,
    });

    // If transfer wasn't requested, log the completed interaction
    if (!this.transferRequested) {
      try {
        await this.wolkvoxClient.logInteraction({
          callId: this.session.callId,
          phoneNumber: this.context.customerPhone,
          transcript: this.context.transcript.join('\n'),
          summary: this.generateCallSummary(),
          duration: Date.now() - this.context.startTime.getTime(),
          timestamp: new Date().toISOString(),
        });

        logger.info('Call logged in Wolkvox (no transfer)', {
          callId: this.session.callId,
        });
      } catch (error) {
        logger.error('Failed to log call in Wolkvox', {
          callId: this.session.callId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Generate call summary for human agent
   */
  private generateCallSummary(): string {
    const duration = Math.floor(
      (Date.now() - this.context.startTime.getTime()) / 1000
    );

    const summary = `
🤖 RESUMEN DE CONVERSACIÓN CON BOT

Cliente: ${this.context.customerPhone}
Duración: ${duration}s
Inicio: ${this.context.startTime.toLocaleString('es-CO')}

${this.transferRequested ? `Motivo de transferencia: ${this.transferReason || 'Solicitud del cliente'}` : 'Llamada completada sin transferencia'}

Conversación:
${this.context.transcript.slice(-10).join('\n')}

${this.context.toolsUsed.length > 0 ? `\nHerramientas usadas: ${this.context.toolsUsed.join(', ')}` : ''}
    `.trim();

    return summary;
  }

  /**
   * Map department name to Wolkvox skill ID
   */
  private mapDepartmentToSkill(department: string): string {
    // This should map to actual Wolkvox skill IDs
    const skillMap: Record<string, string> = {
      'ventas': 'VQ_PYC_VENTAS',
      'servicio': 'VQ_PYC_SERVICIO',
      'siniestros': 'VQ_PYC_SINIESTRO',
      'general': 'VQ_PYC_GENERAL',
    };

    return skillMap[department.toLowerCase()] || skillMap['general'];
  }

  /**
   * Get current call context
   */
  getContext(): WolkvoxCallContext {
    return { ...this.context };
  }

  /**
   * Record a tool call
   */
  recordToolCall(toolName: string): void {
    if (!this.context.toolsUsed.includes(toolName)) {
      this.context.toolsUsed.push(toolName);
    }
  }
}
