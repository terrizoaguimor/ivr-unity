"use client";

import { useState } from "react";
import { Phone, Clock, CheckCircle, Activity, Users, Zap } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { CallList } from "@/components/calls/call-list";
import { LiveCallPanel } from "@/components/calls/live-call-panel";
import { useRealtimeCalls } from "@/hooks/use-realtime-calls";
import { cn } from "@/lib/utils";
import type { Call } from "@/types";

export default function DashboardPage() {
  const { calls, activeCalls, connected } = useRealtimeCalls();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  // Calculate stats
  const todayCalls = calls.length;
  const avgDuration = calls.length > 0
    ? Math.round(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length)
    : 0;
  const completedCalls = calls.filter((c) => c.status === "completed").length;
  const resolutionRate = todayCalls > 0 ? Math.round((completedCalls / todayCalls) * 100) : 0;

  const departments = [
    { name: "SALUD", count: 12, gradient: "from-emerald-500 to-teal-600" },
    { name: "VIDA", count: 8, gradient: "from-blue-500 to-indigo-600" },
    { name: "P&C", count: 6, gradient: "from-amber-500 to-orange-600" },
    { name: "PQRS", count: 4, gradient: "from-purple-500 to-violet-600" },
    { name: "SINIESTRO", count: 2, gradient: "from-rose-500 to-pink-600" },
  ];

  const totalDeptCalls = departments.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={connected ? "Conectado en tiempo real" : "Modo demo"}
      />

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
            value={todayCalls}
            icon={Activity}
            trend={{ value: 12, label: "vs ayer" }}
            color="blue"
            index={1}
          />
          <StatsCard
            title="Duración Promedio"
            value={`${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, "0")}`}
            icon={Clock}
            color="yellow"
            index={2}
          />
          <StatsCard
            title="Tasa de Resolución"
            value={`${resolutionRate}%`}
            icon={CheckCircle}
            trend={{ value: 5, label: "vs semana" }}
            color="purple"
            index={3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Calls */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
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
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Por Departamento
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                          {dept.name}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {dept.count}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            dept.gradient,
                            "transition-all duration-500 group-hover:shadow-lg"
                          )}
                          style={{ width: `${(dept.count / totalDeptCalls) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
