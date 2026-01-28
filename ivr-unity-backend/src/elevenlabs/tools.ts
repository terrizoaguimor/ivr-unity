import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Tool call from ElevenLabs Conversational AI
 */
export interface ToolCall {
  type: 'client_tool_call';
  tool_call_id: string;
  tool_name: string;
  parameters: Record<string, unknown>;
}

/**
 * Tool result to send back to ElevenLabs
 */
export interface ToolResult {
  type: 'client_tool_result';
  tool_call_id: string;
  result: string;
  is_error?: boolean;
}

/**
 * Department types for transfer
 */
export type Department = 'SALUD' | 'VIDA' | 'PC' | 'PQRS' | 'SINIESTRO';

/**
 * Transfer call parameters
 */
interface TransferCallParams {
  department: Department;
  reason?: string;
  subtype?: string;
}

/**
 * Lookup policy parameters
 */
interface LookupPolicyParams {
  customer_id: string;
}

/**
 * Handle tool calls from ElevenLabs agent
 */
export async function handleToolCall(
  toolCall: ToolCall,
  callId: string
): Promise<ToolResult> {
  const callLogger = logger.child({ callId, toolCallId: toolCall.tool_call_id });

  callLogger.info('Processing tool call', {
    toolName: toolCall.tool_name,
    parameters: toolCall.parameters,
  });

  try {
    switch (toolCall.tool_name) {
      case 'transfer_call':
        return await handleTransferCall(
          toolCall.tool_call_id,
          toolCall.parameters as unknown as TransferCallParams,
          callId
        );

      case 'lookup_policy':
        return await handleLookupPolicy(
          toolCall.tool_call_id,
          toolCall.parameters as unknown as LookupPolicyParams,
          callId
        );

      case 'end_call':
        return handleEndCall(toolCall.tool_call_id, callId);

      default:
        callLogger.warn('Unknown tool called', { toolName: toolCall.tool_name });
        return {
          type: 'client_tool_result',
          tool_call_id: toolCall.tool_call_id,
          result: `Unknown tool: ${toolCall.tool_name}`,
          is_error: true,
        };
    }
  } catch (error) {
    callLogger.error('Tool call failed', { error });
    return {
      type: 'client_tool_result',
      tool_call_id: toolCall.tool_call_id,
      result: `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
      is_error: true,
    };
  }
}

/**
 * Handle transfer_call tool
 */
async function handleTransferCall(
  toolCallId: string,
  params: TransferCallParams,
  callId: string
): Promise<ToolResult> {
  const { department, reason, subtype } = params;

  logger.info('Transfer requested', { callId, department, reason, subtype });

  // Get the queue for this department
  const queue = getQueueForDepartment(department, subtype);

  if (!queue) {
    return {
      type: 'client_tool_result',
      tool_call_id: toolCallId,
      result: `No queue found for department: ${department}`,
      is_error: true,
    };
  }

  // In a real implementation, you would:
  // 1. Use Telnyx Call Control API to transfer the call
  // 2. Or return the queue info to the bridge to handle the transfer

  return {
    type: 'client_tool_result',
    tool_call_id: toolCallId,
    result: JSON.stringify({
      status: 'transfer_initiated',
      queue,
      department,
      reason: reason || 'Customer request',
    }),
  };
}

/**
 * Handle lookup_policy tool
 */
async function handleLookupPolicy(
  toolCallId: string,
  params: LookupPolicyParams,
  callId: string
): Promise<ToolResult> {
  const { customer_id } = params;

  logger.info('Policy lookup requested', { callId, customerId: customer_id });

  // In a real implementation, you would query your CRM/database
  // For now, return mock data
  const mockPolicyData = {
    customer_id,
    name: 'Cliente Demo',
    policies: [
      {
        type: 'SALUD',
        number: 'POL-SALUD-' + customer_id.slice(-4),
        status: 'ACTIVA',
        expiry: '2025-12-31',
      },
    ],
    contact: {
      phone: customer_id,
      email: 'cliente@example.com',
    },
  };

  return {
    type: 'client_tool_result',
    tool_call_id: toolCallId,
    result: JSON.stringify({
      status: 'found',
      data: mockPolicyData,
    }),
  };
}

/**
 * Handle end_call tool
 */
function handleEndCall(toolCallId: string, callId: string): ToolResult {
  logger.info('End call requested', { callId });

  return {
    type: 'client_tool_result',
    tool_call_id: toolCallId,
    result: JSON.stringify({
      status: 'call_ending',
      message: 'Call will be terminated after goodbye',
    }),
  };
}

/**
 * Get the queue name for a department
 */
function getQueueForDepartment(department: Department, subtype?: string): string | null {
  const queues = config.queues;

  switch (department) {
    case 'SALUD':
      if (subtype === 'ventas') return queues.SALUD.ventas;
      if (subtype === 'servicio') return queues.SALUD.servicio;
      if (subtype === 'backoffice') return queues.SALUD.backoffice;
      return queues.SALUD.general;

    case 'VIDA':
      if (subtype === 'ventas') return queues.VIDA.ventas;
      if (subtype === 'servicio') return queues.VIDA.servicio;
      return queues.VIDA.general;

    case 'PC':
      if (subtype === 'ventas') return queues.PC.ventas;
      if (subtype === 'servicio') return queues.PC.servicio;
      if (subtype === 'siniestro') return queues.PC.siniestro;
      return queues.PC.general;

    case 'PQRS':
      return queues.PQRS.general;

    case 'SINIESTRO':
      return queues.SINIESTRO.urgente;

    default:
      return null;
  }
}

/**
 * ElevenLabs tool definitions for the agent configuration
 */
export const AGENT_TOOLS = [
  {
    type: 'client',
    name: 'transfer_call',
    description: 'Transfiere la llamada a un departamento específico. Usa cuando el cliente necesita hablar con un agente humano o ser transferido a otro departamento.',
    parameters: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          enum: ['SALUD', 'VIDA', 'PC', 'PQRS', 'SINIESTRO'],
          description: 'Departamento destino: SALUD (seguros de salud), VIDA (seguros de vida), PC (propiedad y accidentes/auto/hogar), PQRS (quejas y sugerencias), SINIESTRO (reportes urgentes 24/7)',
        },
        reason: {
          type: 'string',
          description: 'Razón breve de la transferencia',
        },
        subtype: {
          type: 'string',
          enum: ['ventas', 'servicio', 'backoffice', 'siniestro'],
          description: 'Tipo de atención: ventas (cotizaciones, nuevos seguros), servicio (consultas, cambios), backoffice (pagos, facturación), siniestro (reportes urgentes)',
        },
      },
      required: ['department'],
    },
  },
  {
    type: 'client',
    name: 'lookup_policy',
    description: 'Busca información de póliza por número de identificación del cliente. Usa cuando el cliente quiere consultar información de su póliza.',
    parameters: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'string',
          description: 'Número de identificación del cliente (cédula, pasaporte, etc.)',
        },
      },
      required: ['customer_id'],
    },
  },
  {
    type: 'client',
    name: 'end_call',
    description: 'Termina la llamada de manera educada. Usa solo cuando la conversación ha terminado naturalmente o el cliente solicita terminar.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
];
