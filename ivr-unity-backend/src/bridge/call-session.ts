import { EventEmitter } from 'events';
import { createCallLogger } from '../utils/logger';

/**
 * Call session states
 */
export type CallState =
  | 'initializing'
  | 'connected'
  | 'streaming'
  | 'transferring'
  | 'ended';

/**
 * Call session metadata
 */
export interface CallMetadata {
  callId: string;
  caller: string;
  calledNumber?: string;
  startTime: Date;
  endTime?: Date;
  transferQueue?: string;
  transferReason?: string;
}

/**
 * Call session statistics
 */
export interface CallStats {
  audioPacketsReceived: number;
  audioPacketsSent: number;
  userUtterances: number;
  agentResponses: number;
  toolCalls: number;
  totalDurationMs: number;
}

/**
 * Manages a single call session
 */
export class CallSession extends EventEmitter {
  private _state: CallState = 'initializing';
  private _metadata: CallMetadata;
  private _stats: CallStats;
  private callLogger: ReturnType<typeof createCallLogger>;

  constructor(callId: string, caller: string, calledNumber?: string) {
    super();

    this._metadata = {
      callId,
      caller,
      calledNumber,
      startTime: new Date(),
    };

    this._stats = {
      audioPacketsReceived: 0,
      audioPacketsSent: 0,
      userUtterances: 0,
      agentResponses: 0,
      toolCalls: 0,
      totalDurationMs: 0,
    };

    this.callLogger = createCallLogger(callId);
    this.callLogger.info('Call session created', {
      caller,
      calledNumber,
    });
  }

  /**
   * Get call ID
   */
  get callId(): string {
    return this._metadata.callId;
  }

  /**
   * Get current state
   */
  get state(): CallState {
    return this._state;
  }

  /**
   * Get metadata
   */
  get metadata(): CallMetadata {
    return { ...this._metadata };
  }

  /**
   * Get statistics
   */
  get stats(): CallStats {
    return { ...this._stats };
  }

  /**
   * Update call state
   */
  setState(newState: CallState): void {
    const previousState = this._state;
    this._state = newState;

    this.callLogger.info('Call state changed', {
      from: previousState,
      to: newState,
    });

    this.emit('stateChange', newState, previousState);
  }

  /**
   * Record audio packet received
   */
  recordAudioReceived(): void {
    this._stats.audioPacketsReceived++;
  }

  /**
   * Record audio packet sent
   */
  recordAudioSent(): void {
    this._stats.audioPacketsSent++;
  }

  /**
   * Record user utterance
   */
  recordUserUtterance(): void {
    this._stats.userUtterances++;
  }

  /**
   * Record agent response
   */
  recordAgentResponse(): void {
    this._stats.agentResponses++;
  }

  /**
   * Record tool call
   */
  recordToolCall(): void {
    this._stats.toolCalls++;
  }

  /**
   * Mark transfer
   */
  setTransfer(queue: string, reason?: string): void {
    this._metadata.transferQueue = queue;
    this._metadata.transferReason = reason;
    this.setState('transferring');
  }

  /**
   * End the session
   */
  end(): void {
    this._metadata.endTime = new Date();
    this._stats.totalDurationMs =
      this._metadata.endTime.getTime() - this._metadata.startTime.getTime();

    this.setState('ended');

    this.callLogger.info('Call session ended', {
      duration: `${(this._stats.totalDurationMs / 1000).toFixed(1)}s`,
      stats: this._stats,
      transferred: this._metadata.transferQueue ? true : false,
      transferQueue: this._metadata.transferQueue,
    });

    this.emit('ended', this._metadata, this._stats);
  }

  /**
   * Get session summary
   */
  getSummary(): {
    metadata: CallMetadata;
    stats: CallStats;
    state: CallState;
  } {
    return {
      metadata: this.metadata,
      stats: this.stats,
      state: this.state,
    };
  }
}

/**
 * Session manager for tracking all active calls
 */
export class SessionManager {
  private sessions: Map<string, CallSession> = new Map();

  /**
   * Create a new session
   */
  createSession(callId: string, caller: string, calledNumber?: string): CallSession {
    if (this.sessions.has(callId)) {
      throw new Error(`Session already exists for call ${callId}`);
    }

    const session = new CallSession(callId, caller, calledNumber);
    this.sessions.set(callId, session);

    session.on('ended', () => {
      // Keep session for a bit for logging purposes, then remove
      setTimeout(() => {
        this.sessions.delete(callId);
      }, 60000); // Keep for 1 minute after end
    });

    return session;
  }

  /**
   * Get session by call ID
   */
  getSession(callId: string): CallSession | undefined {
    return this.sessions.get(callId);
  }

  /**
   * Remove session
   */
  removeSession(callId: string): boolean {
    return this.sessions.delete(callId);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): CallSession[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.state !== 'ended'
    );
  }

  /**
   * Get active session count
   */
  get activeCount(): number {
    return this.getActiveSessions().length;
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();
