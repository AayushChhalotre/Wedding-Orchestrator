import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TaskDrawer } from "@/components/TaskDrawer";
import { type Task, type TaskStatus } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { ChevronDown, Link2 } from "lucide-react";
import { motion } from "framer-motion";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", color: "bg-primary/10 text-primary" },
  done: { label: "Done", color: "bg-green-100 text-green-700" },
  at_risk: { label: "At risk", color: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
  blocked: { label: "Blocked", color: "bg-orange-100 text-orange-700" },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const tasks = useStore(state => state.tasks);
  const phases = useStore(state => state.phases);

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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif-display text-serif-gradient leading-tight tracking-tight">
              Timeline
            </h1>
            <p className="text-muted-foreground text-sm mt-3 font-medium tracking-wide">
              {tasks.length} tasks across {phases.length} phases · Orchestrating the perfect sequence
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
            <button className="px-4 py-1.5 text-xs font-bold bg-background rounded-lg text-foreground shadow-sm border border-border/20">List</button>
            <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Phases</button>
          </div>
        </motion.div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-border/40">
          <FilterGroup
            label="Status"
            options={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="h-8 w-px bg-border/40 self-center hidden md:block" />
          <FilterGroup
            label="Owner"
            options={ownerFilters}
            value={ownerFilter}
            onChange={setOwnerFilter}
          />
          <div className="h-8 w-px bg-border/40 self-center hidden md:block" />
          <FilterGroup
            label="Category"
            options={categoryFilters}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>

        {/* Task list grouped by phase */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {tasksByPhase.map(({ phase, tasks: phaseTasks }) => {
            if (phaseTasks.length === 0) return null;
            const isCollapsed = collapsedPhases.includes(phase.id);

            return (
              <motion.div 
                key={phase.id} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 260, damping: 20 }
                  }
                }}
                data-testid={`phase-group-${phase.id}`}
              >
                {/* Phase header - sticky on desktop */}
                <motion.button
                  whileTap={{ scale: 0.995 }}
                  onClick={() => togglePhase(phase.id)}
                  className="sticky top-0 z-10 w-full flex items-center gap-4 px-5 py-3.5 bg-background/80 backdrop-blur-xl rounded-2xl border border-border/60 mb-4 hover:border-primary/20 hover:bg-muted/50 transition-all shadow-sm"
                  data-testid={`phase-header-${phase.id}`}
                >
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-muted-foreground transition-transform shrink-0",
                      isCollapsed ? "-rotate-90" : "rotate-0"
                    )}
                  />
                  <span className="text-sm font-bold text-foreground tracking-tight">{phase.name}</span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{phase.dateRange}</span>
                  <span className="ml-auto text-xs font-bold text-muted-foreground">{phaseTasks.length} tasks</span>
                  {phase.atRisk > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold border border-amber-200/50">
                      {phase.atRisk} at risk
                    </span>
                  )}
                </motion.button>

                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 px-1"
                  >
                    {/* Desktop: table-like header */}
                    <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_32px] gap-4 px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
                      <span>Task Details</span>
                      <span>Timeline</span>
                      <span>Progress</span>
                      <span>Assignee</span>
                      <span />
                    </div>

                    <div className="space-y-2">
                      {phaseTasks.map((task) => (
                        <TaskRow key={task.id} task={task} onOpen={() => setOpenTaskId(task.id)} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      )}
    </Layout>
  );
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const status = statusConfig[task.status as TaskStatus];

  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: "var(--muted)" }}
      whileTap={{ scale: 0.995 }}
      onClick={onOpen}
      className="w-full bg-card border border-card-border rounded-xl px-5 py-4 transition-all text-left shadow-sm group"
      data-testid={`task-row-${task.id}`}
    >
      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-2 tracking-tight">{task.title}</p>
          <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 mt-0.5 border", status.color, "border-current/10")}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
          <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{task.owner}</span>
          {task.dependencies.length > 0 && (
            <Link2 size={12} className="ml-auto text-primary/60" />
          )}
        </div>
      </div>

      {/* Desktop layout: table-like grid */}
      <div className="hidden lg:grid grid-cols-[1fr_140px_120px_120px_32px] gap-4 items-center">
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-sm font-bold text-foreground truncate tracking-tight">{task.title}</p>
          {task.dependencies.length > 0 && (
            <Link2 size={13} className="text-primary/40 shrink-0 group-hover:text-primary/70 transition-colors" />
          )}
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <span className={cn("text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider w-fit border", status.color, "border-current/10")}>
          {status.label}
        </span>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
            {task.ownerInitials}
          </div>
          <span className="text-xs font-bold text-muted-foreground truncate">{task.owner}</span>
        </div>
        <span className="text-muted-foreground/40 text-sm group-hover:text-primary group-hover:translate-x-1 transition-all">›</span>
      </div>
    </motion.button>
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
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">{label}:</span>
      <div className="flex items-center gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
              value === opt
                ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10"
                : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
            data-testid={`filter-${label.toLowerCase()}-${opt.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
