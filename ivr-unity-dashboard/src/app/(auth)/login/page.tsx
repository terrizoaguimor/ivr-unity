"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Phone, Lock, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline();

    tl.from(cardRef.current, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(".login-logo", { scale: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4")
    .from(".login-title", { y: 20, opacity: 0, duration: 0.4 }, "-=0.2")
    .from(".login-subtitle", { y: 20, opacity: 0, duration: 0.4 }, "-=0.3")
    .from(".input-group", { y: 20, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.2")
    .from(".login-btn", { y: 20, opacity: 0, duration: 0.4 }, "-=0.1");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Inicio de sesión exitoso");
        router.push("/");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        "bg-slate-950"
      )}
    >
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Glass card */}
      <div
        ref={cardRef}
        className={cn(
          "relative w-full max-w-md",
          "bg-white/5 backdrop-blur-2xl",
          "border border-white/10",
          "rounded-3xl shadow-2xl shadow-black/40",
          "p-8 md:p-10",
          "overflow-hidden"
        )}
      >
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative flex flex-col items-center mb-8">
          <div
            className={cn(
              "login-logo w-20 h-20 rounded-2xl",
              "bg-gradient-to-br from-indigo-500 to-purple-600",
              "flex items-center justify-center mb-5",
              "shadow-lg shadow-indigo-500/30"
            )}
          >
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h1 className="login-title text-3xl font-bold text-white flex items-center gap-2">
            Unity IVR
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="login-subtitle text-white/50 mt-2">
            Ingresa tus credenciales
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div className="input-group">
            <Input
              name="username"
              label="Usuario"
              icon={<User className="w-5 h-5" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <Input
              name="password"
              type="password"
              label="Contraseña"
              icon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-400 text-center">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="login-btn w-full"
            size="lg"
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Footer */}
        <p className="relative mt-8 text-center text-sm text-white/30">
          Unity Financial IVR Dashboard
        </p>

        {/* Bottom highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
