import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Bell,
  AlertTriangle,
  Settings,
  Menu,
  X,
  ChevronRight,
  Circle,
  Palette,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { useStore, formatWeddingDate } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Journey", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
  { href: "/stakeholders", label: "Inner Circle", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/risks", label: "Heads Up", icon: AlertTriangle },
  { href: "/vibe-and-vision", label: "Vibe & Vision", icon: Palette },
  { href: "/budget", label: "Budget Watch", icon: Wallet },
  { href: "/admin", label: "Admin", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const weddingInfo = useStore(state => state.weddingInfo);

  const sidebarVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background selection:bg-primary/10 selection:text-primary">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border noise-bg relative z-30 shadow-xl">
        {/* Logo / Couple name */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="px-6 pt-8 pb-6 border-b border-sidebar-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Circle size={4} className="fill-sidebar-primary stroke-none" />
              <Circle size={4} className="fill-sidebar-primary/40 stroke-none" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/40 font-semibold">
              Orchestrator
            </span>
          </div>
          <h1 className="font-serif-display text-sidebar-foreground text-2xl leading-tight tracking-tight">
            {weddingInfo.partner1Name && weddingInfo.partner2Name 
              ? <>{weddingInfo.partner1Name} <span className="text-sidebar-foreground/80 font-light">&</span> {weddingInfo.partner2Name}</>
              : "Your Celebration"}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sidebar-foreground/50 text-xs font-medium uppercase tracking-wider">
              {weddingInfo?.location || "Location TBD"}
            </p>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-bold">Progress</span>
              <span className="text-[10px] text-sidebar-foreground/60 font-mono tracking-tighter">{weddingInfo?.daysLeft ?? 0} DAYS LEFT</span>
            </div>
            <div className="h-1 bg-sidebar-accent/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "23%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-sidebar-primary rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }, index) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer",
                    active
                      ? "bg-sidebar-primary/10 text-sidebar-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                  )}
                >
                  {active && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-5 bg-sidebar-primary rounded-full"
                    />
                  )}
                  <Icon size={18} strokeWidth={active ? 2 : 1.5} className={cn("transition-colors", active ? "text-sidebar-primary" : "text-inherit opacity-70 group-hover:opacity-100")} />
                  <span className="tracking-tight">{label}</span>
                  {active && <ChevronRight size={14} className="ml-auto opacity-30" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Vendor portal shortcut */}
        <div className="px-4 pb-8">
          <Link href="/vendor-portal">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-sidebar-accent/30 rounded-xl p-4 border border-sidebar-border/30 hover:border-sidebar-border/60 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-bold">Professional</span>
                <ArrowRight size={12} className="text-sidebar-foreground/20 group-hover:text-sidebar-foreground/50 transition-colors" />
              </div>
              <p className="text-sm font-serif-display text-sidebar-foreground tracking-tight">Vendor Portal</p>
              <p className="text-[10px] text-sidebar-foreground/40 mt-1">Manage contracts & logistics</p>
            </motion.div>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/80 backdrop-blur-md border-b border-sidebar-border/50 px-4 h-16 flex items-center justify-between">
        <h1 className="font-serif-display text-sidebar-foreground text-xl">
          {weddingInfo.partner1Name && weddingInfo.partner2Name 
              ? <>{weddingInfo.partner1Name} <span className="opacity-80">&</span> {weddingInfo.partner2Name}</>
              : "Wedding"}
        </h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border noise-bg px-6 py-8 flex flex-col"
            >
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-bold">Orchestrator</span>
                <h1 className="font-serif-display text-sidebar-foreground text-2xl mt-1">
                  The Journey
                </h1>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = location === href || (href !== "/" && location.startsWith(href));
                  return (
                    <Link key={href} href={href}>
                      <div
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer",
                          active
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                        {label}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto">
                <Link href="/vendor-portal">
                  <div
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/30"
                  >
                    <span className="font-serif-display text-sidebar-foreground">Vendor Portal</span>
                    <ArrowRight size={16} className="text-sidebar-foreground/30" />
                  </div>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 relative">
        <div className="absolute inset-0 pointer-events-none noise-bg opacity-[0.015]" />
        {children}
      </main>
    </div>
  );
}
