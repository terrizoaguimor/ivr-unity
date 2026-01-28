import type { Transcript, Agent, AgentStats } from "@/types";

const API_BASE = "https://api.elevenlabs.io/v1/convai";

async function fetchElevenLabs(endpoint: string, options: RequestInit = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const data = await fetchElevenLabs("/agents");
  return data.agents || [];
}

export async function getAgent(agentId: string): Promise<Agent> {
  return await fetchElevenLabs(`/agents/${agentId}`);
}

export async function updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
  return await fetchElevenLabs(`/agents/${agentId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

// Conversations / Transcripts
export async function getConversations(params: {
  agentId?: string;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
  cursor?: string;
}): Promise<{ conversations: Transcript[]; nextCursor?: string }> {
  const searchParams = new URLSearchParams();

  if (params.agentId) searchParams.set("agent_id", params.agentId);
  if (params.startDate) searchParams.set("start_date", params.startDate);
  if (params.endDate) searchParams.set("end_date", params.endDate);
  if (params.pageSize) searchParams.set("page_size", params.pageSize.toString());
  if (params.cursor) searchParams.set("cursor", params.cursor);

  const query = searchParams.toString();
  const data = await fetchElevenLabs(`/conversations${query ? `?${query}` : ""}`);

  return {
    conversations: (data.conversations || []).map(mapConversationToTranscript),
    nextCursor: data.next_cursor,
  };
}

export async function getConversation(conversationId: string): Promise<Transcript> {
  const data = await fetchElevenLabs(`/conversations/${conversationId}`);
  return mapConversationToTranscript(data);
}

export async function getConversationAudio(conversationId: string): Promise<Blob> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  const response = await fetch(`${API_BASE}/conversations/${conversationId}/audio`, {
    headers: {
      "xi-api-key": apiKey!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch audio: ${response.status}`);
  }

  return response.blob();
}

// Helper to map API response to our types
function mapConversationToTranscript(conv: Record<string, unknown>): Transcript {
  const transcript = conv.transcript as Array<{
    role: string;
    content: string;
    timestamp: number;
  }> || [];

  const analysis = conv.analysis as {
    evaluation_results?: Record<string, { result: string; rationale?: string }>;
    collected_data?: Record<string, string>;
  } | undefined;

  return {
    id: conv.conversation_id as string,
    conversationId: conv.conversation_id as string,
    startTime: conv.start_time as string || new Date().toISOString(),
    endTime: conv.end_time as string || new Date().toISOString(),
    duration: conv.duration_seconds as number || 0,
    messages: transcript.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      timestamp: msg.timestamp,
    })),
    analysis: analysis ? {
      evaluationResults: analysis.evaluation_results,
      collectedData: analysis.collected_data,
    } : undefined,
  };
}

// Agent Stats
export async function getAgentStats(agentId: string): Promise<AgentStats> {
  // Fetch recent conversations to calculate stats
  const { conversations } = await getConversations({
    agentId,
    pageSize: 100,
  });

  const totalCalls = conversations.length;
  const totalDuration = conversations.reduce((sum, c) => sum + (c.duration || 0), 0);
  const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

  // Calculate resolution rate from analysis
  const resolved = conversations.filter(
    (c) => c.analysis?.evaluationResults?.resolution?.result === "success"
  ).length;
  const resolutionRate = totalCalls > 0 ? (resolved / totalCalls) * 100 : 0;

  // Calculate transfer rate
  const transferred = conversations.filter(
    (c) => c.analysis?.collectedData?.transferred === "true"
  ).length;
  const transferRate = totalCalls > 0 ? (transferred / totalCalls) * 100 : 0;

  return {
    totalCalls,
    avgDuration,
    resolutionRate,
    transferRate,
  };
}
