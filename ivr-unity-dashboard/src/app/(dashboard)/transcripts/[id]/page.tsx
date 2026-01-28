import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Play, User, Bot, Clock, CheckCircle } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getConversation } from "@/lib/elevenlabs";
import { formatDuration } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TranscriptDetailPage({ params }: PageProps) {
  const { id } = await params;

  let transcript;
  try {
    transcript = await getConversation(id);
  } catch {
    // Use demo data if API fails
    if (id.startsWith("demo")) {
      transcript = {
        id,
        conversationId: id,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3300000).toISOString(),
        duration: 300,
        messages: [
          { role: "assistant" as const, content: "Bienvenido a Unity Financial. En que puedo ayudarle hoy?", timestamp: 0 },
          { role: "user" as const, content: "Hola, quiero cotizar un seguro de salud", timestamp: 5 },
          { role: "assistant" as const, content: "Con gusto le ayudo con una cotizacion de seguro de salud. Para darle la mejor opcion, necesito hacerle algunas preguntas. Cuantas personas incluiria en el plan?", timestamp: 8 },
          { role: "user" as const, content: "Somos 4 personas, mi esposa, dos hijos y yo", timestamp: 15 },
          { role: "assistant" as const, content: "Perfecto, un plan familiar para 4 personas. Sus hijos son menores de edad?", timestamp: 18 },
          { role: "user" as const, content: "Si, tienen 8 y 12 anos", timestamp: 25 },
          { role: "assistant" as const, content: "Excelente. Le voy a transferir con uno de nuestros asesores de ventas del equipo de Salud para que le brinde las mejores opciones de cobertura. Esta bien?", timestamp: 28 },
          { role: "user" as const, content: "Si, perfecto", timestamp: 35 },
          { role: "assistant" as const, content: "Perfecto, en un momento le transfiero. Que tenga un excelente dia!", timestamp: 38 },
        ],
        analysis: {
          evaluationResults: { resolution: { result: "success", rationale: "Cliente transferido exitosamente a ventas" } },
          collectedData: { call_reason: "Cotizacion seguro salud familiar", family_size: "4 personas" },
        },
      };
    } else {
      notFound();
    }
  }

  const resolved = transcript.analysis?.evaluationResults?.resolution?.result === "success";

  return (
    <div className="min-h-screen">
      <Header
        title="Detalle de Transcripcion"
        subtitle={`Conversacion ${transcript.id}`}
      />

      <div className="p-6">
        {/* Back Button */}
        <Link href="/transcripts" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a transcripciones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Conversacion</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transcript.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user"
                            ? "bg-gray-200 dark:bg-gray-600"
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <Bot className="w-5 h-5 text-google-blue" />
                        )}
                      </div>
                      <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block max-w-[80%] px-4 py-3 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-google-blue text-white rounded-tr-none"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                          {formatDuration(Math.round(msg.timestamp))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informacion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duracion</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDuration(transcript.duration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                    <Badge variant={resolved ? "success" : "warning"}>
                      {resolved ? "Resuelto" : "Transferido"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(transcript.startTime).toLocaleString("es-CO")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Card */}
            <Card>
              <CardHeader>
                <CardTitle>Analisis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcript.analysis?.collectedData && (
                  <>
                    {Object.entries(transcript.analysis.collectedData).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </>
                )}
                {transcript.analysis?.evaluationResults?.resolution?.rationale && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Razon</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {transcript.analysis.evaluationResults.resolution.rationale}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
