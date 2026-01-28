"use client";

import { useState, useEffect, useCallback } from "react";
import type { Call } from "@/types";

interface UseRealtimeCallsOptions {
  backendWsUrl?: string;
  enabled?: boolean;
}

export function useRealtimeCalls(options: UseRealtimeCallsOptions = {}) {
  const {
    backendWsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:3000",
    enabled = true,
  } = options;

  const [calls, setCalls] = useState<Call[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCall = useCallback((updatedCall: Call) => {
    setCalls((prev) => {
      const index = prev.findIndex((c) => c.id === updatedCall.id);
      if (index >= 0) {
        const newCalls = [...prev];
        newCalls[index] = updatedCall;
        return newCalls;
      }
      return [updatedCall, ...prev];
    });
  }, []);

  const removeCall = useCallback((callId: string) => {
    setCalls((prev) => prev.filter((c) => c.id !== callId));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(`${backendWsUrl}/admin`);

        ws.onopen = () => {
          setConnected(true);
          setError(null);
          console.log("Connected to backend WebSocket");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            switch (data.type) {
              case "call:new":
              case "call:update":
                updateCall(data.call);
                break;
              case "call:ended":
                // Keep in list but mark as completed
                updateCall({ ...data.call, status: "completed" });
                break;
              case "calls:list":
                setCalls(data.calls);
                break;
              default:
                console.log("Unknown message type:", data.type);
            }
          } catch (err) {
            console.error("Failed to parse WebSocket message:", err);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          console.log("Disconnected from backend WebSocket");
          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = (err) => {
          console.error("WebSocket error:", err);
          setError("Connection error");
        };
      } catch (err) {
        console.error("Failed to connect:", err);
        setError("Failed to connect");
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [backendWsUrl, enabled, updateCall]);

  // For demo purposes, generate mock calls if not connected
  useEffect(() => {
    if (!connected && calls.length === 0) {
      // Add demo calls for UI development
      const demoCalls: Call[] = [
        {
          id: "demo-1",
          callControlId: "demo-1",
          caller: "+573001234567",
          calledNumber: "+573009876543",
          status: "active",
          startTime: new Date(Date.now() - 120000).toISOString(),
          duration: 120,
          department: "SALUD",
          agentResponse: "Bienvenido a Unity Financial. En que puedo ayudarle?",
        },
        {
          id: "demo-2",
          callControlId: "demo-2",
          caller: "+573109876543",
          calledNumber: "+573009876543",
          status: "streaming",
          startTime: new Date(Date.now() - 60000).toISOString(),
          duration: 60,
          department: "VIDA",
        },
        {
          id: "demo-3",
          callControlId: "demo-3",
          caller: "+573201111111",
          calledNumber: "+573009876543",
          status: "completed",
          startTime: new Date(Date.now() - 300000).toISOString(),
          endTime: new Date(Date.now() - 60000).toISOString(),
          duration: 240,
          department: "PC",
          transferredTo: "VQ_PYC_SINIESTRO",
        },
      ];
      setCalls(demoCalls);
    }
  }, [connected, calls.length]);

  return {
    calls,
    connected,
    error,
    activeCalls: calls.filter((c) => c.status === "active" || c.status === "streaming" || c.status === "ringing"),
    completedCalls: calls.filter((c) => c.status === "completed"),
  };
}
