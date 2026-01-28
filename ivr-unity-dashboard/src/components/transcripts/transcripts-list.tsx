"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Search, Calendar, Eye, Download, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "./export-button";
import { formatDuration, cn } from "@/lib/utils";
import Link from "next/link";
import type { Transcript } from "@/types";

interface TranscriptsResponse {
  conversations: Transcript[];
  nextCursor: string | null;
  hasMore: boolean;
  isDemo?: boolean;
}

export function TranscriptsList() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Pagination state
  const [cursors, setCursors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const fetchTranscripts = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", new Date(startDate).toISOString());
      if (endDate) params.set("endDate", new Date(endDate + "T23:59:59").toISOString());
      if (cursor) params.set("cursor", cursor);
      params.set("pageSize", "20");

      const queryString = params.toString();
      const response = await fetch(`/api/transcripts${queryString ? `?${queryString}` : ""}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transcripts");
      }

      const data: TranscriptsResponse = await response.json();
      setTranscripts(data.conversations);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setIsDemo(data.isDemo || false);
    } catch (err) {
      console.error("Error fetching transcripts:", err);
      setError(err instanceof Error ? err.message : "Error al cargar transcripciones");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTranscripts();
    setCursors([]);
    setCurrentPage(0);
  }, [fetchTranscripts]);

  const handleNextPage = () => {
    if (nextCursor) {
      setCursors([...cursors, nextCursor]);
      setCurrentPage(currentPage + 1);
      fetchTranscripts(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newCursors = [...cursors];
      newCursors.pop();
      setCursors(newCursors);
      setCurrentPage(currentPage - 1);
      fetchTranscripts(newCursors[newCursors.length - 1]);
    }
  };

  const handleApplyDateFilter = () => {
    setShowDateFilter(false);
    fetchTranscripts();
    setCursors([]);
    setCurrentPage(0);
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setShowDateFilter(false);
  };

  // Filter by search query (client-side)
  const filteredTranscripts = transcripts.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const callReason = t.analysis?.collectedData?.call_reason?.toLowerCase() || "";
    const messages = t.messages.map(m => m.content.toLowerCase()).join(" ");
    return callReason.includes(query) || messages.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Buscar en transcripciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-2.5 w-80",
                "bg-white dark:bg-white/5 backdrop-blur-sm",
                "border border-slate-200 dark:border-white/10 rounded-xl",
                "text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50",
                "transition-all duration-200"
              )}
            />
          </div>

          {/* Date Filter Button */}
          <div className="relative">
            <Button
              variant={startDate || endDate ? "primary" : "glass"}
              size="sm"
              onClick={() => setShowDateFilter(!showDateFilter)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {startDate || endDate ? "Filtrado" : "Fecha"}
              {(startDate || endDate) && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearDateFilter();
                  }}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </Button>

            {/* Date Filter Dropdown */}
            {showDateFilter && (
              <div className={cn(
                "absolute top-full left-0 mt-2 p-4 z-50",
                "bg-white dark:bg-slate-800 rounded-xl shadow-xl",
                "border border-slate-200 dark:border-white/10",
                "min-w-[280px]"
              )}>
                <p className="text-sm font-medium text-slate-700 dark:text-white mb-3">
                  Filtrar por fecha
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-white/50 mb-1 block">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-sm",
                        "bg-slate-100 dark:bg-white/5",
                        "border border-slate-200 dark:border-white/10",
                        "text-slate-900 dark:text-white",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-white/50 mb-1 block">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-sm",
                        "bg-slate-100 dark:bg-white/5",
                        "border border-slate-200 dark:border-white/10",
                        "text-slate-900 dark:text-white",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      )}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={handleClearDateFilter}
                      className="flex-1"
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApplyDateFilter}
                      className="flex-1"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ExportButton startDate={startDate} endDate={endDate} />
      </div>

      {/* Error/Demo Alert */}
      {(error || isDemo) && (
        <div className={cn(
          "p-4 rounded-xl border",
          error
            ? "bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
            : "bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
        )}>
          <p className={cn(
            "text-sm",
            error
              ? "text-red-700 dark:text-red-400"
              : "text-amber-700 dark:text-amber-400"
          )}>
            {error || "Usando datos de demostración. Conecta tu API key de ElevenLabs para ver datos reales."}
          </p>
        </div>
      )}

      {/* Transcripts Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Transcripciones
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{filteredTranscripts.length} conversaciones</Badge>
              {(startDate || endDate) && (
                <Badge variant="info">
                  {startDate && endDate
                    ? `${new Date(startDate).toLocaleDateString("es-CO")} - ${new Date(endDate).toLocaleDateString("es-CO")}`
                    : startDate
                    ? `Desde ${new Date(startDate).toLocaleDateString("es-CO")}`
                    : `Hasta ${new Date(endDate).toLocaleDateString("es-CO")}`
                  }
                </Badge>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="ml-3 text-slate-500 dark:text-white/50">Cargando transcripciones...</span>
          </div>
        ) : filteredTranscripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-white/40">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p>No hay transcripciones</p>
            {searchQuery && (
              <p className="text-sm mt-1">Prueba con otra búsqueda</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredTranscripts.map((t) => {
                  const resolved = t.analysis?.evaluationResults
                    ? Object.values(t.analysis.evaluationResults).some(r => r.result === "success")
                    : false;

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(t.startTime).toLocaleDateString("es-CO")}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-white/40">
                            {new Date(t.startTime).toLocaleTimeString("es-CO")}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-white/70">
                        {formatDuration(t.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-white/70 max-w-[200px] truncate">
                        {t.analysis?.collectedData?.call_reason || "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={resolved ? "success" : "warning"}>
                          {resolved ? "Resuelto" : "Transferido"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link href={`/transcripts/${t.id}`}>
                            <Button variant="glass" size="sm">
                              <Eye className="w-4 h-4 mr-1.5" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {(hasMore || currentPage > 0) && (
          <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-white/50">
              Página {currentPage + 1}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={handleNextPage}
                disabled={!hasMore || loading}
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
