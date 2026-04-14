import { useState } from "react";
import { Layout } from "@/components/Layout";
import { TaskDrawer } from "@/components/TaskDrawer";
import { tasks, phases, type Task } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { ChevronDown, Link2 } from "lucide-react";

const statusConfig = {
  not_started: { label: "Not started", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", color: "bg-primary/10 text-primary" },
  done: { label: "Done", color: "bg-green-100 text-green-700" },
  at_risk: { label: "At risk", color: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
};

const statusFilters = ["All", "Not started", "In progress", "Done", "At risk"];
const ownerFilters = ["All", "Couple", "Vendors", "Family"];
const categoryFilters = ["All", "Venue", "Guests", "Food", "Photography", "Decor", "Logistics", "Rituals"];

export default function Timeline() {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [collapsedPhases, setCollapsedPhases] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setCollapsedPhases((prev) =>
      prev.includes(phaseId) ? prev.filter((p) => p !== phaseId) : [...prev, phaseId]
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "All") {
      const matchMap: Record<string, string[]> = {
        "Not started": ["not_started"],
        "In progress": ["in_progress"],
        "Done": ["done"],
        "At risk": ["at_risk", "overdue"],
      };
      if (!matchMap[statusFilter]?.includes(task.status)) return false;
    }
    if (ownerFilter !== "All") {
      const ownerMap: Record<string, string> = {
        Couple: "couple",
        Vendors: "vendor",
        Family: "family",
      };
      if (task.ownerType !== ownerMap[ownerFilter]) return false;
    }
    if (categoryFilter !== "All" && task.category !== categoryFilter) return false;
    return true;
  });

  const tasksByPhase = phases.map((phase) => ({
    phase,
    tasks: filteredTasks.filter((t) => t.phaseId === phase.id),
  }));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Timeline</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tasks.length} tasks across {phases.length} phases
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg p-1">
            <button className="px-3 py-1.5 text-xs font-medium bg-card rounded text-foreground shadow-sm">List</button>
            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Phases</button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterGroup
            label="Status"
            options={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterGroup
            label="Owner"
            options={ownerFilters}
            value={ownerFilter}
            onChange={setOwnerFilter}
          />
          <FilterGroup
            label="Category"
            options={categoryFilters}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>

        {/* Task list grouped by phase */}
        <div className="space-y-6">
          {tasksByPhase.map(({ phase, tasks: phaseTasks }) => {
            if (phaseTasks.length === 0) return null;
            const isCollapsed = collapsedPhases.includes(phase.id);

            return (
              <div key={phase.id} data-testid={`phase-group-${phase.id}`}>
                {/* Phase header - sticky on desktop */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="sticky top-0 z-10 w-full flex items-center gap-3 px-4 py-2.5 bg-muted/90 backdrop-blur-sm rounded-lg border border-border mb-2 hover:bg-muted transition-colors"
                  data-testid={`phase-header-${phase.id}`}
                >
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-muted-foreground transition-transform shrink-0",
                      isCollapsed ? "-rotate-90" : "rotate-0"
                    )}
                  />
                  <span className="text-sm font-semibold text-foreground">{phase.name}</span>
                  <span className="text-xs text-muted-foreground">{phase.dateRange}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{phaseTasks.length} tasks</span>
                  {phase.atRisk > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                      {phase.atRisk} at risk
                    </span>
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-1">
                    {/* Desktop: table-like header */}
                    <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_32px] gap-4 px-4 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      <span>Task</span>
                      <span>Due date</span>
                      <span>Status</span>
                      <span>Owner</span>
                      <span />
                    </div>

                    {phaseTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onOpen={() => setOpenTaskId(task.id)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      )}
    </Layout>
  );
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const status = statusConfig[task.status];

  return (
    <button
      onClick={onOpen}
      className="w-full bg-card border border-card-border rounded-lg px-4 py-3 hover:border-primary/30 hover:bg-muted/30 transition-all text-left"
      data-testid={`task-row-${task.id}`}
    >
      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{task.title}</p>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 mt-0.5", status.color)}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          <span>·</span>
          <span>{task.owner}</span>
          {task.dependencies.length > 0 && (
            <Link2 size={11} className="ml-auto" />
          )}
        </div>
      </div>

      {/* Desktop layout: table-like grid */}
      <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_32px] gap-4 items-center">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
          {task.dependencies.length > 0 && (
            <Link2 size={12} className="text-muted-foreground shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium w-fit", status.color)}>
          {status.label}
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[9px] font-bold shrink-0">
            {task.ownerInitials}
          </div>
          <span className="text-xs text-muted-foreground truncate">{task.owner}</span>
        </div>
        <span className="text-muted-foreground text-xs">›</span>
      </div>
    </button>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-muted-foreground font-medium">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
            value === opt
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
          data-testid={`filter-${label.toLowerCase()}-${opt.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
