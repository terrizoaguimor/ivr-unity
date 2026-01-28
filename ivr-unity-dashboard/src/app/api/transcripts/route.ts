import { NextRequest, NextResponse } from "next/server";
import { getConversations } from "@/lib/elevenlabs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const agentId = searchParams.get("agentId");
    const cursor = searchParams.get("cursor");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await getConversations({
      agentId: agentId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      pageSize: Math.min(pageSize, 100), // Max 100 per page
      cursor: cursor || undefined,
    });

    return NextResponse.json({
      conversations: result.conversations,
      nextCursor: result.nextCursor,
      hasMore: !!result.nextCursor,
    });
  } catch (error) {
    console.error("Error fetching transcripts:", error);

    // Return demo data on error
    return NextResponse.json({
      conversations: [
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
          duration: 180,
          messages: [
            { role: "assistant", content: "Bienvenido a Unity Financial", timestamp: 0 },
            { role: "user", content: "Tuve un accidente de auto", timestamp: 3 },
          ],
          analysis: {
            evaluationResults: { resolution: { result: "pending" } },
            collectedData: { call_reason: "Reporte siniestro" },
          },
        },
      ],
      nextCursor: null,
      hasMore: false,
      isDemo: true,
    });
  }
}
