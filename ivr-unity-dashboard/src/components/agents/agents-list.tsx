"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, Plus, Settings, BarChart3, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentEditorModal } from "./agent-editor-modal";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types";
import Link from "next/link";

const demoAgent: Agent = {
  agentId: "demo-agent-1",
  name: "Unity Financial IVR",
  status: "active",
  voiceId: "EXAVITQu4vr4xnSDxMaL",
  language: "es",
  firstMessage: "Bienvenido a Unity Financial. ¿En qué puedo ayudarle hoy?",
  systemPrompt: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  stats: {
    totalCalls: 1250,
    avgDuration: 180,
    resolutionRate: 85,
    transferRate: 15,
  },
};

export function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/agents");
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setAgents(data);
        setIsDemo(false);
      } else {
        throw new Error("No agents found");
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError(err instanceof Error ? err.message : "Error al cargar agentes");
      setAgents([demoAgent]);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleOpenEditor = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setSelectedAgent(null);
  };

  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgents(agents.map(a =>
      a.agentId === updatedAgent.agentId ? updatedAgent : a
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <span className="ml-3 text-slate-500 dark:text-white/50">Cargando agentes...</span>
      </div>
    );
  }

  return (
    <>
      {/* Error/Demo Alert */}
      {(error || isDemo) && (
        <div className={cn(
          "mb-6 p-4 rounded-xl border flex items-center justify-between",
          "bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
        )}>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {isDemo
              ? "Usando datos de demostración. Conecta tu API key de ElevenLabs para gestionar agentes reales."
              : `Error: ${error}`
            }
          </p>
          <Button variant="glass" size="sm" onClick={fetchAgents}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <GlassCard key={agent.agentId} variant="bordered" className="group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-xl",
                    "bg-gradient-to-br from-purple-500 to-violet-600",
                    "shadow-lg shadow-purple-500/30"
                  )}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-white/50">
                      {agent.language === "es" ? "Español" : agent.language === "en" ? "English" : agent.language}
                    </p>
                  </div>
                </div>
                <Badge variant={agent.status === "active" ? "success" : "default"} dot>
                  {agent.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <p className="text-sm text-slate-600 dark:text-white/60 mb-5 line-clamp-2">
                {agent.firstMessage}
              </p>

              {agent.stats && (
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {agent.stats.totalCalls.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/40">Llamadas</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {agent.stats.resolutionRate}%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/40">Resolución</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenEditor(agent)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Link href={`/transcripts?agentId=${agent.agentId}`}>
                  <Button variant="glass" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="glass" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}

        {/* Add Agent Card */}
        <GlassCard
          variant="subtle"
          className={cn(
            "border-2 border-dashed border-slate-200 dark:border-white/10",
            "hover:border-indigo-500/50 transition-colors cursor-pointer",
            "group"
          )}
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
            <div className={cn(
              "p-4 rounded-2xl mb-4 transition-all duration-300",
              "bg-slate-100 dark:bg-white/5 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600",
              "group-hover:shadow-lg group-hover:shadow-indigo-500/30"
            )}>
              <Plus className="w-8 h-8 text-slate-400 dark:text-white/40 group-hover:text-white transition-colors" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">Crear Nuevo Agente</p>
            <p className="text-sm text-slate-500 dark:text-white/40 text-center mt-1">
              Configura un nuevo agente de IA para tu IVR
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Agent Editor Modal */}
      {selectedAgent && (
        <AgentEditorModal
          agent={selectedAgent}
          isOpen={editorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveAgent}
        />
      )}
    </>
  );
}
