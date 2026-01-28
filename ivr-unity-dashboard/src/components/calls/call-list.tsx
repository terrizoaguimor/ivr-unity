"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Phone, PhoneOff, ArrowRightLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Call, CallStatus } from "@/types";

interface CallListProps {
  calls: Call[];
  onSelectCall?: (call: Call) => void;
  selectedCallId?: string;
}

export function CallList({ calls, onSelectCall, selectedCallId }: CallListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current || calls.length === 0) return;

    const items = listRef.current.querySelectorAll(".call-item");
    gsap.from(items, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
    });
  }, [calls.length]);

  const getStatusBadge = (status: CallStatus) => {
    const config: Record<CallStatus, { variant: "success" | "warning" | "error" | "info" | "default"; label: string; pulse: boolean }> = {
      ringing: { variant: "warning", label: "Timbrando", pulse: true },
      active: { variant: "success", label: "Activa", pulse: true },
      streaming: { variant: "info", label: "Streaming", pulse: true },
      transferring: { variant: "warning", label: "Transfiriendo", pulse: true },
      completed: { variant: "default", label: "Completada", pulse: false },
      failed: { variant: "error", label: "Fallida", pulse: false },
    };
    const { variant, label, pulse } = config[status];
    return <Badge variant={variant} dot pulse={pulse}>{label}</Badge>;
  };

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/40">
        <Phone className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">No hay llamadas</p>
        <p className="text-sm">Las llamadas activas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="divide-y divide-white/5">
      {calls.map((call) => (
        <div
          key={call.id}
          onClick={() => onSelectCall?.(call)}
          className={cn(
            "call-item p-4 cursor-pointer transition-all duration-200",
            selectedCallId === call.id
              ? "bg-indigo-500/10 border-l-2 border-l-indigo-500"
              : "hover:bg-white/5 border-l-2 border-l-transparent"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div
                className={cn(
                  "relative p-2.5 rounded-xl",
                  call.status === "active" || call.status === "streaming"
                    ? "bg-emerald-500/20"
                    : call.status === "ringing"
                    ? "bg-amber-500/20"
                    : call.status === "transferring"
                    ? "bg-purple-500/20"
                    : "bg-white/5"
                )}
              >
                {call.status === "transferring" ? (
                  <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                ) : call.status === "completed" || call.status === "failed" ? (
                  <PhoneOff className="w-5 h-5 text-white/40" />
                ) : (
                  <Phone
                    className={cn(
                      "w-5 h-5",
                      call.status === "active" || call.status === "streaming"
                        ? "text-emerald-400"
                        : call.status === "ringing"
                        ? "text-amber-400"
                        : "text-white/40"
                    )}
                  />
                )}
                {(call.status === "active" || call.status === "streaming" || call.status === "ringing") && (
                  <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-current" />
                )}
              </div>

              {/* Call Info */}
              <div>
                <p className="font-medium text-white">
                  {formatPhoneNumber(call.caller)}
                </p>
                <p className="text-sm text-white/50">
                  {call.department || "Sin departamento"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Duration */}
              {call.duration !== undefined && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(call.duration)}</span>
                </div>
              )}

              {/* Status Badge */}
              {getStatusBadge(call.status)}
            </div>
          </div>

          {/* Agent Response Preview */}
          {call.agentResponse && (
            <p className="mt-3 text-sm text-white/60 line-clamp-1 pl-14">
              <span className="font-medium text-white/70">Agente:</span> {call.agentResponse}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
