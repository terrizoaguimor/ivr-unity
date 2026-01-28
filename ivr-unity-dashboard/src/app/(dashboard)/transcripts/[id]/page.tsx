import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Play, User, Bot, Clock, CheckCircle, Calendar, MessageSquare } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getConversation } from "@/lib/elevenlabs";
import { formatDuration, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp?: number;
  time_in_call_secs?: number;
}

export default async function TranscriptDetailPage({ params }: PageProps) {
  const { id } = await params;

  let transcript: {
    id: string;
    conversationId: string;
    startTime: string;
    endTime?: string;
    duration: number;
    messages: Message[];
    analysis?: {
      evaluationResults?: Record<string, { result: string; rationale?: string }>;
      collectedData?: Record<string, string>;
    };
  };

  try {
    const result = await getConversation(id);
    transcript = {
      id: result.id || result.conversationId || id,
      conversationId: result.conversationId || id,
      startTime: result.startTime || new Date().toISOString(),
      endTime: result.endTime,
      duration: result.duration || 0,
      messages: (result.messages || []).map((msg) => ({
        role: msg.role === "system" ? "assistant" : msg.role as "assistant" | "user",
        content: msg.content || "",
        timestamp: msg.timestamp || 0,
      })),
      analysis: result.analysis,
    };
  } catch {
    // Use demo data if API fails
    if (id.startsWith("demo") || id.startsWith("conv_")) {
      transcript = {
        id,
        conversationId: id,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3300000).toISOString(),
        duration: 300,
        messages: [
          { role: "assistant", content: "Bienvenido a Unity Financial. ¿En qué puedo ayudarle hoy?", timestamp: 0 },
          { role: "user", content: "Hola, quiero cotizar un seguro de salud", timestamp: 5 },
          { role: "assistant", content: "Con gusto le ayudo con una cotización de seguro de salud. Para darle la mejor opción, necesito hacerle algunas preguntas. ¿Cuántas personas incluiría en el plan?", timestamp: 8 },
          { role: "user", content: "Somos 4 personas, mi esposa, dos hijos y yo", timestamp: 15 },
          { role: "assistant", content: "Perfecto, un plan familiar para 4 personas. ¿Sus hijos son menores de edad?", timestamp: 18 },
          { role: "user", content: "Sí, tienen 8 y 12 años", timestamp: 25 },
          { role: "assistant", content: "Excelente. Le voy a transferir con uno de nuestros asesores de ventas del equipo de Salud para que le brinde las mejores opciones de cobertura. ¿Está bien?", timestamp: 28 },
          { role: "user", content: "Sí, perfecto", timestamp: 35 },
          { role: "assistant", content: "Perfecto, en un momento le transfiero. ¡Que tenga un excelente día!", timestamp: 38 },
        ],
        analysis: {
          evaluationResults: { resolution: { result: "success", rationale: "Cliente transferido exitosamente a ventas" } },
          collectedData: { call_reason: "Cotización seguro salud familiar", family_size: "4 personas" },
        },
      };
    } else {
      notFound();
    }
  }

  // Check if any evaluation result has success
  const resolved = transcript.analysis?.evaluationResults
    ? Object.values(transcript.analysis.evaluationResults).some(r => r.result === "success")
    : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Header
        title="Detalle de Transcripción"
        subtitle={`Conversación ${transcript.id.substring(0, 20)}...`}
      />

      <div className="p-6">
        {/* Back Button */}
        <Link
          href="/transcripts"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a transcripciones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Conversación
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Reproducir
                    </Button>
                    <Button variant="glass" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {transcript.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-white/40">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                      <p>No hay mensajes en esta conversación</p>
                    </div>
                  ) : (
                    transcript.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex gap-3",
                          msg.role === "user" ? "flex-row-reverse" : ""
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.role === "user"
                              ? "bg-slate-200 dark:bg-slate-600"
                              : "bg-gradient-to-br from-indigo-500 to-purple-600"
                          )}
                        >
                          {msg.role === "user" ? (
                            <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className={cn("flex-1", msg.role === "user" ? "text-right" : "")}>
                          <div
                            className={cn(
                              "inline-block max-w-[85%] px-4 py-3 rounded-2xl",
                              msg.role === "user"
                                ? "bg-indigo-500 text-white rounded-tr-sm"
                                : "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-tl-sm"
                            )}
                          >
                            <p className="text-sm leading-relaxed">{msg.content || "(Sin contenido)"}</p>
                          </div>
                          <p className={cn(
                            "text-xs text-slate-400 dark:text-white/40 mt-1.5",
                            msg.role === "user" ? "text-right" : ""
                          )}>
                            {formatDuration(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Info Card */}
            <GlassCard>
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Información
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
                    <Clock className="w-5 h-5 text-slate-500 dark:text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-white/50">Duración</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDuration(transcript.duration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
                    <CheckCircle className="w-5 h-5 text-slate-500 dark:text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-white/50">Estado</p>
                    <Badge variant={resolved ? "success" : "warning"}>
                      {resolved ? "Resuelto" : "Transferido"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
                    <Calendar className="w-5 h-5 text-slate-500 dark:text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-white/50">Fecha</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {new Date(transcript.startTime).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Analysis Card */}
            <GlassCard>
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Análisis
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {transcript.analysis?.collectedData && Object.keys(transcript.analysis.collectedData).length > 0 ? (
                  <>
                    {Object.entries(transcript.analysis.collectedData).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <p className="text-xs text-slate-500 dark:text-white/50 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {value || "No especificado"}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-white/40">
                    No hay datos de análisis disponibles
                  </p>
                )}
                {transcript.analysis?.evaluationResults && Object.keys(transcript.analysis.evaluationResults).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(transcript.analysis.evaluationResults).map(([key, value]) => (
                      <div
                        key={key}
                        className={cn(
                          "p-3 rounded-lg border",
                          value.result === "success"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                        )}
                      >
                        <p className={cn(
                          "text-xs uppercase tracking-wide mb-1",
                          value.result === "success"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        )}>
                          {key.replace(/_/g, " ")}
                        </p>
                        {value.rationale && (
                          <p className={cn(
                            "text-sm",
                            value.result === "success"
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-amber-700 dark:text-amber-300"
                          )}>
                            {value.rationale}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
