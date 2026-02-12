import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, m } from "motion/react";

import {
  CallIcon,
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import SidebarWidget from "./SidebarWidget";
import { slideInFromLeft, defaultTransition } from "../lib/motion";
import { usePrefersReducedMotion, useIsMobile } from "../hooks/useMediaQuery";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    name: "IVR Management",
    icon: <CallIcon />,
    subItems: [
      { name: "Dashboard", path: "/ivr" },
      { name: "Agent Config", path: "/ivr/agent-config" },
      { name: "Mock Data", path: "/ivr/mock-data" },
      { name: "Testing", path: "/ivr/testing" },
      { name: "Call Logs", path: "/ivr/logs" },
      { name: "Settings", path: "/ivr/settings" },
    ],
  },
];

const othersItems: NavItem[] = [];

const supportItems: NavItem[] = [];

const SIDEBAR_GAP = 12; // px gap from viewport edges

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } =
    useSidebar();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "support" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "support", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : menuType === "support"
          ? supportItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "support" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "support" | "others"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : defaultTransition;

  const showLabels = isExpanded || isHovered || isMobileOpen;

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "support" | "others"
  ) => (
    <ul className="flex flex-col gap-0.5">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "xl:justify-center"
                  : "xl:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>

              {showLabels && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {nav.new && showLabels && (
                <span
                  className={`ml-auto absolute right-10 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive"
                  } menu-dropdown-badge`}
                >
                  new
                </span>
              )}
              {showLabels && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {showLabels && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && showLabels && (
            <AnimatePresence initial={false}>
              {openSubmenu?.type === menuType &&
                openSubmenu?.index === index && (
                  <m.div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: subMenuHeight[`${menuType}-${index}`] || "auto",
                      opacity: 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transition}
                    className="overflow-hidden"
                  >
                    <ul className="mt-1 space-y-0.5 ml-9">
                      {nav.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            className={`menu-dropdown-item ${
                              isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${
                                    isActive(subItem.path)
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                                >
                                  new
                                </span>
                              )}
                              {subItem.pro && (
                                <span
                                  className={`ml-auto ${
                                    isActive(subItem.path)
                                      ? "menu-dropdown-badge-pro-active"
                                      : "menu-dropdown-badge-pro-inactive"
                                  } menu-dropdown-badge-pro`}
                                >
                                  pro
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </m.div>
                )}
            </AnimatePresence>
          )}
        </li>
      ))}
    </ul>
  );

  // Floating capsule glassmorphism styles
  const capsuleStyles: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: [
      "0 8px 32px rgba(81, 39, 131, 0.08)",
      "0 2px 8px rgba(0, 0, 0, 0.04)",
      "inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    ].join(", "),
  };

  const capsuleDarkStyles: React.CSSProperties = {
    background: "rgba(17, 17, 27, 0.82)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: [
      "0 8px 32px rgba(0, 0, 0, 0.3)",
      "0 2px 8px rgba(81, 39, 131, 0.15)",
      "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    ].join(", "),
  };

  const renderLogo = () => (
    <div
      className={`flex-shrink-0 py-6 px-1 flex ${
        !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
      }`}
    >
      <Link to="/">
        {showLabels ? (
          <>
            <img
              className="dark:hidden"
              src="/images/logo/logo.svg"
              alt="Logo"
              width={150}
              height={40}
            />
            <img
              className="hidden dark:block"
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              width={150}
              height={40}
            />
          </>
        ) : (
          <img
            src="/images/logo/logo-icon.svg"
            alt="Logo"
            width={32}
            height={32}
          />
        )}
      </Link>
    </div>
  );

  const renderDivider = () => (
    <div className="flex-shrink-0 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />
  );

  const renderNav = () => (
    <div
      className="overflow-y-auto overflow-x-hidden sidebar-capsule-scrollbar py-3"
      style={{ flex: "1 1 0%", minHeight: 0 }}
    >
      <nav>
        <div className="flex flex-col gap-4">
          <div>
            <h2
              className={`mb-2 px-3 text-[10px] uppercase tracking-wider font-semibold flex leading-[20px] text-gray-400/80 ${
                !isExpanded && !isHovered
                  ? "xl:justify-center"
                  : "justify-start"
              }`}
            >
              {showLabels ? (
                "IVR Management"
              ) : (
                <HorizontaLDots className="size-5" />
              )}
            </h2>
            {renderMenuItems(navItems, "main")}
          </div>
        </div>
      </nav>
      {showLabels ? <SidebarWidget /> : null}
    </div>
  );

  // ── Mobile: Slide-in drawer (capsule shape) ──
  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <m.aside
            className={`fixed flex flex-col z-50 border-r-0 px-4 overflow-hidden ${isDark ? "text-gray-100" : "text-gray-900"}`}
            style={{
              top: SIDEBAR_GAP,
              left: SIDEBAR_GAP,
              width: 290,
              height: `calc(100vh - ${SIDEBAR_GAP * 2}px)`,
              borderRadius: 24,
              ...(isDark ? capsuleDarkStyles : capsuleStyles),
            }}
            variants={slideInFromLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              ...transition,
              duration: prefersReducedMotion ? 0 : 0.3,
            }}
          >
            {renderLogo()}
            {renderDivider()}
            {renderNav()}
          </m.aside>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop: Floating capsule ──
  return (
    <aside
      className={`fixed flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-50 px-3
        ${isDark ? "text-gray-100" : "text-gray-900"}
        ${
          isExpanded || isMobileOpen
            ? "w-[280px]"
            : isHovered
            ? "w-[280px]"
            : "w-[78px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
      style={{
        top: SIDEBAR_GAP,
        left: SIDEBAR_GAP,
        height: `calc(100vh - ${SIDEBAR_GAP * 2}px)`,
        borderRadius: 24,
        ...(isDark ? capsuleDarkStyles : capsuleStyles),
      }}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderLogo()}
      {renderDivider()}
      {renderNav()}
    </aside>
  );
};

export default AppSidebar;
