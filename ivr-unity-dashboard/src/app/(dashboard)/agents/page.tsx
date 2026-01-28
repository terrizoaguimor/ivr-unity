import { Suspense } from "react";
import { Bot, Plus, Settings, BarChart3, MessageSquare, Sparkles } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAgents } from "@/lib/elevenlabs";
import { cn } from "@/lib/utils";

async function AgentsList() {
  let agents = [];
  let error = null;

  try {
    agents = await getAgents();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar agentes";
    // Demo data
    agents = [
      {
        agentId: "demo-agent-1",
        name: "Unity Financial IVR",
        status: "active",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
        language: "es",
        firstMessage: "Bienvenido a Unity Financial. ¿En qué puedo ayudarle hoy?",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          totalCalls: 1250,
          avgDuration: 180,
          resolutionRate: 85,
          transferRate: 15,
        },
      },
    ];
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-400">
            Usando datos de demostración. Error: {error}
          </p>
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
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-sm text-white/50">
                      {agent.language === "es" ? "Español" : "English"}
                    </p>
                  </div>
                </div>
                <Badge variant={agent.status === "active" ? "success" : "default"} dot>
                  {agent.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <p className="text-sm text-white/60 mb-5 line-clamp-2">
                {agent.firstMessage}
              </p>

              {agent.stats && (
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-2xl font-bold text-white">
                      {agent.stats.totalCalls.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/40">Llamadas</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-400">
                      {agent.stats.resolutionRate}%
                    </p>
                    <p className="text-xs text-white/40">Resolución</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Button variant="glass" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}

        {/* Add Agent Card */}
        <GlassCard
          variant="subtle"
          className={cn(
            "border-2 border-dashed border-white/10",
            "hover:border-indigo-500/50 transition-colors cursor-pointer",
            "group"
          )}
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
            <div className={cn(
              "p-4 rounded-2xl mb-4 transition-all duration-300",
              "bg-white/5 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600",
              "group-hover:shadow-lg group-hover:shadow-indigo-500/30"
            )}>
              <Plus className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
            </div>
            <p className="font-semibold text-white">Crear Nuevo Agente</p>
            <p className="text-sm text-white/40 text-center mt-1">
              Configura un nuevo agente de IA para tu IVR
            </p>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

export default function AgentsPage() {
  const stats = [
    { label: "Agentes Activos", value: "1", gradient: "from-purple-500 to-violet-600" },
    { label: "Llamadas Este Mes", value: "1,250", gradient: "from-blue-500 to-indigo-600" },
    { label: "Tasa de Resolución", value: "85%", gradient: "from-emerald-500 to-teal-600" },
    { label: "Duración Promedio", value: "3:00", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Agentes AI"
        subtitle="Gestiona los agentes de ElevenLabs Conversational AI"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={stat.label} className="group">
              <div className="p-5 flex items-center gap-4">
                <div className={cn(
                  "w-2 h-12 rounded-full bg-gradient-to-b",
                  stat.gradient
                )} />
                <div>
                  <p className="text-sm text-white/50">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Agents Grid */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-white/50">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Cargando agentes...</span>
              </div>
            </div>
          }
        >
          <AgentsList />
        </Suspense>
      </div>
    </div>
  );
}
