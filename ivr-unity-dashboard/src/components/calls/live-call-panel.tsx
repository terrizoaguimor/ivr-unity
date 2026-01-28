"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  User,
  Bot,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPhoneNumber, formatDuration, cn } from "@/lib/utils";
import type { Call } from "@/types";

interface LiveCallPanelProps {
  call: Call;
  onClose?: () => void;
}

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

export function LiveCallPanel({ call, onClose }: LiveCallPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.from(panelRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  // Duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Demo messages (in production, receive from WebSocket)
  useEffect(() => {
    const demoMessages: Message[] = [
      { role: "agent", content: "Bienvenido a Unity Financial. ¿En qué puedo ayudarle hoy?", timestamp: new Date() },
    ];
    setMessages(demoMessages);
  }, [call.id]);

  const isActive = call.status === "active" || call.status === "streaming";

  return (
    <GlassCard ref={panelRef} className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "relative p-3 rounded-xl",
              isActive
                ? "bg-emerald-500/20"
                : "bg-white/5"
            )}>
              <Phone className={cn(
                "w-6 h-6",
                isActive ? "text-emerald-400" : "text-white/40"
              )} />
              {isActive && (
                <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {formatPhoneNumber(call.caller)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isActive ? "success" : "default"} dot pulse={isActive}>
                  {isActive ? "En vivo" : call.status}
                </Badge>
                {call.department && (
                  <Badge variant="info">{call.department}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-white/5 border border-white/10"
            )}>
              <Clock className="w-4 h-4 text-white/50" />
              <span className="font-mono text-sm text-white">
                {formatDuration(duration)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                msg.role === "user"
                  ? "bg-white/10"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600"
              )}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-white/70" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl",
                msg.role === "user"
                  ? "bg-indigo-500/30 text-white rounded-tr-none"
                  : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={cn(
                "text-xs mt-1.5",
                msg.role === "user" ? "text-indigo-200" : "text-white/40"
              )}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isActive && (
          <div className="flex items-center gap-2 text-white/40">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm">Escuchando...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-5 border-t border-white/10">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="glass"
            onClick={() => setMuted(!muted)}
            className="rounded-full w-12 h-12 p-0"
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="glass"
            className="rounded-full w-12 h-12 p-0"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="danger"
            onClick={onClose}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
