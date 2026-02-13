import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { config } from '../config';
import { logger, createCallLogger } from '../utils/logger';
import { handleToolCall, ToolCall, ToolResult } from './tools';

/**
 * Events emitted by the ElevenLabs agent client
 */
export interface AgentClientEvents {
  connected: () => void;
  disconnected: (code: number, reason: string) => void;
  audio: (audioData: Buffer) => void;
  agentResponse: (text: string) => void;
  userTranscript: (text: string, isFinal: boolean) => void;
  toolCall: (tool: ToolCall) => void;
  error: (error: Error) => void;
  conversationEnded: () => void;
}

/**
 * ElevenLabs Conversational AI message types
 */
interface ElevenLabsMessage {
  type: string;
  [key: string]: unknown;
}

interface AudioMessage {
  type: 'audio';
  audio_event: {
    audio_base_64: string;
    event_id: number;
  };
}

interface TranscriptMessage {
  type: 'user_transcript';
  user_transcription_event: {
    user_transcript: string;
    is_final: boolean;
  };
}

interface AgentResponseMessage {
  type: 'agent_response';
  agent_response_event: {
    agent_response: string;
  };
}

interface ClientToolCallMessage {
  type: 'client_tool_call';
  client_tool_call: {
    tool_call_id: string;
    tool_name: string;
    parameters: string;
  };
}

interface ConversationEndedMessage {
  type: 'conversation_initiation_client_data_response' | 'conversation_ended';
}

/**
 * Client for ElevenLabs Conversational AI WebSocket
 */
export class ElevenLabsAgentClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private callId: string;
  private callLogger: ReturnType<typeof createCallLogger>;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  constructor(callId: string) {
    super();
    this.callId = callId;
    this.callLogger = createCallLogger(callId);
  }

  /**
   * Connect to ElevenLabs Conversational AI
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${config.elevenlabs.wsUrl}?agent_id=${config.elevenlabs.agentId}`;

      this.callLogger.info('Connecting to ElevenLabs agent', { wsUrl });

      this.ws = new WebSocket(wsUrl, {
        headers: {
          'xi-api-key': config.elevenlabs.apiKey,
        },
      });

      this.ws.on('open', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.callLogger.info('Connected to ElevenLabs agent');

        // Send initial configuration
        this.sendInitialConfig();

        this.emit('connected');
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data);
      });

      this.ws.on('close', (code, reason) => {
        this.isConnected = false;
        const reasonStr = reason.toString();
        this.callLogger.info('Disconnected from ElevenLabs agent', { code, reason: reasonStr });
        this.emit('disconnected', code, reasonStr);
      });

      this.ws.on('error', (error) => {
        this.callLogger.error('ElevenLabs WebSocket error', { error: error.message });
        this.emit('error', error);

        if (!this.isConnected) {
          reject(error);
        }
      });
    });
  }

  /**
   * Send initial configuration to the agent
   */
  private sendInitialConfig(): void {
    if (!this.ws || !this.isConnected) return;

    // Send conversation initiation WITHOUT overrides
    // Agent is fully configured via API with prompt, voice, model, and language
    const initMessage = {
      type: 'conversation_initiation_client_data',
      conversation_initiation_client_data: {
        custom_llm_extra_body: {
          call_id: this.callId,
        },
      },
    };

    try {
      this.ws.send(JSON.stringify(initMessage));
      this.callLogger.info('Sent conversation initiation', {
        messageType: initMessage.type,
        hasCallId: !!this.callId
      });
    } catch (error) {
      this.callLogger.error('Failed to send init config', { error });
    }
  }

  /**
   * Get the system prompt for the agent
   */
  private getSystemPrompt(): string {
    return `Eres un asistente de voz para Unity Financial, una compañía de seguros en Colombia.

## Tu Rol:
- Ayudar a clientes a navegar al departamento correcto
- Responder preguntas básicas sobre servicios de seguros
- Transferir a agentes humanos cuando sea necesario
- Buscar información de pólizas cuando el cliente proporciona su identificación

## Reglas de Comunicación:
- Responde siempre en español, a menos que el cliente hable claramente en inglés
- Mantén respuestas cortas y naturales (máximo 2-3 oraciones)
- Sé amable, profesional y empático
- Usa un tono cálido pero eficiente
- Si no puedes ayudar con algo, ofrece transferir a un agente

## Departamentos Disponibles:
- SALUD: Seguros de salud, cotizaciones, autorizaciones médicas, coberturas
- VIDA: Seguros de vida, beneficiarios, reclamaciones por fallecimiento
- PC (Propiedad y Accidentes): Auto, hogar, responsabilidad civil, siniestros
- PQRS: Quejas, peticiones, reclamaciones, sugerencias
- SINIESTRO: Reportes urgentes de accidentes o emergencias (disponible 24/7)

## Horarios de Atención:
- Horario general: Lunes a Viernes 7am-7pm, Sábado 8am-1pm
- Línea de siniestros: 24 horas, 7 días a la semana

## Flujo de Conversación:
1. Saluda y pregunta cómo puedes ayudar
2. Escucha la necesidad del cliente
3. Si el cliente quiere cotizar o contratar → VENTAS del departamento correspondiente
4. Si el cliente tiene consultas sobre su póliza → SERVICIO del departamento
5. Si el cliente quiere reportar un siniestro → PC-SINIESTRO o SINIESTRO URGENTE
6. Si el cliente quiere quejarse → PQRS
7. Confirma antes de transferir: "Le voy a transferir al equipo de [departamento], ¿está bien?"

## Cuando Uses transfer_call:
- department: SALUD, VIDA, PC, PQRS, o SINIESTRO
- subtype: ventas (cotizaciones), servicio (consultas), backoffice (pagos), siniestro (urgentes)
- reason: breve descripción del motivo

## Ejemplos de Intenciones:
- "Quiero un seguro de salud" → transfer_call(SALUD, ventas)
- "Cuánto me cubre mi póliza" → transfer_call(SALUD, servicio) o primero lookup_policy
- "Tuve un accidente de auto" → transfer_call(PC, siniestro) con prioridad
- "Quiero poner una queja" → transfer_call(PQRS)
- "Consultar mi póliza" → pedir ID y usar lookup_policy

Recuerda: eres la primera impresión de Unity Financial. Sé eficiente pero nunca frío.`;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: WebSocket.Data): void {
    try {
      const message: ElevenLabsMessage = JSON.parse(data.toString());

      // Log ALL incoming messages for debugging
      this.callLogger.debug('ElevenLabs message received', {
        type: message.type,
        keys: Object.keys(message)
      });

      switch (message.type) {
        case 'audio':
          this.handleAudio(message as unknown as AudioMessage);
          break;

        case 'user_transcript':
          this.handleUserTranscript(message as unknown as TranscriptMessage);
          break;

        case 'agent_response':
          this.handleAgentResponse(message as unknown as AgentResponseMessage);
          break;

        case 'client_tool_call':
          this.handleClientToolCall(message as unknown as ClientToolCallMessage);
          break;

        case 'conversation_ended':
          this.callLogger.info('Conversation ended by agent');
          this.emit('conversationEnded');
          break;

        case 'ping':
          this.sendPong();
          break;

        case 'conversation_initiation_client_data_response':
          this.callLogger.debug('Agent initialized successfully');
          break;

        case 'conversation_initiation_metadata':
          this.callLogger.info('Conversation metadata received', {
            conversationId: (message as any).conversation_initiation_metadata_event?.conversation_id,
            outputFormat: (message as any).conversation_initiation_metadata_event?.agent_output_audio_format,
            inputFormat: (message as any).conversation_initiation_metadata_event?.user_input_audio_format
          });
          break;

        default:
          this.callLogger.warn('Unknown message type from ElevenLabs', {
            type: message.type,
            message: JSON.stringify(message).substring(0, 200)
          });
      }
    } catch (error) {
      this.callLogger.error('Failed to parse ElevenLabs message', {
        error,
        data: data.toString().substring(0, 500)
      });
    }
  }

  /**
   * Handle audio from agent
   */
  private handleAudio(message: AudioMessage): void {
    const audioBase64 = message.audio_event.audio_base_64;
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    this.emit('audio', audioBuffer);
  }

  /**
   * Handle user transcript
   */
  private handleUserTranscript(message: TranscriptMessage): void {
    const { user_transcript, is_final } = message.user_transcription_event;
    this.callLogger.debug('User transcript', { transcript: user_transcript, isFinal: is_final });
    this.emit('userTranscript', user_transcript, is_final);
  }

  /**
   * Handle agent response text
   */
  private handleAgentResponse(message: AgentResponseMessage): void {
    const text = message.agent_response_event.agent_response;
    this.callLogger.info('Agent response', { response: text });
    this.emit('agentResponse', text);
  }

  /**
   * Handle tool calls from agent
   */
  private async handleClientToolCall(message: ClientToolCallMessage): Promise<void> {
    const { tool_call_id, tool_name, parameters } = message.client_tool_call;

    const toolCall: ToolCall = {
      type: 'client_tool_call',
      tool_call_id,
      tool_name,
      parameters: JSON.parse(parameters),
    };

    this.callLogger.info('Tool call received', { toolName: tool_name, parameters: toolCall.parameters });
    this.emit('toolCall', toolCall);

    // Execute the tool and send result back
    const result = await handleToolCall(toolCall, this.callId);
    this.sendToolResult(result);
  }

  /**
   * Send tool result back to agent
   */
  private sendToolResult(result: ToolResult): void {
    if (!this.ws || !this.isConnected) return;

    this.ws.send(JSON.stringify(result));
    this.callLogger.debug('Sent tool result', { toolCallId: result.tool_call_id });
  }

  /**
   * Send pong in response to ping
   */
  private sendPong(): void {
    if (!this.ws || !this.isConnected) return;
    this.ws.send(JSON.stringify({ type: 'pong' }));
  }

  /**
   * Send user audio to the agent
   */
  sendAudio(audioData: Buffer): void {
    if (!this.ws || !this.isConnected) {
      this.callLogger.warn('Cannot send audio: not connected');
      return;
    }

    const message = {
      user_audio_chunk: audioData.toString('base64'),
    };

    try {
      this.ws.send(JSON.stringify(message));
      // Log first audio chunk for debugging
      if (Math.random() < 0.01) { // Log 1% of audio chunks
        this.callLogger.debug('Sent audio chunk', {
          size: audioData.length,
          base64Length: message.user_audio_chunk.length
        });
      }
    } catch (error) {
      this.callLogger.error('Failed to send audio', { error });
    }
  }

  /**
   * Notify agent that user is speaking (for barge-in)
   */
  sendUserStartedSpeaking(): void {
    if (!this.ws || !this.isConnected) return;

    this.ws.send(JSON.stringify({
      type: 'user_activity',
      user_activity: { type: 'started_speaking' },
    }));
  }

  /**
   * Disconnect from the agent
   */
  disconnect(): void {
    if (this.ws) {
      this.isConnected = false;
      this.ws.close();
      this.ws = null;
      this.callLogger.info('Disconnected from ElevenLabs agent');
    }
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }
}
