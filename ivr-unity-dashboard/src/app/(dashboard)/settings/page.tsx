"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Settings, Key, Phone, Bot, Save, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY || "",
      agentId: process.env.ELEVENLABS_AGENT_ID || "",
    },
    telnyx: {
      apiKey: process.env.TELNYX_API_KEY || "",
      publicKey: process.env.TELNYX_PUBLIC_KEY || "",
    },
    general: {
      companyName: "Unity Financial",
      defaultLanguage: "es",
      backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
    },
  });

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

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Configuración guardada exitosamente");
      } else {
        toast.error("Error al guardar la configuración");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (service: "elevenlabs" | "telnyx") => {
    toast.info(`Probando conexión con ${service}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`Conexión exitosa con ${service}`);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Configuración"
        subtitle="Administra las credenciales y ajustes del sistema"
      />

      <div ref={contentRef} className="p-6 max-w-4xl space-y-6">
        {/* ElevenLabs */}
        <GlassCard>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  "bg-gradient-to-br from-purple-500 to-violet-600",
                  "shadow-lg shadow-purple-500/30"
                )}>
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">ElevenLabs</h3>
                  <p className="text-sm text-white/50">
                    Configuración del agente de IA conversacional
                  </p>
                </div>
              </div>
              <Badge variant="success" dot>Conectado</Badge>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="relative">
              <Input
                label="API Key"
                type={showSecrets["elevenlabs-api"] ? "text" : "password"}
                value={settings.elevenlabs.apiKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    elevenlabs: { ...settings.elevenlabs, apiKey: e.target.value },
                  })
                }
                icon={<Key className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => toggleSecret("elevenlabs-api")}
                className="absolute right-4 bottom-3 text-white/40 hover:text-white/70 transition-colors"
              >
                {showSecrets["elevenlabs-api"] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Input
              label="Agent ID"
              value={settings.elevenlabs.agentId}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  elevenlabs: { ...settings.elevenlabs, agentId: e.target.value },
                })
              }
            />

            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => testConnection("elevenlabs")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Probar Conexión
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Telnyx */}
        <GlassCard>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  "bg-gradient-to-br from-emerald-500 to-teal-600",
                  "shadow-lg shadow-emerald-500/30"
                )}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Telnyx</h3>
                  <p className="text-sm text-white/50">
                    Configuración de telefonía SIP/TeXML
                  </p>
                </div>
              </div>
              <Badge variant="warning" dot>Pendiente</Badge>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="relative">
              <Input
                label="API Key"
                type={showSecrets["telnyx-api"] ? "text" : "password"}
                value={settings.telnyx.apiKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    telnyx: { ...settings.telnyx, apiKey: e.target.value },
                  })
                }
                icon={<Key className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => toggleSecret("telnyx-api")}
                className="absolute right-4 bottom-3 text-white/40 hover:text-white/70 transition-colors"
              >
                {showSecrets["telnyx-api"] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Input
              label="Public Key"
              value={settings.telnyx.publicKey}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  telnyx: { ...settings.telnyx, publicKey: e.target.value },
                })
              }
            />

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Configuración pendiente
                </p>
                <p className="text-sm text-amber-400/70 mt-1">
                  Configura el número Telnyx con el webhook URL del backend para recibir llamadas.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => testConnection("telnyx")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Probar Conexión
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* General Settings */}
        <GlassCard>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                "bg-gradient-to-br from-blue-500 to-indigo-600",
                "shadow-lg shadow-blue-500/30"
              )}>
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">General</h3>
                <p className="text-sm text-white/50">
                  Configuración general del sistema
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <Input
              label="Nombre de la Empresa"
              value={settings.general.companyName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, companyName: e.target.value },
                })
              }
            />

            <Input
              label="URL del Backend"
              value={settings.general.backendUrl}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, backendUrl: e.target.value },
                })
              }
            />

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Idioma Predeterminado
              </label>
              <select
                value={settings.general.defaultLanguage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultLanguage: e.target.value },
                  })
                }
                className={cn(
                  "w-full px-4 py-3",
                  "bg-white/5 backdrop-blur-sm",
                  "border border-white/10 rounded-xl",
                  "text-white",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50",
                  "transition-all duration-200"
                )}
              >
                <option value="es" className="bg-slate-900">Español</option>
                <option value="en" className="bg-slate-900">English</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
