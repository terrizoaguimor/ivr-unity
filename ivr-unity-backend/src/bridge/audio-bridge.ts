import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { ElevenLabsAgentClient } from '../elevenlabs/agent-client';
import { CallSession } from './call-session';
import { telnyxToElevenLabs, elevenLabsToTelnyx } from '../utils/audio-converter';
import { createCallLogger } from '../utils/logger';

/**
 * Telnyx WebSocket media event
 */
interface TelnyxMediaEvent {
  event: 'media' | 'start' | 'stop' | 'mark';
  sequence_number?: number;
  media?: {
    track: 'inbound' | 'outbound';
    chunk: number;
    timestamp: string;
    payload: string; // Base64 encoded audio
  };
  start?: {
    stream_id: string;
    call_control_id: string;
    client_state?: string;
    custom_parameters?: Record<string, string>;
  };
  stop?: {
    stream_id: string;
    call_control_id: string;
  };
}

/**
 * Audio bridge that connects Telnyx WebSocket to ElevenLabs Agent
 */
export class AudioBridge extends EventEmitter {
  private telnyxWs: WebSocket;
  private agentClient: ElevenLabsAgentClient;
  private session: CallSession;
  private callLogger: ReturnType<typeof createCallLogger>;
  private isStreaming = false;
  private streamId: string | null = null;
  private audioQueue: Buffer[] = [];
  private processingAudio = false;

  constructor(telnyxWs: WebSocket, session: CallSession) {
    super();
    this.telnyxWs = telnyxWs;
    this.session = session;
    this.callLogger = createCallLogger(session.callId);
    this.agentClient = new ElevenLabsAgentClient(session.callId);

    this.setupTelnyxHandlers();
    this.setupAgentHandlers();
  }

  /**
   * Start the audio bridge
   */
  async start(): Promise<void> {
    this.callLogger.info('Starting audio bridge');

    try {
      await this.agentClient.connect();
      this.session.setState('connected');
      this.callLogger.info('Audio bridge started successfully');
    } catch (error) {
      this.callLogger.error('Failed to start audio bridge', { error });
      this.session.end();
      throw error;
    }
  }

  /**
   * Setup Telnyx WebSocket handlers
   */
  private setupTelnyxHandlers(): void {
    this.telnyxWs.on('message', (data: WebSocket.Data) => {
      try {
        const event: TelnyxMediaEvent = JSON.parse(data.toString());
        this.handleTelnyxEvent(event);
      } catch (error) {
        this.callLogger.error('Failed to parse Telnyx message', { error });
      }
    });

    this.telnyxWs.on('close', (code, reason) => {
      this.callLogger.info('Telnyx WebSocket closed', { code, reason: reason.toString() });
      this.stop();
    });

    this.telnyxWs.on('error', (error) => {
      this.callLogger.error('Telnyx WebSocket error', { error: error.message });
    });
  }

  /**
   * Handle Telnyx WebSocket events
   */
  private handleTelnyxEvent(event: TelnyxMediaEvent): void {
    switch (event.event) {
      case 'start':
        this.handleStreamStart(event);
        break;

      case 'media':
        this.handleMediaEvent(event);
        break;

      case 'stop':
        this.handleStreamStop(event);
        break;

      case 'mark':
        // Mark events for synchronization, currently not used
        break;

      default:
        this.callLogger.debug('Unknown Telnyx event', { event: event.event });
    }
  }

  /**
   * Handle stream start
   */
  private handleStreamStart(event: TelnyxMediaEvent): void {
    if (event.start) {
      this.streamId = event.start.stream_id;
      this.isStreaming = true;
      this.session.setState('streaming');

      this.callLogger.info('Audio stream started', {
        streamId: this.streamId,
        callControlId: event.start.call_control_id,
      });
    }
  }

  /**
   * Handle media (audio) event from Telnyx
   */
  private handleMediaEvent(event: TelnyxMediaEvent): void {
    if (!event.media || event.media.track !== 'inbound') {
      return;
    }

    this.session.recordAudioReceived();

    // Decode μ-law audio from Telnyx
    const mulawAudio = Buffer.from(event.media.payload, 'base64');

    // Convert to PCM 16kHz for ElevenLabs
    const pcmAudio = telnyxToElevenLabs(mulawAudio);

    // Send to ElevenLabs agent
    if (this.agentClient.connected) {
      this.agentClient.sendAudio(pcmAudio);
    }
  }

  /**
   * Handle stream stop
   */
  private handleStreamStop(event: TelnyxMediaEvent): void {
    this.isStreaming = false;
    this.callLogger.info('Audio stream stopped', { streamId: event.stop?.stream_id });
  }

  /**
   * Setup ElevenLabs agent handlers
   */
  private setupAgentHandlers(): void {
    // Handle audio from agent
    this.agentClient.on('audio', (audioData: Buffer) => {
      this.sendAudioToTelnyx(audioData);
    });

    // Handle user transcripts
    this.agentClient.on('userTranscript', (text: string, isFinal: boolean) => {
      if (isFinal) {
        this.session.recordUserUtterance();
        this.emit('userTranscript', text);
      }
    });

    // Handle agent responses
    this.agentClient.on('agentResponse', (text: string) => {
      this.session.recordAgentResponse();
      this.emit('agentResponse', text);
    });

    // Handle tool calls
    this.agentClient.on('toolCall', (toolCall) => {
      this.session.recordToolCall();
      this.handleToolCall(toolCall);
    });

    // Handle conversation ended
    this.agentClient.on('conversationEnded', () => {
      this.callLogger.info('Conversation ended by agent');
      this.stop();
    });

    // Handle disconnection
    this.agentClient.on('disconnected', (code, reason) => {
      this.callLogger.info('Agent disconnected', { code, reason });
      if (this.session.state !== 'ended') {
        this.stop();
      }
    });

    // Handle errors
    this.agentClient.on('error', (error) => {
      this.callLogger.error('Agent error', { error: error.message });
    });
  }

  /**
   * Send audio to Telnyx
   */
  private sendAudioToTelnyx(pcmAudio: Buffer): void {
    if (!this.isStreaming || this.telnyxWs.readyState !== WebSocket.OPEN) {
      return;
    }

    // Convert from PCM 16kHz to μ-law 8kHz
    const mulawAudio = elevenLabsToTelnyx(pcmAudio);

    // Send to Telnyx as media event
    const mediaEvent = {
      event: 'media',
      stream_id: this.streamId,
      media: {
        payload: mulawAudio.toString('base64'),
      },
    };

    this.telnyxWs.send(JSON.stringify(mediaEvent));
    this.session.recordAudioSent();
  }

  /**
   * Handle tool calls from agent
   */
  private async handleToolCall(toolCall: { tool_name: string; parameters: Record<string, unknown> }): Promise<void> {
    this.callLogger.info('Processing tool call', { toolName: toolCall.tool_name });

    // Check for transfer
    if (toolCall.tool_name === 'transfer_call') {
      const params = toolCall.parameters as { department: string; reason?: string };
      this.session.setTransfer(params.department, params.reason);
      this.emit('transfer', params.department, params.reason);
    }

    // Check for end call
    if (toolCall.tool_name === 'end_call') {
      this.callLogger.info('End call tool invoked');
      // Give agent time to say goodbye, then end
      setTimeout(() => {
        this.stop();
      }, 5000);
    }
  }

  /**
   * Stop the audio bridge
   */
  stop(): void {
    this.callLogger.info('Stopping audio bridge');

    this.isStreaming = false;

    // Disconnect from ElevenLabs
    this.agentClient.disconnect();

    // Close Telnyx WebSocket if still open
    if (this.telnyxWs.readyState === WebSocket.OPEN) {
      this.telnyxWs.close();
    }

    // End the session
    if (this.session.state !== 'ended') {
      this.session.end();
    }

    this.emit('stopped');
  }
}
