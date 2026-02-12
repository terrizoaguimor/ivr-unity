import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, m } from "motion/react";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { fadeInOut, defaultTransition } from "../lib/motion";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : defaultTransition;

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out  ${
          isExpanded || isHovered ? "xl:ml-[304px]" : "xl:ml-[102px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
          <AnimatePresence mode="wait">
            <m.div
              key={location.pathname}
              variants={fadeInOut}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
