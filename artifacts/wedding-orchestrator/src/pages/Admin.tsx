import { useState } from "react";
import { Menu, X, TrendingUp, AlertTriangle, CheckCircle2, Bell, ChevronRight } from "lucide-react";
import { adminEvents, stuckMilestones } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const navItems = [
  { label: "Active events", active: true },
  { label: "Stuck milestones", active: false },
  { label: "Reminder health", active: false },
  { label: "Settings", active: false },
];

const kpiData = [
  { label: "Reminders sent", value: "48", icon: Bell, color: "text-primary bg-primary/10" },
  { label: "Delivery failed", value: "3", icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  { label: "Responded", value: "31", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { label: "Response rate", value: "65%", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
];

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Active events");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = adminEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
          data-testid="admin-menu-toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="text-sidebar-foreground font-medium text-sm">Admin Operations</span>
        <Link href="/dashboard">
          <span className="ml-auto text-sidebar-foreground/50 hover:text-sidebar-foreground text-xs cursor-pointer">
            ← Couple view
          </span>
        </Link>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-56 bg-sidebar border-r border-sidebar-border px-3 py-4">
            <AdminNav active={activeSection} onChange={(s) => { setActiveSection(s); setSidebarOpen(false); }} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-sidebar border-r border-sidebar-border">
        <div className="px-5 pt-6 pb-5 border-b border-sidebar-border">
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-medium mb-1">
            AI Wedding Orchestrator
          </p>
          <h2 className="text-sidebar-foreground font-semibold text-sm">Admin Operations</h2>
        </div>
        <nav className="flex-1 px-3 py-4">
          <AdminNav active={activeSection} onChange={setActiveSection} />
        </nav>
        <div className="px-3 pb-4 border-t border-sidebar-border pt-3">
          <Link href="/dashboard">
            <div className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground cursor-pointer px-3 py-2 rounded hover:bg-sidebar-accent/40">
              ← Couple view
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pt-14 lg:pt-0 relative">
        {/* Top filter bar */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-3 flex items-center gap-4 z-10">
          <span className="text-sm font-semibold text-foreground">{activeSection}</span>
          <div className="flex items-center gap-2 ml-auto">
            <select className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none">
              <option>All cities</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
            </select>
            <select className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none">
              <option>All dates</option>
              <option>Next 30 days</option>
              <option>Next 90 days</option>
            </select>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6">
          {activeSection === "Active events" && (
            <div>
              {/* Table */}
              {/* Desktop header */}
              <div className="hidden lg:grid grid-cols-[1fr_120px_160px_80px_120px_40px] gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border mb-2">
                <span>Couple</span>
                <span>Date</span>
                <span>Progress</span>
                <span>At risk</span>
                <span>Last activity</span>
                <span />
              </div>

              <div className="space-y-1.5">
                {adminEvents.map((event) => {
                  const pct = Math.round((event.tasksCompleted / event.totalTasks) * 100);
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                      className="w-full bg-card border border-card-border rounded-lg hover:border-primary/30 transition-all text-left"
                      data-testid={`admin-event-row-${event.id}`}
                    >
                      {/* Mobile */}
                      <div className="lg:hidden px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{event.coupleName}</p>
                            <p className="text-xs text-muted-foreground">{event.weddingDate} · {event.city}</p>
                          </div>
                          {event.atRisk > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                              {event.atRisk} at risk
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div className="hidden lg:grid grid-cols-[1fr_120px_160px_80px_120px_40px] gap-4 items-center px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{event.coupleName}</p>
                          <p className="text-xs text-muted-foreground">{event.city}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.weddingDate}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                        </div>
                        <p className={cn("text-xs font-medium", event.atRisk > 0 ? "text-amber-600" : "text-muted-foreground")}>
                          {event.atRisk > 0 ? `${event.atRisk} at risk` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.lastActivity}</p>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === "Stuck milestones" && (
            <div className="space-y-3">
              {stuckMilestones.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-amber-200 rounded-xl p-5"
                  data-testid={`stuck-milestone-${item.id}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.coupleName}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.task}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-amber-600 font-medium">
                          Stuck for {item.blockedSince}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.blockReason}
                        </span>
                      </div>
                    </div>
                    <button className="ml-auto px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 shrink-0">
                      Intervene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "Reminder health" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpiData.map((kpi) => (
                  <div key={kpi.label} className="bg-card border border-card-border rounded-xl p-5" data-testid={`kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center mb-3", kpi.color)}>
                      <kpi.icon size={16} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  Reminder health tracks automated and manual reminder delivery rates across all active events.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event detail slide-over */}
      {selectedEvent && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setSelectedEventId(null)}
          />
          <div
            className={cn(
              "fixed z-50 bg-card border-border shadow-xl flex flex-col",
              "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t",
              "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:bottom-0 lg:w-[360px] lg:rounded-none lg:border-l lg:border-t-0"
            )}
            data-testid="admin-event-detail"
          >
            <div className="lg:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{selectedEvent.coupleName}</h3>
                <p className="text-xs text-muted-foreground">{selectedEvent.weddingDate} · {selectedEvent.city}</p>
              </div>
              <button onClick={() => setSelectedEventId(null)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{selectedEvent.tasksCompleted}</p>
                    <p className="text-[10px] text-muted-foreground">Tasks done</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{selectedEvent.totalTasks - selectedEvent.tasksCompleted}</p>
                    <p className="text-[10px] text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Overall progress</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.round((selectedEvent.tasksCompleted / selectedEvent.totalTasks) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((selectedEvent.tasksCompleted / selectedEvent.totalTasks) * 100)}% complete
                  </p>
                </div>
                {selectedEvent.atRisk > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-600" />
                      <p className="text-xs font-medium text-amber-700">
                        {selectedEvent.atRisk} milestone{selectedEvent.atRisk > 1 ? "s" : ""} at risk
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Last activity: {selectedEvent.lastActivity}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90">
                View full timeline
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80">
                Contact couple
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminNav({ active, onChange }: { active: string; onChange: (s: string) => void }) {
  return (
    <ul className="space-y-0.5">
      {navItems.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => onChange(item.label)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              active === item.label
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
            data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
