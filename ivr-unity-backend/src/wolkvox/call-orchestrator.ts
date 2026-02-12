/**
 * Call Orchestrator - Wolkvox ↔ ElevenLabs
 *
 * Orquesta el flujo completo:
 * 1. Detecta llamadas entrantes en Wolkvox
 * 2. Conecta con ElevenLabs WebSocket
 * 3. Maneja la interacción del bot
 * 4. Guarda contexto
 * 5. Transfiere a agente humano con warm handoff
 * 6. Registra todo en Wolkvox
 */

import { EventEmitter } from 'events';
import { WolkvoxClient, WolkvoxAgent } from './wolkvox-client';
import { logger } from '../utils/logger';

export interface CallOrchestrationConfig {
  pollingIntervalMs: number; // Intervalo para consultar llamadas activas
  defaultSkillId?: string; // Skill por defecto para transfers
  autoTransferKeywords?: string[]; // Keywords que disparan transfer automático
  maxCallDurationMs?: number; // Duración máxima antes de forzar transfer
}

export interface ActiveCall {
  callId: string;
  agentId: string;
  phoneNumber: string;
  startTime: Date;
  elevenLabsConnected: boolean;
  transcript: string;
  summary: string;
  shouldTransfer: boolean;
  transferReason?: string;
}

export class CallOrchestrator extends EventEmitter {
  private wolkvoxClient: WolkvoxClient;
  private config: CallOrchestrationConfig;
  private activeCalls: Map<string, ActiveCall>;
  private pollingInterval: NodeJS.Timeout | null;
  private isRunning: boolean;

  constructor(
    wolkvoxClient: WolkvoxClient,
    config: CallOrchestrationConfig
  ) {
    super();
    this.wolkvoxClient = wolkvoxClient;
    this.config = config;
    this.activeCalls = new Map();
    this.pollingInterval = null;
    this.isRunning = false;

    logger.info('CallOrchestrator initialized', {
      pollingIntervalMs: config.pollingIntervalMs,
      defaultSkillId: config.defaultSkillId,
    });
  }

  /**
   * Iniciar el orquestador
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('CallOrchestrator already running');
      return;
    }

    logger.info('Starting CallOrchestrator');

    // Verificar que Wolkvox esté accesible
    const healthy = await this.wolkvoxClient.healthCheck();
    if (!healthy) {
      throw new Error('Wolkvox API is not accessible');
    }

    this.isRunning = true;

    // Iniciar polling de llamadas activas
    this.pollingInterval = setInterval(
      () => this.pollActiveCalls(),
      this.config.pollingIntervalMs
    );

    // Primera ejecución inmediata
    await this.pollActiveCalls();

    logger.info('CallOrchestrator started successfully');
    this.emit('started');
  }

  /**
   * Detener el orquestador
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    logger.info('Stopping CallOrchestrator');

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    // Cerrar llamadas activas
    for (const [callId, call] of this.activeCalls) {
      await this.endCall(callId, 'orchestrator_stopped');
    }

    this.isRunning = false;
    logger.info('CallOrchestrator stopped');
    this.emit('stopped');
  }

  /**
   * Polling de llamadas activas en Wolkvox
   */
  private async pollActiveCalls(): Promise<void> {
    try {
      const agentsOnCall = await this.wolkvoxClient.getAgentsOnCall();

      logger.debug('Polled active calls', {
        count: agentsOnCall.length,
      });

      // Procesar cada agente en llamada
      for (const agent of agentsOnCall) {
        const callId = `${agent.agent_id}-${Date.now()}`;

        // Si ya tenemos esta llamada, skip
        if (this.activeCalls.has(callId)) {
          continue;
        }

        // Nueva llamada detectada
        await this.handleNewCall(agent);
      }

      // Limpiar llamadas que ya terminaron
      await this.cleanupEndedCalls(agentsOnCall);

    } catch (error) {
      logger.error('Error polling active calls', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Manejar nueva llamada detectada
   */
  private async handleNewCall(agent: WolkvoxAgent): Promise<void> {
    const callId = `wv-${agent.agent_id}-${Date.now()}`;

    logger.info('New call detected', {
      callId,
      agentId: agent.agent_id,
      agentName: agent.agent_name,
    });

    const activeCall: ActiveCall = {
      callId,
      agentId: agent.agent_id,
      phoneNumber: 'unknown', // Extraer del agent si está disponible
      startTime: new Date(),
      elevenLabsConnected: false,
      transcript: '',
      summary: '',
      shouldTransfer: false,
    };

    this.activeCalls.set(callId, activeCall);

    try {
      // Conectar con ElevenLabs
      await this.connectElevenLabs(callId);

      this.emit('call:started', activeCall);

    } catch (error) {
      logger.error('Failed to handle new call', {
        callId,
        error: error instanceof Error ? error.message : String(error),
      });

      await this.endCall(callId, 'connection_failed');
    }
  }

  /**
   * Conectar llamada con ElevenLabs
   */
  private async connectElevenLabs(callId: string): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    logger.info('Connecting call to ElevenLabs', { callId });

    // Nota: Aquí se conectaría el audio de Wolkvox con ElevenLabs WebSocket
    // Esto requeriría un bridge de audio que capture el stream de Wolkvox
    // y lo envíe a ElevenLabs en tiempo real

    // Por ahora, simulamos la conexión
    call.elevenLabsConnected = true;

    // Escuchar eventos del bot
    this.setupElevenLabsListeners(callId);

    logger.info('ElevenLabs connected', { callId });
  }

  /**
   * Configurar listeners de eventos de ElevenLabs
   */
  private setupElevenLabsListeners(callId: string): void {
    // Aquí se conectarían los eventos reales de ElevenLabs
    // Por ahora, simulamos el flujo

    // Cuando el bot detecte que necesita transferir
    // (basado en keywords o tiempo de llamada)
    setTimeout(() => {
      const call = this.activeCalls.get(callId);
      if (call) {
        this.handleTransferRequest(callId, 'customer_request');
      }
    }, 30000); // Después de 30s, simular transfer
  }

  /**
   * Manejar solicitud de transfer
   */
  private async handleTransferRequest(
    callId: string,
    reason: string
  ): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      logger.warn('Transfer requested for unknown call', { callId });
      return;
    }

    logger.info('Transfer requested', {
      callId,
      reason,
    });

    call.shouldTransfer = true;
    call.transferReason = reason;

    // Generar resumen de la conversación
    const summary = await this.generateCallSummary(call);
    call.summary = summary;

    // Transferir a skill/queue
    const skillId = this.config.defaultSkillId || 'default';

    try {
      await this.wolkvoxClient.transferCallToSkill(
        call.agentId,
        skillId,
        summary
      );

      logger.info('Call transferred successfully', {
        callId,
        skillId,
      });

      this.emit('call:transferred', {
        callId,
        skillId,
        summary,
      });

      // Registrar en Wolkvox
      await this.wolkvoxClient.logInteraction({
        callId,
        agentId: call.agentId,
        phoneNumber: call.phoneNumber,
        transcript: call.transcript,
        summary: call.summary,
        duration: Date.now() - call.startTime.getTime(),
        timestamp: new Date().toISOString(),
      });

      // Finalizar seguimiento de esta llamada
      await this.endCall(callId, 'transferred');

    } catch (error) {
      logger.error('Failed to transfer call', {
        callId,
        error: error instanceof Error ? error.message : String(error),
      });

      this.emit('call:transfer_failed', {
        callId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Generar resumen de la llamada para el agente humano
   */
  private async generateCallSummary(call: ActiveCall): Promise<string> {
    // Aquí se generaría un resumen basado en el transcript
    // Por ahora, un resumen básico

    const duration = Math.floor((Date.now() - call.startTime.getTime()) / 1000);

    return `
🤖 RESUMEN DE CONVERSACIÓN CON BOT

Cliente: ${call.phoneNumber}
Duración con bot: ${duration}s
Motivo: ${call.transferReason || 'Solicitud de cliente'}

Transcript:
${call.transcript || 'No disponible'}

Siguiente acción: Atender consulta del cliente
    `.trim();
  }

  /**
   * Finalizar llamada
   */
  private async endCall(callId: string, reason: string): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      return;
    }

    logger.info('Ending call', {
      callId,
      reason,
      duration: Date.now() - call.startTime.getTime(),
    });

    // Desconectar ElevenLabs
    if (call.elevenLabsConnected) {
      // Aquí se cerraría la conexión WebSocket
      call.elevenLabsConnected = false;
    }

    this.activeCalls.delete(callId);

    this.emit('call:ended', {
      callId,
      reason,
    });
  }

  /**
   * Limpiar llamadas que ya terminaron
   */
  private async cleanupEndedCalls(activeAgents: WolkvoxAgent[]): Promise<void> {
    const activeAgentIds = new Set(activeAgents.map(a => a.agent_id));

    for (const [callId, call] of this.activeCalls) {
      // Si el agente ya no está en llamada, cerrar tracking
      if (!activeAgentIds.has(call.agentId)) {
        await this.endCall(callId, 'call_ended_in_wolkvox');
      }

      // Si la llamada excede el tiempo máximo, forzar transfer
      if (this.config.maxCallDurationMs) {
        const duration = Date.now() - call.startTime.getTime();
        if (duration > this.config.maxCallDurationMs && !call.shouldTransfer) {
          await this.handleTransferRequest(callId, 'max_duration_exceeded');
        }
      }
    }
  }

  /**
   * Obtener estado actual
   */
  getStatus(): {
    isRunning: boolean;
    activeCalls: number;
    calls: ActiveCall[];
  } {
    return {
      isRunning: this.isRunning,
      activeCalls: this.activeCalls.size,
      calls: Array.from(this.activeCalls.values()),
    };
  }

  /**
   * Forzar transfer manual de una llamada
   */
  async forceTransfer(callId: string, skillId?: string): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    const targetSkillId = skillId || this.config.defaultSkillId || 'default';

    logger.info('Forcing manual transfer', {
      callId,
      skillId: targetSkillId,
    });

    await this.handleTransferRequest(callId, 'manual_transfer');
  }
}
