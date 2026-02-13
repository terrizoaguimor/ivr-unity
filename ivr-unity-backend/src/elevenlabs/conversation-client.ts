/**
 * ElevenLabs Conversation API Client
 *
 * Obtiene detalles de conversaciones, transcripciones y audio
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export interface ConversationTranscript {
  role: 'user' | 'agent';
  message: string;
  time_in_call_secs: number;
  tool_calls?: any[];
  tool_results?: any[];
}

export interface ConversationDetails {
  agent_id: string;
  agent_name: string;
  conversation_id: string;
  user_id: string;
  status: 'initiated' | 'in-progress' | 'processing' | 'done' | 'failed';
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
  transcript: ConversationTranscript[];
  start_time_unix_secs: number;
  call_duration_secs: number;
  cost: number;
  feedback?: string;
  main_language?: string;
  call_successful?: boolean;
  transcript_summary?: string;
}

export interface ElevenLabsConversationConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export class ElevenLabsConversationClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: ElevenLabsConversationConfig) {
    this.apiKey = config.apiKey;

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.elevenlabs.io/v1/convai',
      timeout: config.timeout || 30000,
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    logger.info('ElevenLabsConversationClient initialized');
  }

  /**
   * Obtener detalles completos de una conversación
   */
  async getConversation(conversationId: string): Promise<ConversationDetails> {
    try {
      logger.info('Fetching conversation details from ElevenLabs', {
        conversationId,
      });

      const response = await this.client.get<ConversationDetails>(
        `/conversations/${conversationId}`
      );

      logger.info('Conversation details retrieved', {
        conversationId,
        status: response.data.status,
        hasAudio: response.data.has_audio,
        transcriptLength: response.data.transcript?.length || 0,
        duration: response.data.call_duration_secs,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to get conversation from ElevenLabs', {
        conversationId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Descargar audio de la conversación (formato MP3)
   */
  async getConversationAudio(conversationId: string): Promise<Buffer> {
    try {
      logger.info('Downloading conversation audio from ElevenLabs', {
        conversationId,
      });

      const response = await this.client.get(
        `/conversations/${conversationId}/audio`,
        {
          responseType: 'arraybuffer',
        }
      );

      const audioBuffer = Buffer.from(response.data);

      logger.info('Conversation audio downloaded', {
        conversationId,
        sizeBytes: audioBuffer.length,
        sizeMB: (audioBuffer.length / 1024 / 1024).toFixed(2),
      });

      return audioBuffer;
    } catch (error) {
      logger.error('Failed to download conversation audio', {
        conversationId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Obtener transcripción formateada como texto
   */
  async getFormattedTranscript(conversationId: string): Promise<string> {
    const conversation = await this.getConversation(conversationId);

    if (!conversation.transcript || conversation.transcript.length === 0) {
      return 'No transcript available';
    }

    return conversation.transcript
      .map((turn) => {
        const timestamp = Math.floor(turn.time_in_call_secs);
        const minutes = Math.floor(timestamp / 60);
        const seconds = timestamp % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        return `[${timeStr}] ${turn.role.toUpperCase()}: ${turn.message}`;
      })
      .join('\n');
  }

  /**
   * Verificar si la conversación tiene audio disponible
   */
  async hasAudio(conversationId: string): Promise<boolean> {
    try {
      const conversation = await this.getConversation(conversationId);
      return conversation.has_audio;
    } catch (error) {
      logger.warn('Could not check audio availability', {
        conversationId,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Obtener resumen completo de la conversación
   */
  async getConversationSummary(conversationId: string): Promise<{
    transcript: string;
    duration: number;
    cost: number;
    successful: boolean;
    summary?: string;
  }> {
    const conversation = await this.getConversation(conversationId);
    const transcript = await this.getFormattedTranscript(conversationId);

    return {
      transcript,
      duration: conversation.call_duration_secs,
      cost: conversation.cost,
      successful: conversation.call_successful ?? true,
      summary: conversation.transcript_summary,
    };
  }
}
