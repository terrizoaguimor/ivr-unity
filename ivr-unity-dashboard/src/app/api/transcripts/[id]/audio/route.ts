import { NextRequest, NextResponse } from "next/server";
import { getConversationAudio } from "@/lib/elevenlabs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const audioBlob = await getConversationAudio(id);

    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Content-Disposition": `inline; filename="conversation-${id}.mp3"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
