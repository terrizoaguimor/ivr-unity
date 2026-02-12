import { AnimatePresence, m } from "motion/react";
import { useSidebar } from "../context/SidebarContext";
import { fadeInOut, defaultTransition } from "../lib/motion";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const prefersReducedMotion = usePrefersReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : defaultTransition;

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <m.div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-lg xl:hidden"
          onClick={toggleMobileSidebar}
          variants={fadeInOut}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          style={{ borderRadius: 0 }}
        />
      )}
    </AnimatePresence>
  );
};

export default Backdrop;
