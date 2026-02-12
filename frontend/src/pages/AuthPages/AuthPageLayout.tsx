import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── Animated Mesh Gradient Background ── */}
      <div className="fixed inset-0 -z-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(81, 39, 131, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(241, 137, 24, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(81, 39, 131, 0.18) 0%, transparent 50%), linear-gradient(135deg, #0f0a1a 0%, #1a1025 25%, #0d0f1a 50%, #141020 75%, #0f0a1a 100%)",
          }}
        />
        {/* Dark mode overlay adjustment */}
        <div className="absolute inset-0 bg-[#0a0612]/40 dark:bg-transparent" />
        {/* Light mode: brighter gradient */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(81, 39, 131, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(241, 137, 24, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(81, 39, 131, 0.06) 0%, transparent 50%), linear-gradient(135deg, #f8f6fc 0%, #f0edf6 25%, #f5f3f8 50%, #f2eff7 75%, #f8f6fc 100%)",
          }}
        />
      </div>

      {/* ── Floating Orbs ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Purple orb - top left */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 dark:opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(81, 39, 131, 0.6) 0%, transparent 70%)",
            animation: "float-slow 20s ease-in-out infinite",
          }}
        />
        {/* Orange orb - right center */}
        <div
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-25 dark:opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(241, 137, 24, 0.5) 0%, transparent 70%)",
            animation: "float-slow 25s ease-in-out infinite reverse",
          }}
        />
        {/* Purple orb - bottom center */}
        <div
          className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full opacity-20 dark:opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(81, 39, 131, 0.5) 0%, transparent 70%)",
            animation: "float-slow 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Noise Texture ── */}
      <div
        className="fixed inset-0 -z-5 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Main Layout ── */}
      <div className="relative flex flex-col justify-center min-h-screen lg:flex-row">
        {/* Form Side */}
        {children}

        {/* ── Branding Side (Desktop) ── */}
        <div className="items-center justify-center hidden w-full lg:w-1/2 lg:flex">
          <div className="relative flex flex-col items-center justify-center px-12 py-16">
            {/* Glass card behind branding */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: "rgba(81, 39, 131, 0.08)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center max-w-sm">
              {/* Unity Logo */}
              <Link to="/" className="block mb-8">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Unity Financial Network"
                  className="drop-shadow-lg"
                />
              </Link>

              {/* Divider with glow */}
              <div className="w-24 h-px mb-8 bg-gradient-to-r from-transparent via-[#f18918]/50 to-transparent" />

              <h2 className="mb-3 text-xl font-semibold text-center text-white/90 dark:text-white/90">
                Unity Financial Network
              </h2>
              <p className="text-center text-white/50 dark:text-white/50 text-sm leading-relaxed">
                Enterprise-grade financial dashboard with real-time analytics,
                premium visualizations, and intelligent insights.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {["Real-time Analytics", "AI Powered", "Secure"].map(
                  (label) => (
                    <span
                      key={label}
                      className="px-3 py-1.5 text-xs font-medium rounded-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Theme Toggle ── */}
      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div>

      {/* ── Float Animation Keyframes ── */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
