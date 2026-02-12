import type React from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { cn } from "../../../utils";
import { scaleInOut, defaultTransition } from "../../../lib/motion";
import { usePrefersReducedMotion } from "../../../hooks/useMediaQuery";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : defaultTransition;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          ref={dropdownRef}
          className={cn(
            "absolute z-40 right-0 mt-2 rounded-xl glass-card shadow-theme-lg origin-top-right",
            className
          )}
          variants={scaleInOut}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
};
