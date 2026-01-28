"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, Bot, MessageSquare, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Agent } from "@/types";

interface AgentEditorModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
}

export function AgentEditorModal({
  agent,
  isOpen,
  onClose,
  onSave,
}: AgentEditorModalProps) {
  const [name, setName] = useState(agent.name);
  const [firstMessage, setFirstMessage] = useState(agent.firstMessage);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt || "");
  const [language, setLanguage] = useState(agent.language);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "prompt">("general");

  // Reset form when agent changes
  useEffect(() => {
    setName(agent.name);
    setFirstMessage(agent.firstMessage);
    setSystemPrompt(agent.systemPrompt || "");
    setLanguage(agent.language);
  }, [agent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/agents/${agent.agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          firstMessage,
          systemPrompt,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update agent");
      }

      const updatedAgent = await response.json();
      onSave(updatedAgent);
      toast.success("Agente actualizado", {
        description: "Los cambios se han guardado correctamente",
      });
      onClose();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Error al guardar", {
        description: "No se pudieron guardar los cambios",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <GlassCard className="overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Configurar Agente
                </h2>
                <p className="text-sm text-slate-500 dark:text-white/50">
                  {agent.agentId.substring(0, 20)}...
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-white/50" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "general"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/70"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                General
              </div>
            </button>
            <button
              onClick={() => setActiveTab("prompt")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === "prompt"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/70"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Code className="w-4 h-4" />
                System Prompt
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {activeTab === "general" ? (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                    Nombre del Agente
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl",
                      "bg-slate-100 dark:bg-white/5",
                      "border border-slate-200 dark:border-white/10",
                      "text-slate-900 dark:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    )}
                    placeholder="Nombre del agente..."
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Idioma Principal
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl",
                      "bg-slate-100 dark:bg-white/5",
                      "border border-slate-200 dark:border-white/10",
                      "text-slate-900 dark:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    )}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                {/* First Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                    Mensaje de Bienvenida
                  </label>
                  <textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl resize-none",
                      "bg-slate-100 dark:bg-white/5",
                      "border border-slate-200 dark:border-white/10",
                      "text-slate-900 dark:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    )}
                    placeholder="El primer mensaje que el agente dirá al usuario..."
                  />
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-white/40">
                    Este es el mensaje inicial que el agente dice al contestar una llamada.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={15}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl resize-none font-mono text-sm",
                      "bg-slate-100 dark:bg-white/5",
                      "border border-slate-200 dark:border-white/10",
                      "text-slate-900 dark:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    )}
                    placeholder="Define el comportamiento y personalidad del agente..."
                  />
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-white/40">
                    El system prompt define la personalidad, capacidades y restricciones del agente.
                    Usa markdown para mejor formato.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-white/10">
            <Button variant="glass" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
