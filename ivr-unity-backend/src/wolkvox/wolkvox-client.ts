/**
 * Wolkvox API Client
 *
 * Cliente para interactuar con Wolkvox Manager API v2
 * Basado en documentación oficial y skill de Wolkvox
 */

import { logger } from '../utils/logger';

export interface WolkvoxConfig {
  server: string; // Últimos 4 dígitos (ej: "0048")
  token: string;
  baseUrl?: string;
  timeout?: number;
}

export interface WolkvoxAgent {
  agent_id: string;
  agent_name: string;
  agent_status: string;
  calls: string;
  inbound: string;
  outbound: string;
  internal: string;
  time_state_now: string;
  ready_time: string;
  inbound_time: string;
  outbound_time: string;
  acw_time: string;
  aux_time: string;
  ring_time: string;
  login_time: string;
  aht_time: string;
  ocupation: string;
  rpcs?: string;
  hits?: string;
}

export interface WolkvoxCall {
  call_id: string;
  agent_id: string;
  phone_number: string;
  direction: 'inbound' | 'outbound';
  status: string;
  duration: number;
  start_time: string;
}

export interface WolkvoxSkill {
  skill_id: string;
  skill_name: string;
  agents_available: number;
  calls_waiting: number;
  max_wait_time: number;
}

export interface WolkvoxAPIResponse<T> {
  code: string;
  error: string | null;
  msg: string;
  data: T;
}

export class WolkvoxClient {
  private baseUrl: string;
  private token: string;
  private server: string;
  private timeout: number;

  constructor(config: WolkvoxConfig) {
    this.server = config.server;
    this.token = config.token;
    this.baseUrl = config.baseUrl || `https://wv${config.server}.wolkvox.com/api/v2`;
    this.timeout = config.timeout || 55000; // 55 segundos (límite es 60s)

    logger.info('WolkvoxClient initialized', {
      server: this.server,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Realizar petición a Wolkvox API con retry y backoff exponencial
   */
  private async request<T>(
    resource: string,
    params: Record<string, string> = {},
    method: 'GET' | 'POST' = 'GET',
    maxRetries: number = 3
  ): Promise<WolkvoxAPIResponse<T>> {
    const url = new URL(`${this.baseUrl}/${resource}.php`);

    // Agregar parámetros de query
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: Record<string, string> = {
      'wolkvox-token': this.token,
      'wolkvox_server': this.server,
      'Content-Type': 'application/json',
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        logger.debug('Wolkvox API request', {
          url: url.toString(),
          method,
          attempt: attempt + 1,
        });

        const response = await fetch(url.toString(), {
          method,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json() as WolkvoxAPIResponse<T>;

          if (data.code === '200') {
            logger.debug('Wolkvox API success', {
              url: url.toString(),
              msg: data.msg,
            });
            return data;
          } else {
            logger.warn('Wolkvox API returned non-200 code', {
              code: data.code,
              error: data.error,
              msg: data.msg,
            });
            throw new Error(`Wolkvox API error: ${data.error || data.msg}`);
          }
        }

        // Retry en caso de rate limiting o errores del servidor
        if (response.status === 429 || response.status >= 500) {
          const delay = Math.pow(2, attempt) * 1000;
          logger.warn('Wolkvox API error, retrying', {
            status: response.status,
            attempt: attempt + 1,
            delayMs: delay,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (response.status === 401) {
          throw new Error('Wolkvox authentication failed. Check token and server.');
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          logger.warn('Wolkvox API timeout', {
            attempt: attempt + 1,
            url: url.toString(),
          });

          if (attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        if (attempt === maxRetries - 1) {
          logger.error('Wolkvox API max retries exceeded', {
            url: url.toString(),
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      }
    }

    throw new Error('Wolkvox API request failed after all retries');
  }

  /**
   * Obtener agentes en tiempo real
   */
  async getRealtimeAgents(): Promise<WolkvoxAgent[]> {
    const response = await this.request<WolkvoxAgent[]>('real_time', {
      api: 'agents',
    });
    return response.data;
  }

  /**
   * Obtener estado de un agente específico
   */
  async getAgent(agentId: string): Promise<WolkvoxAgent | null> {
    const agents = await this.getRealtimeAgents();
    return agents.find(a => a.agent_id === agentId) || null;
  }

  /**
   * Obtener agentes disponibles (Ready)
   */
  async getAvailableAgents(): Promise<WolkvoxAgent[]> {
    const agents = await this.getRealtimeAgents();
    return agents.filter(a => a.agent_status === 'Ready');
  }

  /**
   * Obtener agentes en llamada activa
   */
  async getAgentsOnCall(): Promise<WolkvoxAgent[]> {
    const agents = await this.getRealtimeAgents();
    return agents.filter(a => a.agent_status === 'Talk');
  }

  /**
   * Obtener skills/colas en tiempo real
   */
  async getRealtimeSkills(): Promise<WolkvoxSkill[]> {
    const response = await this.request<WolkvoxSkill[]>('real_time', {
      api: 'skills',
    });
    return response.data;
  }

  /**
   * Transferir llamada a un skill/queue
   *
   * Nota: Este endpoint puede variar según la configuración de Wolkvox.
   * Basado en la API de Agentes V2 "Transferir llamada"
   */
  async transferCallToSkill(
    agentId: string,
    skillId: string,
    context?: string
  ): Promise<void> {
    logger.info('Transferring call to skill', {
      agentId,
      skillId,
      hasContext: !!context,
    });

    // Endpoint de transferencia (puede necesitar ajuste según configuración)
    await this.request('agentbox', {
      api: 'transfer',
      agent_id: agentId,
      destination: skillId,
      context: context || '',
    }, 'POST');

    logger.info('Call transferred successfully', {
      agentId,
      skillId,
    });
  }

  /**
   * Registrar interacción/logging
   *
   * Guarda el contexto y transcript de la llamada con el bot
   */
  async logInteraction(data: {
    callId: string;
    agentId?: string;
    phoneNumber: string;
    transcript: string;
    summary: string;
    duration: number;
    timestamp: string;
  }): Promise<void> {
    logger.info('Logging interaction to Wolkvox', {
      callId: data.callId,
      phoneNumber: data.phoneNumber,
      duration: data.duration,
    });

    // Nota: El endpoint exacto puede variar
    // Puede ser reports.php o un endpoint personalizado
    try {
      await this.request('reports', {
        api: 'log_interaction',
        call_id: data.callId,
        agent_id: data.agentId || '',
        phone: data.phoneNumber,
        transcript: data.transcript,
        summary: data.summary,
        duration: data.duration.toString(),
        timestamp: data.timestamp,
      }, 'POST');

      logger.info('Interaction logged successfully', {
        callId: data.callId,
      });
    } catch (error) {
      logger.error('Failed to log interaction', {
        callId: data.callId,
        error: error instanceof Error ? error.message : String(error),
      });
      // No throw - el logging es best-effort
    }
  }

  /**
   * Hacer llamada outbound
   */
  async makeOutboundCall(
    agentId: string,
    phoneNumber: string
  ): Promise<void> {
    logger.info('Making outbound call', {
      agentId,
      phoneNumber,
    });

    await this.request('agentbox', {
      api: 'make_call',
      agent_id: agentId,
      phone: phoneNumber,
    });

    logger.info('Outbound call initiated', {
      agentId,
      phoneNumber,
    });
  }

  /**
   * Cambiar estado del agente
   */
  async changeAgentStatus(
    agentId: string,
    status: 'Ready' | 'ACW' | 'Break' | string
  ): Promise<void> {
    logger.info('Changing agent status', {
      agentId,
      status,
    });

    await this.request('agentbox', {
      api: 'change_status',
      agent_id: agentId,
      status,
    });

    logger.info('Agent status changed', {
      agentId,
      status,
    });
  }

  /**
   * Obtener reportes de llamadas (últimos 10 minutos)
   * Útil para detectar llamadas entrantes nuevas
   */
  async getRecentCalls(minutes: number = 10): Promise<any[]> {
    try {
      const response = await this.request<any[]>('real_time', {
        api: 'calls',
        minutes: minutes.toString(),
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to get recent calls', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Health check - verifica que la conexión funcione
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getRealtimeAgents();
      return true;
    } catch (error) {
      logger.error('Wolkvox health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}
