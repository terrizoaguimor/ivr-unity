import { NextRequest, NextResponse } from "next/server";
import { getConversations } from "@/lib/elevenlabs";

export const dynamic = "force-dynamic";

function escapeCSV(value: string): string {
  if (!value) return "";
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  const escaped = value.replace(/"/g, '""');
  if (escaped.includes(",") || escaped.includes("\n") || escaped.includes('"')) {
    return `"${escaped}"`;
  }
  return escaped;
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const agentId = searchParams.get("agentId");

    // Fetch conversations
    const { conversations } = await getConversations({
      agentId: agentId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      pageSize: 1000, // Max export size
    });

    // Build CSV
    const headers = [
      "ID",
      "Fecha",
      "Hora",
      "Duración",
      "Mensajes",
      "Motivo de Llamada",
      "Estado",
      "Resumen",
    ];

    const rows = conversations.map((conv) => {
      const date = new Date(conv.startTime);
      const callReason = conv.analysis?.collectedData?.call_reason || "";
      const resolved = conv.analysis?.evaluationResults
        ? Object.values(conv.analysis.evaluationResults).some(r => r.result === "success")
        : false;

      // Create summary from first few messages
      const summary = conv.messages
        .slice(0, 4)
        .map(m => `${m.role === "assistant" ? "AI" : "Usuario"}: ${m.content}`)
        .join(" | ")
        .substring(0, 200);

      return [
        escapeCSV(conv.id),
        escapeCSV(date.toLocaleDateString("es-CO")),
        escapeCSV(date.toLocaleTimeString("es-CO")),
        escapeCSV(formatDuration(conv.duration)),
        conv.messages.length.toString(),
        escapeCSV(callReason),
        resolved ? "Resuelto" : "Transferido",
        escapeCSV(summary),
      ];
    });

    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Add BOM for Excel compatibility
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    // Generate filename with date
    const now = new Date();
    const filename = `transcripciones_${now.toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvWithBOM, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting transcripts:", error);
    return NextResponse.json(
      { error: "Failed to export transcripts" },
      { status: 500 }
    );
  }
}
