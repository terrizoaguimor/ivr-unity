"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Phone, Filter, Download, RefreshCw, FileText } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CallList } from "@/components/calls/call-list";
import { LiveCallPanel } from "@/components/calls/live-call-panel";
import { useRealtimeCalls } from "@/hooks/use-realtime-calls";
import { cn } from "@/lib/utils";
import type { Call } from "@/types";

export default function CallsPage() {
  const { calls, activeCalls, completedCalls, connected } = useRealtimeCalls();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredCalls = filter === "all"
    ? calls
    : filter === "active"
    ? activeCalls
    : completedCalls;

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.from(contentRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        title="Llamadas"
        subtitle="Monitoreo en tiempo real de llamadas"
      />

      <div ref={contentRef} className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "Todas", count: calls.length },
              { key: "active", label: "Activas", count: activeCalls.length, pulse: activeCalls.length > 0 },
              { key: "completed", label: "Completadas", count: completedCalls.length },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  filter === item.key
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  {item.label} ({item.count})
                  {item.pulse && (
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="glass" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="glass" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call List */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Lista de Llamadas
                    </h2>
                  </div>
                  <Badge variant={connected ? "success" : "warning"}>
                    {connected ? "Conectado" : "Demo"}
                  </Badge>
                </div>
              </div>
              <div className="p-0">
                <CallList
                  calls={filteredCalls}
                  onSelectCall={setSelectedCall}
                  selectedCallId={selectedCall?.id}
                />
              </div>
            </GlassCard>
          </div>

          {/* Call Details */}
          <div className="lg:col-span-1">
            {selectedCall ? (
              selectedCall.status === "active" || selectedCall.status === "streaming" ? (
                <LiveCallPanel
                  call={selectedCall}
                  onClose={() => setSelectedCall(null)}
                />
              ) : (
                <GlassCard>
                  <div className="p-6 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Detalles de Llamada
                    </h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-white/50 mb-1">Llamante</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {selectedCall.caller}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-white/50 mb-1">Estado</p>
                      <Badge variant={selectedCall.status === "completed" ? "success" : "error"}>
                        {selectedCall.status}
                      </Badge>
                    </div>
                    {selectedCall.department && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-1">Departamento</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {selectedCall.department}
                        </p>
                      </div>
                    )}
                    {selectedCall.duration !== undefined && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-1">Duración</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {Math.floor(selectedCall.duration / 60)}:{(selectedCall.duration % 60).toString().padStart(2, "0")}
                        </p>
                      </div>
                    )}
                    {selectedCall.transferredTo && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-1">Transferida a</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {selectedCall.transferredTo}
                        </p>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => window.open(`/transcripts/${selectedCall.id}`, "_blank")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Transcripción
                    </Button>
                  </div>
                </GlassCard>
              )
            ) : (
              <GlassCard>
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-white/40">
                  <Phone className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-center">
                    Selecciona una llamada para ver sus detalles
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
