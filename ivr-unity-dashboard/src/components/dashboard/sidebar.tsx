"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Phone,
  MessageSquare,
  Settings,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calls", label: "Llamadas", icon: Phone },
  { href: "/transcripts", label: "Transcripciones", icon: MessageSquare },
  { href: "/agents", label: "Agentes AI", icon: Bot },
  { href: "/settings", label: "Configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      const items = navRef.current.querySelectorAll(".nav-item");
      gsap.from(items, {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, []);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: collapsed ? 80 : 280 }}
      className={cn(
        "fixed left-0 top-0 h-full z-40",
        "bg-white/5 backdrop-blur-2xl",
        "border-r border-white/10",
        "transition-all duration-300 ease-out"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">Unity IVR</span>
                <p className="text-xs text-white/50">Financial Services</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-24 z-50",
            "w-6 h-6 rounded-full",
            "bg-slate-800 border border-white/20",
            "flex items-center justify-center",
            "hover:bg-slate-700 transition-colors",
            "shadow-lg"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-white" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-white" />
          )}
        </button>

        {/* Navigation */}
        <nav ref={navRef} className="flex-1 p-4 space-y-1 mt-4">
          <span className={cn(
            "text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-4 block",
            collapsed && "sr-only"
          )}>
            Menu
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-item flex items-center gap-3 px-4 py-3 rounded-xl",
                  "transition-all duration-200",
                  isActive
                    ? "bg-indigo-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-white/50">admin@unity.com</p>
              </div>
            </div>
          )}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl w-full",
                "text-white/60",
                "hover:bg-red-500/20 hover:text-red-400",
                "transition-all duration-200",
                "border border-transparent hover:border-red-500/30",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Cerrar Sesion</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
