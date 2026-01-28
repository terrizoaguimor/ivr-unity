"use client";

import { useState } from "react";
import { Phone, Clock, CheckCircle, Activity, Users, Zap, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CallList } from "@/components/calls/call-list";
import { LiveCallPanel } from "@/components/calls/live-call-panel";
import { useRealtimeCalls } from "@/hooks/use-realtime-calls";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { cn } from "@/lib/utils";
import type { Call } from "@/types";

export default function DashboardPage() {
  const { calls, activeCalls, connected } = useRealtimeCalls();
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboardStats(60000);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Use real stats from ElevenLabs, fallback to realtime calls
  const todayCalls = stats.todayCalls || calls.length;
  const avgDuration = stats.avgDuration || (calls.length > 0
    ? Math.round(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length)
    : 0);
  const resolutionRate = stats.resolutionRate;

  const departments = stats.departments.length > 0
    ? stats.departments
    : [
        { name: "SALUD", count: 0, gradient: "from-emerald-500 to-teal-600" },
        { name: "VIDA", count: 0, gradient: "from-blue-500 to-indigo-600" },
        { name: "P&C", count: 0, gradient: "from-amber-500 to-orange-600" },
        { name: "PQRS", count: 0, gradient: "from-purple-500 to-violet-600" },
        { name: "SINIESTRO", count: 0, gradient: "from-rose-500 to-pink-600" },
      ];

  const totalDeptCalls = departments.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Header
        title="Dashboard"
        subtitle={connected ? "Conectado en tiempo real" : "Estadísticas de ElevenLabs"}
      >
        <Button
          variant="glass"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
          Actualizar
        </Button>
      </Header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Llamadas Activas"
            value={activeCalls.length}
            icon={Phone}
            color="green"
            index={0}
          />
          <StatsCard
            title="Llamadas Hoy"
            value={statsLoading ? "..." : todayCalls}
            icon={Activity}
            trend={stats.recentTrend.calls !== 0 ? {
              value: Math.abs(stats.recentTrend.calls),
              label: "vs ayer",
              positive: stats.recentTrend.calls > 0
            } : undefined}
            color="blue"
            index={1}
          />
          <StatsCard
            title="Duración Promedio"
            value={statsLoading ? "..." : `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, "0")}`}
            icon={Clock}
            color="yellow"
            index={2}
          />
          <StatsCard
            title="Tasa de Resolución"
            value={statsLoading ? "..." : `${resolutionRate}%`}
            icon={CheckCircle}
            trend={stats.recentTrend.resolution !== 0 ? {
              value: Math.abs(stats.recentTrend.resolution),
              label: "vs semana",
              positive: stats.recentTrend.resolution > 0
            } : undefined}
            color="purple"
            index={3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Calls */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Llamadas en Tiempo Real
                    </h2>
                    {activeCalls.length > 0 && (
                      <Badge variant="success" dot pulse>
                        {activeCalls.length} activas
                      </Badge>
                    )}
                  </div>
                  <Badge variant={connected ? "success" : "warning"}>
                    {connected ? "En vivo" : "Demo"}
                  </Badge>
                </div>
              </div>
              <div className="p-0">
                <CallList
                  calls={calls}
                  onSelectCall={setSelectedCall}
                  selectedCallId={selectedCall?.id}
                />
              </div>
            </GlassCard>
          </div>

          {/* Selected Call Panel or Department Stats */}
          <div className="lg:col-span-1">
            {selectedCall && (selectedCall.status === "active" || selectedCall.status === "streaming") ? (
              <LiveCallPanel
                call={selectedCall}
                onClose={() => setSelectedCall(null)}
              />
            ) : (
              <GlassCard>
                <div className="p-6 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Por Departamento
                      </h2>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-white/50">
                      Últimos 7 días
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {totalDeptCalls === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-white/40">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Sin datos de departamentos</p>
                      <p className="text-xs mt-1">Las llamadas se clasificarán automáticamente</p>
                    </div>
                  ) : (
                    departments.map((dept) => (
                      <div key={dept.name} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {dept.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {dept.count}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-white/40">
                              ({totalDeptCalls > 0 ? Math.round((dept.count / totalDeptCalls) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              dept.gradient,
                              "transition-all duration-500 group-hover:shadow-lg"
                            )}
                            style={{ width: `${totalDeptCalls > 0 ? (dept.count / totalDeptCalls) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {/* Weekly Summary */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-white/50">Total esta semana</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.totalCalls}
                        </span>
                        {stats.recentTrend.calls !== 0 && (
                          <span className={cn(
                            "flex items-center text-xs",
                            stats.recentTrend.calls > 0 ? "text-emerald-500" : "text-red-500"
                          )}>
                            {stats.recentTrend.calls > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-0.5" />
                            )}
                            {Math.abs(stats.recentTrend.calls)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
