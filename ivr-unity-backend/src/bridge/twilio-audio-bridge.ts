import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { ElevenLabsAgentClient } from '../elevenlabs/agent-client';
import { CallSession } from './call-session';
import { telnyxToElevenLabs, elevenLabsToTelnyx } from '../utils/audio-converter';
import { createCallLogger } from '../utils/logger';

/**
 * Twilio Media Stream event types
 */
interface TwilioMediaEvent {
  event: 'start' | 'media' | 'stop' | 'mark';
  sequenceNumber?: string;
  streamSid?: string;
  start?: {
    streamSid: string;
    accountSid: string;
    callSid: string;
    tracks: string[];
    customParameters?: Record<string, string>;
    mediaFormat: {
      encoding: string;
      sampleRate: number;
      channels: number;
    };
  };
  media?: {
    track: 'inbound' | 'outbound';
    chunk: string;
    timestamp: string;
    payload: string; // Base64 encoded audio
  };
  stop?: {
    streamSid: string;
    accountSid: string;
    callSid: string;
  };
  mark?: {
    name: string;
  };
}

/**
 * Audio bridge that connects Twilio WebSocket to ElevenLabs Agent
 */
export class TwilioAudioBridge extends EventEmitter {
  private twilioWs: WebSocket;
  private agentClient: ElevenLabsAgentClient;
  private session: CallSession;
  private callLogger: ReturnType<typeof createCallLogger>;
  private isStreaming = false;
  private streamSid: string | null = null;
  private callSid: string | null = null;

  constructor(twilioWs: WebSocket, session: CallSession) {
    super();
    this.twilioWs = twilioWs;
    this.session = session;
    this.callLogger = createCallLogger(session.callId);
    this.agentClient = new ElevenLabsAgentClient(session.callId);

    this.setupTwilioHandlers();
    this.setupAgentHandlers();
  }

  /**
   * Start the audio bridge
   */
  async start(): Promise<void> {
    this.callLogger.info('Starting Twilio audio bridge');

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
   * Setup Twilio WebSocket handlers
   */
  private setupTwilioHandlers(): void {
    this.twilioWs.on('message', (data: WebSocket.Data) => {
      try {
        const event: TwilioMediaEvent = JSON.parse(data.toString());
        this.handleTwilioEvent(event);
      } catch (error) {
        this.callLogger.error('Failed to parse Twilio message', { error });
      }
    });

    this.twilioWs.on('close', (code, reason) => {
      this.callLogger.info('Twilio WebSocket closed', { code, reason: reason.toString() });
      this.stop();
    });

    this.twilioWs.on('error', (error) => {
      this.callLogger.error('Twilio WebSocket error', { error: error.message });
    });
  }

  /**
   * Handle Twilio WebSocket events
   */
  private handleTwilioEvent(event: TwilioMediaEvent): void {
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
        // Mark events for synchronization
        this.callLogger.debug('Mark event received', { name: event.mark?.name });
        break;

      default:
        this.callLogger.debug('Unknown Twilio event', { event: event.event });
    }
  }

  /**
   * Handle stream start
   */
  private handleStreamStart(event: TwilioMediaEvent): void {
    if (event.start) {
      this.streamSid = event.start.streamSid;
      this.callSid = event.start.callSid;
      this.isStreaming = true;
      this.session.setState('streaming');

      this.callLogger.info('Audio stream started', {
        streamSid: this.streamSid,
        callSid: this.callSid,
        mediaFormat: event.start.mediaFormat,
      });

      // Send mark to confirm stream started
      this.sendMark('stream_started');
    }
  }

  /**
   * Handle media (audio) event from Twilio
   */
  private handleMediaEvent(event: TwilioMediaEvent): void {
    if (!event.media || event.media.track !== 'inbound') {
      return;
    }

    this.session.recordAudioReceived();

    // Decode μ-law audio from Twilio (same as Telnyx)
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
  private handleStreamStop(event: TwilioMediaEvent): void {
    this.isStreaming = false;
    this.callLogger.info('Audio stream stopped', {
      streamSid: event.stop?.streamSid,
      callSid: event.stop?.callSid,
    });
  }

  /**
   * Setup ElevenLabs agent handlers
   */
  private setupAgentHandlers(): void {
    // Handle audio from agent
    this.agentClient.on('audio', (audioData: Buffer) => {
      this.sendAudioToTwilio(audioData);
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
   * Send audio to Twilio
   */
  private sendAudioToTwilio(pcmAudio: Buffer): void {
    if (!this.isStreaming || this.twilioWs.readyState !== WebSocket.OPEN) {
      return;
    }

    // Convert from PCM 16kHz to μ-law 8kHz
    const mulawAudio = elevenLabsToTelnyx(pcmAudio);

    // Send to Twilio as media event
    const mediaEvent = {
      event: 'media',
      streamSid: this.streamSid,
      media: {
        payload: mulawAudio.toString('base64'),
      },
    };

    this.twilioWs.send(JSON.stringify(mediaEvent));
    this.session.recordAudioSent();
  }

  /**
   * Send mark event to Twilio
   */
  private sendMark(name: string): void {
    if (this.twilioWs.readyState !== WebSocket.OPEN) {
      return;
    }

    const markEvent = {
      event: 'mark',
      streamSid: this.streamSid,
      mark: {
        name,
      },
    };

    this.twilioWs.send(JSON.stringify(markEvent));
  }

  /**
   * Handle tool calls from agent
   */
  private async handleToolCall(toolCall: {
    tool_name: string;
    parameters: Record<string, unknown>
  }): Promise<void> {
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

    // Close Twilio WebSocket if still open
    if (this.twilioWs.readyState === WebSocket.OPEN) {
      this.twilioWs.close();
    }

    // End the session
    if (this.session.state !== 'ended') {
      this.session.end();
    }

    this.emit('stopped');
  }
}
