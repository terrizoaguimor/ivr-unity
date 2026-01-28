import { Suspense } from "react";
import { MessageSquare, Download, Search, Calendar, Sparkles, Eye } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getConversations } from "@/lib/elevenlabs";
import { formatDuration, cn } from "@/lib/utils";
import Link from "next/link";

async function TranscriptsList() {
  let transcripts = [];
  let error = null;

  try {
    const result = await getConversations({ pageSize: 50 });
    transcripts = result.conversations;
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar transcripciones";
    // Use demo data if API fails
    transcripts = [
      {
        id: "demo-1",
        conversationId: "demo-1",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3300000).toISOString(),
        duration: 300,
        messages: [
          { role: "assistant", content: "Bienvenido a Unity Financial", timestamp: 0 },
          { role: "user", content: "Quiero cotizar un seguro de salud", timestamp: 5 },
        ],
        analysis: {
          evaluationResults: { resolution: { result: "success" } },
          collectedData: { call_reason: "Cotización salud" },
        },
      },
      {
        id: "demo-2",
        conversationId: "demo-2",
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 6900000).toISOString(),
        duration: 300,
        messages: [
          { role: "assistant", content: "Bienvenido a Unity Financial", timestamp: 0 },
          { role: "user", content: "Tuve un accidente de auto", timestamp: 3 },
        ],
        analysis: {
          evaluationResults: { resolution: { result: "success" } },
          collectedData: { call_reason: "Reporte siniestro" },
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

      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Transcripciones Recientes
              </h2>
            </div>
            <Badge>{transcripts.length} conversaciones</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transcripts.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-white">
                        {new Date(t.startTime).toLocaleDateString("es-CO")}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(t.startTime).toLocaleTimeString("es-CO")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/70">
                    {formatDuration(t.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/70">
                    {t.analysis?.collectedData?.call_reason || "No especificado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        t.analysis?.evaluationResults?.resolution?.result === "success"
                          ? "success"
                          : "warning"
                      }
                    >
                      {t.analysis?.evaluationResults?.resolution?.result === "success"
                        ? "Resuelto"
                        : "Transferido"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link href={`/transcripts/${t.id}`}>
                        <Button variant="glass" size="sm">
                          <Eye className="w-4 h-4 mr-1.5" />
                          Ver
                        </Button>
                      </Link>
                      <Button variant="glass" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}

export default function TranscriptsPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Transcripciones"
        subtitle="Historial de conversaciones con el agente AI"
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar en transcripciones..."
                className={cn(
                  "pl-10 pr-4 py-2.5 w-80",
                  "bg-white/5 backdrop-blur-sm",
                  "border border-white/10 rounded-xl",
                  "text-sm text-white placeholder:text-white/30",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50",
                  "transition-all duration-200"
                )}
              />
            </div>
            <Button variant="glass" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha
            </Button>
          </div>

          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Transcripts List */}
        <Suspense
          fallback={
            <GlassCard>
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-white/50">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Cargando transcripciones...</span>
                </div>
              </div>
            </GlassCard>
          }
        >
          <TranscriptsList />
        </Suspense>
      </div>
    </div>
  );
}
