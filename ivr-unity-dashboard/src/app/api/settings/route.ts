import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await request.json();

    // In a real implementation, you would:
    // 1. Validate the settings
    // 2. Store them securely (encrypted in database, or update environment variables)
    // 3. Restart services if needed

    console.log("Settings received:", {
      ...settings,
      elevenlabs: { ...settings.elevenlabs, apiKey: "***" },
      telnyx: { ...settings.telnyx, apiKey: "***" },
    });

    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return current settings (masked)
  return NextResponse.json({
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY ? "***configured***" : "",
      agentId: process.env.ELEVENLABS_AGENT_ID || "",
    },
    telnyx: {
      apiKey: process.env.TELNYX_API_KEY ? "***configured***" : "",
      publicKey: process.env.TELNYX_PUBLIC_KEY || "",
    },
    general: {
      companyName: "Unity Financial",
      defaultLanguage: "es",
      backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
    },
  });
}
