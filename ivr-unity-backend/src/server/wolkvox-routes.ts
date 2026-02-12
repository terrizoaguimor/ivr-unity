import { Request, Response } from 'express';
import { CallOrchestrator } from '../wolkvox/call-orchestrator';
import { WolkvoxClient } from '../wolkvox/wolkvox-client';
import { logger } from '../utils/logger';

// Singleton instances (will be initialized from index.ts)
let orchestrator: CallOrchestrator | null = null;
let wolkvoxClient: WolkvoxClient | null = null;

/**
 * Initialize Wolkvox routes with orchestrator instance
 */
export function initializeWolkvoxRoutes(
  orchInstance: CallOrchestrator,
  clientInstance: WolkvoxClient
): void {
  orchestrator = orchInstance;
  wolkvoxClient = clientInstance;
  logger.info('Wolkvox routes initialized');
}

/**
 * GET /api/wolkvox/status
 * Get orchestrator and Wolkvox connection status
 */
export async function getWolkvoxStatus(req: Request, res: Response): Promise<void> {
  try {
    if (!orchestrator || !wolkvoxClient) {
      res.status(503).json({
        error: 'Wolkvox not initialized',
        status: 'unavailable',
      });
      return;
    }

    const orchestratorStatus = orchestrator.getStatus();
    const wolkvoxHealthy = await wolkvoxClient.healthCheck();

    res.json({
      orchestrator: {
        isRunning: orchestratorStatus.isRunning,
        activeCalls: orchestratorStatus.activeCalls,
      },
      wolkvox: {
        healthy: wolkvoxHealthy,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting Wolkvox status', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to get status',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * GET /api/wolkvox/active-calls
 * Get all active calls being managed by orchestrator
 */
export function getActiveCalls(req: Request, res: Response): void {
  try {
    if (!orchestrator) {
      res.status(503).json({
        error: 'Wolkvox not initialized',
      });
      return;
    }

    const status = orchestrator.getStatus();

    res.json({
      count: status.activeCalls,
      calls: status.calls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting active calls', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to get active calls',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/wolkvox/transfer
 * Force transfer of a specific call
 * Body: { callId: string, skillId?: string }
 */
export async function forceTransfer(req: Request, res: Response): Promise<void> {
  try {
    if (!orchestrator) {
      res.status(503).json({
        error: 'Wolkvox not initialized',
      });
      return;
    }

    const { callId, skillId } = req.body;

    if (!callId) {
      res.status(400).json({
        error: 'callId is required',
      });
      return;
    }

    logger.info('Manual transfer requested', {
      callId,
      skillId,
    });

    await orchestrator.forceTransfer(callId, skillId);

    res.json({
      success: true,
      message: 'Transfer initiated',
      callId,
      skillId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error forcing transfer', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to transfer call',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * GET /api/wolkvox/agents
 * Get real-time agent status from Wolkvox
 */
export async function getAgents(req: Request, res: Response): Promise<void> {
  try {
    if (!wolkvoxClient) {
      res.status(503).json({
        error: 'Wolkvox client not initialized',
      });
      return;
    }

    const { status } = req.query;

    let agents;
    if (status === 'available') {
      agents = await wolkvoxClient.getAvailableAgents();
    } else if (status === 'oncall') {
      agents = await wolkvoxClient.getAgentsOnCall();
    } else {
      agents = await wolkvoxClient.getRealtimeAgents();
    }

    res.json({
      count: agents.length,
      agents,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting agents', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to get agents',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * GET /api/wolkvox/skills
 * Get real-time skill/queue status from Wolkvox
 */
export async function getSkills(req: Request, res: Response): Promise<void> {
  try {
    if (!wolkvoxClient) {
      res.status(503).json({
        error: 'Wolkvox client not initialized',
      });
      return;
    }

    const skills = await wolkvoxClient.getRealtimeSkills();

    res.json({
      count: skills.length,
      skills,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting skills', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to get skills',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/wolkvox/start
 * Start the call orchestrator
 */
export async function startOrchestrator(req: Request, res: Response): Promise<void> {
  try {
    if (!orchestrator) {
      res.status(503).json({
        error: 'Wolkvox not initialized',
      });
      return;
    }

    await orchestrator.start();

    res.json({
      success: true,
      message: 'Orchestrator started',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error starting orchestrator', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to start orchestrator',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/wolkvox/stop
 * Stop the call orchestrator
 */
export async function stopOrchestrator(req: Request, res: Response): Promise<void> {
  try {
    if (!orchestrator) {
      res.status(503).json({
        error: 'Wolkvox not initialized',
      });
      return;
    }

    await orchestrator.stop();

    res.json({
      success: true,
      message: 'Orchestrator stopped',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error stopping orchestrator', {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      error: 'Failed to stop orchestrator',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
