"use client";

import { useState, useEffect, useCallback } from "react";

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

const defaultStats: DashboardStats = {
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
};

export function useDashboardStats(refreshInterval = 60000) {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up auto-refresh
    const intervalId = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}
