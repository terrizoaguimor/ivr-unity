// Call types
export interface Call {
  id: string;
  callControlId: string;
  caller: string;
  calledNumber: string;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  department?: string;
  queue?: string;
  agentResponse?: string;
  transferredTo?: string;
}

export type CallStatus =
  | "ringing"
  | "active"
  | "streaming"
  | "transferring"
  | "completed"
  | "failed";

// Transcript types
export interface Transcript {
  id: string;
  conversationId: string;
  callId?: string;
  caller?: string;
  startTime: string;
  endTime: string;
  duration: number;
  messages: TranscriptMessage[];
  analysis?: TranscriptAnalysis;
  audioUrl?: string;
}

export interface TranscriptMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface TranscriptAnalysis {
  evaluationResults?: Record<string, {
    result: string;
    rationale?: string;
  }>;
  collectedData?: Record<string, string>;
  sentiment?: "positive" | "neutral" | "negative";
  resolved?: boolean;
}

// Agent types
export interface Agent {
  agentId: string;
  name: string;
  status: "active" | "inactive";
  voiceId: string;
  language: string;
  firstMessage: string;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
  stats?: AgentStats;
}

export interface AgentStats {
  totalCalls: number;
  avgDuration: number;
  resolutionRate: number;
  transferRate: number;
}

// Settings types
export interface Settings {
  elevenlabs: {
    apiKey: string;
    agentId: string;
  };
  telnyx: {
    apiKey: string;
    publicKey: string;
  };
  general: {
    companyName: string;
    defaultLanguage: string;
    businessHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
}

// Dashboard stats
export interface DashboardStats {
  activeCalls: number;
  todayCalls: number;
  avgDuration: number;
  resolutionRate: number;
  callsByDepartment: {
    department: string;
    count: number;
  }[];
  callsByHour: {
    hour: string;
    calls: number;
  }[];
}
