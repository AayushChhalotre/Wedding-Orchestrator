import { useState } from "react";
import { Link, useLocation } from "wouter";
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
} from "lucide-react";
import { weddingInfo } from "@/data/mockData";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
  { href: "/stakeholders", label: "Stakeholders", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/risks", label: "Risk Alerts", icon: AlertTriangle },
  { href: "/admin", label: "Admin", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-sidebar border-r border-sidebar-border">
        {/* Logo / Couple name */}
        <div className="px-5 pt-7 pb-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 text-sidebar-foreground/40">
              <Circle size={5} strokeWidth={1} />
              <Circle size={5} strokeWidth={1} />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-medium">
              AI Wedding Orchestrator
            </span>
          </div>
          <h1 className="font-serif-display text-sidebar-foreground text-xl leading-snug mt-2">
            {weddingInfo.coupleName}
          </h1>
          <p className="text-sidebar-foreground/60 text-xs mt-0.5">
            {weddingInfo.weddingDate} · {weddingInfo.city}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-sidebar-accent rounded-full overflow-hidden">
              <div className="h-full w-[23%] bg-sidebar-primary rounded-full" />
            </div>
            <span className="text-[11px] text-sidebar-foreground/50">{weddingInfo.daysLeft}d left</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                  {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Vendor portal shortcut */}
        <div className="px-3 pb-4 border-t border-sidebar-border pt-3">
          <Link href="/vendor-portal">
            <div className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground cursor-pointer flex items-center gap-2 px-3 py-2 rounded hover:bg-sidebar-accent/40 transition-colors">
              <span>Vendor Portal</span>
              <ChevronRight size={10} className="ml-auto" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-serif-display text-sidebar-foreground text-lg">
          {weddingInfo.coupleName}
        </h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
          data-testid="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-64 bg-sidebar border-r border-sidebar-border px-3 py-4">
            <nav className="space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = location === href || (href !== "/" && location.startsWith(href));
                return (
                  <Link key={href} href={href}>
                    <div
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        active
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                    </div>
                  </Link>
                );
              })}
              <Link href="/vendor-portal">
                <div
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground cursor-pointer"
                >
                  Vendor Portal
                </div>
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
