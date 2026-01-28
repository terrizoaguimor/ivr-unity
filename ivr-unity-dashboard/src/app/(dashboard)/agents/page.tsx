"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { AgentsList } from "@/components/agents/agents-list";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const [stats, setStats] = useState([
    { label: "Agentes Activos", value: "...", gradient: "from-purple-500 to-violet-600" },
    { label: "Llamadas Esta Semana", value: "...", gradient: "from-blue-500 to-indigo-600" },
    { label: "Tasa de Resolución", value: "...", gradient: "from-emerald-500 to-teal-600" },
    { label: "Duración Promedio", value: "...", gradient: "from-amber-500 to-orange-600" },
  ]);

  useEffect(() => {
    // Fetch stats from dashboard API
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        const avgDuration = data.avgDuration || 0;
        const mins = Math.floor(avgDuration / 60);
        const secs = avgDuration % 60;

        setStats([
          { label: "Agentes Activos", value: "1", gradient: "from-purple-500 to-violet-600" },
          { label: "Llamadas Esta Semana", value: (data.totalCalls || 0).toLocaleString(), gradient: "from-blue-500 to-indigo-600" },
          { label: "Tasa de Resolución", value: `${data.resolutionRate || 0}%`, gradient: "from-emerald-500 to-teal-600" },
          { label: "Duración Promedio", value: `${mins}:${secs.toString().padStart(2, "0")}`, gradient: "from-amber-500 to-orange-600" },
        ]);
      })
      .catch(() => {
        // Fallback to demo data
        setStats([
          { label: "Agentes Activos", value: "1", gradient: "from-purple-500 to-violet-600" },
          { label: "Llamadas Esta Semana", value: "0", gradient: "from-blue-500 to-indigo-600" },
          { label: "Tasa de Resolución", value: "0%", gradient: "from-emerald-500 to-teal-600" },
          { label: "Duración Promedio", value: "0:00", gradient: "from-amber-500 to-orange-600" },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Header
        title="Agentes AI"
        subtitle="Gestiona los agentes de ElevenLabs Conversational AI"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="group">
              <div className="p-5 flex items-center gap-4">
                <div className={cn(
                  "w-2 h-12 rounded-full bg-gradient-to-b",
                  stat.gradient
                )} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-white/50">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Agents Grid */}
        <AgentsList />
      </div>
    </div>
  );
}
