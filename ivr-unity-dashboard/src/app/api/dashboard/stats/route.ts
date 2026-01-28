import { NextResponse } from "next/server";
import { getConversations, getAgents } from "@/lib/elevenlabs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DepartmentStat {
  name: string;
  count: number;
  gradient: string;
}

interface DashboardStats {
  totalCalls: number;
  todayCalls: number;
  avgDuration: number;
  resolutionRate: number;
  transferRate: number;
  departments: DepartmentStat[];
  recentTrend: {
    calls: number;
    resolution: number;
  };
}

export async function GET() {
  try {
    // Get all agents first
    const agents = await getAgents();
    const agentId = agents[0]?.agentId;

    if (!agentId) {
      return NextResponse.json({
        totalCalls: 0,
        todayCalls: 0,
        avgDuration: 0,
        resolutionRate: 0,
        transferRate: 0,
        departments: [],
        recentTrend: { calls: 0, resolution: 0 },
      } as DashboardStats);
    }

    // Get today's date range
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekAgoStart = new Date(todayStart);
    weekAgoStart.setDate(weekAgoStart.getDate() - 7);

    // Fetch conversations for today
    const { conversations: todayConversations } = await getConversations({
      agentId,
      startDate: todayStart.toISOString(),
      pageSize: 100,
    });

    // Fetch conversations for yesterday (for trend)
    const { conversations: yesterdayConversations } = await getConversations({
      agentId,
      startDate: yesterdayStart.toISOString(),
      endDate: todayStart.toISOString(),
      pageSize: 100,
    });

    // Fetch conversations for the week (for weekly trend)
    const { conversations: weekConversations } = await getConversations({
      agentId,
      startDate: weekAgoStart.toISOString(),
      pageSize: 100,
    });

    // Calculate stats for today
    const todayCalls = todayConversations.length;
    const totalDuration = todayConversations.reduce((sum, c) => sum + (c.duration || 0), 0);
    const avgDuration = todayCalls > 0 ? Math.round(totalDuration / todayCalls) : 0;

    // Calculate resolution rate
    const resolvedToday = todayConversations.filter(
      (c) => c.analysis?.evaluationResults &&
        Object.values(c.analysis.evaluationResults).some(r => r.result === "success")
    ).length;
    const resolutionRate = todayCalls > 0 ? Math.round((resolvedToday / todayCalls) * 100) : 0;

    // Calculate transfer rate
    const transferredToday = todayConversations.filter(
      (c) => c.analysis?.collectedData?.transferred === "true" ||
        c.analysis?.collectedData?.transfer_department
    ).length;
    const transferRate = todayCalls > 0 ? Math.round((transferredToday / todayCalls) * 100) : 0;

    // Calculate department breakdown from collected data
    const departmentCounts: Record<string, number> = {
      SALUD: 0,
      VIDA: 0,
      "P&C": 0,
      PQRS: 0,
      SINIESTRO: 0,
    };

    for (const conv of weekConversations) {
      const dept = conv.analysis?.collectedData?.department ||
        conv.analysis?.collectedData?.transfer_department ||
        conv.analysis?.collectedData?.call_reason;

      if (dept) {
        const deptUpper = dept.toUpperCase();
        if (deptUpper.includes("SALUD") || deptUpper.includes("HEALTH")) {
          departmentCounts.SALUD++;
        } else if (deptUpper.includes("VIDA") || deptUpper.includes("LIFE")) {
          departmentCounts.VIDA++;
        } else if (deptUpper.includes("P&C") || deptUpper.includes("AUTO") || deptUpper.includes("HOGAR")) {
          departmentCounts["P&C"]++;
        } else if (deptUpper.includes("PQRS") || deptUpper.includes("QUEJA") || deptUpper.includes("RECLAMO")) {
          departmentCounts.PQRS++;
        } else if (deptUpper.includes("SINIESTRO") || deptUpper.includes("ACCIDENTE") || deptUpper.includes("CLAIM")) {
          departmentCounts.SINIESTRO++;
        } else {
          // Default: distribute to general (SALUD)
          departmentCounts.SALUD++;
        }
      }
    }

    // Build department stats array
    const departments: DepartmentStat[] = [
      { name: "SALUD", count: departmentCounts.SALUD, gradient: "from-emerald-500 to-teal-600" },
      { name: "VIDA", count: departmentCounts.VIDA, gradient: "from-blue-500 to-indigo-600" },
      { name: "P&C", count: departmentCounts["P&C"], gradient: "from-amber-500 to-orange-600" },
      { name: "PQRS", count: departmentCounts.PQRS, gradient: "from-purple-500 to-violet-600" },
      { name: "SINIESTRO", count: departmentCounts.SINIESTRO, gradient: "from-rose-500 to-pink-600" },
    ];

    // Calculate trends
    const yesterdayCalls = yesterdayConversations.length;
    const callsTrend = yesterdayCalls > 0
      ? Math.round(((todayCalls - yesterdayCalls) / yesterdayCalls) * 100)
      : todayCalls > 0 ? 100 : 0;

    // Weekly resolution rate for trend
    const resolvedWeek = weekConversations.filter(
      (c) => c.analysis?.evaluationResults &&
        Object.values(c.analysis.evaluationResults).some(r => r.result === "success")
    ).length;
    const weekResolutionRate = weekConversations.length > 0
      ? Math.round((resolvedWeek / weekConversations.length) * 100)
      : 0;
    const resolutionTrend = resolutionRate - weekResolutionRate;

    const stats: DashboardStats = {
      totalCalls: weekConversations.length,
      todayCalls,
      avgDuration,
      resolutionRate,
      transferRate,
      departments,
      recentTrend: {
        calls: callsTrend,
        resolution: resolutionTrend,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    // Return fallback demo data
    return NextResponse.json({
      totalCalls: 0,
      todayCalls: 0,
      avgDuration: 0,
      resolutionRate: 0,
      transferRate: 0,
      departments: [
        { name: "SALUD", count: 0, gradient: "from-emerald-500 to-teal-600" },
        { name: "VIDA", count: 0, gradient: "from-blue-500 to-indigo-600" },
        { name: "P&C", count: 0, gradient: "from-amber-500 to-orange-600" },
        { name: "PQRS", count: 0, gradient: "from-purple-500 to-violet-600" },
        { name: "SINIESTRO", count: 0, gradient: "from-rose-500 to-pink-600" },
      ],
      recentTrend: { calls: 0, resolution: 0 },
    } as DashboardStats);
  }
}
